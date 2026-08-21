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
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemeDetectionMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-detection-mixin.js';

/**
 * A Web Component for individual breadcrumb items in a breadcrumb navigation system.
 *
 * - Represents a single navigation step, optionally linking to a specific URL via the `href` property.
 * - Can be marked as collapsible using the `collapse` attribute to allow responsive shrinking (When this
 * attribute is added, the breadcrumb label will show ellipsis if the available space is not enough to fit
 * the whole label).
 * - Supports an ellipsis mode (`part="ellipsis"`) to indicate hidden breadcrumbs when space is limited.
 * - Displays a separator unless it is the last breadcrumb in the sequence.
 *
 * ```html
 * <vcf-breadcrumb href="/home">Home</vcf-breadcrumb>
 * <vcf-breadcrumb href="/products">Products</vcf-breadcrumb>
 * <vcf-breadcrumb>Current Page</vcf-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|------------
 * `link`       | The element wrapping the breadcrumb label.
 * `link-slot`  | The slot used to replace the label with a custom link element.
 * `separator`  | The separator shown after every breadcrumb except the last one.
 * `ellipsis`   | Set on the generated breadcrumb that stands in for collapsed items.
 *
 * @mixes ElementMixin
 * @mixes SlotStylesMixin
 * @mixes ThemeDetectionMixin
 */
declare class VcfBreadcrumb extends SlotStylesMixin(
  ElementMixin(ThemeDetectionMixin(HTMLElement))
) {
  /**
   * The URL this breadcrumb links to. When empty, the breadcrumb renders as
   * plain text instead of a link.
   *
   * @attr {string} href
   */
  href: string;

  /**
   * When true, the breadcrumb is allowed to shrink and to be collapsed into the
   * ellipsis breadcrumb once the available space is not enough to fit all items.
   *
   * @attr {boolean} collapse
   */
  collapse: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vcf-breadcrumb': VcfBreadcrumb;
  }
}

export { VcfBreadcrumb };
