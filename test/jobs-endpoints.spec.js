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
  describe('POST /api/jobs', () => {
    beforeEach(() =>
 
      helpers.seedUsers(db, testUsers)
     )
     it('responds 400 when company not provided', () => {
       
       const job = {
         //company:"Floyd's",
         job_role:"Plumber", 
         job_location:"Miami"
       }

       return supertest(app)
       .post('/api/jobs')
       .send(job)
       .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
       .expect(400, {error:'Missing required value: company'})
     })

     it('responds 400 when role not provided', () => {
      
      const job = {
        company:"Floyd's",
       // job_role:"Plumber", 
        job_location:"Miami"
      }

      return supertest(app)
      .post('/api/jobs')
      .send(job)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(400, {error:'Missing required value: job_role'})
    })

    it('responds 400 when job_location not provided', () => {
      
      const job = {
        company:"Floyd's",
        job_role:"Plumber", 
        //job_location:"Miami",

      }

      return supertest(app)
      .post('/api/jobs')
      .send(job)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(400, {error:'Missing required value: job_location'})
    })
    it('adds a new job to the database', () => {
     const job = {
      company: "Appy",
      job_role: "Programmer",
      job_location: "Austin, TX",
      job_description: "I program the computers.",
      found_at: "indeed.com",
      applied: null,
      phone_screen: null,
      interview: null,
      offer: '20000',
      user_id:1
        
      }
      return supertest(app)
        .post(`/api/jobs`)
        .send(job)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.company).to.eql(job.company)
          expect(res.body.job_role).to.eql(job.job_role)
          expect(res.body.job_location).to.eql(job.job_location)
          expect(res.body.job_description).to.eql(job.job_description)
          expect(res.body.found_at).to.eql(job.found_at)
          expect(res.body.applied).to.eql(job.applied)
          expect(res.body.interview).to.eql(job.interview)
          expect(res.body.offer).to.eql(job.offer)
          expect(res.body.user_id).to.eql(job.user_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/jobs/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/jobs/${res.body.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(res.body)
        )
    })
  })
})