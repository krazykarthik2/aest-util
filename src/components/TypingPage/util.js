export const getFormattedText = (select, capitalize, punc, num) => {
  if (!select) return;
  select = select
    .split(" ")
    .filter((e) => e)
    .join(" ");
  if (capitalize === "word") {
    select = select
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else if (capitalize === "sentence") {
    select = select
      .split(".")
      .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join(".");
  } else if (capitalize === "capital") {
    select = select.toUpperCase();
  } else if (capitalize === "small") {
    select = select.toLowerCase();
  }

  if (!punc) {
    select = select.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  } else {
    //sometimes add comma after a word randomly sometimes add a dot
    select = select
      .split(" ")
      .map((e) => {
        return e + (Math.random() < 0.1 ? "," : Math.random() < 0.2 ? "." : "");
      })
      .join(" ");
  }
  if (!num) {
    select = select.replace(/[0-9]/g, "");
  } else {
    select = select
      .split(" ")
      .map((e) => {
        return (
          e +
          (Math.random() < 0.1
            ? Math.floor(Math.random() * 10)
            : Math.random() < 0.2
            ? Math.floor(Math.random() * 100)
            : "")
        );
      })
      .join(" ");
  }
  return select;
};
export const getTimeDiff = (oldTime, newTime) => {
  let diff = new Date(newTime) - new Date(oldTime);
  let seconds = Math.floor(diff / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  return { seconds, minutes, hours, days };
} 
export const getTimeDiffStr = (oldTime, newTime) => {
  let { seconds, minutes, hours, days } = getTimeDiff(oldTime, newTime);
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return `${seconds} seconds ago`;
}
export const withoutLast =( arr)=>{
  let x = arr?.slice(0, arr.length - 1);
  return x
}

