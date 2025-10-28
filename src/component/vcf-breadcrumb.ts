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
import { LitElement, css, html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemeDetectionMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-detection-mixin.js';

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
 * @mixes PolylitMixin
 * @mixes ThemeDetectionMixin
 * @demo demo/index.html
 */
@customElement("vcf-breadcrumb")
class VcfBreadcrumb extends ThemeDetectionMixin(ElementMixin(PolylitMixin(LitElement))) {

  @property({ type: String, reflect: true }) 
  href = '';

  @property({ type: Boolean, reflect: true }) 
  collapse = false;

  static get is() {
    return 'vcf-breadcrumb';
  }

  static get version() {
    return '2.2.0';
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
    return css`
        :host {
          display: flex;
          align-items: center;
          min-width: 40px;
          --vcf-breadcrumb-separator-font-family: 'inherit';
          --vcf-breadcrumb-separator-symbol: '/';
          --vcf-breadcrumb-separator-color: var(--vaadin-text-color-secondary, #666);
          --vcf-breadcrumb-separator-size: var(--vaadin-icon-size, 1lh);
          --vcf-breadcrumb-separator-margin: 0;
          --vcf-breadcrumb-separator-padding: 0 var(--vaadin-padding-xs, 6px);
          --vcf-breadcrumb-mobile-back-symbol: '←';
          --vcf-breadcrumb-link-focus-ring-color: var(--vaadin-focus-ring-color, Highlight);
        }

        :host [part='separator'] {
          margin: var(--vcf-breadcrumb-separator-margin);
          padding: var(--vcf-breadcrumb-separator-padding);
        }

        :host [part='separator']::after {
          font-family: var(--vcf-breadcrumb-separator-font-family);
          content: var(--vcf-breadcrumb-separator-symbol);
          color: var(--vcf-breadcrumb-separator-color);
          font-size: var(--vcf-breadcrumb-separator-size);
          speak: none;
        }

        :host(:last-of-type) [part='separator'] {
          display: none;
        }

        [part='link'] {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
  
        /* Focus ring */
        :host(:focus-within) [part="link"] {
          outline: var(--vcf-breadcrumb-link-focus-ring-color) auto 1px;
          outline-offset: 1px;
        }
  
        ::slotted(a:focus) {
          outline: none;
        }
  
        /* mobile back mode */
        :host(.mobile-back) {
          display: none;
        }
  
        :host(.mobile-back) [part='separator'] {
          display: none;
        }
  
        :host(.mobile-back.is-last-not-current),
        :host(.mobile-back.is-before-current) {
          display: inline-block;
        }

        ::slotted(a.breadcrumb-anchor.add-mobile-back-icon)::before {
          display: inline;
          font-family: var(--vcf-breadcrumb-separator-font-family);
          content: var(--vcf-breadcrumb-mobile-back-symbol);
          font-size: var(--vcf-breadcrumb-separator-size);
          margin: var(--vcf-breadcrumb-separator-margin);
          color: inherit;
        }

        /* Lumo theme */
        :host([data-application-theme='lumo']) {
          --vcf-breadcrumb-separator-font-family: 'lumo-icons';
          --vcf-breadcrumb-separator-symbol: var(--lumo-icons-angle-right);
          --vcf-breadcrumb-separator-color: var(--lumo-contrast-40pct);
          --vcf-breadcrumb-separator-size: var(--lumo-font-size-s);
          --vcf-breadcrumb-separator-margin: 0;
          --vcf-breadcrumb-separator-padding: 0 var(--lumo-space-xs);
          --vcf-breadcrumb-mobile-back-symbol: var(--lumo-icons-angle-left);
          --vcf-breadcrumb-link-focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));

          font-family: var(--lumo-font-family);
          font-size: var(--lumo-font-size-m);
        }

        :host([data-application-theme='lumo']) ::slotted(a[slot="link-slot"]:not(:any-link)) {
          /* Lumo global styles use disabled color for anchors without href, force base text color instead */
          color: var(--lumo-body-text-color) !important;
        }
    `;
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

    // Add popover for ellipsis mode
    if (this._isEllipsisElement()) {
      // Add tabindex="0" to make it keyboard-accessible
      anchor.setAttribute("tabindex", "0");
      anchor.style.cursor = "pointer";
      anchor.setAttribute("id", this.id);
      const popover = this.querySelector('vaadin-popover[for="' + this.id + '"]');
      if (popover) {
        anchor.addEventListener("keydown", (event) => {
          if (event.key === " " || event.key === "Space") {
            event.preventDefault();
             // @ts-ignore
            popover.opened = !popover.opened;
          }
        });     
        popover.addEventListener("opened-changed", (event) => {
          if (!((event as CustomEvent).detail.value)) {
            anchor.focus(); // Return focus to the ellipsis element
          }
        });      
        anchor.appendChild(popover);
      }      
      this.removeAttribute("id");
    }

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

