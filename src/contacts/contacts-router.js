const express = require("express");
const contactsRouter = express.Router();
const xss = require('xss')
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const contactsService = require("./contacts-service");

contactsRouter
  .route("/api/contacts/job/:job_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    contactsService
      .getAllContacts(knexInstance, req.params.job_id)
      .then(contacts => {
        if (!contacts.length) {
          return res.status(404).json({
            error:`Job doesn't exist` 
          })
        }
        else {
         return res.json(contacts);
        }
       
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name, role, email, phone, contact_url, last_contacted, job_id} = req.body;

    const requiredValues = { name, role, job_id};

    for (const [key, value] of Object.entries(requiredValues)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    const newContact = { name, role, email, phone, contact_url, last_contacted, job_id};
    newContact.user_id = req.user.id;

    contactsService
      .insertContact(req.app.get("db"), newContact)
      .then(contact => {
        res
          .status(201)
          .location(`/api/contacts/${contact.id}`)
          .json(contact);
      })
      .catch(next);
  });

contactsRouter.route("/api/contacts/:contact_id")
   .all(requireAuth, (req, res, next) => {
       contactsService.getContactById(
         req.app.get('db'),
         req.params.contact_id
       )
         .then(contact => {
           if (!contact) {
             return res.status(404).json({
               error: { message: `Contact doesn't exist` }
             })
           }
           res.contact = contact // save the contact for the next middleware
           next() // don't forget to call next so the next middleware happens!
         })
         .catch(next)
     })
     .get((req, res, next) => {
           res.json(res.contact)
              })
              .delete((req, res, next) => {
            
                   contactsService.deleteContact(
                     req.app.get('db'),
                     req.params.contact_id
                   )
                     .then(() => {
                       res.status(204).end()
                     })
                     .catch(next)
                  })
                
 .patch(bodyParser, (req, res, next) => {
    const { name, role, email, phone, contact_url, last_contacted, job_id} = req.body;


     const contactToUpdate =  { name, role, email, phone, contact_url, last_contacted, job_id};
    contactToUpdate.user_id = req.user.id 
 
contactsService
.updateContact( req.app.get('db'),
       req.params.contact_id,
       contactToUpdate
     )
       .then(numRowsAffected => {
         res.status(204).end()
       })
       .catch(next)
    })
module.exports = contactsRouter;
