const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app');

describe('Jobs Endpoints', function() {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('jobs').truncate())
     context('Given there are jobs in the database', () => {
         const testJobs = [
           {
            id: 1,
            company: 'Appy',
            job_role: 'Programmer',
            date_created:null,
            job_description: 'I program the computers.',

    
           },
           {
            id: 2,
            company: 'MIB',
            job_role: 'Code Ninja',
            date_created:null,
            job_description: 'Hiyaaaa!',

    
           },
           {
            id: 3,
            company: 'The Space Force',
            job_role: 'Super Secret Role',
            date_created:null,
            job_description: 'Confidential and Secret',
       
           },
         ];
    
         beforeEach('insert jobs', () => {
           return db
             .into('jobs')
             .insert(testJobs)
         })
   
          it('GET /api/jobs responds with 200 and all of the jobs', () => {
             return supertest(app)
               .get('/api/jobs')
               .expect(200, testJobs)
           })

})
})