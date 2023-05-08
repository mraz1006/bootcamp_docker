import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const server = http.createServer();

server.on("request", async (req, res) => {
  console.log("request url: ", req.url);
  try {
    if (req.url === undefined) throw new Error("req.url is undefined");
    // Show index.html when accessing the root path.
    const filePath = req.url === "/" ? "/index.html" : req.url;
    const file = await fs.readFile(
      path.join(path.resolve(), "public", filePath)
    );

    const mimeTypes: { [key: string]: string } = {
      ".html": "text/html",
      ".json": "text/json",
      ".jpg": "image/jpeg",
      ".ico": "image/x-icon",
    };
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType: string =
      mimeTypes[extname] || "application/octet-stream";

    res.writeHead(200, { "content-type": contentType });
    res.end(file, "utf-8");
    return;
  } catch (err) {
    console.error("error: ", err);
    const error = err as NodeJS.ErrnoException;
    if (error.code === "ENOENT") {
      res.writeHead(404, { "content-type": "text/plain" });
      return res.end("404 Not Found");
    } else {
      res.writeHead(500, { "content-type": "text/plain" });
      return res.end("500 Internal Server Error");
    }
  }
});

server.on("listening", () => {
  console.log("start listening!");
});

const port = process.env.PORT ?? 8080;
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});

process.on('SIGINT', () => {
  console.log('SIGINT received.');
  process.exit(0);
});