import '@vaadin/vaadin-lumo-styles/spacing';
import '@vaadin/vaadin-lumo-styles/color';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles';

registerStyles(
  'vcf-breadcrumbs',
  css`
    [part='links-list'] {
      display: flex;
      justify-content: start;
      align-content: center;
      align-items: center;
    }
  `
);
