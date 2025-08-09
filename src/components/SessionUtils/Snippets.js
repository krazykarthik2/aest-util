import { BsThreeDots } from "react-icons/bs";
import { FaWifi } from "react-icons/fa";
import { FaBroom, FaList, FaReact } from "react-icons/fa6";
import { SiJupyter } from "react-icons/si";

const Main = {
  cra: ["npx create-react-app", <FaReact />],
  jupyter: ["jupyter lab", <SiJupyter />],
  "%user%": ["cd %USERPROFILE%", <BsThreeDots />],
  "clear:temp": ["cd %TEMP% && del *", <FaBroom />],
  ls: ["dir", <FaList />],
  "wifi:visible": ["netsh wlan show networks", <FaWifi />],
  "wifi:known-networks": ["netsh wlan show profiles", <FaWifi />],
  "wifi:pass $1": ["netsh wlan show profile name=$1 key=clear", <FaWifi />],
};
const Alias = {
  notebook: Main.jupyter,
  "go:userprofile": Main["%user%"],
  user: Main["%user%"],
};
const Snippets = {
  ...Main,
  ...Alias,
};
export function format$str(str, args) {
  // Match $1, "$1", '$1'
  const regex = /"\$([0-9])"|'?\$([0-9])'?/g;

  return str.replace(regex, (match, g1, g2) => {
    const index = Number(g1 || g2) - 1;
    const arg = args[index] ?? "";

    // Preserve quotes if the original had them
    if (match.startsWith('"') && match.endsWith('"')) {
      return `"${arg}"`;
    }
    if (match.startsWith("'") && match.endsWith("'")) {
      return `'${arg}'`;
    }
    return arg; // unquoted
  });
}

export function format$str(str, args) {
  const regex = /\$[0-9]/g
  const dollarAreas = str.match(regex);
  const argsPlacedArr = dollarAreas?.map(e=>Number(e.slice(1))-1)?.map(e=>args[e])
  console.log(argsPlacedArr)
  const result=str.split(regex).map((e,i)=>e+(argsPlacedArr?.[i]||""));
  return result.join('');
    
}

export default Snippets;
