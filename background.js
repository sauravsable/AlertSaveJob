const JOBS_KEY = 'savedJobs';
let notificationLinks = {};

const sampleJobs = [
    {
      "id": "1",
      "title": "Software Engineer",
      "company": "Tech Innovators Inc.",
      "location": "San Francisco, CA",
      "description": "Join our dynamic team to develop cutting-edge software solutions.",
      "postedDate": "2024-08-30",
      "jobType": "Full-time",
      "industry": "Technology",
      "applicationLink": "https://www.linkedin.com/jobs/view/1",
      "salary": "$120,000 - $150,000"
    },
    {
      "id": "2",
      "title": "Product Manager",
      "company": "Global Solutions Ltd.",
      "location": "New York, NY",
      "description": "Lead product development for our innovative products.",
      "postedDate": "2024-08-30",
      "jobType": "Full-time",
      "industry": "Product Management",
      "applicationLink": "https://www.linkedin.com/jobs/view/2",
      "salary": "$100,000 - $130,000"
    },
    {
      "id": "3",
      "title": "Data Scientist",
      "company": "AI Ventures",
      "location": "Austin, TX",
      "description": "Analyze and interpret complex data to drive business solutions.",
      "postedDate": "2024-08-29",
      "jobType": "Full-time",
      "industry": "Data Science",
      "applicationLink": "https://www.linkedin.com/jobs/view/3",
      "salary": "$110,000 - $140,000"
    },
    {
      "id": "4",
      "title": "UX Designer",
      "company": "Creative Minds Studio",
      "location": "Los Angeles, CA",
      "description": "Design intuitive user experiences for our innovative products.",
      "postedDate": "2024-08-28",
      "jobType": "Full-time",
      "industry": "Design",
      "applicationLink": "https://www.linkedin.com/jobs/view/4",
      "salary": "$90,000 - $120,000"
    },
    {
      "id": "5",
      "title": "Marketing Specialist",
      "company": "Growth Marketers LLC",
      "location": "Chicago, IL",
      "description": "Develop and execute marketing strategies to grow our brand.",
      "postedDate": "2024-08-27",
      "jobType": "Full-time",
      "industry": "Marketing",
      "applicationLink": "https://www.linkedin.com/jobs/view/5",
      "salary": "$70,000 - $90,000"
    },
    {
      "id": "6",
      "title": "HR Manager",
      "company": "People First Corp.",
      "location": "Boston, MA",
      "description": "Manage HR functions and drive employee engagement.",
      "postedDate": "2024-08-26",
      "jobType": "Full-time",
      "industry": "Human Resources",
      "applicationLink": "https://www.linkedin.com/jobs/view/6",
      "salary": "$80,000 - $110,000"
    },
    {
      "id": "7",
      "title": "Financial Analyst",
      "company": "FinancePro Group",
      "location": "Seattle, WA",
      "description": "Provide financial analysis and support for strategic decisions.",
      "postedDate": "2024-08-25",
      "jobType": "Full-time",
      "industry": "Finance",
      "applicationLink": "https://www.linkedin.com/jobs/view/7",
      "salary": "$85,000 - $115,000"
    },
    {
      "id": "8",
      "title": "DevOps Engineer",
      "company": "Cloud Solutions Inc.",
      "location": "Denver, CO",
      "description": "Manage and optimize our cloud infrastructure.",
      "postedDate": "2024-08-24",
      "jobType": "Full-time",
      "industry": "Technology",
      "applicationLink": "https://www.linkedin.com/jobs/view/8",
      "salary": "$110,000 - $140,000"
    },
    {
      "id": "9",
      "title": "Content Writer",
      "company": "Content Creators Hub",
      "location": "Remote",
      "description": "Create compelling content to engage our audience.",
      "postedDate": "2024-08-23",
      "jobType": "Part-time",
      "industry": "Content Creation",
      "applicationLink": "https://www.linkedin.com/jobs/view/9",
      "salary": "$40,000 - $60,000"
    },
    {
      "id": "10",
      "title": "Cybersecurity Analyst",
      "company": "SecureTech Ltd.",
      "location": "Washington, D.C.",
      "description": "Protect our systems from cyber threats and ensure data security.",
      "postedDate": "2024-08-22",
      "jobType": "Full-time",
      "industry": "Cybersecurity",
      "applicationLink": "https://www.linkedin.com/jobs/view/10",
      "salary": "$100,000 - $130,000"
    }
  ];
  

function initializeStorage() {
  chrome.storage.local.set({ [JOBS_KEY]: sampleJobs }, () => {
    console.log('Sample job data initialized.');
  });
}


function checkJobAlerts() {
  chrome.storage.local.get(JOBS_KEY, (data) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving job data:', chrome.runtime.lastError.message);
      return;
    }
    if (data[JOBS_KEY]) {
      const today = new Date();
      const savedJobs = data[JOBS_KEY];

      savedJobs.forEach((job) => {
        const postedDate = new Date(job.postedDate);
        const daysAgo = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));

        if (daysAgo >= 2 && daysAgo <= 3) {
          const notificationId = `job-alert-${job.id}`;

          notificationLinks[notificationId] = job.applicationLink;

          chrome.notifications.create(notificationId, {
            type: 'basic',
            iconUrl: 'logo.png',
            title: 'AlertSaveJob',
            message: `Job Title: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nPosted Date: ${job.postedDate}`,
            priority: 2
          }, (createdNotificationId) => {
            if (chrome.runtime.lastError) {
              console.error('Error creating notification:', chrome.runtime.lastError.message);
            } else {
              console.log('Notification created with ID:', createdNotificationId);
            }
          });
        }
      });
    }
  });
}

function setupStartupNotification() {
  chrome.alarms.create('startupNotification', {
    when: Date.now() + 120000,
    periodInMinutes: 0 
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'startupNotification') {
      console.log('Startup notification triggered.');
      checkJobAlerts();
      chrome.alarms.clear('startupNotification');
    }
  });
}


chrome.notifications.onClicked.addListener((notificationId) => {
  const jobLink = notificationLinks[notificationId];
  if (jobLink) {
    chrome.tabs.create({ url: jobLink });
  }
});

initializeStorage();

setupStartupNotification();

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed, initializing storage...');
    initializeStorage();
  } else if (details.reason === 'update') {
    console.log('Extension updated.');
  }
});
