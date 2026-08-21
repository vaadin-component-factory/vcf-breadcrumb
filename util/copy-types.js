/*-
 * #%L
 * 
 * Copyright (C) 2018 - 2026 Vaadin Ltd
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

/**
 * Copies the hand-written public type declarations from `types/src` into the
 * compiled output at `dist/src`, so that every emitted `.js` has its `.d.ts`
 * sitting next to it.
 *
 * The declarations are hand-written (and `declaration` is off in tsconfig.json)
 * because the inferred ones exposed the Lit implementation: an unexported
 * `*_base` mixin constant, `typeof LitElement`, and type references to
 * `lit-html` and `@open-wc/dedupe-mixin`, which are not direct dependencies of
 * this package. See `types/src/component/*.d.ts` for the public surface.
 */
import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'types', 'src');
const to = join(root, 'dist', 'src');

async function* declarations(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* declarations(path);
    } else if (entry.name.endsWith('.d.ts')) {
      yield path;
    }
  }
}

try {
  await stat(to);
} catch {
  console.error(`${relative(root, to)} does not exist - run "tsc" before copying the type declarations.`);
  process.exit(1);
}

let count = 0;
for await (const source of declarations(from)) {
  const target = join(to, relative(from, source));
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target);
  count += 1;
}

console.log(`Copied ${count} type declaration(s) from ${relative(root, from)} to ${relative(root, to)}.`);
