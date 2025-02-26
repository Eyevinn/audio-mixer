const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

console.log('\x1b[33mWebsite being served on localhost:9000...\x1b[0m');
app.listen(9000);
