
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";

const key = fs.readFileSync("server.key");
const cert = fs.readFileSync("server.crt");

const redirect = express().use((req, res, _) => {
    return res.redirect("https://" + req.headers.host.split(":")[0] + ":" + 8443 + req.url);
});
http.createServer(redirect).listen(8080, () => {
    console.log("Server listening on: http://localhost:8080");
});

const staticFiles = express().use(express.static("./webdist"));
https.createServer({ key, cert }, staticFiles).listen(8443, () => {
    console.log("Server listening on: https://localhost:8443");
});
