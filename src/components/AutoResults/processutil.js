import { FaArrowDown, FaArrowRight, FaBug, FaHome, FaPlay, FaPlusCircle, FaStop, FaStopCircle } from "react-icons/fa";

//TODO: fix error with multiple works
export function makeLineIdGroups(__state) {
  console.log(__state)
  let state = [...__state];
  let newState = [];
  for (let i = 0; i < state.length; i++) {
    // group all things consecutively having same lineId if they are of state.by in ["line-started","batch-output","batch-error","line-executed"]
    if (
      state[i].by == "server" &&
      ["line-started", "batch-output", "batch-error", "line-executed"].includes(
        state[i].content.action
      )
    ) {
      let lineId = state[i].content.lineId;
      let j = i + 1;
      while (
        j < state.length &&
        state[j].by == "server" &&
        state[j].content.lineId == lineId &&
        [
          "line-started",
          "batch-output",
          "batch-error",
          "line-executed",
        ].includes(state[j].content.action)
      ) {
        j++;
      }
      console.log("--------");

      let group = state.splice(i, j - i);
      let newgroup = {};
      newgroup.by = "server";
      newgroup.content = { lineId: lineId };
      let groupedCommandSubs = [];
      console.log("groups", group);
      for (let k = 0; k < group.length; k++) {
        let start = 0;
        if (group[k].content.action == "line-started") {
          start = k;
          while (group[k].content.action != "line-executed") {
            k++;
          }
          let sameCommand = {
            inouts: group.slice(start, k + 1),
            content: {
              lineId: lineId,
              action: "grouped-command",
            },
          };
          groupedCommandSubs.push(sameCommand);
        }
      }
      newgroup.sub = groupedCommandSubs;
      newState.push(newgroup);
    }
    newState.push(state[i]);
  }
  return newState;
}

export const Icon = {
  "batch-created": <FaPlusCircle size={30} />,
  "batch-output": <FaArrowRight size={30} />,
  "batch-error": <FaBug size={30} />,
  "batch-executed": <FaStopCircle size={30} />,
  "line-started": <FaPlay size={30} />,
  "line-executed": <FaStop size={30} />,
};
