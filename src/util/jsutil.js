import axios from "axios";
import quoteFile from "../assets/quotes.txt";
import commonthousand from "../assets/most-common-1000.txt";

export const getBackendUrl = () => {
  return window.location.origin.startsWith("chrome-extension://")
    ? process.env.REACT_APP_EXTENSION_API_URL
    : process.env.REACT_APP_API_URL;
};

export function generateRandomCode(length = 16) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
export const generateTOTP = async (secret) => {
  return (await axios.get(getBackendUrl() + "/api/generate-totp")).data.secret;
};
export async function getRandomQuote(quotes = 1) {
  try {
    const start = 0,
      total = 1454;
    const randomIndex = Math.floor(Math.random() * (total - start) + start);
    const file =(await axios.get(quoteFile)).data;
    window.quoteFile = quoteFile;
    const response = file.split('\n').slice(randomIndex, randomIndex + quotes);
    window.response = response;
    return response.map((e) => {let x = e.split("~")[0];return x.substr(1,x.length-2);});
  } catch (error) {
    console.error("Error fetching random text:", error);
    return error.message;
  }
}
export async function getRandomWords(number = 50) {
  try {
    const response = await axios.get(commonthousand);
    const words = response.data.split("\n");
    const randomWords = words.sort(() => Math.random() - 0.5).slice(0, number);
    return randomWords;
  } catch (error) {
    console.error("Error fetching random text:", error);
    return "";
  }
}