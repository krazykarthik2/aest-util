const processArgsWhatsapp = (args) => {
  args = args.join(" ");
  return "send?text=" + encodeURI(args);
};
const processArgsFigma = (args) => {
};
const processArgsCamera = (args) => {
};
const processArgsSpotify = (args) => {
};
const processArgsNotion = (args) => {
};
const processArgsNotepad = (args) => {
};
const processArgsExplorer = (args) => {
};
const processArgsVscode = (args) => {
};
const processArgsWindsurf = (args) => {
};
const processArgsTelegram = (args) => {
};
const processArgsDiscord = (args) => {
};
const processArgsLink = (args) => {
};
const processArgsSearch = (args) => {
  return "query=" + encodeURI(args.join(" "));
}
const actualAppLinks = {
  whatsapp: (...args) => args.length ? "whatsapp://" + processArgsWhatsapp(args) : "whatsapp://",
  figma: (...args) => args.length ? "figma://" + processArgsFigma(args) : "figma://",
  camera: (...args) => args.length ? "camera://" + processArgsCamera(args) : "camera://",
  spotify: (...args) => args.length ? "spotify://" + processArgsSpotify(args) : "spotify://",
  notion: (...args) => args.length ? "notion://" + processArgsNotion(args) : "notion://",
  notepad: (...args) => args.length ? "notepad://" + processArgsNotepad(args) : "notepad://",
  explorer: (...args) => args.length ? "explorer://" + processArgsExplorer(args) : "explorer://",
  vscode: (...args) => args.length ? "vscode://" + processArgsVscode(args) : "vscode://",
  windsurf: (...args) => args.length ? "windsurf://" + processArgsWindsurf(args) : "windsurf://",
  telegram: (...args) => args.length ? "tg://" + processArgsTelegram(args) : "tg://",
  discord: (...args) => args.length ? "discord://" + processArgsDiscord(args) : "discord://",
  phonelink: (...args) => args.length ? "ms-phone://" + processArgsLink(args) : "phonelinkms-phone://",
  bluetooth: (...args) => args.length ? "ms-settings-bluetooth://" + processArgsLink(args) : "ms-settings-bluetooth://",
  wifi: (...args) => args.length ? "ms-settings-wifi://" + processArgsLink(args) : "ms-settings-wifi://",
  airplane: (...args) => args.length ? "ms-settings-airplanemode://" + processArgsLink(args) : "ms-settings-airplanemode://",
  "action-center": (...args) => args.length ? "ms-actioncenter://" + processArgsLink(args) : "ms-actioncenter://",
  settings: (...args) => args.length ? "ms-settings://" + processArgsLink(args) : "ms-settings://",
  location: (...args) => args.length ? "ms-settings-location://" + processArgsLink(args) : "ms-settings-location://",
  defender: (...args) => args.length ? "windowsdefender://://" + processArgsLink(args) : "windowsdefender://",
  zoom: (...args) => args.length ? "zoommtg://" + processArgsLink(args) : "zoommtg://",
  slack: (...args) => args.length ? "slack://" + processArgsLink(args) : "slack://",
  teams: (...args) => args.length ? "msteams://" + processArgsLink(args) : "msteams://",
  search: (...args) => args.length ? "search-ms://" + processArgsSearch(args) : "search-ms://",
  notifications: (...args) => args.length ? "ms-settings-notifications://" + processArgsLink(args) : "ms-settings-notifications://",
  power: (...args) => args.length ? "ms-settings-power://" + processArgsLink(args) : "ms-settings-power://",
  hotspot: (...args) => args.length ? "ms-settings-mobilehotspot://" + processArgsLink(args) : "ms-settings-mobilehotspot://",
  accounts: (...args) => args.length ? "ms-settings-emailandaccounts://" + processArgsLink(args) : "ms-settings-emailandaccounts://",
  daemon:(...args) => args.length? "teja-util://"+processArgsLink(args):"teja-util://",
}

const aliasAppLinks = {
  code: actualAppLinks.vscode,
  files: actualAppLinks.explorer,
  link: actualAppLinks.phonelink,
  phone: actualAppLinks.phonelink,
};
export const appLinks = {
  ...actualAppLinks,
  ...aliasAppLinks,
};
