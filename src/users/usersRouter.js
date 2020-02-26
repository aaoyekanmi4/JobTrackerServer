const express = require('express')
const path = require('path')
const UsersService = require('./usersService');
const AuthService = require('../auth/auth-service');
const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, email } = req.body

    for (const field of ['email', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })


    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              email,
              date_created: 'now()',
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                const sub = user.user_name
                const payload = { user_id: user.id }
      
                res
                  .status(201)
               
                  
                  .send({
                    authToken: AuthService.createJwt(sub, payload),
                  })
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter