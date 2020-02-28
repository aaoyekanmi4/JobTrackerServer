const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Contacts Endpoints', function() {
  let db

  const {
    testUsers,
    testJobs,
    testContacts,
  } = helpers.makeJobsFixtures()

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
  describe('GET /api/contacts/:contact_id', ()=> {
      context('Given no contacts in the database,', ()=> {
        beforeEach(() => helpers.seedUsers(db, testUsers));
          it('returns 404 not found', ()=> {
              const contactId = 123456;
              return supertest(app)
              .get(`/api/contacts/${contactId}`)
              .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
              .expect(404, {error: "Contact doesn't exist"})
          })
          
      })
      context('Given there are contacts in the database', () => {
          beforeEach(()=>helpers.seedJobsTables(db, testUsers, testJobs, testContacts))
          it('returns 200 and the desired contact', ()=> {
              const contactId = testContacts[0].id;
              const expectedContact = helpers.makeExpectedContact(
                testContacts[contactId - 1]
              );
              return supertest(app)
              .get(`/api/contacts/${contactId}`)
              .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
              .expect(200, expectedContact)
          })
          it('returns 404 if contact not in database', ()=> {
            const contactId = 123456;
            return supertest(app)
            .get(`/api/contacts/${contactId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(404, {error: "Contact doesn't exist"})
          })
      
      })
  })

})