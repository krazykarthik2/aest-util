import axios from "axios";

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
    const response = await axios.get(
      "https://dummyjson.com/quotes/random/" + quotes
    );
    return response.data.map((e) => e.quote);
  } catch (error) {
    console.error("Error fetching random text:", error);
    return "";
  }
}