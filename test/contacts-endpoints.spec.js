const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Contacts Endpoints", function() {
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
  describe("GET /api/contacts/:contact_id", () => {
    context("Given no contacts in the database,", () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it("returns 404 not found", () => {
        const contactId = 123456;
        return supertest(app)
          .get(`/api/contacts/${contactId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: "Contact doesn't exist" });
      });
    });
    context("Given there are contacts in the database", () => {
      beforeEach(() =>
        helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
      );
      it("returns 200 and the desired contact", () => {
        const contactId = testContacts[0].id;
        const expectedContact = helpers.makeExpectedContact(
          testContacts[contactId - 1]
        );
        return supertest(app)
          .get(`/api/contacts/${contactId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedContact);
      });
      it("returns 404 if contact not in database", () => {
        const contactId = 123456;
        return supertest(app)
          .get(`/api/contacts/${contactId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: "Contact doesn't exist" });
      });
    });
  });
  describe("POST /api/contacts/job/job:id", () => {
    beforeEach(() =>
      helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
    );
    it("responds 400 when name not provided", () => {
      const contact = {
        // name:"Matt C",
        role: "Head of Design"
      };

      return supertest(app)
        .post("/api/contacts/job/1")
        .send(contact)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: "Missing required value: name" });
    });

    it("responds 400 when role not provided", () => {
      const contact = {
        name: "Matt C"
        // role: "Head of Design",
      };

      return supertest(app)
        .post("/api/contacts/job/1")
        .send(contact)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(400, { error: "Missing required value: role" });
    });

    it("adds a new contact to the database", () => {
      const contact = {
        id: 1,
        name: "test-contact-1",
        role: "test-role-1",
        email: "test@email1.com",
        phone: "9999999999",
        contact_url: "linkedin.com",
        last_contacted: null,
        job_id: testJobs[0].id,
        user_id: testUsers[0].id,
        date_created: new Date("2029-01-22T16:28:32.615Z")
      };
      return supertest(app)
        .post(`/api/contacts/job/1`)
        .send(contact)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(contact.name);
          expect(res.body.role).to.eql(contact.role);
          expect(res.body.email).to.eql(contact.email);
          expect(res.body.phone).to.eql(contact.phone);
          expect(res.body.contact_url).to.eql(contact.contact_url);
          expect(res.body.last_contacted).to.eql(contact.last_contacted);
          expect(res.body.job_id).to.eql(contact.job_id);
          expect(res.body.user_id).to.eql(contact.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/contacts/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/contacts/${res.body.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(res.body)
        );
    });
  });
  describe("PATCH /api/contacts/:contact_id", () => {
    context("Given there are contacts for jobs in the database", () => {
      beforeEach("insert jobs", () =>
        helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
      );

      it("responds with 204 and updates the contact", () => {
        const contactId = 1;
        const contactValues = {
          name: "Matt C",
          role: "Head of Design"
        };

        const revisedContact = {
          ...testContacts[contactId - 1],
          ...contactValues
        };

        return supertest(app)
          .patch(`/api/contacts/${contactId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(contactValues)
          .expect(204);
      });
    });
  });
  describe("DELETE /api/contacts/:contact_id", () => {
    context("Given no contacts in the database", () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 404 on delete`, () => {
        const contactId = 1;
        return supertest(app)
          .delete(`/api/contacts/${contactId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Contact doesn't exist` });
      });
    });
    context("Given contacts in the database", () => {
      beforeEach("insert jobs", () =>
        helpers.seedJobsTables(db, testUsers, testJobs, testContacts)
      );
      it(`deletes contact from database`, () => {
        const contactId = 1;

        const jobId = testContacts.find(contact => contact.id === contactId)
          .job_id;
        const contactsForJob = helpers.makeExpectedJobContacts(
          testUsers,
          jobId,
          testContacts
        );
        const contactsWithDeletion = contactsForJob.filter(
          contact => contact.id !== 1
        );

        return supertest(app)
          .delete(`/api/contacts/${contactId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/contacts/job/${jobId}`)
              .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
              .expect(200, contactsWithDeletion)
          );
      });
    });
  });
});
