const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeJobsArray }= require('./jobs.fixtures');
describe("Jobs Endpoints", function() {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("jobs").truncate());
  afterEach("cleanup", () => db("jobs").truncate());
  context(`Given no jobs`, () => {
    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get("/api/jobs")
        .expect(200, []);
    });
  });
  context("Given there are jobs in the database", () => {
   const testJobs = makeJobsArray();
    beforeEach("insert jobs", () => {
      return db.into("jobs").insert(testJobs);
    });

    it("GET /api/jobs responds with 200 and all of the jobs", () => {
      return supertest(app)
        .get("/api/jobs")
        .expect(200, testJobs);
    });
  });
  describe(`GET /api/jobs/:job_id`, () => {
    context(`Given no jobs`, () => {
      it(`responds with 404`, () => {
        const jobId = 123456;
        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .expect(404, { error: { message: `Job doesn't exist` } });
      });

      context("Given there are jobs in the database", () => {
        const testJobs = makeJobsArray();

        beforeEach("insert jobs", () => {
          return db.into("jobs").insert(testJobs);
        });
        it("GET /api/jobs/:job_id responds with 200 and the specified job", () => {
          const jobId = 2;
          const expectedJob = testJobs[jobId - 1];
          return supertest(app)
            .get(`/api/jobs/${jobId}`)
            .expect(200, expectedJob);
        });
      });
    });
  });
   describe(`POST /api/jobs`, () => {
       it(`creates a job, responding with 201 and the new job`,  function() {
         const newJob = {
          company: 'Company post test',
          job_role: 'test role',
          job_location: 'test location',
          applied:true
         }
         return supertest(app)
           .post('/api/jobs')
           .send(newJob)
           .expect(201)
                  .expect(res => {
                     expect(res.body.company).to.eql(newJob.company)
                     expect(res.body.job_role).to.eql(newJob.job_role)
                     expect(res.body.job_location).to.eql(newJob.job_location)
                     expect(res.body).to.have.property('id')
                   })
       })
     })
});
