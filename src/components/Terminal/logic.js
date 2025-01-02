import { setStyle } from "../../redux/commandSlice";
import { isExtension } from "../../util/jsutil";
import { links } from "./commands/links";
import { extensionOnlyLinks } from "./commands/extensionOnlyLinks";
import { externalLinks } from "./commands/externalLinks";
import { externalSearchLinks } from "./commands/externalSearchLinks";
import { utillinks } from "./commands/utillinks";
import { asyncUtilCommands } from "./commands/asyncUtilCommands";
const ignoreCommands = ["qr"];


const openNewTab = (address) => {
  if (address.startsWith("chrome://")) {
    window.chrome.tabs?.create({ url: address });
    return;
  }
  window.open(address, "_new", "noopener,noreferrer");
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
    action = action.replaceAll(/[^a-zA-Z0-9.-]+/g, "");
    action = action.toLowerCase();

    if (isExtension()) {
      if (action in extensionOnlyLinks) {
        openNewTab(extensionOnlyLinks[action]);
        return null;
      }
    }
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

const AllCommands = [
  ...Object.keys(extensionOnlyLinks),
  ...Object.keys(links),
  ...Object.keys(utillinks),
  ...Object.keys(externalLinks),
  ...Object.keys(externalSearchLinks),
  ...Object.keys(asyncUtilCommands),
];
export { AllCommands };
