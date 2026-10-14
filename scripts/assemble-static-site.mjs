import { cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(sourceDirectory, 'public');
const excludedEntries = new Set([
  '.git',
  '.snapshots',
  '.vscode',
  'Mindfulness',
  'node_modules',
  'public',
  'scripts',
]);

await mkdir(outputDirectory, { recursive: true });

for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
  if (excludedEntries.has(entry.name) || entry.name.startsWith('.env')) continue;

  await cp(
    path.join(sourceDirectory, entry.name),
    path.join(outputDirectory, entry.name),
    {
      recursive: true,
      filter: (sourcePath) => {
        const name = path.basename(sourcePath);
        return !name.startsWith('.') && name !== 'node_modules';
      },
    },
  );
}

console.log(`Static homepage assembled at ${outputDirectory}`);