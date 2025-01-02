const actualExternalLinks = {
  colab: "https://colab.research.google.com/",
  gpt: "https://chatgpt.com/",
  "web.whatsapp": "https://web.whatsapp.com/",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  tailwind: "https://tailwindcss.com/docs",
  hackerrank: "https://www.hackerrank.com/",
  w3schools: "https://www.w3schools.com/",
  netlify: "https://app.netlify.com/",
  vercel: "https://vercel.com/",
  heroku: "https://dashboard.heroku.com/",
};
const aliasExternalLinks = {
  chatgpt: actualExternalLinks.gpt,
  openai: actualExternalLinks.gpt,
  passwords: actualExternalLinks["chrome.passwords"],
  ig: actualExternalLinks.instagram,
  fb: actualExternalLinks.facebook,
};
export const externalLinks = {
  ...actualExternalLinks,
  ...aliasExternalLinks,
};
