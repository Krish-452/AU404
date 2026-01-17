const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);


app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  }).catch(err => {
  console.error('Failed to sync database:', err);
});