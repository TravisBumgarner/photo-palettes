const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "../frontend/dist");
const htmlPath = path.join(distDir, "index.html");
const ejsPath = path.join(distDir, "index.ejs");

let html = fs.readFileSync(htmlPath, "utf-8");
fs.writeFileSync(ejsPath, html);