const express = require('express')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const AuthService = require('./auth-service')

authRouter.options('/login', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.end();
});
  authRouter
  .route('/login')
  .get((req, res) => {
      res.send('Hi')
  })
  .post( jsonBodyParser, (req, res, next) => {
     const { user_name, password } = req.body
     const loginUser = { user_name, password }
     //check that both user_name, and password fields coming in request
     for (const [key, value] of Object.entries(loginUser))
       if (value == null)
         return res.status(400).json({
           error: `Missing '${key}' in request body`
         })

//check for username in database
AuthService.getUserWithUserName(
    req.app.get('db'),
    loginUser.user_name
  )
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect user_name or password',
        })
//if user is there, compare stored password hash to hash of this password
    return AuthService.comparePasswords(loginUser.password, dbUser.password)
      .then(compareMatch => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          })

//send JWT in the response so client can use it to store to prove user is logged in
const sub = dbUser.user_name
        const payload = { user_id: dbUser.id }
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        })
       })
   })
    })

module.exports = authRouter;
