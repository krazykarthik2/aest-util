import { FaStopwatch } from "react-icons/fa";

const utillinksActual = {
  timer:<FaStopwatch />
};
const utillinksAlias = {
  countdown: utillinksActual.timer,
};
export const utillinks = {
  ...utillinksActual,
  ...utillinksAlias,
};
