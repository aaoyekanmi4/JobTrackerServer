const jobsService = {
   getUsersJobs(knex, user_id) {
       return knex.select('*').from('jobs').where({user_id});
   },
   insertJob(knex, newJob) {
       return knex
       .insert(newJob)
       .into('jobs')
       .returning('*')
       .then(rows =>  rows[0])

   },
   getJobById(knex, id, user_id) {
    return knex.from('jobs').select('*').where({ id, user_id }).first()
     },
   deleteJob(knex, id, user_id) {
       return knex('jobs').where({ id,user_id }).delete()
   },
   updateJob(knex, id, updateJob, user_id) {
       return knex('jobs').where({ id,user_id }).update(updateJob)
   }
} 

module.exports = jobsService;