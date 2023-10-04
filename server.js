const express = require('express');

const app = express();

app.use(express.static('public'));

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});