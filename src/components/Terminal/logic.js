import { setStyle } from "../../redux/commandSlice";

const links = {
  qrimg:"/qrimgutil",
  state: "/state",
  type: "/typing",
  login: "/login",
  signin: "/login",
  logout: "/logout",
  signout: "/logout",
  register: "/signup",
  signup: "/signup",
  "auth.totp.enable": "/enable-totp",
  clock: "/1",
  "clock.zen": "/2",
  terminal: "/terminal?style=10",
  cmd: "/terminal?style=10",
  bash: "/terminal?style=10",
  shell: "/terminal?style=10",
  sh: "/terminal?style=10",
};
const ignoreCommands = ["qr"];
const externalLinks = {
  colab: "https://colab.research.google.com/",
};
const actualExternalSearchLinks = {
  perplexity: (...args) =>
    args.length
      ? "https://perplexity.ai/search/new?q=" + encodeURI(args.join(" "))
      : "https://perplexity.ai",
  google: (...args) =>
    args.length
      ? "https://google.com/search?q=" + encodeURI(args.join(" "))
      : "https://google.com",
  youtube: (...args) =>
    args.length
      ? "https://youtube.com/results?search_query=" + encodeURI(args.join(" "))
      : "https://youtube.com",
  duckduckgo: (...args) =>
    args.length
      ? "https://duckduckgo.com/?q=" + encodeURI(args.join(" "))
      : "https://duckduckgo.com",
  github: (...args) =>
    args.length
      ? "https://github.com/search?q=" + encodeURI(args.join(" "))
      : "https://github.com",
  kaggle: (...args) =>
    args.length
      ? "https://kaggle.com/search?q=" + encodeURI(args.join(" "))
      : "https://kaggle.com",
  npm: (...args) =>
    args.length
      ? "https://npmjs.com/search?q=" + encodeURI(args.join(" "))
      : "https://npmjs.com",
  pypi: (...args) =>
    args.length
      ? "https://pypi.org/search?q=" + encodeURI(args.join(" "))
      : "https://pypi.org",
  drive: (...args) =>
    args.length
      ? "https://drive.google.com/drive/search?q=this" +
        encodeURI(args.join(" "))
      : "https://drive.google.com/drive/my-drive",
  stackoverflow: (...args) =>
    args.length
      ? "https://stackoverflow.com/search?q=" + encodeURI(args.join(" "))
      : "https://stackoverflow.com",
  leetcode: (...args) =>
    args.length
      ? "https://leetcode.com/problemset/?search=" + encodeURI(args.join(" "))
      : "https://leetcode.com/problemset/all",
  "leetcode.profile": (...args) =>
    args.length
      ? "https://leetcode.com/u/" + args[0]
      : "https://leetcode.com/profile",
  linkedin:(...args) =>
    args.length
      ? "https://linkedin.com/search?q=" + encodeURI(args.join(" "))
      : "https://linkedin.com",
  "linkedin.profile": (...args) => args.length
  ? "https://linkedin.com/in/" + args.join(' ')
  : "https://linkedin.com/profile"
};
const aliasExternalSearchLinks = {
  ai: actualExternalSearchLinks.perplexity,
  ddg: actualExternalSearchLinks.duckduckgo,
  duck: actualExternalSearchLinks.duckduckgo,
  yt: actualExternalSearchLinks.youtube,
  gh: actualExternalSearchLinks.github,
  dataset: actualExternalSearchLinks.kaggle,
  pip: actualExternalSearchLinks.pypi,
  leet: actualExternalSearchLinks.leetcode,
  "leet.profile": actualExternalSearchLinks["leetcode.profile"],
  "leet.u": actualExternalSearchLinks["leetcode.profile"],
};
const externalSearchLinks = {
  ...actualExternalSearchLinks,
  ...aliasExternalSearchLinks,
};
const openNewTab = (address) => {
  window.open(address, "_new", "noopener,noreferrer");
};
export function handleCommand(cmd, navigate, dispatch, clearHistory) {
  if (!cmd || !navigate || !dispatch || !clearHistory) return;
  cmd = cmd.trim();
  let [action, ...args] = cmd.split(" ");

  console.log("$$$$$$", action);
  if (action.startsWith("?")) {
    navigate(
      "?" +
        action.substr(1) +
        (action.substr(1) && args.join("") ? "%20" : "") +
        args.join("%20")
    );
    return null;
  }
  if (ignoreCommands.includes(action)) {
    return null;
  }
  if (action.startsWith("https://")) {
    openNewTab(action + args.join(" "));
  } else {
    action = action.replaceAll(/[^a-zA-Z0-9.]+/g, "");
    action = action.toLowerCase();
    if (action in links) {
      navigate(links[action]);
    } else if (action in externalLinks) {
      openNewTab(externalLinks[action]);
    } else if (action in externalSearchLinks) {
      openNewTab(externalSearchLinks[action](...args));
    } else {
      switch (action) {
        case "style":
          args = args.filter((arg) => arg);
          dispatch(setStyle(parseInt(args[0])));
          return null;
          break;
        case "echo":
          return args.join(" ");
          break;
        case "clear":
        case "cls":
          dispatch(clearHistory());
          return null;
          break;
        default:
          // Handle other commands or show error
          return `Unknown command: ${cmd}`;
      }
    }
  }

  return `command executed:${action}`;
}
