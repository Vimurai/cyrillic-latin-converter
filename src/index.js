// src/index.js

import {
  LAT_TO_CYR,
  CYR_TO_LAT,
  LAT_TO_CYR_CHAINED
} from "./dictionaries.js";

import {
  splitTextPreserveDelimiters,
  isIgnoredWord,
  getIgnoreReplacement,
  shouldChainDoubleLetter
} from "./utils.js";

// Default configuration
const DEFAULT_CONFIG = {
  ignoreClasses: ["language"],
  ignoreListIncludeUnicode: true,
  benchmark: false,
  benchmarkCallback: (t) => console.log(`Execution time: ${t}ms`)
};

export class CyrillicLatinConverter {
  /**
   * @param {Object} options
   *   - ignoreClasses: array of CSS classes to skip during DOM traversal
   *   - ignoreListIncludeUnicode: boolean (split‐pattern choice)
   *   - benchmark: boolean
   *   - benchmarkCallback: function(milliseconds)
   */
  constructor(options = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options };
  }

  /**
   * Convert a single string from Latin→Cyrillic.
   * Returns a new string.
   */
  toCyrillic(text) {
    return this._replaceL2C(text);
  }

  /**
   * Convert a single string from Cyrillic→Latin.
   * Returns a new string.
   */
  toLatin(text) {
    return this._replaceC2L(text);
  }

  /**
   * Walks the DOM (selector can be a CSS selector string or an Element)
   * and replaces text nodes & placeholders in inputs.
   *
   * direction = "L2C" or "C2L"
   */
  convertInDOM(root, direction) {
    if (this.config.benchmark) {
      this._benchStart = performance.now();
    }

    const rootNode =
      typeof root === "string" ? document.querySelector(root) : root;
    if (!rootNode) {
      throw new Error(`Invalid root selector/element: ${root}`);
    }
    this._traverseAndConvert(rootNode, direction);

    if (this.config.benchmark) {
      const elapsed = Math.round(performance.now() - this._benchStart);
      this.config.benchmarkCallback(elapsed);
    }
  }

  /**
   * Private: Recursively traverse child nodes.
   */
  _traverseAndConvert(node, direction) {
    // Skip certain tags entirely:
    const skipTags = new Set(["iframe", "script", "style", "code", "pre"]);
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      skipTags.has(node.tagName.toLowerCase())
    ) {
      return;
    }

    // If element has an “ignore” CSS class, skip subtree:
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      this._hasIgnoredClass(node)
    ) {
      return;
    }

    // If this is a text node, replace its contents:
    if (node.nodeType === Node.TEXT_NODE) {
      const original = node.textContent;
      const replaced =
        direction === "L2C" ? this._replaceL2C(original) : this._replaceC2L(original);
      if (replaced !== original) {
        node.textContent = replaced;
      }
    }

    // If it’s an element with a placeholder (e.g. <input>), replace that too:
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.hasAttribute("placeholder")
    ) {
      const ph = node.getAttribute("placeholder");
      const newPh =
        direction === "L2C" ? this._replaceL2C(ph) : this._replaceC2L(ph);
      if (newPh !== ph) {
        node.setAttribute("placeholder", newPh);
      }
    }

    // Recurse into children:
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach((child) =>
        this._traverseAndConvert(child, direction)
      );
    }
  }

  /** Check if any of the ignore‐classes is present on this element or an ancestor. */
  _hasIgnoredClass(el) {
    const { ignoreClasses } = this.config;
    let curr = el;
    while (curr && curr !== document) {
      if (curr.classList) {
        for (const cls of ignoreClasses) {
          if (curr.classList.contains(cls)) {
            return true;
          }
        }
      }
      curr = curr.parentNode;
    }
    return false;
  }

  /**
   * Internal: replace Latin→Cyrillic for a single string.
   */
  _replaceL2C(str) {
    const tokens = splitTextPreserveDelimiters(
      str,
      this.config.ignoreListIncludeUnicode
    );

    const out = tokens.map((tok) => {
      // 1) If this word is in the “ignore‐list”, return its forced replacement:
      if (isIgnoredWord(tok, "L2C")) {
        return getIgnoreReplacement(tok, "L2C");
      }

      // 2) Now, we attempt to transliterate character‐by‐character
      //    while respecting “chained” double‐letters (e.g. “nj” → “њ”).
      if (!tok || tok.trim() === "") return tok;

      let chars = Array.from(tok); // splits into array of characters
      let result = [];

      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        let replaced = null;
        let skipNext = false;

        // Check if we can chain double‐letter (only if shouldChainDoubleLetter returns true)
        if (shouldChainDoubleLetter(tok) && LAT_TO_CYR_CHAINED[c]) {
          const next = chars[i + 1];
          if (next && LAT_TO_CYR_CHAINED[c][next]) {
            replaced = LAT_TO_CYR_CHAINED[c][next];
            skipNext = true;
          }
        }

        if (skipNext) {
          result.push(replaced);
          i++; // skip the next character
        } else {
          result.push(LAT_TO_CYR[c] || c);
        }
      }

      return result.join("");
    });

    return out.join("");
  }

  /**
   * Internal: replace Cyrillic→Latin for a single string.
   */
  _replaceC2L(str) {
    const tokens = splitTextPreserveDelimiters(
      str,
      this.config.ignoreListIncludeUnicode
    );

    const out = tokens.map((tok) => {
      if (isIgnoredWord(tok, "C2L")) {
        return getIgnoreReplacement(tok, "C2L");
      }
      if (!tok || tok.trim() === "") return tok;

      // Simplest: one-to-one character mapping (no chaining needed, since “lj”, “nj”, etc. already exist as single codes in CYR_TO_LAT)
      return Array.from(tok)
        .map((c) => CYR_TO_LAT[c] || c)
        .join("");
    });

    return out.join("");
  }
}
