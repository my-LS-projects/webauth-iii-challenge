const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const usersRouter = require('../database/users/users-router')

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', usersRouter)

server.get('/', ( req, res ) => {
    res.status(200).json({ message: "api running" })
})

module.exports = server;