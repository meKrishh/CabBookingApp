import auth from "../middleware/auth";
const bcrypt = require("bcrypt");
import user from "../models/user"
import {
  v4 as uuidv4
} from 'uuid'
import config from 'config';
import jwt from 'jsonwebtoken';
const express = require("express");
const router = express.Router();

router.get("/current", auth, async (req, res) => {
  const users = await user.findById(req.user._id).select("-password");
  res.send(users);
});

router.post("/", async (req, res) => {

  //find an existing user
  let users = await user.findOne({ email: req.body.email });
  if (users) return res.status(400).send("User already registered.");

  const idMap = uuidv4()
  users = new user({
    _id: idMap,
    userName: req.body.userName,
    email: req.body.email,
    contact: req.body.contact,
    password: req.body.password,
    isAdmin: req.body.isAdmin
  });
  users.password = await bcrypt.hash(users.password, 10);
  await users.save();

  const token = jwt.sign({ _id: users._id, isAdmin: users.isAdmin }, config.get('myprivatekey'));
  res.header("x-auth-token", token).send({
    _id: users._id,
    userName: users.userName,
    email: users.email,
    contact: users.contact
  });
});

module.exports = router;