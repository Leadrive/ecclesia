var express = require('express');
var router = express.Router();
var Meeting = require('../modules/meeting');
var User = require('../modules/user');
var crypto = require('crypto');

router.get('/', function (req, res) {
  if(req.session.username){
      console.log(req.session.username);
      res.render('home');
  }else{
    res.redirect('/');
  }
})

router.get('/logout', function (req, res) {
  if(req.session.username){
    req.session.destroy(function(err){
        if(!err){
          res.redirect('/');
        }
    });
  }else{
    res.redirect('/');
  }
})

router.post('/join-room', function(req, res){
  var roomname = req.body.roomName;
  var host = req.body.host;
  var username = req.session.username;
  var date = req.session.date;

  req.session.host = host;
  var cryptor = crypto.createHash('sha1');
  var raw = host + roomname + date;
  var roomHash = cryptor.update(raw).digest('hex');

  
  Meeting.addParticipant (roomname, host, username, function (err, addRe){
    if(!err){
      var conference  = {
        roomName : roomname,
        host : host,
        date : date,
      };
      User.archive(username, conference, function (err, archiveRe){
        if(!err){
          return res.json({response : "join-success", roomName : roomname, creator : host, roomHash :roomHash} );
        }
      });
    }
  });
});

router.post('/create-room', function (req, res) {
  // deal with post json data 
  // { request:'create-room' username:'..', roomname:'..' }
  // ... code here
  console.log(req.body, req.session.username);
  var resInfo = "";
  if (req.body.roomName === undefined){
    resInfo = "create-failed";
    return res.json({response: resInfo});
  }else{
    req.session.roomName = req.body.roomName;
    var date = new Date();
    req.session.date = date.toDateString();
    var  newMeeting = {
      roomName : req.body.roomName,
      date : date.toDateString(),
      host : req.session.username,
      userList : [],
      ChartList:[],
      MarkdownList:[],
      SketchList:[]
    };
    var raw = newMeeting.host + newMeeting.roomName + newMeeting.date;
    var cryptor = crypto.createHash('sha1');
    var roomHash = cryptor.update(raw).digest('hex');
    console.log('hash:',roomHash);

    Meeting.createRoom(newMeeting, function (err, meeting){
      if(!err){
        resInfo = "create-success";
        
        return res.json({response:resInfo, roomName:meeting.roomName, creator: meeting.host, roomHash : roomHash});
      }
      else {
        console.log(err);
        return res.json({response: resInfo});
      }
    });
  }
});
module.exports = router;
