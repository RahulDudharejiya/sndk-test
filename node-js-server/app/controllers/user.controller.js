const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.update = (req, res) => {
  const { username, firstname, lastname, profileImg, email } = req.body;
  const userId = req.body.id;

  User.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        firstname,
        lastname,
        profileImg,
        email,
      },
    },
    { new: true }, // Returns the updated document
    (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        res.status(404).send({ message: "User not found." });
        return;
      }

      User.findOne({ _id: user._id })
        .populate("roles", "-__v")
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          var authorities = user.roles.map(
            (role) => "ROLE_" + role.name.toUpperCase()
          );

          res.status(200).send({
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            roles: authorities,
          });
        });
    }
  );
};
