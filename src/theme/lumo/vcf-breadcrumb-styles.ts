import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';

import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vcf-breadcrumb',
  css`
  
    :host {
      --vcf-breadcrumb-separator-font-family: 'lumo-icons';
      --vcf-breadcrumb-separator-symbol: var(--lumo-icons-angle-right);
      --vcf-breadcrumb-separator-color: var(--lumo-contrast-40pct);
      --vcf-breadcrumb-separator-size: var(--lumo-font-size-s);
      --vcf-breadcrumb-separator-margin: 0;
      --vcf-breadcrumb-separator-padding: 0 var(--lumo-space-xs);
      --vcf-breadcrumb-mobile-back-symbol: var(--lumo-icons-angle-left);
    }

    :host {
      font-family: var(--lumo-font-family);
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
   
    [part='link'] {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    /* Focus ring */
    :host(:focus-within) [part="link"] {
      outline: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct)) auto 1px;
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
  `
);
