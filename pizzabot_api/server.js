<<<<<<< HEAD
require('dotenv').config();
 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const utils = require('./utils');
const reqs = require('./queries/db_queries');
 
const app = express();
const port = process.env.PORT || 4000;
 
// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// enable morgan
app.use(morgan('dev'));
 
 
//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue
 
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        Error: {
          error: true,
          text: "Invalid user.",
        }
      });
    } else {
      req.context = context; //set the user to req so other routes can use it
      next();
    }
  });
});
 
// request handlers
app.get('/', (req, res) => {
  if (!req.context) return res.status(401).json({ Error: {success: false, text: 'Invalid user to access it.', }});
});

 
//#region Users qq

const contexts = {};

// validate the user credentials
app.post('/users/signin', function (req, res) {
  const user = req.body.login;
  const pwd = req.body.password;

  successFunc = (data) => {
    if (data && Array.isArray(data) && data.length === 1) {
      const userData = data[0];
      const context = {
        User: {
          RefID: userData.userrefid,
          FirstName: userData.userfn,
          SecondName: userData.usersn,
          LastName: userData.userln,
          RoleName: userData.rolename,
          Email: userData.useremail,
          Phone: userData.userphone,
        }
      };

      contexts[context.User.RefID] = context;

      // generate token
      const token = utils.generateToken(context);
      // get basic user details
      const contextObj = utils.getCleanContext(context);
      // return the token along with user details
      return res.status(200).json({context: contextObj, token});
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Invalid login or password.'
        }
      })
    }
  };
  errorFunc = (err) => {
    console.log('Error: ', err);
  }

  contextData = reqs.post_data(
    'post_context_for_user', 
    {
      login: user,
      pwd: pwd,
    }, 
    successFunc, 
    errorFunc
  );
});

app.post('/users/update', function (req, res) {
  const refid = req.body.refid;
  const userfn = req.body.userfn;
  const usersn = req.body.usersn;
  const userln = req.body.userln;
  const useremail = req.body.useremail;
  const userphone = req.body.userphone;
  const userpwd = req.body.oldpwd;
  const usernewpwd = req.body.newpwd;
  const execby = req.body.execby;

  successFunc = (data) => {
    console.log(data);
    console.log(data[0]['fn_users_iu']);
    if (data && data.length === 1 && data[0]['fn_users_iu']) {
      contexts[data[0]['fn_users_iu']] = {
        RefID: refid,
        FirstName: userfn,
        SecondName: usersn,
        LastName: userln,
        Email: useremail,
        Phone: userphone,
        RoleName: contexts[data[0]['fn_users_iu']].RoleName
      };
      return res.status(200).json({isSuccess: true});
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Updating was rollbacked',
        }
      })
    }
  };
  errorFunc = (data) => {
    return res.status(200).json({
      Error: {
        error: true,
        text: 'Connection is lost'
      }
    })
  };

  reqs.post_data(
    'post_new_user_info',
    {
      refid,
      userfn,
      usersn,
      userln,
      useremail,
      userphone,
      userpwd,
      usernewpwd,
      execby,
      type: 'U',
    },
    successFunc,
    errorFunc
  );
})
 
//#endregion


//#region Token qq

// verify the token and return it if it's valid
app.get('/verifyToken', function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      Error: {
        error: true,
        text: "Token is required.",
      }
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, context) {
    if (err) return res.status(401).json({
      Error: {
        error: true,
        text: "Invalid token.",
      }
    });
 
    // return 401 status if the userId does not match.
    if (contexts[context.User.RefID].User.RefID !== context.User.RefID) {
      return res.status(401).json({
        Error: {
          error: true,
          text: "Invalid user.",
        }
      });
    }
    // get basic context details
    var contextObj = utils.getCleanContext(contexts[context.User.RefID]);
    return res.status(200).json({ context: contextObj, token });
  });
});

//#endregion
 
app.listen(port, () => {
  console.log('Server started on: ' + port);
});
=======
let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
const PORT = 3001;

let pool = new pg.Pool({
    port: 5432,
    password: 'lhi5rgDabV14684h',
    database: 'devvarimzharim_pizzabot_dev',
    max: '10',
    host: 'postgresql.devvarimzharim.myjino.ru',
    user: 'devvarimzharim_pizzabot_dev',
});

pool.connect((err, db, done) => {
    if (err) {
        return console.log(err);
    } else {
        db.query('INSERT INTO Users ()')
    }
})

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

>>>>>>> master
