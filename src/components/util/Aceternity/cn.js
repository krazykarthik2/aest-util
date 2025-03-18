export default function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}