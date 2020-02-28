const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        email: 'Testuser@1.com',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        user_name: 'test-user-2',
        email: 'Testuser@2.com',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 3,
        user_name: 'test-user-3',
        email: 'Testuser@3.com',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 4,
        user_name: 'test-user-4',
        email: 'Testuser@4.com',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
    ]
  }
  
  const makeJobsArray = (users) => {
   return [
        {
          id: 1,
          company: "Appy",
          job_role: "Programmer",
          job_location: 'here',
          job_description: "I program the computers.",
          found_at: null,
          applied: null,
          phone_screen: null,
          interview: null,
          offer: null,
          date_created: new Date('2029-01-22T16:28:32.615Z'),
          user_id:users[0].id
        },
        {
          id: 2,
          company: "MIB",
          job_role: "Code Ninja",
          job_location: 'here',
          job_description: "Hiyaaaa!",
          found_at: null,
          applied: null,
          phone_screen: null,
          interview: null,
          offer: null,
          date_created: new Date('2029-01-22T16:28:32.615Z'),
          user_id:users[0].id
        },
        {
          id: 3,
          company: "The Space Force",
          job_role: "Super Secret Role",
          job_location: 'here',
          job_description: "Confidential and Secret",
          found_at: null,
          applied: null,
          phone_screen: null,
          interview: null,
          offer: null,
          date_created: new Date('2029-01-22T16:28:32.615Z'),
          user_id:users[0].id
        }
      ];


}


     function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
 
       const token = jwt.sign({ user_id: user.id }, secret, {
         subject: user.user_name,
         algorithm: 'HS256',
       })
      

       return `Bearer ${token}`

     }
  
  function makeContactsArray(users, jobs) {
    return [
      {
        id: 1,
        name: 'test-contact-1',
        role:'test-role-1',
        email:'test@email1.com',
        phone:'9999999999',
        contact_url:'linkedin.com',
        last_contacted:null,
        job_id: jobs[0].id,
        user_id: users[0].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        name: 'test-contact-2',
        role:'test-role-2',
        email:'test@email2.com',
        phone:'9999999999',
        contact_url:'linkedin.com',
        last_contacted:null,
        job_id: jobs[1].id,
        user_id: users[1].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 3,
        name: 'test-contact-3',
        role:'test-role-3',
        email:'test@email3.com',
        phone:'9999999999',
        contact_url:'linkedin.com',
        last_contacted:null,
        job_id: jobs[2].id,
        user_id: users[2].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
    

    ];
  }
  function makeExpectedContact(contact) {
    return {
        id: contact.id,
        name: contact.name,
      
        email:contact.email,
        phone:contact.phone,
        contact_url:contact.contact_url,
        last_contacted:contact.last_contacted,
        job_id: contact.job_id,
        user_id: contact.user_id,
        date_created: contact.date_created.toISOString(),
        role:contact.role,
      
  }
}
  function makeExpectedJob(users, job, contacts=[]) {
    const owner = users
      .find(user => user.id === job.user_id)
  
    const number_of_contacts = contacts
      .filter(contact => contact.job_id === job.id)
      .length
  
    return   {
        id: job.id,
        company: job.company,
        job_role: job.job_role,
        job_location: job.job_location,
        job_description:job.job_description,
        found_at: job.found_at,
        applied: job.applied,
        phone_screen: job.phone_screen,
        interview: job.interview,
        offer: job.offer,
        date_created: job.date_created.toISOString(),
        user_id:job.user_id
    
      }
    
  }
  
  function makeExpectedJobContacts(users, jobId, contacts) {
    const expectedContacts= contacts
      .filter(contact => contact.job_id === jobId)
  
    return expectedContacts.map(contact => {
     
      return {
        id: contact.id,
        name: contact.name,
      
        email:contact.email,
        phone:contact.phone,
        contact_url:contact.contact_url,
        last_contacted:contact.last_contacted,
        job_id: contact.job_id,
        user_id: contact.user_id,
        date_created: contact.date_created.toISOString(),
        role:contact.role,
      
      }
    })
  }
  
 
  
  function makeJobsFixtures() {
    const testUsers = makeUsersArray()
    const testJobs = makeJobsArray(testUsers)
    const testContacts = makeContactsArray(testUsers, testJobs)
    return { testUsers, testJobs, testContacts }
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          jobs,
          users,
          contacts
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE jobs_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE contacts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('jobs_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('contacts_id_seq', 0)`),
        ])
      )
    )
  }
   function seedUsers(db, users) {
       const preppedUsers = users.map(user => ({
         ...user,
         password: bcrypt.hashSync(user.password, 1)
       }))
       return db.into('users').insert(preppedUsers)
         .then(() =>
           // update the auto sequence to stay in sync
           db.raw(
             `SELECT setval('users_id_seq', ?)`,
             [users[users.length - 1].id],
           )
         )
     }
  function seedJobsTables(db, users, jobs, contacts=[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('jobs').insert(jobs)

      // update the auto sequence to match the forced id values
           await trx.raw(
               `SELECT setval('jobs_id_seq', ?)`,
               [jobs[jobs.length - 1].id],
             )
      // only insert contacts if there are some, also update the sequence counter
      if (contacts.length) {
        await trx.into('contacts').insert(contacts)
        await trx.raw(
          `SELECT setval('contacts_id_seq', ?)`,
          [contacts[contacts.length - 1].id],
        )
      }
    })
  }
  function makeMaliciousJob(user) {
    const maliciousJob= {
      id: 911,
      company: 'Fake co.',
      date_created: new Date(),
      job_location:'here',
      job_role: 'Naughty naughty very naughty <script>alert("xss");</script>',
      user_id: user.id,
      job_description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
     
    }
    const expectedJob = {
      ...makeExpectedJob([user], maliciousJob),
      job_role: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      job_description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
      maliciousJob,
      expectedJob,
    }
  }
  
  function seedMaliciousJob(db, user, job) {
    return db
      .into('users')
      .insert([user])
      .then(() =>
        db
          .into('jobs')
          .insert([job])
      )
  }
  
  module.exports = {
    makeUsersArray,
    makeJobsArray,
    makeExpectedJob,
    makeExpectedJobContacts,
    makeContactsArray,
    makeAuthHeader,
    makeMaliciousJob,
    makeExpectedContact,
    seedMaliciousJob,
    makeJobsFixtures,
    cleanTables,
    seedJobsTables,
    seedUsers,
  }