import '@vaadin/vaadin-lumo-styles/typography';
import '@vaadin/vaadin-lumo-styles/spacing';
import '@vaadin/vaadin-lumo-styles/icons';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles';

registerStyles(
  'vcf-breadcrumb',
  css`
    :host {
      font-family: var(--lumo-font-family);
    }

    [part='separator'] {
      margin: var(--lumo-space-wide-xs);
    }
  `
);
