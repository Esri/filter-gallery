const express = require('express');

const PORT = 5555;
const app = express();

app.use('/', express.static(`${__dirname}/dist`));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);