import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const skillRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

// Prefer pnpm: its content-addressable store and strict, non-hoisted
// node_modules give better supply-chain isolation than npm's flat
// install. Fall back to npm only when pnpm isn't on PATH so the skill
// still works on machines that ship npm with Node but not pnpm.
function resolvePackageManager() {
  for (const pm of ['pnpm', 'npm']) {
    try {
      execSync(`${pm} --version`, { stdio: 'ignore' });
      return pm;
    } catch {}
  }
  return null;
}

// Resolve `beautiful-mermaid`, auto-installing it into the skill folder
// on first use. Shared by render.mjs, batch.mjs, and themes.mjs.
export async function loadBeautifulMermaid() {
  try {
    return await import('beautiful-mermaid');
  } catch {}

  const pm = resolvePackageManager();
  if (!pm) {
    console.error('[beautiful-mermaid] No package manager found — install pnpm (preferred) or npm.');
    process.exit(1);
  }
  if (pm === 'npm') {
    console.error('[beautiful-mermaid] pnpm not found; falling back to npm. Install pnpm for stricter supply-chain isolation.');
  }

  console.error(`[beautiful-mermaid] Dependency not found. Installing automatically with ${pm}...`);
  try {
    execSync(`${pm} install`, {
      cwd: skillRoot,
      stdio: ['pipe', 'pipe', 'inherit'],
      timeout: 120000,
    });
    console.error('[beautiful-mermaid] Installed successfully.\n');
  } catch (e) {
    console.error(`[beautiful-mermaid] Auto-install failed: ${e.message}`);
    console.error(`Manual fix: cd ${skillRoot} && ${pm} install`);
    process.exit(1);
  }

  try {
    const pkgPath = join(skillRoot, 'node_modules', 'beautiful-mermaid', 'dist', 'index.js');
    return await import(pkgPath);
  } catch (e) {
    console.error(`[beautiful-mermaid] Failed to load after install: ${e.message}`);
    process.exit(1);
  }
}
