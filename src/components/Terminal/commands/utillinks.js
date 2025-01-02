const utillinksActual = {
  timer: (...args) => {
    const InvalidTime = new Error("Invalid time");
    if (args.length) {
      args = args
        .join("")
        .split(/[.:/s]/g)
        .filter((arg) => arg);
      let time = 0, d = 0, h = 0, m = 0, s = 0;
      for (let i = 0; i < args.length; i++) {
        if (args[i] < 0) throw InvalidTime;
        if (i > 3) throw InvalidTime;
        if (args[i].endsWith("d")) {
          d = parseInt(args[i].slice(0, -1));
        } else if (args[i].endsWith("h")) {
          h = parseInt(args[i].slice(0, -1));
        } else if (args[i].endsWith("m")) {
          m = parseInt(args[i].slice(0, -1));
        } else if (args[i].endsWith("s")) {
          s = parseInt(args[i].slice(0, -1));
        } else {
          s = parseInt(args[i]);
        }
      }
      time = d * 86400 + h * 3600 + m * 60 + s;
      return (
        "/timer?style=11&timerto=" +
        (Date.now() + time * 1000) +
        "&timerfrom=" +
        Date.now()
      );
    } else return "/timer";
  },
};
const utillinksAlias = {
  countdown: utillinksActual.timer,
};
export const utillinks = {
  ...utillinksActual,
  ...utillinksAlias,
};
