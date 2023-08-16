const express = require('express'); 
const cors = require("cors");
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.static('public'));

app.set('views', __dirname + '/views')

app.get('/public/css/style.css', function(req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'public', 'css', 'style.css'));
});

app.get('/public/js/main.js', function(req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'js', 'main.js'));
});


// routes
const router = require("./routes/home");

app.use('/', router)

const PORT = 5000;

app.use(cors());
app.listen(process.env.PORT || PORT, () => console.log(`server is running on port ${PORT}`));