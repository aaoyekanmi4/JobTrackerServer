const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Jobs Endpoints', function() {
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

  describe(`GET /api/jobs`, () => {
  
    context(`Given no jobs`, () => {
      beforeEach(() =>
 
      helpers.seedUsers(db, testUsers)
     )
      it(`responds with 200 and an empty list`, () => {
        console.log(helpers.makeAuthHeader(testUsers[0]))
        return supertest(app)
        
          .get('/api/jobs')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
         
          .expect(200, [])
      })
    })

    context('Given there are jobs in the database', () => {
  
      beforeEach('insert jobs', () =>
        helpers.seedJobsTables(
          db,
          testUsers,
          testJobs,
          testContacts,
        )
      )

      it('responds with 200 and all of the jobs', () => {
        const expectedJobs = testJobs.map(job =>
          helpers.makeExpectedJob(
            testUsers,
            job,
            testContacts,
          )
        )
        return supertest(app)
          .get('/api/jobs')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedJobs)
      })
    })

   

  describe(`GET /api/jobs/:job_id`, () => {
    context(`Given no jobs`, () => {
      beforeEach(() =>
 
      helpers.seedUsers(db, testUsers)
     )
      it(`responds with 404`, () => {
        const jobId = 123456
        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Job doesn't exist` })
      })
    })

    context('Given there are jobs in the database', () => {
      beforeEach('insert jobs', () =>
        helpers.seedJobsTables(
          db,
          testUsers,
          testJobs,
          testContacts,
        )
      )

      it('responds with 200 and the specified job', () => {
        const jobId = 2
        const expectedJob = helpers.makeExpectedJob(
          testUsers,
          testJobs[jobId - 1],
          testContacts,
        )

        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedJob)
      })
    })


  describe(`GET /api/contacts/job/:job_id`, () => {
    context(`Given no jobs`, () => {
      beforeEach(() =>
 
      helpers.seedUsers(db, testUsers)
     )
      it(`responds with 404`, () => {
        const jobId = 123456
        return supertest(app)
          .get(`/api/contacts/job/${jobId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Job doesn't exist` })
      })
    })

    context('Given there are contacts for job in the database', () => {
      beforeEach('insert jobs', () =>
        helpers.seedJobsTables(
          db,
          testUsers,
          testJobs,
          testContacts,
        )
      )

      it('responds with 200 and the specified contacts', () => {
        const jobId = 1
        const expectedContacts = helpers.makeExpectedJobContacts(
          testUsers, jobId, testContacts
        )

        return supertest(app)
        .get(`/api/contacts/job/${jobId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedContacts)
      })
    })
  })
})
  })
})