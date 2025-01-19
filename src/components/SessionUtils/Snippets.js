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
export function format$(str, args) {
  return str?.split(" ")?.map((e) =>
      e.startsWith("$")
        && Number.isInteger(Number(e.slice(1)))
          && args.length > Number(e.slice(1)) - 1
            ? <span className="arg bg-gray-900 p-1 rounded-md">{args?.[Number(e.slice(1)) - 1]}</span>
        : <>{e}&nbsp;</> 
    )
    
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
