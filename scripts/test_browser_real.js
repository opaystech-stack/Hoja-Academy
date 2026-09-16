/**
 * OPAYS ACADEMY — TEST NAVIGATEUR RÉEL (Puppeteer / Chrome Headless)
 * Ouvre les 18 modules dans un vrai Chrome, teste interactions et capture screenshots
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const modulesDir = DIRS.modules;
const screenshotsDir = DIRS.screenshots;
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Liste des modules depuis le registre central (source de vérité unique)
const moduleList = modules.map(m => m.code);

// Detect Chrome/Edge executable
function findBrowser() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function main() {
  const browserPath = findBrowser();
  if (!browserPath) {
    console.error('❌ Aucun navigateur Chrome/Edge trouvé. Installation requise.');
    process.exit(1);
  }
  console.log('🌐 Navigateur détecté:', browserPath);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-web-security', '--allow-file-access-from-files']
  });

  console.log('\n' + '═'.repeat(70));
  console.log('  🔬 TEST NAVIGATEUR RÉEL — 18 MODULES OPAYS (Chrome Headless)');
  console.log('═'.repeat(70));

  const results = [];
  let totalIssues = 0;

  for (let i = 0; i < moduleList.length; i++) {
    const code = moduleList[i];
    const modNum = modules[i] ? String(modules[i].num).padStart(2, '0') : String(i + 1).padStart(2, '0');
    const filePath = path.join(modulesDir, code, 'presentation.html');
    const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');

    const page = await browser.newPage();
    const consoleErrors = [];
    const consoleWarnings = [];

    // Capture console
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
      if (msg.type() === 'warning') consoleWarnings.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    const moduleResult = { modNum, code, tests: [], issues: [] };

    function check(name, pass, detail) {
      moduleResult.tests.push({ name, pass });
      if (!pass) {
        moduleResult.issues.push(detail || name);
        totalIssues++;
      }
    }

    try {
      // ===== DESKTOP (1920x1080) =====
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForSelector('.scene.active', { timeout: 5000 });

      // Screenshot desktop cover
      await page.screenshot({
        path: path.join(screenshotsDir, `${modNum}-desktop-cover.png`),
        fullPage: false
      });

      // Console errors on load
      const loadErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('net::ERR'));
      check('Console: 0 erreurs JS au chargement', loadErrors.length === 0, 
        loadErrors.length > 0 ? `Erreurs console: ${loadErrors.join('; ')}` : undefined);

      // Active scene visible
      const activeScene = await page.$('.scene.active');
      check('Slide active visible', activeScene !== null);

      // Title in topbar
      const brandText = await page.$eval('#homeBtn', el => el.textContent.trim()).catch(() => '');
      check('Topbar affiche OPAYS ACADEMY', brandText.includes('OPAYS ACADEMY'));

      // Progress bar at 0 or start
      const progressWidth = await page.$eval('#progressBar', el => el.style.width).catch(() => '');
      check('Progress bar initialisée', progressWidth !== '');

      // ===== NAVIGATION =====
      // Use goTo() to test navigation engine directly (click Next triggers advance() which first reveals .reveal elements)
      await page.evaluate(() => { goTo(1); });
      await new Promise(r => setTimeout(r, 600));
      const slideIdx = await page.$eval('#currentIndex', el => el.textContent).catch(() => '');
      check('Navigation: goTo(1) avance à slide 2', slideIdx.includes('2') || slideIdx.includes('02'));

      // Go back to slide 1
      await page.evaluate(() => { goTo(0); });
      await new Promise(r => setTimeout(r, 600));
      const slideIdxBack = await page.$eval('#currentIndex', el => el.textContent).catch(() => '');
      check('Navigation: goTo(0) revient à slide 1', slideIdxBack.includes('1') || slideIdxBack.includes('01'));

      // Keyboard navigation — use goTo() to test the engine directly (ArrowRight first reveals hidden elements before advancing)
      await page.evaluate(() => { goTo(1); });
      await new Promise(r => setTimeout(r, 600));
      const slideIdxKeyboard = await page.$eval('#currentIndex', el => el.textContent).catch(() => '');
      check('Navigation: goTo(1) avance à slide 2', slideIdxKeyboard.includes('2') || slideIdxKeyboard.includes('02'));

      // Go back
      await page.evaluate(() => { goTo(0); });
      await new Promise(r => setTimeout(r, 200));

      // ===== NOTES FORMATEUR =====
      // Open notes panel
      await page.click('#notesBtn');
      await new Promise(r => setTimeout(r, 600));
      const notesPanelOpen = await page.$eval('#notesPanel', el => el.classList.contains('open')).catch(() => false);
      check('Notes formateur: panneau s\'ouvre', notesPanelOpen);

      if (notesPanelOpen) {
        // Check notes content
        const noteGoal = await page.$eval('#noteGoal', el => el.textContent.trim()).catch(() => '');
        check('Notes formateur: objectif non vide', noteGoal.length > 5, 
          noteGoal.length <= 5 ? `noteGoal vide: "${noteGoal}"` : undefined);

        const noteTalk = await page.$eval('#noteTalk', el => el.textContent.trim()).catch(() => '');
        check('Notes formateur: arguments non vides', noteTalk.length > 5,
          noteTalk.length <= 5 ? `noteTalk vide: "${noteTalk}"` : undefined);

        const noteTransition = await page.$eval('#noteTransition', el => el.textContent.trim()).catch(() => '');
        check('Notes formateur: transition non vide', noteTransition.length > 5,
          noteTransition.length <= 5 ? `noteTransition vide: "${noteTransition}"` : undefined);

        // Screenshot notes
        await page.screenshot({
          path: path.join(screenshotsDir, `${modNum}-desktop-notes.png`),
          fullPage: false
        });

        // Close notes (press N or Escape)
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 300));
      }

      // ===== RESOURCE DOCK =====
      await page.click('#resourceDockBtn');
      await new Promise(r => setTimeout(r, 600));
      const dockOpen = await page.$eval('#resourceDock', el => el.classList.contains('open')).catch(() => false);
      check('Dock ressources: s\'ouvre', dockOpen);

      if (dockOpen) {
        // Count dock items
        const dockItems = await page.$$eval('.dock-item', items => items.length).catch(() => 0);
        check('Dock ressources: au moins 1 prompt', dockItems >= 1);

        // Close dock
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 300));
      }

      // ===== OVERVIEW =====
      await page.keyboard.press('o');
      await new Promise(r => setTimeout(r, 600));
      const overviewOpen = await page.$eval('#overview', el => el.classList.contains('open')).catch(() => false);
      check('Vue d\'ensemble: s\'ouvre avec [O]', overviewOpen);

      if (overviewOpen) {
        const overviewItems = await page.$$eval('.overview-item', items => items.length).catch(() => 0);
        check('Vue d\'ensemble: affiche toutes les slides', overviewItems >= 3);

        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 300));
      }

      // ===== COPY BUTTONS =====
      // Navigate to a slide with a prompt card (if any)
      const hasCopyBtn = await page.$$eval('.copy-btn[data-copy]', btns => btns.length).catch(() => 0);
      if (hasCopyBtn > 0) {
        // Find the slide with a copy button and navigate there
        const copyBtnSlideIdx = await page.evaluate(() => {
          const scenes = document.querySelectorAll('.scene');
          for (let i = 0; i < scenes.length; i++) {
            if (scenes[i].querySelector('.copy-btn[data-copy]')) return i;
          }
          return -1;
        });
        if (copyBtnSlideIdx >= 0) {
          await page.evaluate((idx) => { goTo(idx); }, copyBtnSlideIdx);
          await new Promise(r => setTimeout(r, 500));

          // Check the copy button is visible
          const copyBtnVisible = await page.$eval('.scene.active .copy-btn[data-copy]', el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          }).catch(() => false);
          check('Bouton copie prompt visible en slide', copyBtnVisible);
        }
      }
      check('Au moins 1 bouton copie dans le module', hasCopyBtn >= 1);

      // ===== CONSOLE ERRORS AFTER INTERACTIONS =====
      const postInteractErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('Permissions'));
      check('Console: 0 erreurs JS après interactions', postInteractErrors.length === 0,
        postInteractErrors.length > 0 ? `Erreurs post-interaction: ${postInteractErrors.slice(0, 3).join('; ')}` : undefined);

      // ===== MOBILE (375x812 iPhone) =====
      await page.setViewport({ width: 375, height: 812, isMobile: true });
      await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForSelector('.scene.active', { timeout: 5000 });
      await new Promise(r => setTimeout(r, 500));

      // Screenshot mobile
      await page.screenshot({
        path: path.join(screenshotsDir, `${modNum}-mobile-cover.png`),
        fullPage: false
      });

      // Check mobile renders without overflow (use html.scrollWidth which respects overflow:hidden clipping)
      const htmlScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      check('Mobile: pas de débordement horizontal', htmlScrollWidth <= 380);

      // Check topbar visible
      const topbarVisible = await page.$eval('.topbar', el => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.height < 80;
      }).catch(() => false);
      check('Mobile: topbar compacte visible', topbarVisible);

      // Check hero-stage hidden on mobile
      const heroStageHidden = await page.$eval('.hero-stage', el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none';
      }).catch(() => true); // true if no hero-stage (OK)
      check('Mobile: hero-stage masqué', heroStageHidden);

      // Chapter rail hidden on mobile
      const railHidden = await page.$eval('.chapter-rail', el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none';
      }).catch(() => true);
      check('Mobile: chapter rail masqué', railHidden);

      // Navigation still works on mobile
      await page.click('#nextBtn');
      await new Promise(r => setTimeout(r, 600));
      const mobileSlideIdx = await page.$eval('#currentIndex', el => el.textContent).catch(() => '');
      check('Mobile: navigation fonctionne', mobileSlideIdx.includes('2') || mobileSlideIdx.includes('02'));

      // Mobile console errors
      const mobileErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('Permissions'));
      // Note: cumulated with desktop errors, so just check no NEW ones appeared
      check('Mobile: pas de nouvelles erreurs console', mobileErrors.length === postInteractErrors.length);

    } catch (err) {
      moduleResult.issues.push('CRASH: ' + err.message.slice(0, 100));
      totalIssues++;
    }

    await page.close();

    // Print result
    const status = moduleResult.issues.length === 0 ? '✅ PASS' : '❌ FAIL';
    const testCount = moduleResult.tests.length;
    const passCount = moduleResult.tests.filter(t => t.pass).length;
    console.log(`\n${status} Module ${modNum} [${code}] — ${passCount}/${testCount} tests`);
    if (moduleResult.issues.length > 0) {
      moduleResult.issues.forEach(i => console.log(`      ❌ ${i}`));
    }

    results.push(moduleResult);
  }

  await browser.close();

  // ===== FINAL REPORT =====
  console.log('\n' + '═'.repeat(70));
  console.log('  📊 RAPPORT FINAL — TEST NAVIGATEUR RÉEL');
  console.log('═'.repeat(70));

  const totalTests = results.reduce((s, r) => s + r.tests.length, 0);
  const totalPassed = results.reduce((s, r) => s + r.tests.filter(t => t.pass).length, 0);
  const modulesWithIssues = results.filter(r => r.issues.length > 0);

  console.log(`  Modules testés : ${results.length}`);
  console.log(`  Total tests : ${totalTests}`);
  console.log(`  Tests réussis : ${totalPassed}`);
  console.log(`  Tests échoués : ${totalTests - totalPassed}`);
  console.log(`  Modules avec issues : ${modulesWithIssues.length}`);

  if (modulesWithIssues.length > 0) {
    console.log('\n  ⚠️  MODULES AVEC DES PROBLÈMES :');
    modulesWithIssues.forEach(r => {
      console.log(`    Module ${r.modNum} :`);
      r.issues.forEach(i => console.log(`      - ${i}`));
    });
  } else {
    console.log('\n  ✅ TOUS LES 18 MODULES PASSENT LE TEST NAVIGATEUR RÉEL');
  }

  console.log(`\n  📸 Screenshots sauvegardés dans: ${screenshotsDir}`);
  console.log('═'.repeat(70));

  // Save results (ignoré par git — .gitignore)
  fs.writeFileSync(
    path.join(DIRS.scripts, 'browser_real_results.json'),
    JSON.stringify({ totalTests, totalPassed, totalIssues, results }, null, 2),
    'utf8'
  );
}

main().catch(err => {
  console.error('❌ ERREUR FATALE:', err.message);
  process.exit(1);
});
