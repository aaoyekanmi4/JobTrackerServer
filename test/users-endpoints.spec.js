const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken');

describe.only('Users Endpoints', function() {
  let db

  const  testUsers  = helpers.makeUsersArray()
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['user_name', 'password', 'email', 'password2']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
          email: 'test email',
          password2: 'test password',
        }

        const errorMessagesByField = {
            user_name:'Please enter a username',
            password:'Please enter a password',
            email:'Please enter an email address',
            password2:'Please confirm the password'
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
                error:errorMessagesByField[field]
            })
        })
           it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                 const userShortPassword = {
                   user_name: 'test user_name',
                   password: '1234567',
                   email: 'test email',
                   password2:'1234567'
                 }
                 return supertest(app)
                   .post('/api/users')
                   .send(userShortPassword)
                   .expect(400, { error: `Password must be longer than 8 characters` })
               })

         it(`responds 400 'Passwords do not match'`, ()=> {
             const passwordMismatch = {
                 user_name:'test user_name',
                 password:'12345678',
                 email:'test email',
                 password2:'a1234567'
             }
             return supertest(app)
             .post('/api/users')
             .send(passwordMismatch)
             .expect(400, {error: 'Passwords do not match'})
         })
            it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
                 const duplicateUser = {
                   user_name: testUser.user_name,
                   password: '11AAaa!!',
                   email: 'test email',
                   password2:'11AAaa!!'
                 }
                 return supertest(app)
                   .post('/api/users')
                   .send(duplicateUser)
                   .expect(400, { error: `Username already taken` })
               })

        
      })
      
      it('responds 200 and with the jwt token', ()=> {
        const validUser = {
            user_name:'BossMode76',
            password:'1233jkl;',
            password2:'1233jkl;',
            email:'test email'

        }
        const nextId = testUsers[testUsers.length -1].id + 1;
        console.log(nextId);
        const expectedToken = jwt.sign(
         { user_id: nextId }, // payload
         process.env.JWT_SECRET,
         {
           subject: validUser.user_name,
           algorithm: 'HS256',
         }
       )
        return supertest(app)
        .post('/api/users')
        .send(validUser)
        .expect(201, {
            authToken: expectedToken
        })
    })
    })
  })
})