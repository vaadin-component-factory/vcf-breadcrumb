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
import { expect, fixture, html } from '@open-wc/testing';
import '../src/vcf-breadcrumbs.js';
import type { VcfBreadcrumb } from '../src/component/vcf-breadcrumb.js';

describe('vcf-breadcrumb', () => {
  it('is registered', () => {
    expect(customElements.get('vcf-breadcrumb')).to.exist;
  });

  it('reflects href and collapse between attribute and property', async () => {
    const item = await fixture<VcfBreadcrumb>(html`
      <vcf-breadcrumb href="/home" collapse>Home</vcf-breadcrumb>
    `);

    expect(item.href).to.equal('/home');
    expect(item.collapse).to.be.true;

    item.href = '/other';
    item.collapse = false;
    await item.updateComplete;

    expect(item.getAttribute('href')).to.equal('/other');
    expect(item.hasAttribute('collapse')).to.be.false;
  });

  it('does not expose the mobile internals as attributes', async () => {
    // PolylitMixin overwrites the `attribute: false` that `@state()` sets, so these
    // fields must not be declared as reactive properties at all.
    const declared = (customElements.get('vcf-breadcrumbs') as any)
      .elementProperties;
    const attributes = [...declared.entries()].map(
      ([, options]: [string, any]) => options.attribute
    );

    expect(attributes).to.not.include('_mobile');
    expect(attributes).to.not.include('_mobile-media-query');
  });

  it('derives the dash-cased attribute for forceMobileMode', () => {
    const declared = (customElements.get('vcf-breadcrumbs') as any)
      .elementProperties;
    expect(declared.get('forceMobileMode').attribute).to.equal(
      'force-mobile-mode'
    );
  });

  it('builds an anchor for a linked breadcrumb and marks the current page', async () => {
    const list = await fixture(html`
      <vcf-breadcrumbs>
        <vcf-breadcrumb href="/home">Home</vcf-breadcrumb>
        <vcf-breadcrumb>Current</vcf-breadcrumb>
      </vcf-breadcrumbs>
    `);

    const [linked, current] = Array.from(
      list.querySelectorAll('vcf-breadcrumb')
    );

    expect(linked.querySelector('a.breadcrumb-anchor')).to.exist;
    expect(linked.getAttribute('aria-hidden')).to.equal('true');
    expect(current.getAttribute('aria-current')).to.equal('page');
  });
});
