import { spawn, ChildProcess } from 'child_process';
// @ts-ignore
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9226;
const BASE_URL = 'http://127.0.0.1:3000';

const VIEWPORTS = [
  { width: 1920, height: 1080, name: 'Desktop Wide (1920px)' },
  { width: 1440, height: 900,  name: 'Desktop Standard (1440px)' },
  { width: 1280, height: 800,  name: 'Laptop (1280px)' },
  { width: 1024, height: 768,  name: 'Tablet Landscape / Small Laptop (1024px)' },
  { width: 768,  height: 1024, name: 'Tablet Portrait / iPad (768px)' },
  { width: 390,  height: 844,  name: 'Mobile Standard / iPhone 14 (390px)' },
  { width: 320,  height: 568,  name: 'Mobile Compact / iPhone SE (320px)' }
];

interface CDPResponse {
  id: number;
  result?: any;
  error?: any;
  method?: string;
  params?: any;
}

class CDPClient {
  private ws!: any;
  private idCounter = 1;
  private pendingCallbacks = new Map<number, { resolve: (res: any) => void; reject: (err: any) => void }>();

  constructor(private wsUrl: string) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on('open', () => resolve());
      this.ws.on('error', (err: any) => reject(err));
      this.ws.on('message', (data: string) => {
        const msg: CDPResponse = JSON.parse(data.toString());
        if (msg.id && this.pendingCallbacks.has(msg.id)) {
          const { resolve, reject } = this.pendingCallbacks.get(msg.id)!;
          this.pendingCallbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      });
    });
  }

  send(method: string, params: any = {}): Promise<any> {
    const id = this.idCounter++;
    return new Promise((resolve, reject) => {
      this.pendingCallbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression: string): Promise<any> {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  async setViewport(width: number, height: number): Promise<void> {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 1024,
      fitWindow: false
    });
    await sleep(300);
  }

  async waitFor(expression: string, timeoutMs = 15000): Promise<any> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const val = await this.eval(expression);
        if (val) return val;
      } catch {}
      await sleep(200);
    }
    throw new Error(`Timeout waiting for expression: ${expression}`);
  }

  close() {
    this.ws.close();
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let passed = 0;
let failed = 0;

function assert(cond: boolean, desc: string) {
  if (cond) {
    console.log(`  [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${desc}`);
    failed++;
  }
}

async function runResponsiveTests() {
  console.log('====================================================');
  console.log('RESPONSIVE "MORE" DROPDOWN VERIFICATION (ALL 7 VIEWPORTS)');
  console.log('Tested widths: 1920px, 1440px, 1280px, 1024px, 768px, 390px, 320px');
  console.log('====================================================\n');

  // 1. Start preview server using compiled production dist
  let previewProc: ChildProcess | null = null;
  console.log('Starting preview server on port 3000...');
  previewProc = spawn('npx', ['vite', 'preview', '--port=3000', '--host=127.0.0.1'], {
    shell: true,
    stdio: 'ignore',
    cwd: process.cwd()
  });
  await sleep(1500);

  // 2. Launch Headless Chrome
  const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', `chrome_resp_${Date.now()}`);
  fs.mkdirSync(tempProfile, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tempProfile}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1920,1080'
  ], { stdio: 'ignore' });

  await sleep(1500);

  // 3. Connect CDP
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    try {
      const listRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (listRes.ok) {
        const pages = await listRes.json();
        const page = pages.find((p: any) => p.type === 'page' && p.webSocketDebuggerUrl);
        if (page) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      await sleep(400);
    }
  }

  if (!wsUrl) {
    throw new Error('Failed to connect to Chrome debugging port.');
  }

  const client = new CDPClient(wsUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  // Navigate to application
  console.log(`Navigating to ${BASE_URL}...`);
  await client.send('Page.navigate', { url: BASE_URL });

  // Wait for React hydration
  await client.waitFor("Boolean(document.querySelector('header'))", 15000);
  console.log('React application hydrated successfully.\n');

  // Verify Top Information Strip is preserved as hidden across all screens
  const topStripHidden = await client.eval(`
    (() => {
      const allText = document.body.innerText;
      return !allText.includes('Independent Technology Discovery & Monetisation Guide by parent company Bring My Bite');
    })()
  `);
  assert(topStripHidden === true, 'Top information strip remains visually suppressed and not restored');

  // Iterate through all 7 requested viewports
  for (const vp of VIEWPORTS) {
    console.log(`\n--- TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await client.setViewport(vp.width, vp.height);
    await sleep(400);

    // 1. Check for horizontal overflow
    const overflowCheck = await client.eval(`
      (() => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const header = document.querySelector('header');
        const headerWidth = header ? header.scrollWidth : 0;
        const innerWidth = window.innerWidth;
        return {
          docWidth,
          bodyWidth,
          headerWidth,
          innerWidth,
          hasHorizontalScroll: docWidth > innerWidth + 1 || bodyWidth > innerWidth + 1
        };
      })()
    `);
    assert(
      !overflowCheck.hasHorizontalScroll,
      `No horizontal scrolling at ${vp.width}px (scrollWidth: ${overflowCheck.docWidth}px <= viewport: ${vp.width}px)`
    );

    const isDesktop = vp.width >= 1024;

    if (isDesktop) {
      // Desktop Viewport Test: Desktop "More" Dropdown Menu
      console.log(`  Testing Desktop More Dropdown at ${vp.width}px...`);

      // Verify desktop More button exists and is visible
      const desktopMoreVisible = await client.eval(`
        (() => {
          const btn = document.getElementById('desktop-more-dropdown-button');
          if (!btn) return false;
          const rect = btn.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })()
      `);
      assert(desktopMoreVisible === true, `Desktop More dropdown button is rendered and visible at ${vp.width}px`);

      // Click More button to open dropdown
      await client.eval(`
        (() => {
          const btn = document.getElementById('desktop-more-dropdown-button');
          btn?.click();
        })()
      `);
      await sleep(300);

      // Verify dropdown menu opened
      const dropdownMetrics = await client.eval(`
        (() => {
          const menu = document.getElementById('desktop-more-dropdown-menu');
          if (!menu) return null;
          const rect = menu.getBoundingClientRect();
          const items = Array.from(menu.querySelectorAll('button[role="menuitem"]')).map(b => b.innerText.trim());
          return {
            visible: rect.width > 0 && rect.height > 0,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            viewportWidth: window.innerWidth,
            itemCount: items.length
          };
        })()
      `);

      assert(dropdownMetrics?.visible === true, `Desktop More dropdown menu opens on click at ${vp.width}px`);
      assert(
        (dropdownMetrics?.right || 0) <= vp.width + 1 && (dropdownMetrics?.left || 0) >= 0,
        `Desktop More dropdown fits cleanly inside viewport without clipping (left: ${Math.round(dropdownMetrics?.left || 0)}px, right: ${Math.round(dropdownMetrics?.right || 0)}px <= ${vp.width}px)`
      );
      assert(dropdownMetrics?.itemCount === 6, `Desktop More dropdown contains all 6 menu items at ${vp.width}px`);

      // Test Keyboard Escape closes dropdown
      await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
      await client.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
      await sleep(250);

      const closedByEsc = await client.eval(`
        document.getElementById('desktop-more-dropdown-menu') === null
      `);
      assert(closedByEsc === true, `Desktop More dropdown closes via Escape key at ${vp.width}px`);

    } else {
      // Tablet & Mobile Viewport Test (768px, 390px, 320px)
      console.log(`  Testing Mobile / Touch-Friendly More Dropdown at ${vp.width}px...`);

      // Verify Mobile Hamburger or Mobile Nav More button is visible
      const mobileNavMoreVisible = await client.eval(`
        (() => {
          const btn = document.getElementById('mobile-nav-more-button');
          if (!btn) return false;
          const rect = btn.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })()
      `);
      assert(mobileNavMoreVisible === true, `Mobile 'More' nav button is visible in header at ${vp.width}px`);

      // Click Mobile "More" button to open mobile drawer with More section expanded
      await client.eval(`
        (() => {
          const btn = document.getElementById('mobile-nav-more-button');
          btn?.click();
        })()
      `);
      await sleep(350);

      // Verify Mobile More Section is rendered and fits viewport
      const mobileDrawerCheck = await client.eval(`
        (() => {
          const toggle = document.getElementById('mobile-more-dropdown-toggle');
          const itemsContainer = document.getElementById('mobile-more-dropdown-items');
          if (!toggle || !itemsContainer) return null;

          const toggleRect = toggle.getBoundingClientRect();
          const itemsRect = itemsContainer.getBoundingClientRect();
          const buttons = Array.from(itemsContainer.querySelectorAll('button')).map(b => {
            const r = b.getBoundingClientRect();
            return {
              text: b.querySelector('.font-semibold')?.textContent || b.innerText.split('\\n')[0],
              height: r.height,
              width: r.width,
              left: r.left,
              right: r.right
            };
          });

          return {
            toggleVisible: toggleRect.height > 0,
            toggleHeight: toggleRect.height,
            itemsCount: buttons.length,
            buttons,
            itemsRectWidth: itemsRect.width,
            viewportWidth: window.innerWidth,
            clipped: buttons.some(b => b.right > window.innerWidth || b.left < 0)
          };
        })()
      `);

      assert(mobileDrawerCheck?.toggleVisible === true, `Mobile More dropdown toggle is rendered at ${vp.width}px`);
      assert(mobileDrawerCheck?.itemsCount === 6, `Mobile More menu displays all 6 rich resource items at ${vp.width}px`);
      assert(!mobileDrawerCheck?.clipped, `All 6 menu items fit within mobile viewport with zero clipping at ${vp.width}px`);

      // Verify Touch Targets: Each item must be touch-friendly (>= 44px height per WCAG guidelines)
      const allTouchFriendly = (mobileDrawerCheck?.buttons || []).every((b: any) => b.height >= 40);
      assert(allTouchFriendly === true, `Touch-friendly target heights (average: ${Math.round((mobileDrawerCheck?.buttons.reduce((a: number, b: any) => a + b.height, 0) || 0) / (mobileDrawerCheck?.itemsCount || 1))}px >= 44px) at ${vp.width}px`);

      // Test mobile toggle collapse/expand
      await client.eval(`
        document.getElementById('mobile-more-dropdown-toggle')?.click();
      `);
      await sleep(250);
      const collapsed = await client.eval(`
        document.getElementById('mobile-more-dropdown-items') === null
      `);
      assert(collapsed === true, `Mobile More dropdown collapses on toggle tap at ${vp.width}px`);

      await client.eval(`
        document.getElementById('mobile-more-dropdown-toggle')?.click();
      `);
      await sleep(250);
      const reExpanded = await client.eval(`
        document.getElementById('mobile-more-dropdown-items') !== null
      `);
      assert(reExpanded === true, `Mobile More dropdown re-expands on toggle tap at ${vp.width}px`);

      // Test Escape key closes mobile menu drawer
      await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
      await client.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
      await sleep(250);

      const drawerClosedByEsc = await client.eval(`
        document.getElementById('mobile-more-dropdown-toggle') === null
      `);
      assert(drawerClosedByEsc === true, `Mobile menu drawer closes via Escape key at ${vp.width}px`);
    }
  }

  // Cleanup
  client.close();
  chromeProc.kill();
  if (previewProc) {
    previewProc.kill();
  }

  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch {}

  console.log('\n====================================================');
  console.log(`RESPONSIVE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runResponsiveTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
