import express from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(rootDir, 'server');
const dataFile = path.join(dataDir, 'data.json');
const allowedDegrees = ['BE', 'BTech', 'B.Sc', 'M.Sc', 'B.com', 'Others'];
const allowedBranches = ['CSE', 'IT', 'AIDS', 'AIML', 'DS', 'CSE(CS)', 'ECE', 'EEE', 'CIVIL', 'MECH', 'ARTS AND SCIENCE'];
const allowedYears = ['I', 'II', 'III', 'IV'];
const allowedEvents = ['PREZI', 'PROTOSPARK', 'QUIZMANIA', 'ARTNOVA', 'HENNA FIEST'];
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

if (isProduction) {
  app.use(express.static(path.join(rootDir, 'dist')));
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
