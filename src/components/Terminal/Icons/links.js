import { CiClock2 } from "react-icons/ci";
import { FaTerminal, FaWindows } from "react-icons/fa";
import { FaQrcode, FaKeyboard, FaQuestion } from "react-icons/fa6";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { SiGoogleauthenticator } from "react-icons/si";

export const links = {
  qrimg: <FaQrcode />,
  state: null,
  type: <FaKeyboard />,
  keyboard: <FaKeyboard />,
  help: <FaQuestion />,
  sessions:<FaWindows />,
  login: <FiLogIn />,
  signin: <FiLogIn />,
  logout: <FiLogOut />,
  signout: <FiLogOut />,
  register: <FiLogIn />,
  signup: <FiLogIn />,
  "auth.totp.enable": <SiGoogleauthenticator />,
  clock: <CiClock2 />,
  "clock.zen": <CiClock2 />,
  terminal: <FaTerminal />,
  cmd: <FaTerminal />,
  bash: <FaTerminal />,
  shell: <FaTerminal />,
  sh: <FaTerminal />,
};
