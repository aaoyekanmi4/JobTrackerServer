// const { expect } = require("chai");
// const knex = require("knex");
// const app = require("../src/app");
// const { makeContactsArray } = require("./contacts.fixtures");
// describe("Contacts Endpoints", function() {
//   let db;
//   before("make knex instance", () => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DATABASE_URL
//     });
//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//   before("clean the table", () => db("contacts").truncate());
//   afterEach("cleanup", () => db("contacts").truncate());
//   context(`Given no contacts`, () => {
//     it(`responds with 200 and an empty list`, () => {
//       return supertest(app)
//         .get("/api/contacts")
//         .expect(200, []);
//     });
//   });
//   context("Given there are contacts in the database", () => {
//     const testContacts = makeContactsArray();
//     beforeEach("insert contacts", () => {
//       return db.into("contacts").insert(testContacts);
//     });

//     it("GET /api/contacts responds with 200 and all of the contacts", () => {
//       return supertest(app)
//         .get("/api/contacts")
//         .expect(200, testContacts);
//     });
//   });
//   describe(`GET /api/contacts/:contact_id`, () => {
//     context(`Given no contacts`, () => {
//       it(`responds with 404`, () => {
//         const contactId = 123456;
//         return supertest(app)
//           .get(`/api/contacts/${contactId}`)
//           .expect(404, { error: { message: `Contact doesn't exist` } });
//       });

//       context("Given there are contacts in the database", () => {
//         const testContacts = makeContactsArray();

//         beforeEach("insert contacts", () => {
//           return db.into("contacts").insert(testContacts);
//         });
//         it("GET /api/contacts/:contact_id responds with 200 and the specified contact", () => {
//           const contactId = 2;
//           const expectedContact = testContacts[contactId - 1];
//           return supertest(app)
//             .get(`/api/contacts/${contactId}`)
//             .expect(200, expectedContact);
//         });
//       });
//     });
//   });
//   describe(`POST /api/contacts`, () => {
//     it(`creates a contact, responding with 201 and the new contact`, function() {
//       const newContact = {
//         company: "Company post test",
//         contact_role: "test role",
//         contact_location: "Omaha, NE",
//         contact_description: "Confidential and Secret",
//         found_at: "monster.com",
//         applied: true,
//         phone_screen: null,
//         interview: null,
//         offer: null
//       };
//       return supertest(app)
//         .post("/api/contacts")
//         .send(newContact)
//         .expect(201)
//         .expect(res => {
//           expect(res.body.company).to.eql(newContact.company);
//           expect(res.body.contact_role).to.eql(newContact.contact_role);
//           expect(res.body.contact_location).to.eql(newContact.contact_location);
//           expect(res.body).to.have.property("id");
//         });
//     });
//   });
//   describe(`PATCH /api/contacts/:contacts:id`, () => {
//     context(`Given no contacts`, () => {
//       it(`responds with 404`, () => {
//         const contactId = 300000;
//         return supertest(app)
//           .patch(`/api/contacts/${contactId}`)
//           .expect(404, { error: { message: `Contact doesn't exist` } });
//       });
//     });

//     context("Given there are contacts in the database", () => {
//       const testContacts = makeContactsArray();

//       beforeEach("insert contacts", () => {
//         return db.into("contacts").insert(testContacts);
//       });

//       it("responds with 204 and updates the contact", () => {
//         const idToUpdate = 2;
//         const updatecontact = {
//           company: "updated company",
//           contact_role: "New Role",
//           contact_location: "updated location"
//         };
//         const expectedContact = {
//           ...testContacts[idToUpdate - 1],
//           ...updatecontact
//         };
//         return supertest(app)
//           .patch(`/api/contacts/${idToUpdate}`)
//           .send(updatecontact)
//           .expect(204)
//           .then(res =>
//             supertest(app)
//               .get(`/api/contacts/${idToUpdate}`)
//               .expect(expectedContact)
//           );
//       });
//     });
//   });
//    describe.only(`DELETE /contacts/:contact_id`, () => {
//        context('Given there are contacts in the database', () => {
//          const testContacts = makeContactsArray()
    
//          beforeEach('insert contacts', () => {
//            return db
//              .into('contacts')
//              .insert(testContacts)
//          })
    
//          it('responds with 204 and removes the contact', () => {
//            const idToRemove = 2
//            const expectedContacts = testContacts.filter(contact => contact.id !== idToRemove)
//            return supertest(app)
//              .delete(`/api/contacts/${idToRemove}`)
//              .expect(204)
//              .then(res =>
//                supertest(app)
//                  .get(`/api/contacts`)
//                  .expect(expectedContacts)
//              )
//          })
//        })
//       })
// });
