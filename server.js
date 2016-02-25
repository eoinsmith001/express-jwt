var express = require('express');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
var config = require('./config');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.set('superSecret', config.secret);
app.get('/token', function(req, res) {
  var payload = {
    user: 44,
    amount: 34.59
  };
  var token = jwt.sign(payload, app.get('superSecret'), {
    expiresInMinutes: 2
  });
  res.status(200).json({
    success: true,
    token: token
  });
});

var apiRouter = express.Router();
apiRouter.use(function(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token...'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      success : false,
      message : 'No token?'
    });
  }
});
apiRouter.route('/')
  .get(function(req,res){
    res.status(200).json({
      message: "Welcome!"
    });
  });
app.use('/api', apiRouter);
app.listen(port,function() {
  console.log('runs on', port);
});
