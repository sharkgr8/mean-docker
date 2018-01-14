const config = require('../../config/config');

var upload_path = config.upload_path;
var temp_path = upload_path + "tmp";
process.env.TMPDIR = temp_path; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var express = require("express"),
  router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var flow = require("./flow-node.js")(temp_path);
var fs = require('fs');
var app = express();


// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = true;

// Handle uploads through Flow.js
router.post("/upload", multipartMiddleware, function(req, res) {
//   fs.readdir(upload_path, function(err, items) {
//     console.log("Upload: ",items);
// });

// fs.readdir(temp_path, function(err, items) {
//   console.log("Temp: ",items);
// });

  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log("POST", status, original_filename, identifier);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    if (status === "done") {
      var s = fs.createWriteStream(upload_path + filename);
      s.on("finish", function() {
        // fs.readdir(upload_path, function(err, items) {
        //   console.log("Upload: ",items);
        // });
        res.status(200).send();
      });
      flow.write(identifier, s, { onDone: flow.clean, end: true });
      
    } else {
      res.status(/^(partly_done|done)$/.test(status) ? 200 : 500).send();
    }
   
  });
});

router.options("/upload", function(req, res) {
  console.log("OPTIONS");
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});

// Handle status checks on chunks through Flow.js
router.get("/upload", function(req, res) {
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log("GET", status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == "found") {
      status = 200;
    } else {
      status = 204;
    }

    res.status(status).send();
  });
});

// router.get("/download/:identifier", function(req, res) {
//   flow.write(req.params.identifier, res);
// });

module.exports = router;
