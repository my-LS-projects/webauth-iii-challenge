const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./users-model");

// for use in endpoints beginning with /api/auth/
router.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(500).json({ message: "could not get users" }));
});

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(registered => res.status(201).json(registered))
    .catch(error => res.status(500).json({ error: "could not register user" }));
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = getJwtToken(user.username);
        res
          .status(200)
          .json({ message: `Welcome back, ${user.username}`, token });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(error => res.status(500).json({ error: "error logging in" }));
});

router.get("/logout", (req, res) => {
  return console.log("hello");
});

function getJwtToken(username, department) {
  const payload = {
    username,
    department
  };

  const secret = process.env.JWT_SECRET || "rapper viper";

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secret, options);
}

function restricted(req, res, next) {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || "rapper viper";
  if (token) {
    // check that token is valid
    jwt.verify(token, secret, (error, decodedToken) => {
      error ? res.status(401).json({ message: "no" }) : next();
    });
  } else {
      res.status(400).json({ message: "no credentials provided" })
  }
}

module.exports = router;
