var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('register');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/chat', function(req, res) {
  res.render('chat');
})

router.get('/home', function(req, res) {
  res.render('home');
})
// router.get('/test', function(req, res) {
//   console.log('filter')
//   res.send('hehe')
// })

module.exports = router;
