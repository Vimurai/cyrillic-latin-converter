// src/dictionaries.js

// 1) All single‐letter mappings Latin→Cyrillic
export const LAT_TO_CYR = {
  a: "а", b: "б", c: "ц", d: "д", e: "е",
  f: "ф", g: "г", h: "х", i: "и", j: "ј",
  k: "к", l: "л", m: "м", n: "н", o: "о",
  p: "п", q: "", r: "р", s: "с", t: "т",
  u: "у", v: "в", w: "", x: "", y: "", z: "з",
  A: "А", B: "Б", C: "Ц", D: "Д", E: "Е",
  F: "Ф", G: "Г", H: "Х", I: "И", J: "Ј",
  K: "К", L: "Л", M: "М", N: "Н", O: "О",
  P: "П", Q: "", R: "Р", S: "С", T: "Т",
  U: "У", V: "В", W: "", X: "", Y: "", Z: "З",
  "č": "ч", "ć": "ћ", "đ": "ђ", "ž": "ж", "š": "ш",
  "Č": "Ч", "Ć": "Ћ", "Đ": "Ђ", "Ž": "Ж", "Š": "Ш"
};

// 2) Single‐letter mapping Cyrillic→Latin
export const CYR_TO_LAT = {
  "а": "a", "б": "b", "ц": "c", "д": "d", "е": "e",
  "ф": "f", "г": "g", "х": "h", "и": "i", "ј": "j",
  "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
  "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
  "в": "v", "з": "z",

  "А": "A", "Б": "B", "Ц": "C", "Д": "D", "Е": "E",
  "Ф": "F", "Г": "G", "Х": "H", "И": "I", "Ј": "J",
  "К": "K", "Л": "L", "М": "M", "Н": "N", "О": "O",
  "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U",
  "В": "V", "З": "Z",

  "ч": "č", "ћ": "ć", "ж": "ž", "ш": "š",
  "љ": "lj", "њ": "nj", "ђ": "đ", "џ": "dz",

  "Ч": "Č", "Ћ": "Ć", "Ж": "Ž", "Ш": "Š",
  "Љ": "Lj", "Њ": "Nj", "Ђ": "Đ", "Џ": "Dž"
};


// 3) Chained double‐letter Latin→Cyrillic (e.g. “nj”→“њ”)
export const LAT_TO_CYR_CHAINED = {
  l: { j: "љ" },
  n: { j: "њ" },
  d: { j: "ђ", z: "џ", ž: "џ" },
  L: { j: "Љ", J: "Љ" },
  N: { j: "Њ", J: "Њ" },
  D: { j: "Ђ", J: "Ђ", z: "Џ", Z: "Џ", ž: "Џ", Ž: "Џ" }
};

// 4) Words to ignore (exact matches) Latin→Cyrillic
export const IGNORE_LIST_LAT_TO_CYR = {
  plugin: "",
  lat: "",
  close: "",
  jquery: "jQuery",
  microsoft: "Microsoft",
  firefox: "Firefox",
  opera: "Opera",
  safari: "Safari",
  chrome: "Chrome",
  ie: "IE"
  // … you can add more
};

// 5) Words to ignore (exact matches) Cyrillic→Latin
export const IGNORE_LIST_CYR_TO_LAT = {
  "ћир": ""
  // … add more if needed
};

// 6) Base substrings that forbid chaining (e.g. any word containing “nadžrel” should NOT chain “dž”)
export const IGNORE_SUBSTRINGS_DOUBLE_CHAIN = [
  "anjon", "adjektiv", "adjunkt", "budzašto", "vanjezič",
  "injekt", "injekc", "konjug", "konjunk", "lindzi", "nadždrel",
  "nadzemn", "nadžet", "nadžive", "nadžup", "podzakon", "predživot",
  // … (copy the entire array from original)
];

// 7) Specific full‐word exceptions for double‐letter chaining
export const IGNORE_FULL_WORDS_DOUBLE_CHAIN = [
  "njemačku"
];
