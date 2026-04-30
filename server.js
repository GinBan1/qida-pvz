const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function load(fname) {
  const fp = path.join(DATA_DIR, fname);
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return fname === 'leaderboard.json' ? {} : []; }
}

function save(fname, data) {
  fs.writeFileSync(path.join(DATA_DIR, fname), JSON.stringify(data), 'utf8');
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve(body); }
    });
  });
}

function json(res, data, code) {
  res.writeHead(code || 200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath, contentType) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:' + PORT);
  const p = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Static files
  if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
    serveFile(res, path.join(__dirname, '齐大植物大战僵尸.html'), 'text/html');
    return;
  }
  if (req.method === 'GET' && p.startsWith('/css/')) {
    serveFile(res, path.join(__dirname, p), 'text/css');
    return;
  }
  if (req.method === 'GET' && p.startsWith('/js/')) {
    serveFile(res, path.join(__dirname, p), 'application/javascript');
    return;
  }

  // --- Nickname API ---

  // GET /api/nicknames — get all taken nicknames
  if (req.method === 'GET' && p === '/api/nicknames') {
    const nicks = load('nicknames.json');
    json(res, { nicknames: nicks });
    return;
  }

  // POST /api/nickname — register a nickname
  // Body: { nickname, oldNickname? }
  if (req.method === 'POST' && p === '/api/nickname') {
    const body = await readBody(req);
    const nick = (body.nickname || '').trim();
    if (!nick || nick.length < 1) {
      json(res, { ok: false, error: '昵称不能为空' }, 400);
      return;
    }
    const nicks = load('nicknames.json');
    const old = (body.oldNickname || '').trim();
    // If changing nickname, remove old one
    if (old && old !== nick) {
      const idx = nicks.indexOf(old);
      if (idx !== -1) nicks.splice(idx, 1);
    }
    // Check if new nickname is taken
    if (nicks.indexOf(nick) !== -1) {
      json(res, { ok: false, error: '该昵称已被使用' });
      return;
    }
    nicks.push(nick);
    save('nicknames.json', nicks);
    json(res, { ok: true });
    return;
  }

  // --- Leaderboard API ---

  // GET /api/leaderboard — get all leaderboard data
  // Query: ?level=0 (optional, omit for all)
  if (req.method === 'GET' && p === '/api/leaderboard') {
    const lb = load('leaderboard.json');
    const level = url.searchParams.get('level');
    if (level !== null) {
      const arr = lb[level] || [];
      // Clean: remove entries without nickname, deduplicate
      const seen = {};
      const cleaned = arr.filter(e => {
        if (!e || !e.n) return false;
        if (seen[e.n]) return false;
        seen[e.n] = true;
        return true;
      });
      if (cleaned.length !== arr.length) {
        lb[level] = cleaned;
        save('leaderboard.json', lb);
      }
      json(res, { entries: cleaned });
    } else {
      json(res, lb);
    }
    return;
  }

  // POST /api/leaderboard — submit a score
  // Body: { level, nickname, score, kills, waves }
  if (req.method === 'POST' && p === '/api/leaderboard') {
    const body = await readBody(req);
    const { level, nickname, score, kills, waves } = body;
    if (!nickname || score === undefined) {
      json(res, { ok: false, error: '缺少参数' }, 400);
      return;
    }
    const lvKey = String(level);
    const lb = load('leaderboard.json');
    if (!lb[lvKey]) lb[lvKey] = [];
    const arr = lb[lvKey];
    // Find existing entry for this nickname
    const oldIdx = arr.findIndex(e => e.n === nickname);
    const entry = {
      n: nickname,
      s: score,
      k: kills,
      w: waves,
      d: new Date().toLocaleDateString('zh-CN')
    };
    if (oldIdx !== -1) {
      if (score > arr[oldIdx].s) arr[oldIdx] = entry;
    } else {
      arr.push(entry);
    }
    arr.sort((a, b) => b.s - a.s);
    lb[lvKey] = arr.slice(0, 50);
    save('leaderboard.json', lb);
    json(res, { ok: true });
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
