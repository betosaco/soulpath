#!/usr/bin/env node

/**
 * Rendering Comparison Tool
 * This script compares the rendering between localhost and Vercel production
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const LOCALHOST_URL = 'http://localhost:3000';
const PRODUCTION_URL = 'https://frontend-eb96ocbiz-matmaxworlds-projects.vercel.app';

console.log('🔍 Comparing localhost vs production rendering...\n');

async function compareRendering() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Test localhost
    console.log('1. Testing localhost...');
    const localhostPage = await browser.newPage();
    await localhostPage.setViewport({ width: 1920, height: 1080 });
    
    try {
      await localhostPage.goto(LOCALHOST_URL, { waitUntil: 'networkidle0', timeout: 10000 });
      console.log('   ✅ Localhost loaded successfully');
    } catch (error) {
      console.log('   ❌ Localhost failed to load:', error.message);
      return;
    }

    // Test production
    console.log('2. Testing production...');
    const productionPage = await browser.newPage();
    await productionPage.setViewport({ width: 1920, height: 1080 });
    
    try {
      await productionPage.goto(PRODUCTION_URL, { waitUntil: 'networkidle0', timeout: 10000 });
      console.log('   ✅ Production loaded successfully');
    } catch (error) {
      console.log('   ❌ Production failed to load:', error.message);
      return;
    }

    // Compare CSS
    console.log('3. Comparing CSS...');
    const localhostCSS = await localhostPage.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.map(sheet => ({
        href: sheet.href,
        rules: sheet.cssRules ? sheet.cssRules.length : 0,
        disabled: sheet.disabled
      }));
    });

    const productionCSS = await productionPage.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.map(sheet => ({
        href: sheet.href,
        rules: sheet.cssRules ? sheet.cssRules.length : 0,
        disabled: sheet.disabled
      }));
    });

    console.log('   Localhost CSS files:', localhostCSS.length);
    console.log('   Production CSS files:', productionCSS.length);

    // Compare computed styles
    console.log('4. Comparing computed styles...');
    const localhostStyles = await localhostPage.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        lineHeight: computedStyle.lineHeight,
        margin: computedStyle.margin,
        padding: computedStyle.padding,
        width: computedStyle.width,
        height: computedStyle.height
      };
    });

    const productionStyles = await productionPage.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        lineHeight: computedStyle.lineHeight,
        margin: computedStyle.margin,
        padding: computedStyle.padding,
        width: computedStyle.width,
        height: computedStyle.height
      };
    });

    // Find differences
    console.log('5. Analyzing differences...');
    const differences = [];
    
    Object.keys(localhostStyles).forEach(key => {
      if (localhostStyles[key] !== productionStyles[key]) {
        differences.push({
          property: key,
          localhost: localhostStyles[key],
          production: productionStyles[key]
        });
      }
    });

    if (differences.length > 0) {
      console.log('   ❌ Found differences:');
      differences.forEach(diff => {
        console.log(`     ${diff.property}:`);
        console.log(`       Localhost: ${diff.localhost}`);
        console.log(`       Production: ${diff.production}`);
      });
    } else {
      console.log('   ✅ No differences found in computed styles');
    }

    // Compare specific elements
    console.log('6. Comparing specific elements...');
    const localhostElements = await localhostPage.evaluate(() => {
      const elements = document.querySelectorAll('[class*="btn"], [class*="header"], [class*="unified"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        computedStyle: {
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          fontSize: window.getComputedStyle(el).fontSize,
          padding: window.getComputedStyle(el).padding,
          margin: window.getComputedStyle(el).margin
        }
      }));
    });

    const productionElements = await productionPage.evaluate(() => {
      const elements = document.querySelectorAll('[class*="btn"], [class*="header"], [class*="unified"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        computedStyle: {
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          fontSize: window.getComputedStyle(el).fontSize,
          padding: window.getComputedStyle(el).padding,
          margin: window.getComputedStyle(el).margin
        }
      }));
    });

    console.log(`   Localhost elements: ${localhostElements.length}`);
    console.log(`   Production elements: ${productionElements.length}`);

    // Save comparison report
    const report = {
      timestamp: new Date().toISOString(),
      localhost: {
        url: LOCALHOST_URL,
        css: localhostCSS,
        styles: localhostStyles,
        elements: localhostElements
      },
      production: {
        url: PRODUCTION_URL,
        css: productionCSS,
        styles: productionStyles,
        elements: productionElements
      },
      differences: differences
    };

    fs.writeFileSync('rendering-comparison.json', JSON.stringify(report, null, 2));
    console.log('\n📊 Comparison report saved to rendering-comparison.json');

  } finally {
    await browser.close();
  }
}

compareRendering().catch(console.error);
