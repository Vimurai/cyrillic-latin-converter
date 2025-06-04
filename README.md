
# Cyrillic ↔ Latin Converter

A lightweight, framework-agnostic JavaScript library for converting text between Cyrillic and Latin scripts. Convert raw strings or entire DOM subtrees (in-browser) with minimal setup. Perfect for multilingual websites, blogs, or any frontend/backend project that needs fast, reliable transliteration.

![npm](https://img.shields.io/npm/v/@your-org/cyrillic-latin-converter.svg) ![License](https://img.shields.io/npm/l/@your-org/cyrillic-latin-converter.svg)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Browser (ESM via CDN or bundler)](#browser-esm-via-cdn-or-bundler)
  - [Node.js / CommonJS](#nodejs--commonjs)
  - [TypeScript](#typescript)
- [API Reference](#api-reference)
  - [`CyrillicLatinConverter`](#cyrilliclatinconverter)
    - `new CyrillicLatinConverter(options?)`
    - `.toCyrillic(text)`
    - `.toLatin(text)`
    - `.convertInDOM(root, direction)`
  - [Configuration Options](#configuration-options)
- [Examples](#examples)
  - [Convert a Raw String](#convert-a-raw-string)
  - [Convert DOM Elements (Vanilla JavaScript)](#convert-dom-elements-vanilla-javascript)
  - [Using in React](#using-in-react)
  - [Using in Vue](#using-in-vue)
  - [Using in Angular](#using-in-angular)
- [Advanced Usage](#advanced-usage)
  - [Ignore Specific Elements with CSS Classes](#ignore-specific-elements-with-css-classes)
  - [Benchmark Mode](#benchmark-mode)
- [Development & Contributing](#development--contributing)
- [License](#license)

---

## Features

- **Dual API**  
  - **String Mode:** Convert any JavaScript string (`toCyrillic()`, `toLatin()`).  
  - **DOM Mode:** Walk the DOM and transliterate all text nodes or placeholders (`convertInDOM()`).

- **Full Cyrillic ↔ Latin Mappings**  
  Handles single-letter mappings (e.g. `а ↔ a`), double-letter chains (e.g. `nj ↔ њ`), and preserves punctuation/spaces.

- **Ignore Lists & Double-Chain Controls**  
  Built-in default ignore words (e.g. “jQuery,” “Firefox”), plus custom `ignoreClasses` to skip entire elements.

- **Benchmarking**  
  Measure conversion speed with a simple toggle. Great for profiling large pages.

- **Zero Dependencies**  
  No jQuery, no frameworks. Works in Node.js, browser, and any bundler (Webpack, Rollup, Parcel, Vite, etc.).

- **Small Size**  
  ~3 KB minified, no extra baggage.

---

## Installation

Install via npm:

```bash
npm install @your-org/cyrillic-latin-converter
```

Or via Yarn:

```bash
yarn add @your-org/cyrillic-latin-converter
```

---

## Quick Start

### Browser (ESM via CDN or Bundler)

Use the ES module build from a CDN or your bundler:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cyrillic ↔ Latin Demo</title>
  <script type="module">
    import { CyrillicLatinConverter } from 'https://cdn.jsdelivr.net/npm/@your-org/cyrillic-latin-converter/dist/index.esm.js';

    document.addEventListener('DOMContentLoaded', () => {
      // Initialize converter with default options
      const converter = new CyrillicLatinConverter();

      // Convert a plain string
      console.log(converter.toCyrillic('Dobro jutro!')); // → 'Добро јутро!'

      // Convert all text inside <div id="content">
      converter.convertInDOM('#content', 'L2C');
    });
  </script>
</head>
<body>
  <div id="content">
    <p>This is a test: Srbija, Beograd, Dobar dan!</p>
    <p>Ово је тест: Србија, Београд, Добар дан!</p>
  </div>
</body>
</html>
```

### Node.js / CommonJS

```js
// In Node.js environment (CommonJS)
const { CyrillicLatinConverter } = require('@your-org/cyrillic-latin-converter');

(async () => {
  const converter = new CyrillicLatinConverter();
  console.log(converter.toCyrillic('Dobro jutro!')); // → 'Добро јутро!'
  console.log(converter.toLatin('Добро јутро!'));    // → 'Dobro jutro!'
})();
```

### TypeScript

```ts
import { CyrillicLatinConverter } from '@your-org/cyrillic-latin-converter';

const converter = new CyrillicLatinConverter({
  ignoreClasses: ['no-trans'], 
  benchmark: true,
  benchmarkCallback: (ms) => console.log(`Converted in ${ms}ms`)
});

const latin = converter.toLatin('Проверимо Dž.');
const cyrillic = converter.toCyrillic('Džemper');
```

---

## API Reference

### `CyrillicLatinConverter`

#### Constructor

```ts
new CyrillicLatinConverter(options?: ConverterOptions);
```

- **`options`** _(optional)_: An object of type `ConverterOptions` (below). All fields are optional.

#### Methods

- #### `.toCyrillic(text: string): string`

  Convert a plain JavaScript string from Latin → Cyrillic.

  **Example**

  ```js
  const converter = new CyrillicLatinConverter();
  converter.toCyrillic('Dobar dan!');  // → 'Добар дан!'
  converter.toCyrillic('njiva');       // → 'њива'
  ```

- #### `.toLatin(text: string): string`

  Convert a plain JavaScript string from Cyrillic → Latin.

  **Example**

  ```js
  const converter = new CyrillicLatinConverter();
  converter.toLatin('Ђурђевдан');  // → 'Đurđevdan'
  converter.toLatin('Љубав');      // → 'Ljubav'
  ```

- #### `.convertInDOM(root: string | HTMLElement, direction: 'L2C' | 'C2L'): void`

  Recursively traverse the DOM subtree rooted at `root` (a CSS selector or an `HTMLElement`), converting all text nodes and `placeholder` attributes. Skips any element (and its children) that has a class in `ignoreClasses`.

  - **`root`**:  
    - A CSS selector string (e.g. `'#content'`, `'.translate-area'`)  
    - Or a DOM element (`document.querySelector('.some-element')`).

  - **`direction`**:  
    - `'L2C'` to convert Latin → Cyrillic  
    - `'C2L'` to convert Cyrillic → Latin

  **Example**

  ```js
  // Convert everything inside <div id="app"> from Latin to Cyrillic
  converter.convertInDOM('#app', 'L2C');

  // Convert a single element reference from Cyrillic to Latin
  const el = document.getElementById('text-block');
  converter.convertInDOM(el, 'C2L');
  ```

---

### Configuration Options

When you instantiate the converter, you may pass an `options` object to customize behavior:

```ts
interface ConverterOptions {
  /**
   * Array of CSS classes to skip entirely when doing DOM conversion.
   * Default: ['language']
   * Example: ['no-trans', 'skip-translate']
   */
  ignoreClasses?: string[];

  /**
   * Whether to use Unicode‐aware splitting when tokenizing words.
   * If true (default), tokens preserve Cyrillic letters in word boundaries.
   */
  ignoreListIncludeUnicode?: boolean;

  /**
   * Enable benchmark mode (measures conversion time).
   * Default: false
   */
  benchmark?: boolean;

  /**
   * Callback to receive benchmark timing (milliseconds).
   * Default: (ms) => console.log(`Execution time: ${ms}ms`)
   */
  benchmarkCallback?: (timeInMs: number) => void;
}
```

- **`ignoreClasses`**  
  By default, any element with class `"language"` (or an ancestor with that class) will be skipped during `convertInDOM`. You can override with your own list, e.g. `['no-trans']`.

- **`ignoreListIncludeUnicode`**  
  If `true` (default), the internals use a Unicode‐aware regular expression so that tokens include Cyrillic letters. If `false`, splitting excludes extended Cyrillic characters (rarely needed).

- **`benchmark`**  
  Set to `true` to activate benchmarking. The library tracks how long the conversion took and then calls your `benchmarkCallback` with the elapsed time in milliseconds.

- **`benchmarkCallback`**  
  A callback function that receives the elapsed time. The default simply logs to `console.log`, but you can override it to display a UI spinner, send telemetry, etc.  

<!--START_SECTION:buy-me-a-coffee-->
<!--END_SECTION:buy-me-a-coffe-->
