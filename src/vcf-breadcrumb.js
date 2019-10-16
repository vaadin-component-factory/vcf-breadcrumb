/**
 * @license
 * Copyright (C) 2015 Vaadin Ltd.
 * This program is available under Commercial Vaadin Add-On License 3.0 (CVALv3).
 * See the file LICENSE.md distributed with this software for more information about licensing.
 * See [the website]{@link https://vaadin.com/license/cval-3} for the complete license.
 */

import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';

/**
 * `<vcf-breadcrumb>` Web Component providing an easy way to display breadcrumb.
 *
 * ```html
 * <vcf-breadcrumb></vcf-breadcrumb>
 * ```
 *
 * @memberof Vaadin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @demo demo/index.html
 */
class VcfBreadcrumb extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="lumo-typography">
        :host(:last-of-type) [part='separator'],
        :host([last-step]) [part='separator'] {
          display: none;
        }

        [part='separator']::after {
          content: '>';
          speak: none;
        }

        .hidden {
          display: none;
        }
      </style>

      <span part="link">
        <slot id="pageLabel"></slot>
        <span id="label" tabindex="0" class$="[[_getLabelClassName()]]"> </span>
        <a id="link" href="[[href]]" class$="[[_getLinkClassName()]]"> </a>
      </span>
      <span part="separator"></span>
    `;
  }

  static get is() {
    return 'vcf-breadcrumb';
  }

  static get version() {
    return '1.2.0';
  }

  ready() {
    super.ready();

    const link = this.$.link;
    const label = this.$.label;
    const slot = this.$.pageLabel;

    if (!this.href) {
      label.appendChild(slot);
      this.setAttribute('aria-current', 'page');
    } else {
      link.appendChild(slot);
    }
  }

  static get properties() {
    return {
      href: {
        type: String,
        value: ''
      },

      shift: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
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

customElements.define(VcfBreadcrumb.is, VcfBreadcrumb);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfBreadcrumb = VcfBreadcrumb;

if (window.Vaadin.runIfDevelopmentMode) {
  window.Vaadin.runIfDevelopmentMode('vaadin-license-checker', VcfBreadcrumb);
}
