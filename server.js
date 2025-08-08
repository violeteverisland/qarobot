const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const COMMENT_FILE = path.join(__dirname, 'comments.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));   // 把 public/ 映射成根目录

// 读评论
function readComments() {
  if (!fs.existsSync(COMMENT_FILE)) return [];
  return JSON.parse(fs.readFileSync(COMMENT_FILE, 'utf8'));
}

// 写评论
function writeComments(list) {
  fs.writeFileSync(COMMENT_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// 接口
app.get('/api/comments', (req, res) => {
  res.json(readComments());
});

app.post('/api/comment', (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) return res.status(400).send('missing fields');
  const list = readComments();
  list.unshift({ name, text, time: new Date().toLocaleString('zh-CN') });
  writeComments(list);
  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));