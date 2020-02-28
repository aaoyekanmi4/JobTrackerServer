const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Jobs Endpoints", function() {
  let db;

  const { testUsers, testJobs, testContacts } = helpers.makeJobsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/jobs`, () => {
    context(`Given no jobs`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 200 and an empty list`, () => {
        console.log(helpers.makeAuthHeader(testUsers[0]));
        return supertest(app)
          .get("/api/jobs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))

          .expect(200, []);
      });
     
    });

    context("Given there are jobs in the database", () => {
      beforeEach("insert jobs", () =>
        helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
      );

      it("responds with 200 and all of the jobs", () => {
        const expectedJobs = testJobs.map(job =>
          helpers.makeExpectedJob(testUsers, job, testContacts)
        );
        return supertest(app)
          .get("/api/jobs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedJobs);
      });
    });
    context(`Given an XSS attack job`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousJob, expectedJob } = helpers.makeMaliciousJob(testUser);

      beforeEach("insert malicious job", () => {
        return helpers.seedMaliciousJob(db, testUser, maliciousJob);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/jobs`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].job_description).to.eql(
              expectedJob.job_description
            );
            expect(res.body[0].job_role).to.eql(expectedJob.job_role);
          });
      });
    });
  });

  describe(`GET /api/jobs/:job_id`, () => {
    context(`Given no jobs`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 404`, () => {
        const jobId = 123456;
        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Job doesn't exist` });
      });
      it(`responds with 404 on delete`, () => {
        const jobId = 123456
        return supertest(app)
          .delete(`/api/jobs/${jobId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Job doesn't exist` })
      })
    });

    context("Given there are jobs in the database", () => {
      beforeEach("insert jobs", () =>
        helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
      );

      it("responds with 200 and the specified job", () => {
        const jobId = 2;
        const expectedJob = helpers.makeExpectedJob(
          testUsers,
          testJobs[jobId - 1],
          testContacts
        );

        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedJob);
      });
      it(`deletes job from database`, () => {
        const jobId = 2;
        const expectedJobs = testJobs.map(job =>
          helpers.makeExpectedJob(testUsers, job, testContacts)
        );
        const jobsWithDelete = expectedJobs.filter(job => job.id !==jobId);
      
        return supertest(app)
          .delete(`/api/jobs/${jobId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res=> 
            supertest(app)
            .get('/api/jobs')
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, jobsWithDelete)
          )
      })
    });

    describe(`GET /api/contacts/job/:job_id`, () => {
      context(`Given an XSS attack job`, () => {
        const testUser = helpers.makeUsersArray()[1]
        const {
          maliciousJob,
          expectedJob,
        } = helpers.makeMaliciousJob(testUser)
  
        beforeEach('insert malicious job', () => {
          return helpers.seedMaliciousJob(
            db,
            testUser,
            maliciousJob,
          )
        })
  
        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/jobs/${maliciousJob.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(200)
            .expect(res => {
              expect(res.body.job_role).to.eql(expectedJob.job_role)
              expect(res.body.job_description).to.eql(expectedJob.job_description)
            })
        })
      })
    
  
      context(`Given no jobs`, () => {
        beforeEach(() => helpers.seedUsers(db, testUsers));
        it(`responds with 404 on patch request`, () => {
                 const jobId = 1
                 return supertest(app)
                   .patch(`/api/jobs/${jobId}`)
                   .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                   .expect(404, { error: `Job doesn't exist` })
               })
        it(`responds with 404 get request`, () => {
          const jobId = 123456;
          return supertest(app)
            .get(`/api/contacts/job/${jobId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Job doesn't exist` });
        });
      });

      context("Given there are contacts for job in the database", () => {
        beforeEach("insert jobs", () =>
          helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
        );

        it("responds with 200 and the specified contacts", () => {
          const jobId = 1;
          const expectedContacts = helpers.makeExpectedJobContacts(
            testUsers,
            jobId,
            testContacts
          );

          return supertest(app)
            .get(`/api/contacts/job/${jobId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedContacts);
        });
      });
    });
  });
  describe("PATCH /api/jobs/:job_id", ()=> {
    context("Given there are contacts for job in the database", () => {
 
  

 
  
     
    beforeEach("insert jobs", () =>
    helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
  );
      
      it('responds with 204 and the updated job', ()=>{
        const jobId = 1;
        const jobValues = {
          company:"Floyd's",
          job_role: "Plumber",
          job_location: "Miami"
        
        };
        const revisedJob = {
               ...testJobs[jobId - 1],
               ...jobValues
             }
        const expectedJob = helpers.makeExpectedJob(testUsers,revisedJob)
        return supertest(app)
        .patch(`/api/jobs/${jobId}`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(jobValues)
        .expect(204)
        .then(res => 
          supertest(app)
          .get(`/api/jobs/${jobId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedJob)
          )
        

      })
    })
  })

  describe("POST /api/jobs", () => {
    beforeEach(() => helpers.seedUsers(db, testUsers));
    it("responds 400 when company not provided", () => {
      const job = {
        //company:"Floyd's",
        job_role: "Plumber",
        job_location: "Miami"
      };

      return supertest(app)
        .post("/api/jobs")
        .send(job)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: "Missing required value: company" });
    });

    it("responds 400 when role not provided", () => {
      const job = {
        company: "Floyd's",
        // job_role:"Plumber",
        job_location: "Miami"
      };

      return supertest(app)
        .post("/api/jobs")
        .send(job)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: "Missing required value: job_role" });
    });

    it("responds 400 when job_location not provided", () => {
      const job = {
        company: "Floyd's",
        job_role: "Plumber"
        //job_location:"Miami",
      };

      return supertest(app)
        .post("/api/jobs")
        .send(job)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: "Missing required value: job_location" });
    });
    it("adds a new job to the database", () => {
      const job = {
        company: "Appy",
        job_role: "Programmer",
        job_location: "Austin, TX",
        job_description: "I program the computers.",
        found_at: "indeed.com",
        applied: null,
        phone_screen: null,
        interview: null,
        offer: "20000",
        user_id: 1
      };
      return supertest(app)
        .post(`/api/jobs`)
        .send(job)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.company).to.eql(job.company);
          expect(res.body.job_role).to.eql(job.job_role);
          expect(res.body.job_location).to.eql(job.job_location);
          expect(res.body.job_description).to.eql(job.job_description);
          expect(res.body.found_at).to.eql(job.found_at);
          expect(res.body.applied).to.eql(job.applied);
          expect(res.body.interview).to.eql(job.interview);
          expect(res.body.offer).to.eql(job.offer);
          expect(res.body.user_id).to.eql(job.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/jobs/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/jobs/${res.body.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(res.body)
        );
    });
  });
});
