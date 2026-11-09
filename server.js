const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  if (pathname === "/") pathname = "/index.html";
  const file = path.join(ROOT, pathname);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(file);
    const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json" };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  });
});
const wss = new WebSocket.Server({ server });
const players = new Map();
const resources = [
  {id:"wood-a", type:"wood", x:8, z:4}, {id:"wood-b", type:"wood", x:-9, z:7},
  {id:"wood-c", type:"wood", x:3, z:-12}, {id:"wood-d", type:"wood", x:15, z:-8},
  {id:"wood-e", type:"wood", x:-16, z:-10}, {id:"wood-f", type:"wood", x:-3, z:16}
];
function sendAll(obj) {
  const msg = JSON.stringify(obj);
  for (const c of wss.clients) if (c.readyState === WebSocket.OPEN) c.send(msg);
}
wss.on("connection", ws => {
  const id = Math.random().toString(36).slice(2, 9);
  players.set(id, { id, name:"Explorador", x:0, z:5, rot:0, color:Math.floor(Math.random()*0xffffff) });
  ws.id = id;
  ws.send(JSON.stringify({type:"welcome", id, players:[...players.values()], resources}));
  sendAll({type:"players", players:[...players.values()]});
  ws.on("message", raw => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const p = players.get(id); if (!p) return;
    if (m.type === "move" && Number.isFinite(m.x) && Number.isFinite(m.z)) {
      p.x = Math.max(-28, Math.min(28, m.x));
      p.z = Math.max(-28, Math.min(28, m.z));
      p.rot = Number.isFinite(m.rot) ? m.rot : 0;
      if (typeof m.name === "string") p.name = m.name.slice(0, 16);
      sendAll({type:"playerMoved", player:p});
    }
    if (m.type === "collect" && typeof m.id === "string") {
      const i = resources.findIndex(r => r.id === m.id);
      if (i >= 0) { resources.splice(i, 1); sendAll({type:"resourceRemoved", id:m.id}); }
    }
  });
  ws.on("close", () => { players.delete(id); sendAll({type:"left", id}); });
});
server.listen(PORT, () => console.log(`Bosque 99 listo en http://localhost:${PORT}`));