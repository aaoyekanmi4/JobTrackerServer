const makeJobsArray = () => {
    const testJobs = [
        {
          id: 1,
          company: "Appy",
          job_role: "Programmer",
          job_location: null,
          job_description: "I program the computers.",
          found_at: null,
          applied: null,
          phone_screen: null,
          interview: null,
          offer: null,
          date_created: null
        },
        {
          id: 2,
          company: "MIB",
          job_role: "Code Ninja",
          job_location: null,
          job_description: "Hiyaaaa!",
          found_at: null,
          applied: null,
          phone_screen: null,
          interview: null,
          offer: null,
          date_created: null
        },
        {
          id: 3,
          company: "The Space Force",
          job_role: "Super Secret Role",
          job_location: null,
          job_description: "Confidential and Secret",
          found_at: null,
          applied: null,
          phone_screen: null,
          interview: null,
          offer: null,
          date_created: null
        }
      ];

      return testJobs;
}

module.exports = {
    makeJobsArray
}