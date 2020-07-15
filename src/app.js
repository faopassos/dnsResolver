const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(4000, () => {
  console.log('**Running on port 4000**');
});
