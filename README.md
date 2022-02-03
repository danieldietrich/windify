[![npm version](https://img.shields.io/npm/v/windify?logo=npm&style=flat-square)](https://www.npmjs.com/package/windify/)[![brotlied](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/windify.svg?compression=brotli&label=brotlied&max=1500&softmax=1000&style=flat-square)](https://www.jsdelivr.com/package/npm/windify)[![hits/month](https://data.jsdelivr.com/v1/package/npm/windify/badge)](https://www.jsdelivr.com/package/npm/windify)[![license](https://img.shields.io/github/license/danieldietrich/copy?style=flat-square)](https://opensource.org/licenses/MIT/)[![sponsor](https://img.shields.io/badge/GitHub-💖Sponsors-b5b7b9?logo=github&style=flat-square)](https://github.com/sponsors/danieldietrich)[![follow](https://img.shields.io/twitter/follow/danieldietrich?logo=twitter&style=flat-square)](https://twitter.com/danieldietrich/)

<p>
  <a href="https://windify.tw/#gh-light-mode-only" target="_blank">
    <img src="./public/windify-light.svg" alt="Tailwind CSS" width="350" height="70">
  </a>
  <a href="https://windify.tw/#gh-dark-mode-only" target="_blank">
    <img src="./public/windify-dark.svg" alt="Tailwind CSS" width="350" height="70">
  </a>
</p>

Toolless [Tailwind CSS](https://tailwindcss.com) and [Windi CSS](https://windicss.org), directly in the browser.

## Features

* **Use Tailwind CSS and Windi CSS directly in the browser, no build tools needed!**
* No need to learn anything about NodeJS, just edit and run index.html
* Processes all inline styles and transforms directives like `@apply`
* Prevents FOUC (flash of unstyled content)
* Tracks document changes by running in watch mode by default
* Parses Tailwind CSS directives and replaces them with the corresponding CSS
* Scans the document for Tailwind CSS classes and adds them to the document

Note: Windify internally uses [Windi CSS](https://windicss.org) to generate the CSS. In the following we use _Tailwind CSS_ as a synonym for all tools that support [Tailwind CSS](https://tailwindcss.com) syntax.

## Usage

1. Add Windify `<script>` to your HTML

```html
<!-- umd package -->
<script src="https://cdn.jsdelivr.net/npm/windify"></script>
<script>
  window.addEventListener('load', () => windify());
</script>

<!-- alternative: modern javascript -->
<script type="module">
  import windify from "https://esm.run/windify";
  window.addEventListener('load', () => windify());
</script>
```

2. Start to use Tailwind CSS / Windi CSS syntax in your HTML

```html
<h1 class="bg-gray-100 hello">Hello!</h1>
```

Windify will process all `<style lang="windify">` inline styles and transform directives like `@apply`

```html
<style lang="windify">
  .hello {
    @apply
      text-purple-600 font-semibold;
    }
  }
</style>    
```

3. Prevent FOUC (flash of unstyled content)

FOUC is prevented by hiding the HTML content until Windify is ready.

We do this by setting the `hidden` attribute on `html`, `body` or the _root_ element (see [options](#options) below).

```html
<body hidden>
    <!-- content goes here -->
</body>
```

## Options

Windify can be configured with the following options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| minify | boolean | true | minify the output |
| parseCss | boolean | true | parse CSS styles `<style lang='windify'>` and process directives like `@apply` |
| preflight | boolean | true | enables CSS reset for descendants of the root element |
| root | HTMLElement | document.body | the DOM element that will be scanned for windi classes |
| watch | boolean | true | enable/disable watch mode, only applies to the root element and its children |
| windiCssVersion | string | 'latest' | Windi CSS version that is used internally to parse and generate CSS |
| config | object | | optional [windicss config](https://windicss.org/guide/configuration.html) |

All configuration properties are optional, choose the defaults you like:

```js
windify({
  minify: false,
  parseCss: false,
  preflight: false,
  root: document.querySelector('#root'),
  watch: false,
  windiCssVersion: '3.4.3',
  config: {
    ...
  }
});
```
