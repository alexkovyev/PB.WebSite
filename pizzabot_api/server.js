require('dotenv').config();
 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const utils = require('./utils');
const reqs = require('./queries/db_queries');
const discordBot = require('./bot/bot');
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const fs = require('fs');
//const pc = require('./pc/pc');
 
const app = express();
var port = 2093;
if (process.argv.length > 2) {
  port = process.argv[2] * 1;
}
 
// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// enable morgan
app.use(morgan('dev'));
const router = express.Router(); 
 

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
router.get('/', (req, res) => {
  if (!req.context) return res.status(401).json({ Error: {success: false, text: 'Invalid user to access it.', }});
});

//#region PC's qq
router.post('/pc/send_query', (req, res) => {
  const methodName = req.body.methodName;
  const JSONdata = req.body.jsondata;

  pc.sendRequest(JSON.stringify({
    cmdName: methodName,
    params: JSONdata,
  }));
});

 
//#region Users qq

const contexts = {};

// validate the user credentials
router.post('/users/signin', function (req, res) {
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
          Profile: {
            RefID: userData.userprofilerefid,
          }
        },
        Pages: userData.pages,
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

router.post('/users/update', function (req, res) {
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
    if (data && data.length === 1 && data[0]['fn_users_iu']) {
      contexts[data[0]['fn_users_iu']] = {
        User: {
          RefID: refid,
          FirstName: userfn,
          SecondName: usersn,
          LastName: userln,
          Email: useremail,
          Phone: userphone,
          RoleName: contexts[data[0]['fn_users_iu']].User.RoleName,
          Profile: contexts[data[0]['fn_users_iu']].User.Profile,
        },
        Pages: contexts[data[0]['fn_users_iu']].Pages
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
});
 
router.post('/users/select_by_point', function(req, res) {
  const point_refid = req.body.point_refid;

  successFunc = (data) => {
    if (data) {
      return res.status(200).json({Operators: data})
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Selecting was wrong',
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
    'post_operators_by_point',
    {
      point_refid
    },
    successFunc,
    errorFunc
  )
});

//#endregion


//#region Token qq

// verify the token and return it if it's valid
router.get('/verifyToken', function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  var pageName = req.body.pageName || req.query.pageName;

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
    if (!contexts[context.User.RefID] || contexts[context.User.RefID].User.RefID !== context.User.RefID) {
      return res.status(401).json({
        Error: {
          error: true,
          text: "Invalid user.",
        }
      });
    }

    // get basic context details
    contextObj = utils.getCleanContext(contexts[context.User.RefID]);

    if (contextObj.Pages.indexOf(pageName) < 0) {
      delete contexts[context.User.RefID];
      return res.status(401).json({
        Error: {
          error: true,
          text: 'Invalid page.'
        }
      });
    }
    return res.status(200).json({ context: contextObj, token });
  });
});

//#endregion
 

//#region Operator qq

router.post('/operator/add_history', function(req, res) {
  const userrefid = req.body.userrefid;
  const actiontype = req.body.actiontype;
  const actioncontent = req.body.actioncontent;
  const is_content_json = true;

  successFunc = (data) => {
    if (data && data[0]['fn_operatorhistory_i']) {
      return res.status(200).json({insertSuccess: true});
    } else {
      res.status(200).json({
        Error: {
          error: true,
          text: 'Connection is lost'
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
    'post_add_new_action',
    {
      userrefid,
      actiontype,
      actioncontent,
      is_content_json
    },
    successFunc,
    errorFunc
  )
});

router.post('/operator/action_history', function (req, res) {
  const userrefid = req.body.userrefid;
  const operationtype = req.body.operationtype;
  const datefrom = req.body.datefrom;
  const dateto = req.body.dateto;
  const last_action = req.body.last_action || false;
  const is_return_json = true;

  successFunc = (data) => {
    if (data) {
      return res.status(200).json({Operations: data});
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Something was wrong',
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
    'post_operator_action_history',
    {
      userrefid,
      operationtype,
      datefrom,
      dateto,
      is_return_json,
      last_action
    },
    successFunc,
    errorFunc
  )
});

//#endregion


//#region General fns

router.post('/general/typecodes', function (req, res) {
  const typename = req.body.typename;

  successFunc = (data) => {
    return res.status(200).json({typeCodeData: data});
  };
  errorFunc = (data) => {
    return res.status(200).json({
      Error: {
        error: true,
        text: 'Connection is lost'
      }
    });
  };

  reqs.post_data(
    'post_type_codes',
    {
      typename
    },
    successFunc,
    errorFunc
  );
});

//#endregion


//#region Cntrls

router.post('/cntrls/upd_points', (req, res) => {
  const cntrlsname = req.body.cntrlsname;
  const point_id = req.body.point_id;
  const enabled = req.body.enabled;
  const execby = req.body.execby;
  const userprofilerefid = req.body.userprofilerefid;

  successFunc = (data) => {
    if (data && data[0]['fn_updoutpoints']) {
      return res.status(200).json({isSuccess: true});
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Something was wrong',
        }
      });
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
    'post_upd_cntrl',
    {
      cntrlsname,
      point_id,
      enabled,
      execby,
      userprofilerefid,
    },
    successFunc,
    errorFunc
  );
})

router.post('/cntrls/get_points', (req, res) => {
  const cntrlsname = req.body.cntrlsname;
  const userprofilerefid = req.body.userprofilerefid;

  successFunc = (data) => {
    if (data) {
      const cntrlsJson = {};
      for(var i in data) {
        const row = data[i];
        const key = row['ui_name'];
        const id = row['id'];
        const enabled = row['enabled'];

        if (!cntrlsJson.hasOwnProperty(key)) {
          cntrlsJson[key] = [];
        };
        cntrlsJson[key].push({id, enabled});
      }

      const cntrlsArr = [];
      for(var i in cntrlsJson) {
        cntrlsArr.push({
          key: i,
          items: cntrlsJson[i],
        });
      };

      return res.status(200).json({Cntrls: cntrlsArr});
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Something was wrong',
        }
      });
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
    'post_cntrls_points',
    {
      cntrlsname,
      userprofilerefid,
    },
    successFunc,
    errorFunc
  )
});

//#endregion


//#region Points

router.post('/point/get_system_status', (req, res) => {
  const address = req.body.address;
  const userprofilerefid = req.body.userprofilerefid;

  successFunc = (data) => {
    if (data && data[0]['fn_getstatusofpoint']) {
      return res.status(200).json({Status: data[0]['fn_getstatusofpoint']})
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
    'post_system_status',
    {
      address,
      userprofilerefid
    },
    successFunc, 
    errorFunc
  );
})

router.post('/point/get_orders_status', (req, res) => {
  const point_refid = req.body.point_refid;

  successFunc = (data) => {
    if (data && data.length === 1) {
      return res.status(200).json({
        OrdersNow: data[0]['numberofordersnow'],
        OrdersToday: data[0]['numberoforderstoday'] 
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
    'post_orders_in_today',
    {
      point_refid
    },
    successFunc,
    errorFunc
  )
})

router.post('/point/get_system_statistics', (req, res) => {
  const point_refid = req.body.point_refid;

  successFunc = (data) => {
    if (data && data.length === 1) {
      return res.status(200).json({
        OrdersNow: data[0]['numberofordersnow'],
        OrdersToday: data[0]['numberoforderstoday'],
        CountOfUnavailableDishes: data[0]['numberofunavailabledishes'],
        CountOfErrors: data[0]['numberoferrors']
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
    'post_point_statistics',
    {
      point_refid,
    },
    successFunc, 
    errorFunc
  )
})

//#endregion


//#region Docs generation

router.post('/docs/generate/washing', function (req, res) {
  const datefrom = req.body.dateFrom;
  const dateto = req.body.dateTo;
  const type = req.body.type;
  const userrefid = req.body.userrefid;


  successFunc = (data) => {
    if (data) {
      const csvFromArrayOfObjects = convertArrayToCSV(data);
      if (!fs.existsSync('./docs')) {
        fs.mkdirSync('./docs');
      }
      if (!fs.existsSync('./docs/washing')) {
        fs.mkdirSync('./docs/washing');
      }
      fs.writeFileSync(`./docs/washing/from_${datefrom.toLocaleString()}_to_${dateto.toLocaleString()}.csv`, csvFromArrayOfObjects);
      discordBot.sendDocs(
        `Документ с отчетом по мойкам c ${(new Date(datefrom)).toLocaleDateString('ru-RU')}, ${(new Date(datefrom)).toLocaleTimeString('ru-RU')} до ${(new Date(dateto)).toLocaleDateString('ru-RU')}, ${(new Date(dateto)).toLocaleTimeString('ru-RU')}`,
        `./docs/washing/from_${datefrom.toLocaleString()}_to_${dateto.toLocaleString()}.csv`,
        'dev',
        true
      );
      return res.status(200);
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
    'post_generated_doc_for_washing',
    {
      userrefid,
      datefrom,
      dateto,
      type,
    }, 
    successFunc,
    errorFunc
  )
});

//#endregion


//#region STFFS

router.post('/stffs/update_balance', (req, res) => {
  const point_refid = req.body.point_refid;
  const operatorfi = req.body.operatorfi;
  const load_stff = req.body.loadSTFF;
  const unload_stff = req.body.unloadSTFF;

  var repeatable_qq = Object.keys(load_stff).length + Object.keys(unload_stff).length;
  successFunc = (data) => {
    if (data && (data[0]['fn_unloadstff'] || data[0]['fn_loadstff'])) {
      repeatable_qq -= 1;
      if (repeatable_qq === 0) {
        return res.status(200).json({isSuccess: true});
      }
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

  for(var i in unload_stff) {
    reqs.post_data(
      'post_unload_container', 
      {
        operatorfi,
        container_refid: unload_stff[i],
      },
      successFunc,
      errorFunc
    );
  }
  for(i in load_stff) {
    for(var j in load_stff[i]) {
      reqs.post_data(
        'post_load_container',
        {
          operatorfi,
          container_codename: i,
          cell_codename: j,
          stff_refid: load_stff[i][j]
        },
        successFunc,
        errorFunc
      )
    }
  }
});

router.post('/stffs/get_all_stff', (req, res) => {
  const point_refid = req.body.point_refid;

  successFunc = (data) => {
    if (data) {
      return res.status(200).json({StffsByNames: data});
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
    'post_all_stffs',
    {
      point_refid
    },
    successFunc,
    errorFunc
  )
})

router.post('/stffs/get_count_of_stffs', (req, res) => {
  const point_refid = req.body.point_refid;

  successFunc = (data) => {
    if (data) {
      return res.status(200).json({STFFCount: data});
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
    'post_stffs_count', 
    {
      point_refid
    },
    successFunc,
    errorFunc
  )
})

router.post('/stffs/get_fridge_map', (req, res) => {
  const point_refid = req.body.point_refid;

  successFunc = (data) => {
    if (data) {
      const fridgeMapJson = {};
      for(var i in data) {
        var row = data[i];
        var codename = row['codename'];
        var refid = row['refid'];
        var key = codename[0];

        if (!fridgeMapJson.hasOwnProperty(key)) {
          fridgeMapJson[key] = [];
        }
        fridgeMapJson[key].push({codename, refid});
      }

      const fridgeMapArr = [];
      for(var i in fridgeMapJson) {
        fridgeMapArr.push({
          key: i,
          items: fridgeMapJson[i]
        });
      }

      return res.status(200).json({
        FridgeMap: fridgeMapArr,
      })
    } else {
      return res.status(200).json({
        Error: {
          error: true,
          text: 'Something was wrong',
        }
      });
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
    'post_fridge_map',
    {
      point_refid
    },
    successFunc,
    errorFunc
  )
})

//#endregion

if (port === 4000) {
  app.use('/api', router);
  app.listen(port, () => {
    console.log('Server started on: ' + port);
  });
} else {
  module.exports = router;
}
