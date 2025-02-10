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
import { ifDefined } from 'lit/directives/if-defined.js';
import { ThemableMixin } from "@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js";
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { typography } from "@vaadin/vaadin-lumo-styles";

/**
 * LitElement based version of `<vcf-breadcrumb>` Web Component.
 * Provides an easy way to display breadcrumb.
 *
 * ```html
 * <vcf-breadcrumb></vcf-breadcrumb>
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
  shift = false;

  static get is() {
    return 'vcf-breadcrumb';
  }

  static get version() {
    return '2.0.0';
  }

  render() {
     return html`
      <span part="link">
        <slot id="pageLabel"></slot>
        <span id="label" tabindex="0" class=${ifDefined(this._getLabelClassName())}>
        </span>
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
        
        .hidden {
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
    anchor.setAttribute("href", this.href);
    anchor.setAttribute("id", "link");
    anchor.classList.add("breadcrumb-anchor");
    const linkClassName = this._getLinkClassName();
    if(linkClassName) {
      anchor.classList.add(linkClassName);
    }      
    this.appendChild(anchor);
  }

  firstUpdated() {
    // create the anchor element to add to the corresponding slot
    this._createAnchor();

    const link = this.querySelector("#link");
    const label = this.shadowRoot?.querySelector("#label");
    let slot = this.shadowRoot?.querySelector("#pageLabel") as HTMLSlotElement;
    const labelText = slot.assignedNodes({ flatten: true })[0];

    if (!this.href) {
      if(slot)  {
        label?.appendChild(slot);
        this.setAttribute("aria-current", "page");
      }
    } else if(slot)  {
      link?.appendChild(labelText);
    }
  }

  _getLabelClassName() {
    if (this.href !== '') {
      return 'hidden';
    }
  }

  _getLinkClassName() {
    if (this.href === '') {
      return 'hidden';
    }
  } 
}

export { VcfBreadcrumb };

