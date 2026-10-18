/**
 * Google Tool Finder — Secure Admin Password Hash Generator
 * 
 * Generates an OWASP-compliant scrypt password hash compatible with api/admin-auth.ts.
 * Format: scrypt$<16-byte-salt-hex>$<64-byte-derived-key-hex>
 * 
 * Usage Examples:
 *   1. Interactive masked input:
 *      npx tsx scripts/generate-admin-hash.ts
 * 
 *   2. Non-interactive via environment variable (recommended for automated setup):
 *      ADMIN_PASSWORD_INPUT="your_secure_password" npx tsx scripts/generate-admin-hash.ts
 * 
 *   3. Pipe input:
 *      echo "your_secure_password" | npx tsx scripts/generate-admin-hash.ts
 * 
 *   4. Verify an existing hash without displaying secrets:
 *      npx tsx scripts/generate-admin-hash.ts --verify "scrypt$..."
 */

import crypto from 'crypto';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPasswordHash } from '../api/admin-auth.js';

interface CliArgs {
  verifyHash?: string;
  writeEnvFile?: string;
  quiet?: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const parsed: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--verify' && args[i + 1]) {
      parsed.verifyHash = args[i + 1];
      i++;
    } else if (args[i] === '--write-env' && args[i + 1]) {
      parsed.writeEnvFile = args[i + 1];
      i++;
    } else if (args[i] === '--quiet' || args[i] === '-q') {
      parsed.quiet = true;
    }
  }

  return parsed;
}

async function readPasswordInput(): Promise<string> {
  // 1. Check if provided via environment variable (cleared immediately after reading)
  if (process.env.ADMIN_PASSWORD_INPUT) {
    const input = process.env.ADMIN_PASSWORD_INPUT;
    delete process.env.ADMIN_PASSWORD_INPUT;
    return input.trim();
  }

  // 2. Check if piped via stdin
  if (!process.stdin.isTTY) {
    return new Promise((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf-8');
      process.stdin.on('data', chunk => { data += chunk; });
      process.stdin.on('end', () => {
        resolve(data.replace(/[\r\n]+$/, ''));
      });
    });
  }

  // 3. Interactive TTY prompt
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Mask input in terminal
    process.stdout.write('Enter Administrator Password to hash: ');
    
    // Disable stdout echoing if possible
    const stdin = process.stdin as any;
    const oldRawMode = stdin.isRaw;
    if (typeof stdin.setRawMode === 'function') {
      stdin.setRawMode(true);
    }

    let input = '';
    const onData = (char: Buffer) => {
      const str = char.toString('utf-8');
      if (str === '\r' || str === '\n' || str === '\u0004') {
        if (typeof stdin.setRawMode === 'function') stdin.setRawMode(oldRawMode || false);
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        rl.close();
        resolve(input.trim());
      } else if (str === '\u0003') { // Ctrl+C
        process.stdout.write('\nAborted.\n');
        process.exit(1);
      } else if (str === '\b' || str === '\x7f') { // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        input += str;
        process.stdout.write('*');
      }
    };

    stdin.on('data', onData);
  });
}

async function main() {
  const options = parseArgs();
  const rawInput = await readPasswordInput();

  if (!rawInput) {
    console.error('Error: Empty password provided. Password cannot be empty.');
    process.exit(1);
  }

  // Verification mode: Test a password against an existing hash
  if (options.verifyHash) {
    const isMatch = verifyPasswordHash(rawInput, options.verifyHash);
    if (isMatch) {
      console.log('PASS: Password matches the supplied scrypt hash.');
      process.exit(0);
    } else {
      console.error('FAIL: Password does NOT match the supplied hash.');
      process.exit(1);
    }
  }

  // Minimum length check for production administrator passwords
  if (rawInput.length < 12) {
    console.warn('[SECURITY WARNING] Password is under 12 characters. A minimum of 16-24 characters is strongly recommended for production admin access.');
  }

  // Generate scrypt hash
  const hash = hashPassword(rawInput);

  // Self-verification sanity check
  const verificationPassed = verifyPasswordHash(rawInput, hash);
  if (!verificationPassed) {
    console.error('FATAL: Internal hash verification failed.');
    process.exit(1);
  }

  // Optional: write to environment file directly without printing
  if (options.writeEnvFile) {
    const targetPath = path.resolve(process.cwd(), options.writeEnvFile);
    let content = '';
    if (fs.existsSync(targetPath)) {
      content = fs.readFileSync(targetPath, 'utf-8');
      if (content.includes('ADMIN_PASSWORD_HASH=')) {
        content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${hash}`);
      } else {
        content += `\nADMIN_PASSWORD_HASH=${hash}\n`;
      }
    } else {
      content = `ADMIN_PASSWORD_HASH=${hash}\n`;
    }
    fs.writeFileSync(targetPath, content, { encoding: 'utf-8', mode: 0o600 });
    console.log(`[OK] Successfully wrote ADMIN_PASSWORD_HASH to ${options.writeEnvFile}`);
    process.exit(0);
  }

  if (options.quiet) {
    // Only output the hash string for shell capturing: HASH=$(npx tsx scripts/generate-admin-hash.ts -q)
    process.stdout.write(hash);
    process.exit(0);
  }

  console.log('\n============================================================');
  console.log('ADMIN_PASSWORD_HASH GENERATION SUCCESSFUL');
  console.log('============================================================');
  console.log('Algorithm: scrypt (N=16384, r=8, p=1, keylen=64)');
  console.log('Format:    scrypt$<32-hex-salt>$<128-hex-hash>');
  console.log('Verified:  Self-verification test passed (100% compatible)');
  console.log('------------------------------------------------------------');
  console.log('Set the following variable in your production hosting environment:');
  console.log(`\nADMIN_PASSWORD_HASH=${hash}\n`);
  console.log('------------------------------------------------------------');
  console.log('IMPORTANT:');
  console.log('1. Once ADMIN_PASSWORD_HASH is configured in production, delete');
  console.log('   any plaintext ADMIN_PASSWORD variable from your hosting dashboard.');
  console.log('2. Keep your plaintext password in a secure password manager.');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
