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
 * Fails when a component's `static get version()` has drifted from the version
 * in package.json. Runs as part of `npm run lint`, so the drift cannot reach a
 * release unnoticed.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readDeclaredVersions, readPackageVersion } from './versions.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const expected = readPackageVersion(root);
const declared = readDeclaredVersions(root);

const mismatched = declared.filter(({ version }) => version !== expected);

if (mismatched.length > 0) {
  console.error(`check-versions: package.json declares ${expected}, but:`);
  for (const { file, version } of mismatched) {
    console.error(`  ${file} declares ${version ?? 'no version at all'}`);
  }
  console.error('Run "node util/publish.js <version>" to release, or fix the sources by hand.');
  process.exit(1);
}

console.log(`check-versions: all ${declared.length} sources declare ${expected}.`);
