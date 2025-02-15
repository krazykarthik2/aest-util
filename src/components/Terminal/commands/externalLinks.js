const actualExternalLinks = {
  colab: "https://colab.research.google.com/",
  gmail:"https://mail.google.com",
  gpt: "https://chatgpt.com/",
  "web.whatsapp": "https://web.whatsapp.com/",
  "web.figma":"https://www.figma.com/files/teams",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  tailwind: "https://tailwindcss.com/docs",
  hackerrank: "https://www.hackerrank.com/",
  w3schools: "https://www.w3schools.com/",
  netlify: "https://app.netlify.com/",
  vercel: "https://vercel.com/",
  heroku: "https://dashboard.heroku.com/",
  "instagram.reels":"https://instagram.com/reels",
  "daemon.download":"https://github.com/krazykarthik2/electron-ws-cmd/releases/latest/"
};
const aliasExternalLinks = {
  chatgpt: actualExternalLinks.gpt,
  mail:actualExternalLinks.gmail,
  openai: actualExternalLinks.gpt,
  passwords: actualExternalLinks["chrome.passwords"],
  ig: actualExternalLinks.instagram,
  ig.reels:actualExternalLinks["instagram.reels"],
  fb: actualExternalLinks.facebook,
};
export const externalLinks = {
  ...actualExternalLinks,
  ...aliasExternalLinks,
};
