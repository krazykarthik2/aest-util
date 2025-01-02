import { FaDribbble, FaFigma, FaFontAwesome, FaGoogleDrive, FaMedium, FaReact, FaReddit } from "react-icons/fa";
import { FaBehance, FaGithub, FaGoogle, FaKaggle, FaLinkedin, FaNpm, FaStackOverflow, FaYoutube } from "react-icons/fa6";
import { SiDuckduckgo, SiGeeksforgeeks, SiLeetcode, SiPerplexity, SiPypi } from "react-icons/si";

const actualExternalSearchLinks = {
  perplexity: <SiPerplexity />,
  google: <FaGoogle />,
  youtube: <FaYoutube />,
  duckduckgo: <SiDuckduckgo />,
  github: <FaGithub />,
  kaggle: <FaKaggle />,
  npm: <FaNpm />,
  pypi: <SiPypi />,
  drive: <FaGoogleDrive />,
  stackoverflow: <FaStackOverflow />,
  geeksforgeeks:<SiGeeksforgeeks />,
  leetcode: <SiLeetcode />,
  "leetcode.profile": <SiLeetcode />,
  linkedin: <FaLinkedin />,
  "linkedin.profile": <FaLinkedin />,
  "icon": <FaFontAwesome />,
  "react-icon": <FaReact />,
  dribble: <FaDribbble />,
  behance:<FaBehance />,
  "figma.search":<FaFigma />,
  medium: <FaMedium/>,
  reddit:<FaReddit/>
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
  "icons": actualExternalSearchLinks.icon,
  "react-icons": actualExternalSearchLinks["react-icon"]
};
export const externalSearchLinks = {
  ...actualExternalSearchLinks,
  ...aliasExternalSearchLinks,
};
