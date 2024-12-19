import { BsTelegram } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import {
  FaBookmark,
  FaCamera,
  FaDiscord,
  FaDownload,
  FaFacebook,
  FaFolder,
  FaGoogleDrive,
  FaHistory,
  FaLock,
  FaPhone,
  FaTwitter,
  FaWpexplorer
} from "react-icons/fa";
import {
  FaFigma,
  FaGear,
  FaGithub,
  FaGoogle,
  FaInstagram,
  FaKaggle,
  FaKeyboard,
  FaLinkedin,
  FaNpm,
  FaQrcode,
  FaQuestion,
  FaSpotify,
  FaStackOverflow,
  FaWhatsapp,
  FaYoutube
} from "react-icons/fa6";
import { FiLogIn, FiLogOut, FiTerminal } from "react-icons/fi";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { LiaBroomSolid } from "react-icons/lia";
import { LuBrainCircuit, LuNotepadText, LuPaintbrushVertical } from "react-icons/lu";
import {
  SiDuckduckgo,
  SiGoogleauthenticator,
  SiGooglecolab,
  SiLeetcode,
  SiNotion,
  SiPerplexity,
  SiPypi
} from "react-icons/si";
import { TfiAnnouncement } from "react-icons/tfi";
import { VscVscode } from "react-icons/vsc";
const links = {
  qrimg: <FaQrcode />,
  state: null,
  type: <FaKeyboard />,
  keyboard: <FaKeyboard />,
  help: <FaQuestion />,
  login: <FiLogIn />,
  signin: <FiLogIn />,
  logout: <FiLogOut />,
  signout: <FiLogOut />,
  register: <FiLogIn />,
  signup: <FiLogIn />,
  "auth.totp.enable": <SiGoogleauthenticator />,
  clock: <CiClock2 />,
  "clock.zen": <CiClock2 />,
  terminal: <FiTerminal />,
  cmd: <FiTerminal />,
  bash: <FiTerminal />,
  shell: <FiTerminal />,
  sh: <FiTerminal />,
};
const ignoreCommands = ["qr"];
const actualAppLinks = {
  whatsapp: <FaWhatsapp />,
  vscode: <VscVscode />,
  telegram: <BsTelegram />,
  figma: <FaFigma />,
  spotify:<FaSpotify />,
  camera: <FaCamera />,
  notion: <SiNotion />,
  notepad: <LuNotepadText />,
  explorer: <FaFolder />,
  windsurf: <FaWpexplorer />,
  discord: <FaDiscord />,
  phonelink: <FaPhone />,
};
const aliasAppLinks = {
  code: actualAppLinks.vscode,
  files: actualAppLinks.explorer,
  link:actualAppLinks.phonelink,
  phone:actualAppLinks.phonelink
};
const appLinks = {
  ...actualAppLinks,
  ...aliasAppLinks,
};
const actualExternalLinks = {
  colab: <SiGooglecolab />,
  gpt: <LuBrainCircuit />,
  "chrome.settings": <FaGear />,
  "chrome.bookmarks": <FaBookmark />,
  "chrome.history": <FaHistory />,
  "chrome.downloads": <FaDownload />,
  "chrome.passwords": <FaLock />,
  "chrome.extensions": <IoExtensionPuzzleSharp />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
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
  leetcode: <SiLeetcode />,
  "leetcode.profile": <SiLeetcode />,
  linkedin: <FaLinkedin />,
  "linkedin.profile": <FaLinkedin />,
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
  "?": actualExternalSearchLinks.google,
};
const externalSearchLinks = {
  ...actualExternalSearchLinks,
  ...aliasExternalSearchLinks,
};
const switchExecution = {
  style: <LuPaintbrushVertical />,
  echo: <TfiAnnouncement />,
  clear: <LiaBroomSolid />,
  cls: <LiaBroomSolid />
};
const Icon = {
  ...links,
  ...externalLinks,
  ...externalSearchLinks,
  ...switchExecution,
};
export default Icon;
