import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_API_URL;
export function generateRandomCode(length=16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
export const generateTOTP = async  (secret) => {
    return (await axios.get(BACKEND_URL + '/api/generate-totp')).data.secret
}