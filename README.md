# &lt;vcf-breadcrumb&gt;

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![npm version](https://badgen.net/npm/v/@vaadin-component-factory/vcf-breadcrumb)](https://www.npmjs.com/package/@vaadin-component-factory/vcf-breadcrumb)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadin-component-factoryvcf-breadcrumb)

This is the npm version [vcf-breadcrumb](https://github.com/vaadin-component-factory/vcf-breadcrumb) developed using Polymer 3.

[Live demo ↗](https://vcf-breadcrumb.netlify.com)
|
[API documentation ↗](https://vcf-breadcrumb.netlify.com/api/#/elements/Vaadin.VcfBreadcrumb)

<img width="355" alt="screenshot (1)" src="https://user-images.githubusercontent.com/3392815/66923796-274e8880-f032-11e9-904d-073f894c199e.png">

## Installation

Install `vcf-breadcrumb`:

```sh
npm i @vaadin-component-factory/vcf-breadcrumb --save
```

## Usage

Once installed, import it in your application:

```js
import '@vaadin-component-factory/vcf-breadcrumb/vcf-breadcrumb.js';
```

Add `<vcf-breadcrumbs>` element to the page. Inside added element add few `<vcf-breadcrumb>` child elements, with `href` attribute. In case you want some `<vcf-breadcrumb>` elements to not be shown in mobile view, add attribute `shift` to those elements. When user click on `<vcf-breadcrumb>` element he/she will be navigated to ULR from `href` attribute of the element.

```html
<vcf-breadcrumbs>
  <vcf-breadcrumb shift href="#">Home</vcf-breadcrumb>
  <vcf-breadcrumb href="#">Directory</vcf-breadcrumb>
  <vcf-breadcrumb href="#">Breadcrumb</vcf-breadcrumb>
</vcf-breadcrumbs>
```

## Running demo

1. Fork the `vcf-breadcrumb` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-breadcrumb` directory, run `npm install` to install dependencies.

1. Run `npm start` to open the demo.

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## Vaadin Prime

This component is available in the Vaadin Prime subscription. It is still open source, but you need to have a valid CVAL license in order to use it. Read more at: https://vaadin.com/pricing

## License

Commercial Vaadin Add-on License version 3 (CVALv3). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
