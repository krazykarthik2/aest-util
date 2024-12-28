import { setStyle } from "../../redux/commandSlice";
import { getRandomQuote } from "../../util/jsutil";
const links = {
  qrimg: "/qrimgutil",
  state: "/state",
  type: "/typing",
  keyboard: "/keyboard?style=10",
  help: "/help",
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
const utillinksActual = {
  timer: (...args) => {
    const InvalidTime = new Error("Invalid time");
    if (args.length) {
      args = args
        .join("")
        .split(/[.:/s]/g)
        .filter((arg) => arg);
      let time = 0,
        d = 0,
        h = 0,
        m = 0,
        s = 0;
      for (let i = 0; i < args.length; i++) {
        if (args[i] < 0) throw InvalidTime;
        if (i > 3) throw InvalidTime;
        if (args[i].endsWith("d")) {
          d = parseInt(args[i].slice(0, -1));
        } else if (args[i].endsWith("h")) {
          h = parseInt(args[i].slice(0, -1));
        } else if (args[i].endsWith("m")) {
          m = parseInt(args[i].slice(0, -1));
        } else if (args[i].endsWith("s")) {
          s = parseInt(args[i].slice(0, -1));
        } else {
          s = parseInt(args[i]);
        }
      }
      time = d * 86400 + h * 3600 + m * 60 + s;
      return (
        "/timer?style=11&timerto=" +
        (Date.now() + time * 1000) +
        "&timerfrom=" +
        Date.now()
      );
    } else return "/timer";
  },
};
const utillinksAlias = {
  countdown: utillinksActual.timer,
};
const utillinks = {
  ...utillinksActual,
  ...utillinksAlias,
};
const ignoreCommands = ["qr"];

const actualAppLinks = {
  whatsapp: "whatsapp://",
  figma: "figma://",
  camera: "camera://",
  spotify: "spotify://",
  notion: "notion://",
  notepad: "notepad://",
  explorer: "explorer://",
  vscode: "vscode://",
  windsurf: "windsurf://",
  telegram: "tg://",
  discord: "discord://",
  phonelink: "ms-phone://",
};
const aliasAppLinks = {
  code: actualAppLinks.vscode,
  files: actualAppLinks.explorer,
  link: actualAppLinks.phonelink,
  phone: actualAppLinks.phonelink,
};
const appLinks = {
  ...actualAppLinks,
  ...aliasAppLinks,
};
const actualExternalLinks = {
  colab: "https://colab.research.google.com/",
  gpt: "https://chatgpt.com/",
  "chrome.settings": "chrome://settings/",
  "chrome.bookmarks": "chrome://bookmarks/",
  "chrome.history": "chrome://history/",
  "chrome.downloads": "chrome://downloads/",
  "chrome.passwords": "chrome://password-manager",
  "chrome.extensions": "chrome://extensions/",
  "web.whatsapp": "https://web.whatsapp.com/",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  tailwind: "https://tailwindcss.com/docs",
};
const aliasExternalLinks = {
  chatgpt: actualExternalLinks.gpt,
  openai: actualExternalLinks.gpt,
  passwords: actualExternalLinks["chrome.passwords"],
  ig: actualExternalLinks.instagram,
  fb: actualExternalLinks.facebook,
};
const externalLinks = {
  ...actualExternalLinks,
  ...aliasExternalLinks,
  ...appLinks,
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
  linkedin: (...args) =>
    args.length
      ? "https://linkedin.com/search?q=" + encodeURI(args.join(" "))
      : "https://linkedin.com",
  "linkedin.profile": (...args) =>
    args.length
      ? "https://linkedin.com/in/" + args.join(" ")
      : "https://linkedin.com/profile",
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
  if (address.startsWith("chrome://")) {
    window.chrome.tabs?.create({ url: address });
    return;
  }
  window.open(address, "_new", "noopener,noreferrer");
};

const convert_currency = async (amount, from, to) => {
  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_VnpBqgCOgfKIzYH4tNKgHbKH1QXx3kNTZaOrkkyn&currencies=${to}&base_currency=${from}`;
  console.log(url);
  let res = await fetch(url);
  res = await res.json();
  console.log(res);
  return res.data[to];
};
const asyncUtilCommands = {
  convert: async (...args) => {
    if (args.length === 3) {
      let [amount, from, to] = args;
      console.log(
        [amount, from, to].filter((e) => !Number.isFinite(Number(e)))
      );
      const x = [
        ...[amount, from, to].filter((e) => Number.isFinite(Number(e))),
        ...[amount, from, to]
          .filter((e) => !Number.isFinite(Number(e)))
          .map((e) => e?.toUpperCase()),
      ];
      [amount, from, to] = x;
      console.log([amount, from, to]);
      if (from === to) return null;
      const rate = await convert_currency(amount, from, to);
      console.log(rate);
      return `${amount} ${from} to ${to}: ${
        rate * amount
      } @ ${from}-${to} = ${rate}`;
    }
  },
  quote: async (...args) => {
    const q = await getRandomQuote(1);
    return q[0].quote + "\n~" + q[0].author;
  },
};
export async function handleCommand(cmd, navigate, dispatch, clearHistory) {
  if (!cmd || !navigate || !dispatch || !clearHistory) return;
  cmd = cmd.trim();
  let [action, ...args] = cmd.split(" ");

  console.log("$$$$$$", action);
  // if (action.startsWith("?")) { testing
  //   navigate(
  //     "?" +
  //       action.substr(1) +
  //       (action.substr(1) && args.join("") ? "%20" : "") +
  //       args.join("%20")
  //   );
  //   return null;
  // }
  const startCharActions = {
    "?": (...e) => {
      return [false, openNewTab(externalSearchLinks.google(...e))];
    },
    "#": (...e) => {
      let result = null;
      try {
        result = eval(e.join(" "));
      } catch (error) {
        console.log(error.message);
        result = "error:" + error.message;
      } finally {
        return [true, result];
      }
    },
  };
  if (action[0] in startCharActions) {
    const [toshowresult, result] = startCharActions[action[0]](
      action.substr(1),
      ...args
    );
    if (toshowresult) return JSON.stringify(result) || "";
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
    } else if (action in utillinks) {
      navigate(utillinks[action](...args));
    } else if (action in externalLinks) {
      openNewTab(externalLinks[action]);
    } else if (action in externalSearchLinks) {
      openNewTab(externalSearchLinks[action](...args));
    } else if (action in asyncUtilCommands) {
      const result = await asyncUtilCommands[action](...args);
      return result;
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

const AllCommands =[
  ...Object.keys(links),
  ...Object.keys(utillinks),
  ...Object.keys(externalLinks),
  ...Object.keys(externalSearchLinks),
  ...Object.keys(asyncUtilCommands),
]
export { AllCommands };