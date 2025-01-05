import {
  FaJs
} from "react-icons/fa";
import {
  FaGoogle
} from "react-icons/fa6";
import { LiaBroomSolid } from "react-icons/lia";
import { LuPaintbrushVertical } from "react-icons/lu";
import { TfiAnnouncement } from "react-icons/tfi";
import { asyncUtilCommands } from "./Icons/asyncUtilCommands";
import { externalLinks } from "./Icons/externalLinks";
import { externalSearchLinks } from "./Icons/externalSearchLinks";
import { links } from "./Icons/links";
import { utillinks } from "./Icons/utillinks";
import {  miscCommandsAsync } from "./Icons/miscCommandsAsync";
const ignoreCommands = ["qr"];
const switchExecution = {
  style: <LuPaintbrushVertical />,
  echo: <TfiAnnouncement />,
  clear: <LiaBroomSolid />,
  cls: <LiaBroomSolid />
};
const Icon = {
  ...links,
  ...utillinks,
  ...externalLinks,
  ...externalSearchLinks,
  ...miscCommandsAsync,
  ...asyncUtilCommands,
  ...switchExecution,
};
const IconShort = {
  "?":<FaGoogle />,
  "#":<FaJs/>
};
export { IconShort };
export default Icon;
