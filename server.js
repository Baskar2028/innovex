import 'dotenv/config';

import express from 'express';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

const app = express();
const rootDir = path.dirname(fileURLToPath(import.meta.url));

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_PASSCODE ||
  'admin123';

const isProduction = process.env.NODE_ENV === 'production';

/* =========================================================
   PostgreSQL Connection
   =========================================================

   RENDER:
   Set DATABASE_URL in Render Environment Variables.

   LOCAL:
   If DATABASE_URL is not present, the app uses:
   postgresql://postgres:postgres@localhost:5432/innovex

   You can change the local values using:
   PGUSER
   PGPASSWORD
   PGHOST
   PGPORT
   PGDATABASE
   ========================================================= */

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${encodeURIComponent(process.env.PGUSER || 'postgres')}:${encodeURIComponent(
    process.env.PGPASSWORD || 'postgres'
  )}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'innovex'}`;

const pool = new Pool({
  connectionString: databaseUrl,

  // Render PostgreSQL requires SSL.
  // Local PostgreSQL normally does not.
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool.on('error', (error) => {
  console.error('Unexpected error on idle PostgreSQL client:', error);
});

app.use(express.json());

/* =========================================================
   Allowed Values
   ========================================================= */

const allowedDegrees = ['BE', 'BTech'];

const allowedBranches = [
  'CSE',
  'IT',
  'AIDS',
  'AIML',
  'DS',
  'CSE(CS)',
  'ECE',
  'EEE',
  'CIVIL',
  'MECH',
];

const allowedYears = ['I', 'II', 'III', 'IV'];

const allowedEvents = [
  'PREZI',
  'PROTOSPARK',
  'TRY CRACK ME',
  'QUIZMANIA',
  'ARTNOVA',
];

const allowedPayments = ['Online', 'Offline'];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactPattern = /^[+]?[0-9 ()-]{7,20}$/;

/* =========================================================
   PostgreSQL Helpers
   ========================================================= */

async function sqlRun(query, params = []) {
  const result = await pool.query(query, params);
  return result;
}

async function sqlAll(query, params = []) {
  const result = await pool.query(query, params);
  return result.rows;
}

/* =========================================================
   Database Initialization
   ========================================================= */

async function initializeDatabase() {
  try {
    await sqlRun(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        contact TEXT NOT NULL,
        college TEXT NOT NULL,
        degree TEXT NOT NULL,
        degree_detail TEXT,
        branch TEXT NOT NULL,
        year TEXT NOT NULL,
        team_members INTEGER NOT NULL,
        members_json TEXT NOT NULL,
        events_json TEXT NOT NULL,
        payment TEXT NOT NULL,
        registered_at TEXT NOT NULL
      )
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error.message);

    console.error(
      '\nMake sure PostgreSQL is running and the database exists.\n' +
        'For local development:\n' +
        '  Database: innovex\n' +
        '  Host: localhost\n' +
        '  Port: 5432\n'
    );

    process.exit(1);
  }
}

/* =========================================================
   JSON Helper
   ========================================================= */

function parseJson(value, fallback = []) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/* =========================================================
   Normalize Registration
   ========================================================= */

function normalizeRegistration(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    contact: row.contact,
    college: row.college,
    degree: row.degree,
    degreeDetail: row.degree_detail || '',
    branch: row.branch,
    year: row.year,
    teamMembers: Number(row.team_members || 0),
    members: parseJson(row.members_json, []),
    events: parseJson(row.events_json, []),
    payment: row.payment,
    registeredAt: row.registered_at,
  };
}

/* =========================================================
   Registration Validation
   ========================================================= */

function validateRegistration(registration) {
  const hasValidDetail =
    registration.degree !== 'Others' &&
    registration.branch !== 'ARTS AND SCIENCE'
      ? true
      : typeof registration.degreeDetail === 'string' &&
        registration.degreeDetail.trim().length > 0;

  // Name validation
  if (
    !(
      typeof registration.name === 'string' &&
      registration.name.trim().length > 0
    )
  ) {
    return {
      valid: false,
      error: 'Name is required.',
    };
  }

  // Email validation
  if (
    !(
      typeof registration.email === 'string' &&
      emailPattern.test(registration.email)
    )
  ) {
    return {
      valid: false,
      error: 'Please enter a valid email address.',
    };
  }

  // Contact validation
  if (
    !(
      typeof registration.contact === 'string' &&
      contactPattern.test(registration.contact)
    )
  ) {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit contact number.',
    };
  }

  // College validation
  if (
    !(
      typeof registration.college === 'string' &&
      registration.college.trim().length > 0
    )
  ) {
    return {
      valid: false,
      error: 'College name is required.',
    };
  }

  // Degree validation
  if (!allowedDegrees.includes(registration.degree)) {
    return {
      valid: false,
      error: 'Please select a valid degree.',
    };
  }

  // Branch validation
  if (!allowedBranches.includes(registration.branch)) {
    return {
      valid: false,
      error: 'Please select a valid branch.',
    };
  }

  // Year validation
  if (!allowedYears.includes(registration.year)) {
    return {
      valid: false,
      error: 'Please select a valid year.',
    };
  }

  // Degree detail validation
  if (!hasValidDetail) {
    return {
      valid: false,
      error: `Please enter your ${
        registration.degree === 'Others'
          ? 'degree'
          : 'Arts & Science degree'
      }.`,
    };
  }

  // Team members validation
  if (
    !(
      Number.isInteger(registration.teamMembers) &&
      registration.teamMembers >= 0 &&
      registration.teamMembers <= 4
    )
  ) {
    return {
      valid: false,
      error: 'Team members must be between 0 and 4.',
    };
  }

  // Members array validation
  if (!Array.isArray(registration.members)) {
    return {
      valid: false,
      error: 'Members data is invalid.',
    };
  }

  // Members count validation
  if (registration.members.length !== registration.teamMembers) {
    return {
      valid: false,
      error: 'Team members count does not match the members list.',
    };
  }

  // Members details validation
  if (registration.teamMembers > 0) {
    for (let i = 0; i < registration.members.length; i++) {
      const member = registration.members[i];

      if (!member) {
        return {
          valid: false,
          error: `Team member ${i + 1} data is invalid.`,
        };
      }

      if (
        !(
          typeof member.name === 'string' &&
          member.name.trim().length > 0
        )
      ) {
        return {
          valid: false,
          error: `Team member ${i + 1}: Name is required.`,
        };
      }

      if (
        !(
          typeof member.email === 'string' &&
          emailPattern.test(member.email)
        )
      ) {
        return {
          valid: false,
          error: `Team member ${i + 1}: Please enter a valid email address.`,
        };
      }

      if (
        !(
          typeof member.department === 'string' &&
          member.department.trim().length > 0
        )
      ) {
        return {
          valid: false,
          error: `Team member ${i + 1}: Department is required.`,
        };
      }

      if (
        !(
          typeof member.contact === 'string' &&
          contactPattern.test(member.contact)
        )
      ) {
        return {
          valid: false,
          error: `Team member ${i + 1}: Please enter a valid 10-digit contact number.`,
        };
      }

      if (
        !(
          typeof member.college === 'string' &&
          member.college.trim().length > 0
        )
      ) {
        return {
          valid: false,
          error: `Team member ${i + 1}: College name is required.`,
        };
      }
    }
  }

  // Events validation
  if (!Array.isArray(registration.events)) {
    return {
      valid: false,
      error: 'Events data is invalid.',
    };
  }

  if (
    registration.events.length < 1 ||
    registration.events.length > 2
  ) {
    return {
      valid: false,
      error: 'Please select 1 or 2 events.',
    };
  }

  if (
    !registration.events.every((event) =>
      allowedEvents.includes(event)
    )
  ) {
    return {
      valid: false,
      error: 'One or more selected events are invalid.',
    };
  }

  // Payment validation
  if (!allowedPayments.includes(registration.payment)) {
    return {
      valid: false,
      error: 'Please select a valid payment method.',
    };
  }

  return {
    valid: true,
  };
}

/* =========================================================
   Insert Registration
   ========================================================= */

async function insertRegistration(registration) {
  await sqlRun(
    `INSERT INTO registrations (
      name,
      email,
      contact,
      college,
      degree,
      degree_detail,
      branch,
      year,
      team_members,
      members_json,
      events_json,
      payment,
      registered_at
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13
    )`,
    [
      registration.name,
      registration.email,
      registration.contact,
      registration.college,
      registration.degree,
      registration.degreeDetail || '',
      registration.branch,
      registration.year,
      registration.teamMembers,
      JSON.stringify(registration.members),
      JSON.stringify(registration.events),
      registration.payment,
      registration.registeredAt,
    ]
  );
}

/* =========================================================
   Admin Authentication
   ========================================================= */

function requireAdmin(req, res, next) {
  const keyFromQuery =
    typeof req.query.key === 'string'
      ? req.query.key
      : '';

  const keyFromBody =
    typeof req.body?.passcode === 'string'
      ? req.body.passcode
      : '';

  const keyFromHeader =
    typeof req.headers['x-admin-key'] === 'string'
      ? req.headers['x-admin-key']
      : '';

  const providedKey =
    keyFromQuery ||
    keyFromBody ||
    keyFromHeader;

  if (providedKey !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: 'Unauthorized access.',
    });
  }

  next();
}

/* =========================================================
   Registration API
   ========================================================= */

app.post('/api/register', async (req, res) => {
  const registration = {
    name:
      typeof req.body.name === 'string'
        ? req.body.name.trim()
        : '',

    email:
      typeof req.body.email === 'string'
        ? req.body.email.trim()
        : '',

    contact:
      typeof req.body.contact === 'string'
        ? req.body.contact.trim()
        : '',

    college:
      typeof req.body.college === 'string'
        ? req.body.college.trim()
        : '',

    degree: req.body.degree,

    degreeDetail:
      typeof req.body.degreeDetail === 'string'
        ? req.body.degreeDetail.trim()
        : '',

    branch: req.body.branch,

    year: req.body.year,

    teamMembers: Number(req.body.teamMembers),

    members: Array.isArray(req.body.members)
      ? req.body.members.map((member) => ({
          name:
            typeof member.name === 'string'
              ? member.name.trim()
              : '',

          email:
            typeof member.email === 'string'
              ? member.email.trim()
              : '',

          department:
            typeof member.department === 'string'
              ? member.department.trim()
              : '',

          contact:
            typeof member.contact === 'string'
              ? member.contact.trim()
              : '',

          college:
            typeof member.college === 'string'
              ? member.college.trim()
              : '',
        }))
      : [],

    events: Array.isArray(req.body.events)
      ? req.body.events
      : [],

    payment: req.body.payment,

    registeredAt: new Date().toISOString(),
  };

  const validationResult =
    validateRegistration(registration);

  if (!validationResult.valid) {
    return res.status(400).json({
      message: validationResult.error,
    });
  }

  try {
    await insertRegistration(registration);

    return res.status(201).json({
      message: 'Registration successful.',
    });
  } catch (error) {
    console.error(
      'Registration insert error:',
      error
    );

    return res.status(500).json({
      message:
        'Unable to save your registration. Please try again.',
    });
  }
});

/* =========================================================
   Admin Login
   ========================================================= */

app.post('/api/admin/login', (req, res) => {
  const passcode =
    typeof req.body?.passcode === 'string'
      ? req.body.passcode
      : '';

  if (passcode !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: 'Invalid Passcode',
    });
  }

  return res.status(200).json({
    message: 'Authorized',
  });
});

/* =========================================================
   Delete Registration
   ========================================================= */

app.delete(
  '/api/admin/registrations/:id',
  requireAdmin,
  async (req, res) => {
    const registrationId = req.params.id;

    console.log(
      `DELETE /api/admin/registrations/:id called with id=${registrationId}`
    );

    if (!registrationId || isNaN(registrationId)) {
      console.log(
        `Invalid registration ID: ${registrationId}`
      );

      return res.status(400).json({
        message: 'Invalid registration ID.',
      });
    }

    try {
      console.log(
        `Deleting registration with id=${registrationId}`
      );

      await sqlRun(
        'DELETE FROM registrations WHERE id = $1',
        [Number(registrationId)]
      );

      console.log(
        `Successfully deleted registration with id=${registrationId}`
      );

      return res.status(200).json({
        message: 'Registration deleted successfully.',
      });
    } catch (error) {
      console.error(
        'Delete registration error:',
        error
      );

      return res.status(500).json({
        message: 'Failed to delete registration.',
      });
    }
  }
);

/* =========================================================
   Get Registrations
   ========================================================= */

app.get(
  '/api/admin/registrations',
  requireAdmin,
  async (req, res) => {
    try {
      const rows = await sqlAll(
        'SELECT * FROM registrations ORDER BY id DESC'
      );

      const registrations =
        rows.map(normalizeRegistration);

      return res.status(200).json(registrations);
    } catch (error) {
      console.error(
        'Fetch registrations failed:',
        error
      );

      return res.status(500).json({
        message: 'Failed to load registrations.',
      });
    }
  }
);

/* =========================================================
   CSV Export
   ========================================================= */

app.get(
  '/api/export-csv',
  requireAdmin,
  async (req, res) => {
    try {
      const registrations = await sqlAll(
        'SELECT * FROM registrations ORDER BY id DESC'
      );

      if (!registrations.length) {
        return res.status(404).json({
          message:
            'No registrations available to export.',
        });
      }

      const rows = registrations.map((item) => ({
        Name: item.name,

        Email: item.email,

        Contact: item.contact,

        College: item.college,

        Degree: item.degree,

        'Degree Detail':
          item.degree_detail || 'N/A',

        Branch: item.branch,

        Year: item.year,

        'Team Members': item.team_members,

        'Team Member Details': parseJson(
          item.members_json,
          []
        )
          .map(
            (member, index) =>
              `${index + 1}. ${member.name} | ${member.email} | ${member.department} | ${member.contact} | ${member.college}`
          )
          .join('\n'),

        Events: parseJson(
          item.events_json,
          []
        ).join(', '),

        Payment: item.payment,

        'Registered At': item.registered_at,
      }));

      const header = Object.keys(rows[0]);

      const csvRows = [
        header.join(','),
      ];

      rows.forEach((row) => {
        const values = header.map(
          (column) => {
            const raw = row[column] ?? '';

            const value = String(raw).replace(
              /"/g,
              '""'
            );

            return `"${value}"`;
          }
        );

        csvRows.push(values.join(','));
      });

      const csv = csvRows.join('\n');

      res.setHeader(
        'Content-Type',
        'text/csv; charset=utf-8'
      );

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="registrations.csv"'
      );

      return res.send(csv);
    } catch (error) {
      console.error(
        'CSV export failed:',
        error
      );

      return res.status(500).json({
        message: 'Failed to export CSV file.',
      });
    }
  }
);

/* =========================================================
   Excel Export Route
   ========================================================= */

app.get(
  '/api/export-excel',
  requireAdmin,
  async (req, res) => {
    return res.redirect(
      302,
      `/api/export-csv?key=${encodeURIComponent(
        req.query.key || ''
      )}`
    );
  }
);

/* =========================================================
   Frontend
   ========================================================= */

if (isProduction) {
  app.use(
    express.static(
      path.join(rootDir, 'dist')
    )
  );

  app.get(
    '/{*splat}',
    (req, res) => {
      res.sendFile(
        path.join(
          rootDir,
          'dist',
          'index.html'
        )
      );
    }
  );
} else {
  const { createServer } =
    await import('vite');

  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: false,
    },

    appType: 'spa',
  });

  app.use(vite.middlewares);
}

/* =========================================================
   Start Server
   ========================================================= */

await initializeDatabase();

const PORT =
  process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Innovex is running at http://localhost:${PORT} (${
      isProduction
        ? 'production'
        : 'development'
    })`
  );
});