var express = require("express"),
router = express.Router(),
User = require("../models/admin-user");

/* GET all users. */
router.get('/', (req, res) => {
    User.find({}, (error, users) => {
      if (error) {
        res.status(500).send(error);
        return;
      }

        res.status(200).json(users);
    });
});



/* GET one users by username. */
router.get('/username/:username', (req, res) => {
    User.findOne({username: req.params.username}, (error, users) => {
      if (error) {
        res.status(500).send(error);
        return;
      }

        res.status(200).json(users);
    });
});

/* Create a user. */
router.post('/', (req, res) => {
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
        meta: {
            email: req.body.meta.email,
            phone: req.body.meta.phone
        }
    });

    user.save(error => {
        if (error) {
          res.status(500).send(error);
          return;
        }

        res.status(201).json({
            message: 'User created successfully'
        });
    });
});
/* GET one users by ID. */
router
  .route("/:id")
  .get((req, res) => {
    User.findById(req.params.id, (error, users) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.status(200).json(users);
    });
  })

  /* Update a user. */
  .put((req, res) => {
    User.findById(req.params.id, function(error, user) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      const data = req.body;
      if (data.name) user.name = data.name;
      if (data.username) user.username = data.username;
      if (data.admin != null) user.admin = data.admin;
      if (data.meta) user.meta = {
        email: data.meta.email,
        phone: data.meta.phone
      };
      if(data.checkPassword && data.password.trim() !== "") {
        user.password = data.password.trim();
      }

      // save the user
      user.save(function(error) {
        if (error) {
          res.status(500).send(error);
          return;
        }

        res.status(200).json({
          message: "User updated successfully"
        });
      });
    });
  })

  /* delete a user */
  .delete(function(req, res) {
    User.remove(
      {
        _id: req.params.id
      },
      function(error, user) {
        if (error) {
          res.status(500).send(error);
          return;
        }
        res.status(200).json({
          message: "User successfully deleted"
        });
      }
    );
  });

module.exports = router;