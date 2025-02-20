/*-
 * #%L
 * 
 * Copyright (C) 2018 - 2025 Vaadin Ltd
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
import { html, LitElement, css } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ThemableMixin } from "@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js";
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { typography } from "@vaadin/vaadin-lumo-styles";

/**
 * A Web Component for individual breadcrumb items in a breadcrumb navigation system.
 * 
 * - Built using LitElement with theming support via Vaadin's ThemableMixin.
 * - Represents a single navigation step, optionally linking to a specific URL via the `href` property.
 * - Can be marked as collapsible using the `collapse` attribute to allow responsive shrinking (When this attribute is added,
 * the breadcrumb label will show ellipsis if the available space is not enough to fit the whole label).  
 * - Supports an ellipsis mode (`part="ellipsis"`) to indicate hidden breadcrumbs when space is limited.
 * - Displays a separator unless it is the last breadcrumb in the sequence.
 * 
 * Example usage:
 * ```html
 * <vcf-breadcrumb href="/home">Home</vcf-breadcrumb>
 * <vcf-breadcrumb href="/products">Products</vcf-breadcrumb>
 * <vcf-breadcrumb>Current Page</vcf-breadcrumb>
 * ```
 * 
 * @memberof Vaadin
 * @name vcf-breadcrumb
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes PolylitMixin
 * @demo demo/index.html
 */
@customElement("vcf-breadcrumb")
class VcfBreadcrumb extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {

  @property({ type: String, reflect: true }) 
  href = '';

  @property({ type: Boolean, reflect: true }) 
  collapse = false;

  static get is() {
    return 'vcf-breadcrumb';
  }

  static get version() {
    return '2.0.0';
  }

  render() {
     return html`
      <span part="link">
        <slot id="pageLabel" role="listitem"></slot>
        <slot name="link-slot" part="link-slot"></slot>
      </span>
      <span part="separator"></span>
    `;
  }

  static get styles() {
    return [typography, css`
        :host(:last-of-type) [part='separator'] {
          display: none;
        }        

        :host {
          display: flex;
          align-items: center;
          min-width: 40px;
        }
    `];
  }

  _createAnchor() {
    const anchor = document.createElement("a");
    anchor.setAttribute("slot", "link-slot");
    anchor.setAttribute("id", "link");
    if(this.href) {
      anchor.setAttribute("href", this.href);
    }
    anchor.classList.add("breadcrumb-anchor");
    // Get anchor label from #pageLabel slot
    let labelSlot = this.shadowRoot?.querySelector("#pageLabel") as HTMLSlotElement;
    const labelText = labelSlot.assignedNodes({ flatten: true })[0];
    anchor.appendChild(labelText);

    this.appendChild(anchor);
  }

  firstUpdated() {
    // Add aria aria-current 'page' to current page
    if (!this.href && !this._isEllipsisElement()) {
      this.setAttribute('aria-current', 'page');
    }

    // Create the anchor element to add to the link slot
    this._createAnchor();
  }

  _isEllipsisElement() {
    return this.getAttribute("part") === "ellipsis";
  }
 
}

export { VcfBreadcrumb };

