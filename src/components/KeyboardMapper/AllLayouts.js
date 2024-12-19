const SpaceKey = {
  key: " ",
  show:"/krazykarthik2",
  expand:true,
  reactOther:false
}
const ShiftKey = { key: "Shift", show: "Shift" ,expand:true,reactOther:true};
const CapsLockKey = { key: "CapsLock", show: "CapsLock" ,expand:true,reactOther:true};
const EnterKey = { key: "Enter", show: "Enter" ,expand:true,reactOther:true};
const ControlKey = { key: "Control", show: "Ctrl" ,expand:false,reactOther:true};
const AltKey = { key: "Alt", show: "Alt" ,expand:false,reactOther:true};
const TabKey = { key: "Tab", show: "Tab" ,expand:true,reactOther:true};
const BackspaceKey = { key: "Backspace", show: "Backspace" ,expand:false,reactOther:true};

const KeysAlphaNormal = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];
const KeysAlphaShift = KeysAlphaNormal.map((e) =>
  e.map((e) => e.toUpperCase())
);
const KeysAlpha = [KeysAlphaNormal, KeysAlphaShift];
const KeysAlphaNumericNormal = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];
const KeysAlphaNumericShift = [
  ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")",],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const KeysAlphaNumeric = [KeysAlphaNumericNormal, KeysAlphaNumericShift];
const KeysAllNormal = [
  [
    "`",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    BackspaceKey,
  ],
  [
    TabKey,
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "[",
    "]",
    "\\",
  ],
  [CapsLockKey, "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", EnterKey],
  [ShiftKey, "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", ShiftKey],
  [ControlKey, AltKey, SpaceKey, AltKey, ControlKey],
];
const KeysAllShift = [
  [
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    BackspaceKey,
  ],
  [
    TabKey,
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "{",
    "}",
    "|",
  ],
  [CapsLockKey, "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", '"', EnterKey],
  [ShiftKey, "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", ShiftKey],
  [ControlKey, AltKey, SpaceKey, AltKey, ControlKey],
];
const KeysAll = [KeysAllNormal, KeysAllShift];
const AllLayouts = {
  //alphabet, alphanumeric, all
  alphabet: KeysAlpha,
  alphanumeric: KeysAlphaNumeric,
  all: KeysAll,
};
export function ModifyKey(key,isCapsLock,isShift){
  if(typeof key == "string") return isCapsLock!=isShift ? key.toUpperCase() : key.toLowerCase();
  else return {...key, key:key.key.toUpperCase()};
}
export default AllLayouts;
