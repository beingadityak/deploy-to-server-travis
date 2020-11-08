require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var user = require('./app/models/user');

var port = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology: true});
app.set('superSecret',process.env.JWT_SECRET);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var apiRoutes = express.Router();

app.get('/',function(req,res){
        res.json({'message':'Hello ! Welcome to the api !!'});
});

app.get('/setup',function(req,res){
        var aditya = new user({
            name : 'beingadityak',
            password : 'aditya1234'
        });
        aditya.save(function(err){
            if(err)
            {
                res.json({status:500,message:'Setup error !'});
                console.log(err);
            }
            res.json({status:200,message:'Setup completed successfully !'});
            console.log('Setup Success !');
        });
});

apiRoutes.post('/auth',function(req,res){
    user.findOne({
        name : req.body.name
    },function(err,user){
        if(err)
        {
            console.log(err);
            res.json({status:500,message:'authentication error!'});
        }
        else if(!user)
        {
            res.json({status:403,message:'authentication failed',reason:'no such user'});
        }
        else if(user)
        {
            if(user.password != req.body.password)
            {
                res.json({status:403,message:'authentication failed',reason:'wrong password'});
            }
            else
            {
                var token = jwt.sign(user.toJSON(),app.get('superSecret'),{
                        expiresIn : '2h'
                });

                res.json({
                    status: 200,
                    token: token
                });
            }
        }
    });
});

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

//protection middleware...

apiRoutes.use(function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token)
    {
        jwt.verify(token,app.get('superSecret'),function(err,decoded){
            if(err)
            {
                return res.json({status:403,message:'authentication failed',reason:'token error'});
            }
            else
            {
                req.decoded = decoded;
                next();
            }
        });
    }
    else
    {
        return res.status(403).send({
            status:403,
            message:'no token provided'
        })
    }
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  user.find({}, function(err, users) {
    res.json(users);
  });
}); 


app.use('/api',apiRoutes);

app.listen(port);
console.log('App running on : '+port);