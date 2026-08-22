import 'dotenv/config';
import express from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const app = express();
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;
const dataDir = path.join(rootDir, 'server');
const dataFile = path.join(dataDir, 'data.json');
const allowedDegrees = ['BE', 'BTech'];
const allowedBranches = ['CSE', 'IT', 'AIDS', 'AIML', 'DS', 'CSE(CS)', 'ECE', 'EEE', 'CIVIL', 'MECH'];
const allowedYears = ['I', 'II', 'III', 'IV'];
const allowedEvents = ['PREZI', 'PROTOSPARK', 'TRY CRACK ME','QUIZMANIA', 'ARTNOVA'];
const allowedPayments = ['Online', 'Offline'];
let writeQueue = Promise.resolve();
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

function isValidRegistration(registration) {
  const hasValidDetail = registration.degree !== 'Others' && registration.branch !== 'ARTS AND SCIENCE'
    ? true
    : typeof registration.degreeDetail === 'string' && registration.degreeDetail.trim().length > 0;

  return (
    typeof registration.name === 'string' && registration.name.trim().length > 0 &&
    allowedDegrees.includes(registration.degree) &&
    allowedBranches.includes(registration.branch) &&
    allowedYears.includes(registration.year) &&
    Number.isInteger(registration.teamMembers) && registration.teamMembers >= 1 &&
    Array.isArray(registration.events) && registration.events.length >= 1 && registration.events.length <= 2 &&
    registration.events.every((event) => allowedEvents.includes(event)) &&
    allowedPayments.includes(registration.payment) &&
    hasValidDetail
  );
}

async function appendRegistration(registration) {
  await mkdir(dataDir, { recursive: true });

  let registrations = [];
  try {
    registrations = JSON.parse(await readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  registrations.push(registration);
  await writeFile(dataFile, JSON.stringify(registrations, null, 2));
}

app.post('/api/register', (req, res) => {
  const registration = {
    name: typeof req.body.name === 'string' ? req.body.name.trim() : '',
    degree: req.body.degree,
    degreeDetail: typeof req.body.degreeDetail === 'string' ? req.body.degreeDetail.trim() : '',
    branch: req.body.branch,
    year: req.body.year,
    teamMembers: Number(req.body.teamMembers),
    events: req.body.events,
    payment: req.body.payment,
    registeredAt: new Date().toISOString(),
  };

  if (!isValidRegistration(registration)) {
    return res.status(400).json({ message: 'Please complete all required fields correctly.' });
  }

  writeQueue = writeQueue.then(() => appendRegistration(registration));
  writeQueue
    .then(() => res.status(201).json({ message: 'Registration successful.' }))
    .catch(() => res.status(500).json({ message: 'Unable to save your registration. Please try again.' }));
});

// --- EXCEL EXPORT ROUTE ---
app.get('/api/export-excel', async (req, res) => {
  try {
    let registrations = [];
    try {
      const fileData = await readFile(dataFile, 'utf8');
      registrations = JSON.parse(fileData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ message: 'No registration data found.' });
      }
      throw error;
    }

    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations available to export.' });
    }

    const formattedData = registrations.map((item) => ({
      Name: item.name,
      Degree: item.degree,
      'Degree Detail': item.degreeDetail || 'N/A',
      Branch: item.branch,
      Year: item.year,
      'Team Members': item.teamMembers,
      Events: Array.isArray(item.events) ? item.events.join(', ') : item.events,
      Payment: item.payment,
      'Registered At': item.registeredAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.xlsx"');
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to export Excel file.' });
  }
});

if (isProduction) {
  app.use(express.static(path.join(rootDir, 'dist')));
  // Route all client-side navigation back to index.html in production
  app.get('/*', (req, res) => {
    res.sendFile(path.join(rootDir, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(3001, () => {
  console.log(`Innovex is running at http://localhost:3001 (${isProduction ? 'production' : 'development'})`);
});