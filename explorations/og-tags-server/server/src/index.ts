import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();

const frontendDist = path.join(__dirname, "../../frontend/dist");
const indexHtml = fs.readFileSync(
  path.join(frontendDist, "index.html"),
  "utf-8"
);

app.use(express.static(frontendDist));

const DATABASE: Record<string, { title: string }> = {
  one: { title: "Foo One" },
  two: { title: "Foo Two" },
};

const mockFetchFromDB = (key: string) => {
  return (
    DATABASE[key] || {
      title: "Default Title",
    }
  );
};

app.get(/.*/, (req: Request, res: Response) => {
  const parts = req.path.split("/"); // ["", "collections", "one" | "two" | any]

  if (parts[1] !== "collections") res.send(indexHtml);

  const { title } = mockFetchFromDB(parts[2]);

  let ogInjectedHTML = indexHtml
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(/<title>.*<\/title>/, `<title>Collection - ${title}</title>`);
  res.send(ogInjectedHTML);
});

app.listen(8080, () => {
  console.log(`Server running at http://localhost:${8080}`);
});
