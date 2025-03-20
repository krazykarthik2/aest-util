import { FaArrowDown, FaArrowRight, FaBug, FaHome, FaPlay, FaPlusCircle, FaStop, FaStopCircle } from "react-icons/fa";
export function makeLineIdGroups(__state) {
  console.log(__state);
  let state = [...__state];
  let newState = [];
  let i = 0;

  while (i < state.length) {
    if (
      state[i].by === "server" &&
      ["line-started", "batch-output", "batch-error", "line-executed"].includes(
        state[i].content.action
      )
    ) {
      let lineId = state[i].content.lineId;
      let group = [];
      let j = i;

      // Collect all consecutive entries with the same lineId
      while (
        j < state.length &&
        state[j].by === "server" &&
        state[j].content.lineId === lineId &&
        ["line-started", "batch-output", "batch-error", "line-executed"].includes(
          state[j].content.action
        )
      ) {
        group.push(state[j]);
        j++;
      }

      let groupedCommandSubs = [];
      let k = 0;

      while (k < group.length) {
        if (group[k].content.action === "line-started") {
          let start = k;
          while (k < group.length && group[k].content.action !== "line-executed") {
            k++;
          }
          if (k < group.length && group[k].content.action === "line-executed") {
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
        k++;
      }

      newState.push({
        by: "server",
        content: { lineId: lineId },
        sub: groupedCommandSubs,
      });

      i = j; // Skip processed entries
    } else {
      newState.push(state[i]);
      i++;
    }
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
