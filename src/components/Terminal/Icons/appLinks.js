import { BsTelegram } from "react-icons/bs";
import { FaCamera, FaFolder, FaDiscord, FaPhone } from "react-icons/fa";
import { FaWhatsapp, FaFigma, FaSpotify } from "react-icons/fa6";
import { LuNotepadText } from "react-icons/lu";
import { SiNotion } from "react-icons/si";
import { VscDebugDisconnect, VscVscode } from "react-icons/vsc";

const actualAppLinks = {
  whatsapp: <FaWhatsapp />,
  vscode: <VscVscode />,
  telegram: <BsTelegram />,
  figma: <FaFigma />,
  spotify: <FaSpotify />,
  camera: <FaCamera />,
  notion: <SiNotion />,
  notepad: <LuNotepadText />,
  explorer: <FaFolder />,
  windsurf: <VscVscode />,
  discord: <FaDiscord />,
  phonelink: <FaPhone />,
  daemon:<VscDebugDisconnect/>
};
const aliasAppLinks = {
  code: actualAppLinks.vscode,
  files: actualAppLinks.explorer,
  link: actualAppLinks.phonelink,
  phone: actualAppLinks.phonelink
};
export const appLinks = {
  ...actualAppLinks,
  ...aliasAppLinks,
};
