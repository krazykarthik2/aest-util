import { GoHome } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { FaWifi } from "react-icons/fa";
import { FaBroom, FaList, FaReact } from "react-icons/fa6";
import { SiJupyter } from "react-icons/si";
import { HiMagnifyingGlass } from "react-icons/hi2";

const Main = {
  cra: ["npx create-react-app", <FaReact />],
  jupyter: ["jupyter lab", <SiJupyter />],
  "%user%": ["cd %USERPROFILE%", <BsThreeDots />],
  "clear:temp": ["cd %TEMP% && del *", <FaBroom />],
  ls: ["dir", <FaList />],
  "wifi:visible": ["netsh wlan show networks", <FaWifi />],
  "wifi:known-networks": ["netsh wlan show profiles", <FaWifi />],
  "wifi:pass $1": ["netsh wlan show profile name=$1 key=clear", <FaWifi />],

  // file ops
  "grep:file $1 $2": ["findstr $1 $2", <BsThreeDots />],
  "open:file $1": ["start $1", <BsThreeDots />],
  "search:dir $1": ["dir /s /b $1", <FaList />],
  "copy:file $1 $2": ["copy $1 $2", <FaList />],
  "wifi:connect $1": ["netsh wlan connect name=$1", <FaWifi />],
  "ping:site $1": ["ping $1", <BsThreeDots />],
  "ssh:connect $1 $2": ["ssh $1@$2", <BsThreeDots />],
  "scp:file $1 $2 $3": ["scp $1 $2@$3", <BsThreeDots />],
  "tar:extract $1": ["tar -xf $1", <BsThreeDots />],
  "curl:download $1 $2": ["curl -o $2 $1", <BsThreeDots />],

  // Quoted arguments examples:
  "find:text $1 $2": ['findstr "$1" "$2"', <HiMagnifyingGlass />],
  "replace:text $1 $2 $3": ['powershell -Command "(Get-Content $3) -replace \\"$1\\", \\"$2\\" | Set-Content $3"', <BsThreeDots />],
  "grep:quoted $1 $2": ['findstr "$1" "$2"', <HiMagnifyingGlass />],
  "search:quoted $1 $2": ['findstr "$1" "$2"', <HiMagnifyingGlass />],





  home: ["cd %USERPROFILE%", <GoHome />],
  desktop: ["cd %USERPROFILE%\\Desktop", <BsThreeDots />],
  documents: ["cd %USERPROFILE%\\Documents", <BsThreeDots />],
  downloads: ["cd %USERPROFILE%\\Downloads", <BsThreeDots />],
  clear: ["cls", <BsThreeDots />],
  mkdir: ["mkdir $1", <BsThreeDots />],
  rmdir: ["rmdir /S /Q $1", <BsThreeDots />],
  move: ["move $1 $2", <BsThreeDots />],
  copy: ["copy $1 $2", <BsThreeDots />],
  rename: ["ren $1 $2", <BsThreeDots />],
  search: ["dir /s /b $1", <FaList />],
  "search:text": ['findstr "$1" "$2"', <BsThreeDots />],
  echo: ["echo $1", <BsThreeDots />],
  notepad: ["notepad $1", <BsThreeDots />],
  calc: ["calc", <BsThreeDots />],
  paint: ["mspaint", <BsThreeDots />],
  date: ["date /T", <BsThreeDots />],
  time: ["time /T", <BsThreeDots />],

  // Networking
  ip: ["ipconfig", <FaWifi />],
  "ip:all": ["ipconfig /all", <FaWifi />],
  ping: ["ping $1", <FaWifi />],
  traceroute: ["tracert $1", <FaWifi />],
  netstat: ["netstat -an", <FaWifi />],
  "wifi:visible": ["netsh wlan show networks", <FaWifi />],
  "wifi:known": ["netsh wlan show profiles", <FaWifi />],
  "wifi:pass $1": ["netsh wlan show profile name=$1 key=clear", <FaWifi />],
  "wifi:connect $1": ["netsh wlan connect name=$1", <FaWifi />],
  curl: ["curl $1", <FaWifi />],
  wget: ["wget $1", <FaWifi />],

  // Git
  "git:init": ["git init", <BsThreeDots />],
  "git:clone": ["git clone $1", <BsThreeDots />],
  "git:add": ["git add $1", <BsThreeDots />],
  "git:commit": ['git commit -m "$1"', <BsThreeDots />],
  "git:push": ["git push", <BsThreeDots />],
  "git:pull": ["git pull", <BsThreeDots />],
  "git:status": ["git status", <BsThreeDots />],
  "git:branch": ["git branch $1", <BsThreeDots />],
  "git:checkout": ["git checkout $1", <BsThreeDots />],

  // npm & Node.js
  "npm:init": ["npm init -y", <BsThreeDots />],
  "npm:install": ["npm install $1", <BsThreeDots />],
  "npm:global": ["npm install -g $1", <BsThreeDots />],
  "npm:uninstall": ["npm uninstall $1", <BsThreeDots />],
  "node:run": ["node $1", <BsThreeDots />],

  // Python
  "py:run": ["python $1", <BsThreeDots />],
  "py:venv": ["python -m venv $1", <BsThreeDots />],
  "py:pip": ["pip install $1", <BsThreeDots />],
  "py:pipup": ["pip install --upgrade $1", <BsThreeDots />],
  "py:freeze": ["pip freeze > requirements.txt", <BsThreeDots />],
  "py:req": ["pip install -r requirements.txt", <BsThreeDots />],

  // Docker
  "docker:ps": ["docker ps", <BsThreeDots />],
  "docker:images": ["docker images", <BsThreeDots />],
  "docker:build": ["docker build -t $1 .", <BsThreeDots />],
  "docker:run": ["docker run -d $1", <BsThreeDots />],
  "docker:exec": ["docker exec -it $1 $2", <BsThreeDots />],
  "docker:rm": ["docker rm $1", <BsThreeDots />],
  "docker:rmi": ["docker rmi $1", <BsThreeDots />],

  // Archiving
  zip: ["tar -a -c -f $1.zip $2", <BsThreeDots />],
  unzip: ["tar -xf $1.zip", <BsThreeDots />],
  "tar:create": ["tar -cf $1.tar $2", <BsThreeDots />],
  "tar:extract": ["tar -xf $1.tar", <BsThreeDots />],

  // PowerShell
  "ps:list": ["powershell Get-Process", <BsThreeDots />],
  "ps:kill": ["powershell Stop-Process -Name $1", <BsThreeDots />],
  "ps:getservice": ["powershell Get-Service", <BsThreeDots />],
  "ps:disk": ["powershell Get-PSDrive", <BsThreeDots />],

  // Fun & Misc
  matrix: ["powershell -Command \"while($true){Write-Host ((Get-Random -Minimum 0 -Maximum 2) -join '') -ForegroundColor Green}\"", <BsThreeDots />],
  cowsay: ["docker run --rm docker/whalesay cowsay $1", <BsThreeDots />],
  fortune: ["fortune", <BsThreeDots />],
  joke: ["curl https://icanhazdadjoke.com/ -H 'Accept: text/plain'", <BsThreeDots />],
  weather: ["curl wttr.in/$1", <FaWifi />],
  qr: ["qrencode -o $2.png $1", <BsThreeDots />],

  // File Inspection
  head: ["powershell Get-Content $1 -TotalCount $2", <BsThreeDots />],
  tail: ["powershell Get-Content $1 -Tail $2", <BsThreeDots />],
  count: ["powershell (Get-Content $1).Count", <BsThreeDots />],
  filesize: ["powershell (Get-Item $1).Length", <BsThreeDots />],

  // System Info
  "sys:info": ["systeminfo", <BsThreeDots />],
  cpu: ["wmic cpu get name", <BsThreeDots />],
  ram: ["wmic memorychip get capacity", <BsThreeDots />],
  disk: ["wmic diskdrive get size", <BsThreeDots />],
  uptime: ["net stats srv", <BsThreeDots />],
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
export function parseArgs(input) {
  return input.match(/"([^"]+)"|'([^']+)'|(\S+)/g)?.map(arg =>
    arg.replace(/^['"]|['"]$/g, "")
  ) || [];
}

export function format$str(str, args) {
  // Match $1, "$1", '$1'
  const regex = /"\$([0-9]+)"|'?\$([0-9]+)'?/g;

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



export default Snippets;
