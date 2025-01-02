import { getRandomQuote } from "../../../util/jsutil";

const convert_currency = async (amount, from, to) => {
  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_VnpBqgCOgfKIzYH4tNKgHbKH1QXx3kNTZaOrkkyn&currencies=${to}&base_currency=${from}`;
  console.log(url);
  let res = await fetch(url);
  res = await res.json();
  console.log(res);
  return res.data[to];
};
export const asyncUtilCommands = {
  convert: async (...args) => {
    if (args.length === 3) {
      let [amount, from, to] = args;
      console.log(
        [amount, from, to].filter((e) => !Number.isFinite(Number(e)))
      );
      const x = [
        ...[amount, from, to].filter((e) => Number.isFinite(Number(e))),
        ...[amount, from, to]
          .filter((e) => !Number.isFinite(Number(e)))
          .map((e) => e?.toUpperCase()),
      ];
      [amount, from, to] = x;
      console.log([amount, from, to]);
      if (from === to) return null;
      const rate = await convert_currency(amount, from, to);
      console.log(rate);
      return `${amount} ${from} to ${to}: ${rate * amount} @ ${from}-${to} = ${rate}`;
    }
  },
  quote: async (...args) => {
    const q = await getRandomQuote(1);
    return q[0].quote + "\n~" + q[0].author;
  },
};
