document.getElementById('refreshButton').addEventListener('click', () => {
    loadJobAlerts();
  });
  
  
  function loadJobAlerts() {
    chrome.storage.local.get('savedJobs', (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving job data:', chrome.runtime.lastError);
        return;
      }
  
      const jobAlertsDiv = document.getElementById('jobAlerts');
      jobAlertsDiv.innerHTML = '';
  
      if (data.savedJobs) {
        const today = new Date();
        const savedJobs = data.savedJobs;
  
        savedJobs.forEach((job) => {
          const postedDate = new Date(job.postedDate);
          const daysAgo = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));
  
          if (daysAgo >= 2 && daysAgo <= 3) {
            const jobElement = document.createElement('div');
            jobElement.className = 'job';
            jobElement.innerHTML = `
              <div class="title">${job.title}</div>
              <div class="company">${job.company}</div>
              <div class="location">${job.location}</div>
              <div class="postedDate">Posted Date: ${job.postedDate}</div>
              <div class="jobLink"><a href="${job.link}" target="_blank">View Job</a></div>
            `;
            jobAlertsDiv.appendChild(jobElement);
          }
        });
  
        if (jobAlertsDiv.children.length === 0) {
          jobAlertsDiv.innerHTML = '<p>No job alerts to display.</p>';
        }
      } else {
        jobAlertsDiv.innerHTML = '<p>No job data available.</p>';
      }
    });
  }
  
  loadJobAlerts();
  