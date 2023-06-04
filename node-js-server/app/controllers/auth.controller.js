const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const multer = require("multer");
const path = require("path");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Define storage for profile images
const relativePath = path.resolve(__dirname, "../uploads");
const storage = multer.diskStorage({
  // Example: Resolve a relative path based on the current directory
  destination: function (req, file, cb) {
    cb(null, relativePath); // Specify the destination folder where the images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension); // Generate a unique filename for the uploaded image
  },
});

// Create an instance of the multer middleware
const upload = multer({ storage: storage });

exports.signup = (req, res) => {
  // Use the 'upload' middleware to handle the profileImg field
  const uploadMiddleware = upload.single("profileImg");

  // Call the upload middleware to handle the file upload
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.log(err, "error");
      res.status(500).send({ message: "Failed to upload profile image." });
      return;
    }

    const user = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      profileImg: req.file.filename,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              res.send({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;
      console.log(user);
      res.status(200).send({
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profileImg: user.profileImg,
        roles: authorities,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
