#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function read(filePath) {
  return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
}

function exists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ${message}`);
    return false;
  }
  console.log(`✅ ${message}`);
  return true;
}

function validateNetlifyToml() {
  console.log('\nNetlify config');
  if (!assert(exists('netlify.toml'), 'netlify.toml exists')) return false;

  const toml = read('netlify.toml');
  const checks = [
    assert(toml.includes('[build]'), 'build section is present'),
    assert(toml.includes('command = "npm run build"'), 'build command is npm run build'),
    assert(toml.includes('publish = ".next"'), 'publish directory is .next'),
    assert(toml.includes('NODE_VERSION = "20"'), 'Node 20 is configured'),
    assert(toml.includes('[functions]'), 'functions section is present'),
    assert(toml.includes('directory = "netlify/functions"'), 'functions directory is netlify/functions'),
    assert(!toml.includes('@netlify/plugin-nextjs'), 'OpenNext adapter is not pinned via @netlify/plugin-nextjs'),
    assert(!toml.includes('/index.html'), 'no SPA fallback redirect is configured for Next.js'),
  ];
  return checks.every(Boolean);
}

function validateFunctions() {
  console.log('\nNetlify functions');
  if (!assert(exists('netlify/functions/contact.js'), 'contact function exists')) return false;
  const fn = read('netlify/functions/contact.js');
  const checks = [
    assert(fn.includes('exports.handler'), 'contact function exports handler'),
    assert(fn.includes('RESEND_API_KEY'), 'contact function reads RESEND_API_KEY'),
    assert(fn.includes('CONTACT_TO_EMAIL'), 'contact function supports CONTACT_TO_EMAIL'),
  ];
  return checks.every(Boolean);
}

function validatePackageScripts() {
  console.log('\nPackage scripts');
  const pkg = JSON.parse(read('package.json'));
  const checks = [
    assert(Boolean(pkg.scripts.build), 'build script exists'),
    assert(Boolean(pkg.scripts.lint), 'lint script exists'),
    assert(Boolean(pkg.scripts.test), 'test script exists'),
    assert(pkg.scripts['netlify:dev'] === 'netlify dev', 'netlify:dev script exists'),
    assert(Boolean(pkg.scripts['netlify:deploy']), 'netlify:deploy script exists'),
    assert(Boolean(pkg.devDependencies['netlify-cli']), 'netlify-cli is a devDependency'),
  ];
  return checks.every(Boolean);
}

function validateWorkflowCleanup() {
  console.log('\nWorkflow cleanup');
  if (!assert(exists('.github/workflows/ci.yml'), 'ci.yml exists')) return false;
  const workflow = read('.github/workflows/ci.yml');
  const checks = [
    assert(!workflow.includes('vercel-action'), 'Vercel deploy action removed'),
    assert(!workflow.includes('VERCEL_'), 'Vercel secrets removed'),
    assert(workflow.includes('NETLIFY_AUTH_TOKEN'), 'Netlify auth token is referenced'),
    assert(workflow.includes('NETLIFY_SITE_ID'), 'Netlify site id is referenced'),
    assert(!exists('.github/workflows/deploy.yml'), 'duplicate deploy.yml is not present'),
  ];
  return checks.every(Boolean);
}

function validateVercelCleanup() {
  console.log('\nVercel cleanup');
  const checks = [
    assert(!exists('vercel.json'), 'vercel.json is removed'),
    assert(!exists('.vercel'), '.vercel directory is absent'),
  ];
  return checks.every(Boolean);
}

function main() {
  console.log('Netlify deployment sanity check');

  const validations = [
    validateNetlifyToml,
    validateFunctions,
    validatePackageScripts,
    validateWorkflowCleanup,
    validateVercelCleanup,
  ];

  const ok = validations.map((fn) => fn()).every(Boolean);
  console.log('\n' + '='.repeat(48));
  if (!ok) {
    console.error('❌ Netlify validation failed');
    process.exit(1);
  }

  console.log('✅ Netlify validation passed');
}

if (require.main === module) {
  main();
}

module.exports = {
  validateNetlifyToml,
  validateFunctions,
  validatePackageScripts,
  validateWorkflowCleanup,
  validateVercelCleanup,
};
