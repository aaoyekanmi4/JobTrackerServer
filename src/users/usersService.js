const bcrypt = require('bcryptjs')
const xss = require('xss')

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  checkPasswordsMatch(password,password2) {
     if (password !== password2) return 'Passwords do not match'
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }

    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      email: xss(user.email),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    }
  },
}

module.exports = UsersService