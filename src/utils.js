// src/utils.js

import {
  IGNORE_LIST_LAT_TO_CYR,
  IGNORE_LIST_CYR_TO_LAT,
  IGNORE_SUBSTRINGS_DOUBLE_CHAIN,
  IGNORE_FULL_WORDS_DOUBLE_CHAIN,
  LAT_TO_CYR_CHAINED
} from "./dictionaries.js";

/**
 * isIgnoredWord(word, direction)
 *  - direction = "L2C" or "C2L"
 */
export function isIgnoredWord(word, direction) {
  const lower = word.toString().toLowerCase();
  if (direction === "L2C") {
    return Object.prototype.hasOwnProperty.call(IGNORE_LIST_LAT_TO_CYR, lower);
  } else {
    return Object.prototype.hasOwnProperty.call(IGNORE_LIST_CYR_TO_LAT, lower);
  }
}

/**
 * getIgnoreReplacement(word, direction)
 *  - returns the replacement if ignore, or null otherwise
 */
export function getIgnoreReplacement(word, direction) {
  const lower = word.toString().toLowerCase();
  if (direction === "L2C") {
    return IGNORE_LIST_LAT_TO_CYR[lower] === "" ? word : IGNORE_LIST_LAT_TO_CYR[lower];
  } else {
    return IGNORE_LIST_CYR_TO_LAT[lower] === "" ? word : IGNORE_LIST_CYR_TO_LAT[lower];
  }
}

/**
 * shouldChainDoubleLetter(word)
 *  - returns false if word is exactly in IGNORE_FULL_WORDS_DOUBLE_CHAIN
 *    OR contains any of the IGNORE_SUBSTRINGS_DOUBLE_CHAIN
 */
export function shouldChainDoubleLetter(word) {
  const lower = word.toString().toLowerCase();
  if (IGNORE_FULL_WORDS_DOUBLE_CHAIN.includes(lower)) return false;
  for (const substr of IGNORE_SUBSTRINGS_DOUBLE_CHAIN) {
    if (lower.includes(substr)) {
      return false;
    }
  }
  return true;
}

/**
 * splitTextPreserveDelimiters(str, includeUnicode = true)
 *  - Splits on any non‐alphanumeric or (if includeUnicode) on any non‐cyrillic‐unicode.
 *  - Returns an array of tokens, including separators.
 */
export function splitTextPreserveDelimiters(str, includeUnicode = true) {
  let pattern;
  if (includeUnicode) {
    // Covers basic Latin+digits + Cyrillic block + čĆžŠđĐ
    pattern = "[^0-9a-zA-Z\u0400-\u04FF_\u010D\u010C\u0107\u0106\u017E\u017D\u0161\u0160\u0111\u0110]+";
  } else {
    pattern = "[^0-9a-zA-Z_\u010D\u010C\u0107\u0106\u017E\u017D\u0161\u0160\u0111\u0110]+";
  }
  const regex = new RegExp("(" + pattern + ")", "i");
  // Test if `split` natively retains delimiters:
  if ("test".split(/([^a-z])/).length === 3) {
    return str.split(regex);
  }
  // Otherwise use a fallback
  const parts = [];
  let lastIndex = 0;
  let match;
  const globalRegex = new RegExp(regex, "gi");
  while ((match = globalRegex.exec(str)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(str.slice(lastIndex, idx));
    }
    parts.push(match[0]);
    lastIndex = globalRegex.lastIndex;
  }
  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }
  return parts.length ? parts : [str];
}
