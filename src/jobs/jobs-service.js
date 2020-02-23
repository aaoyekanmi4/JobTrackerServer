const jobsService = {
   getAllJobs(knex) {
       return knex.select('*').from('jobs');
   },
   insertJob(knex, newJob) {
       return knex
       .insert(newJob)
       .into('jobs')
       .returning('*')
       .then(rows =>  rows[0])

   },
   getJobById(knex, id) {
    return knex.from('jobs').select('*').where({ id }).first()
     },
   deleteJob(knex, id) {
       return knex('jobs').where({ id }).delete()
   },
   updateJob(knex, id, updateJob) {
       return knex('jobs').where({ id }).update(updateJob)
   }
} 

module.exports = jobsService;