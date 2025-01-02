import { FaBookmark, FaHistory, FaDownload, FaLock, FaFacebook, FaTwitter, FaHackerrank } from "react-icons/fa";
import { FaGear, FaInstagram } from "react-icons/fa6";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { LuBrainCircuit } from "react-icons/lu";
import { SiGooglecolab, SiHeroku, SiNetlify, SiTailwindcss, SiVercel, SiW3Schools } from "react-icons/si";
import { appLinks } from "./appLinks";

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
  tailwind: <SiTailwindcss />,
  hackerrank:<FaHackerrank />,
  w3schools:<SiW3Schools />,
  netlify:<SiNetlify />,
  vercel:<SiVercel />,
  heroku:<SiHeroku />,
};

const aliasExternalLinks = {
  chatgpt: actualExternalLinks.gpt,
  openai: actualExternalLinks.gpt,
  passwords: actualExternalLinks["chrome.passwords"],
  ig: actualExternalLinks.instagram,
  fb: actualExternalLinks.facebook,
};
export const externalLinks = {
  ...actualExternalLinks,
  ...aliasExternalLinks,
  ...appLinks,
};
