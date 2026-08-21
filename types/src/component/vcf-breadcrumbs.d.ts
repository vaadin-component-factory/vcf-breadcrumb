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
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A Web Component for displaying breadcrumbs.
 *
 * - Manages multiple `<vcf-breadcrumb>` elements, ensuring proper layout and responsiveness.
 * - Automatically hides breadcrumbs when space is limited, replacing them with an ellipsis element.
 * - Uses `ResizeMixin` to dynamically update visibility based on available space.
 * - The first breadcrumb always remains visible and does not shrink.
 * - Implements accessibility attributes to improve usability.
 * - Uses a `vaadin-popover` to display hidden breadcrumbs when the ellipsis is clicked.
 *
 * Since version 2.2.0, mobile mode is added, which can be triggered in two ways:
 * - Based on a fixed breakpoint (same as other Vaadin components):
 *   `(max-width: 450px), (max-height: 450px)`
 * - Programmatically, using the flag `forceMobileMode`, which allows to enable mobile layout manually.
 *
 * ```html
 * <vcf-breadcrumbs>
 *   <vcf-breadcrumb href="/home">Home</vcf-breadcrumb>
 *   <vcf-breadcrumb href="/category" collapse>Category</vcf-breadcrumb>
 *   <vcf-breadcrumb href="/product" collapse>Product</vcf-breadcrumb>
 *   <vcf-breadcrumb>Details</vcf-breadcrumb>
 * </vcf-breadcrumbs>
 * ```
 *
 * @mixes ElementMixin
 * @mixes ResizeMixin
 */
declare class VcfBreadcrumbs extends ResizeMixin(ElementMixin(HTMLElement)) {
  /**
   * When true, the mobile layout is used regardless of the viewport size. Without
   * this flag the mobile layout is applied based on the same breakpoint as other
   * Vaadin components: `(max-width: 450px), (max-height: 450px)`.
   */
  forceMobileMode: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vcf-breadcrumbs': VcfBreadcrumbs;
  }
}

export { VcfBreadcrumbs };
