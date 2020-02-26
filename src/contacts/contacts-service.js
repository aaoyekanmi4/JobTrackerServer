const contactsService = {
    getAllContacts(knex) {
        return knex.select('*').from('contacts');
    },
    insertContact(knex, newContact) {
        return knex
        .insert(newContact)
        .into('contacts')
        .returning('*')
        .then(rows =>  rows[0])
 
    },
    getContactById(knex, id) {
     return knex.from('contacts').select('*').where({ id }).first()
      },
    deleteContact(knex, id) {
        return knex('contacts').where({ id }).delete()
    },
    updateContact(knex, id, updateContact) {
        return knex('contacts').where({ id }).update(updateContact)
    }
 } 
 
 module.exports = contactsService;