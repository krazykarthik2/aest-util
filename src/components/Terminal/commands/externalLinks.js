const actualExternalLinks = {
  colab: "https://colab.research.google.com/",
  gmail: "https://mail.google.com",
  gpt: "https://chatgpt.com/",
  "web.whatsapp": "https://web.whatsapp.com/",
  "web.figma": "https://www.figma.com/files/teams",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  tailwind: "https://tailwindcss.com/docs",
  hackerrank: "https://www.hackerrank.com/",
  w3schools: "https://www.w3schools.com/",
  netlify: "https://app.netlify.com/",
  vercel: "https://vercel.com/",
  heroku: "https://dashboard.heroku.com/",
  "instagram.reels": "https://instagram.com/reels"
};
const actualExternalLinksNew = {
  "new.colab": "https://colab.research.google.com/?create=true",
  "new.github": "https://github.com/new",
  "new.notion": "https://www.notion.so/new",
  "new.figma": "https://www.figma.com/files/teams?new=true",
  "new.gmail": "https://mail.google.com/mail/u/0/#inbox?compose=new",
};
const downloadLinks = {
  "download.daemon":
    "https://github.com/krazykarthik2/electron-ws-cmd/releases/latest/",
  "download.chrome":
    "https://www.google.com/chrome/browser/desktop/index.html",
  "download.firefox":
    "https://www.mozilla.org/en-US/firefox/new/", 
  "download.vscode":
    "https://code.visualstudio.com/Download",
  "download.nodejs": "https://nodejs.org/en/download/",
  "download.python": "https://www.python.org/downloads/",
  "download.git": "https://git-scm.com/downloads",
  "download.docker": "https://www.docker.com/products/docker-desktop",
  "download.postman": "https://www.postman.com/downloads/",
  "download.mongodb": "https://www.mongodb.com/try/download/community",
  "download.mysql": "https://dev.mysql.com/downloads/mysql/",
  "download.rabbitmq": "https://www.rabbitmq.com/download.html",
  "download.compass": "https://www.mongodb.com/try/download/compass",
  "download.spotify": "https://www.spotify.com/download",
  "download.slack": "https://slack.com/downloads",
  "download.zoom": "https://zoom.us/download",
  "download.discord": "https://discord.com/download",
  "download.telegram": "https://desktop.telegram.org/",
  "download.whatsapp": "https://www.whatsapp.com/download/",
  "download.figma": "https://www.figma.com/downloads/",
  "download.brave": "https://brave.com/download/",
}
const actualExternalLinksNewAlias = {
  "new.mail": actualExternalLinksNew["new.gmail"],
}
const aliasExternalLinks = {
  chatgpt: actualExternalLinks.gpt,
  mail: actualExternalLinks.gmail,
  openai: actualExternalLinks.gpt,
  passwords: actualExternalLinks["chrome.passwords"],
  ig: actualExternalLinks.instagram,
  "ig.reels": actualExternalLinks["instagram.reels"],
  fb: actualExternalLinks.facebook,
};
export const externalLinks = {
  ...actualExternalLinks,
  ...aliasExternalLinks,
  ...actualExternalLinksNew,
  ...actualExternalLinksNewAlias,
  ...downloadLinks
};
