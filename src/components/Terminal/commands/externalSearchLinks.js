import { appLinks } from "./appLinks";

const actualExternalSearchLinks = {
  perplexity: (...args) => args.length
    ? "https://perplexity.ai/search/new?q=" + encodeURI(args.join(" "))
    : "https://perplexity.ai",
  google: (...args) => args.length
    ? "https://google.com/search?q=" + encodeURI(args.join(" "))
    : "https://google.com",
  youtube: (...args) => args.length
    ? "https://youtube.com/results?search_query=" + encodeURI(args.join(" "))
    : "https://youtube.com",
  duckduckgo: (...args) => args.length
    ? "https://duckduckgo.com/?q=" + encodeURI(args.join(" "))
    : "https://duckduckgo.com",
  github: (...args) => args.length
    ? (args.length == 1 && args[0].trim().startsWith("/"))
      ? "https://github.com" + args[0].trim()
      : "https://github.com/search?q=" + encodeURI(args.join(" "))
    : "https://github.com",
  kaggle: (...args) => args.length
    ? "https://kaggle.com/search?q=" + encodeURI(args.join(" "))
    : "https://kaggle.com",
  npm: (...args) => args.length
    ? "https://npmjs.com/search?q=" + encodeURI(args.join(" "))
    : "https://npmjs.com",
  pypi: (...args) => args.length
    ? "https://pypi.org/search?q=" + encodeURI(args.join(" "))
    : "https://pypi.org",
  drive: (...args) => args.length
    ? "https://drive.google.com/drive/search?q=" +
    encodeURI(args.join(" "))
    : "https://drive.google.com/drive/my-drive",
  dribbble: (...args) => args.length
    ? "https://dribbble.com/search/" + encodeURI(args.join(" "))
    : "https://dribbble.com",
  behance: (...args) => args.length
    ? "https://behance.net/search?search=" + encodeURI(args.join(" "))
    : "https://behance.net",
  "figma.search": (...args) => args.length
    ? "https://www.figma.com/community/search?resource_type=mixed&sort_by=relevancy&editor_type=all&price=all&creators=all&query=" + encodeURI(args.join(" "))
    : "https://figma.com/community",
  stackoverflow: (...args) => args.length
    ? "https://stackoverflow.com/search?q=" + encodeURI(args.join(" "))
    : "https://stackoverflow.com",
  geeksforgeeks: (...args) => args.length
    ? "https://geeksforgeeks.org/search?q=" + encodeURI(args.join(" "))
    : "https://geeksforgeeks.org",
  leetcode: (...args) => args.length
    ? "https://leetcode.com/problemset/?search=" + encodeURI(args.join(" "))
    : "https://leetcode.com/problemset/all",
  "leetcode.profile": (...args) => args.length
    ? "https://leetcode.com/u/" + args[0]
    : "https://leetcode.com/profile",
  linkedin: (...args) => args.length
    ? "https://linkedin.com/search?q=" + encodeURI(args.join(" "))
    : "https://linkedin.com",
  "linkedin.profile": (...args) => args.length
    ? "https://linkedin.com/in/" + args.join(" ")
    : "https://linkedin.com/profile",
  icon: (...args) => args.length
    ? "https://fontawesome.com/search?q=" + encodeURI(args.join(" "))
    : "https://fontawesome.com",
  "react-icon": (...args) => args.length
    ? "https://react-icons.github.io/react-icons/search#q=" +
    encodeURI(args.join(" "))
    : "https://react-icons.github.io/react-icons",
  medium: (...args) => args.length
    ? "https://medium.com/search?q=" + encodeURI(args.join(" "))
    : "https://medium.com",
  reddit : (...args) => args.length
    ? "https://reddit.com/search?q=" + encodeURI(args.join(" "))
    : "https://reddit.com",
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
  gfg: actualExternalSearchLinks.geeksforgeeks,
  "leet.profile": actualExternalSearchLinks["leetcode.profile"],
  "leet.u": actualExternalSearchLinks["leetcode.profile"],
  icons: actualExternalSearchLinks.icon,
  "react-icons": actualExternalSearchLinks["react-icon"],
};
const externalDownloadLinks = {
  "download.gh": (...args) => args.length
    ? "https://download-directory.github.io/?url=" + args.join("")
    : "https://download-directory.github.io",
}
const aliasExternalDownloadLinks = {
  "download.github": externalDownloadLinks["download.gh"],
}

export const externalSearchLinks = {
  ...actualExternalSearchLinks,
  ...externalDownloadLinks,
  ...aliasExternalDownloadLinks,
  ...aliasExternalSearchLinks,
  ...appLinks,
};
