require('dotenv').config();

var Nexmo = require('nexmo');
var nexmo = new Nexmo({
    apiKey: process.env['NEXMO_API_KEY'],
    apiSecret: process.env['NEXMO_API_SECRET'],
    applicationId: process.env['NEXMO_APP_ID'],
    privateKey: process.env['NEXMO_APP_FILE_NAME']
  });

var topics = {}
topics[process.env['INBOUND_NUMBER_1']] = 'the summer offer';
topics[process.env['INBOUND_NUMBER_2']] = 'the winter offer';

var conferenceID = 0;

module.exports = function(app){
  app.get('/answer_inbound', function(req, res) {
    conferenceID++;

    nexmo.calls.create({
      to: [{
        type: 'phone',
        number: process.env['CALL_CENTER_NUMBER']
      }],
      from: {
        type: 'phone',
        number: req.query.to
      },
      answer_url: [
        'http://'+process.env['DOMAIN']+'/answer_outbound?conference_id='+conferenceID
      ]
    }, function(err, suc) {
      // console.log("Error:", err);
      // console.log("Success:", suc);

      if(suc) {
        res.json([
          {
            "action": "talk",
            "text": "Please wait while we connect you"
          },
          {
            "action": "conversation",
            "name": "conversation-"+conferenceID,
            "startOnEnter": "false",
            "musicOnHoldUrl": ["https://nexmo-community.github.io/ncco-examples/assets/phone-ringing.mp3"]
          }
        ]);
        console.log("Success:",suc)
      }

      if(err) {
        console.log("Error",err);
      }
    });
  });

  app.get('/answer_outbound', function(req, res) {
    var topic = topics[req.query.from];

    res.json([
      {
        "action": "talk",
        "text": "Incoming call regarding "+topic
      },
      {
        "action": "conversation",
        "name": "conversation-"+req.query.conference_id
      }
    ]);
  });

  app.post('/event', function(req, res) {
    // console.log(req.body);
  });
};
