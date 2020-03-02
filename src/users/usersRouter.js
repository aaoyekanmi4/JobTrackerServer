const express = require('express')
const path = require('path')
const UsersService = require('./usersService');
const AuthService = require('../auth/auth-service');
const usersRouter = express.Router()
const jsonBodyParser = express.json()



usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, email, password2 } = req.body

    for (const field of ['email', 'user_name', 'password', 'password2']) {
      if (!req.body['user_name']) {
        return res.status(400).json({error:'Please enter a username'})
      }
      if (!req.body['email']){
        return res.status(400).json({
          error: `Please enter an email address`
        })
      }
      if (!req.body['password']){
        return res.status(400).json({
          error: `Please enter a password`
        })
      }
    if (!req.body['password2']) {
      return res.status(400).json({error:'Please confirm the password'})
    }
 
  }

    const passwordsDontMatch = UsersService.checkPasswordsMatch(password, password2);
    if(passwordsDontMatch) return res.status(400).json({ error: passwordsDontMatch})
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
          
        //if credentials valid and user does not exist, post user and return token
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