import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const site = 'https://switchroguelikes.com';
const forbidden = ['/rogue-on-switch/', 'rogueonswitch.com', 'billyjameshowell.github.io'];
const inspect = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html') || name.endsWith('.xml') || name === 'robots.txt' || name === 'CNAME') {
      inspect.push(path);
    }
  }
}

walk(dist);

let failed = false;
for (const file of inspect) {
  const text = readFileSync(file, 'utf8');
  for (const needle of forbidden) {
    if (text.includes(needle)) {
      console.error(`${file} contains forbidden URL fragment: ${needle}`);
      failed = true;
    }
  }
}

const index = readFileSync(join(dist, 'index.html'), 'utf8');
if (!index.includes('href="/_astro/')) {
  console.error('dist/index.html does not reference root-relative /_astro/ CSS');
  failed = true;
}
if (!index.includes(`rel="canonical" href="${site}`)) {
  console.error(`dist/index.html canonical is not ${site}`);
  failed = true;
}
if (!index.includes(`property="og:url" content="${site}`)) {
  console.error(`dist/index.html og:url is not ${site}`);
  failed = true;
}

const cname = readFileSync(join(dist, 'CNAME'), 'utf8').trim();
if (cname !== 'switchroguelikes.com') {
  console.error(`dist/CNAME should be switchroguelikes.com, got: ${cname}`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`Production URLs look correct for ${site}`);
