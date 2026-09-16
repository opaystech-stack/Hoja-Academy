/**
 * Test rapide hub + dashboard (validation registre en file://)
 * Usage : node scripts/check_hub_dashboard.js
 */
'use strict';

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

function findBrowser() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));

  // ── HUB ──
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(pathToFileURL(path.resolve('course-hub.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  const hub = await page.evaluate(() => ({
    modules: document.getElementById('statModules').textContent,
    seances: document.getElementById('statSeances').textContent,
    weeks: document.getElementById('statWeeks').textContent,
    prompts: document.getElementById('statPrompts').textContent,
    footer: document.getElementById('footerCounts').textContent,
    cards: document.querySelectorAll('.module-card').length,
    weekSections: document.querySelectorAll('.week-section').length,
    firstCard: document.querySelector('.module-card .module-title')?.textContent,
    lastCard: [...document.querySelectorAll('.module-card .module-title')].pop()?.textContent,
  }));
  console.log('HUB:', JSON.stringify(hub));

  // ── DASHBOARD ──
  await page.goto(pathToFileURL(path.resolve('formateur-dashboard.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  const dash = await page.evaluate(() => ({
    options: document.querySelectorAll('#moduleSelect option').length,
    firstOpt: document.querySelector('#moduleSelect option')?.textContent,
    lastOpt: [...document.querySelectorAll('#moduleSelect option')].pop()?.textContent,
    phases: document.querySelectorAll('.phase-item').length,
    mission: document.getElementById('missionText').textContent.slice(0, 60),
    slideTitle: document.getElementById('slideTitle').textContent,
    workKitHref: document.getElementById('workKitBtn').href,
    launchHref: document.getElementById('launchBtn').href,
    timer: document.getElementById('timerDisplay').textContent,
  }));
  console.log('DASH:', JSON.stringify(dash));

  // Sélection M18
  await page.select('#moduleSelect', '18');
  await new Promise(r => setTimeout(r, 500));
  const m18 = await page.evaluate(() => ({
    title: document.getElementById('slideTitle').textContent,
    phases: document.querySelectorAll('.phase-item').length,
    chips: document.querySelectorAll('.prompt-chip').length,
    timer: document.getElementById('timerDisplay').textContent,
  }));
  console.log('DASH M18:', JSON.stringify(m18));

  // Sélection M03
  await page.select('#moduleSelect', '3');
  await new Promise(r => setTimeout(r, 500));
  const m03 = await page.evaluate(() => ({
    title: document.getElementById('slideTitle').textContent,
    phases: document.querySelectorAll('.phase-item').length,
    chips: document.querySelectorAll('.prompt-chip').length,
  }));
  console.log('DASH M03:', JSON.stringify(m03));

  console.log('ERREURS CONSOLE:', errors.length ? errors : 'aucune');
  await browser.close();
})();
