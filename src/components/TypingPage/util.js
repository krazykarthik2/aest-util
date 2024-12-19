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
