const express = require('express');

const PORT = 80;
const app = express();

app.use('/', express.static(`${__dirname}/dist`));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);