var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
var apiRouter = express.Router();
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
