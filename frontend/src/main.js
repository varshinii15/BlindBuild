import './style.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
let currentTeamName = null;

// Utility for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || result.error || 'API Error');
    return result;
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

// Tab Switching Logic
const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');

    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// --- R2Q1: Events & Registration ---
document.getElementById('add-member-btn').addEventListener('click', () => {
  const container = document.getElementById('team-members-container');
  const div = document.createElement('div');
  div.className = 'item-row member-input';
  div.style.marginBottom = '0.5rem';
  div.style.borderLeftColor = 'var(--accent)';
  div.innerHTML = `
    <input type="text" placeholder="Name" class="member-name" required style="margin-bottom: 0.25rem;"/>
    <input type="email" placeholder="Email" class="member-email" required />
    <button type="button" class="tab-btn remove-member" style="color: var(--secondary); padding: 5px; font-size: 0.8rem;">Remove</button>
  `;
  container.appendChild(div);

  div.querySelector('.remove-member').addEventListener('click', () => div.remove());
});

document.getElementById('create-participant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Transform dynamic inputs into array of objects
  const members = [];
  document.querySelectorAll('.member-input').forEach(row => {
    const name = row.querySelector('.member-name').value;
    const email = row.querySelector('.member-email').value;
    if (name && email) members.push({ name, email });
  });
  data.TeamMembers = members;

  const result = await apiCall('/events/teams', 'POST', data);
  currentTeamName = data.Teamname;
  alert(`Team "${currentTeamName}" Created Successfully!`);
});

document.getElementById('fetch-events-btn').addEventListener('click', async (e) => {
  const btn = e.target;
  const list = document.getElementById('events-list');
  
  if (btn.textContent === 'Close') {
    list.innerHTML = '';
    btn.textContent = 'Load Events';
    return;
  }

  const events = await apiCall('/events/events');
  list.innerHTML = events.map(ev => `
    <div class="item-row" style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <strong>${ev.name}</strong><br>
        <p style="margin: 0.25rem 0; font-size: 0.9rem;">${ev.description}</p>
        <small>📍 ${ev.location} | 📅 ${new Date(ev.date).toLocaleDateString()}</small><br>
        <small>Maximum Limit: ${ev["maximum limit"]}</small>
      </div>
      <button class="btn-primary register-event-btn" data-id="${ev.id}" style="width: auto; padding: 5px 10px; font-size: 0.8rem;">Register</button>
    </div>
  `).join('');

  btn.textContent = 'Close';

  // Add click listeners to register buttons
  document.querySelectorAll('.register-event-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const eventId = e.target.getAttribute('data-id');
      
      if (!currentTeamName) {
        const name = prompt('Please create a team first or enter your Team Name:');
        if (!name) return;
        currentTeamName = name;
      }

      try {
        const result = await apiCall('/events/register', 'POST', {
          Teamname: currentTeamName,
          eventId: eventId
        });
        alert(result.message);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    });
  });
});

document.getElementById('check-reg-btn').addEventListener('click', async (e) => {
  const btn = e.target;
  const list = document.getElementById('reg-status-list');
  const teamNameInput = document.getElementById('check-reg-team-name');
  const teamName = teamNameInput.value || currentTeamName;

  if (btn.textContent === 'Close') {
    list.innerHTML = '';
    btn.textContent = 'View My Events';
    return;
  }

  if (!teamName) return alert('Please enter a team name');

  try {
    const registrations = await apiCall(`/events/registration-status/${teamName}`);
    
    list.innerHTML = registrations.map(reg => `
      <div class="item-row" style="border-left-color: var(--secondary); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${reg.eventId?.title || 'Unknown Event'}</strong><br>
          <small>📍 ${reg.eventId?.location || 'N/A'}</small><br>
          <small>Status: <span style="color: var(--accent)">${reg.status}</span></small>
          ${reg.ticketCode ? `<br><small style="color: var(--primary); font-weight: bold;">🎟 Ticket: ${reg.ticketCode}</small>` : ''}
        </div>
        <div style="display: flex; gap: 0.5rem;">
          ${!reg.ticketCode ? `<button class="btn-primary get-ticket-btn" data-team="${teamName}" data-event="${reg.eventId?.title}" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: var(--accent);">Get Ticket</button>` : ''}
          <button class="btn-primary cancel-reg-btn" data-team="${teamName}" data-event="${reg.eventId?.title}" style="width: auto; padding: 4px 8px; font-size: 0.7rem; background: var(--secondary);">Cancel</button>
        </div>
      </div>
    `).join('');

    btn.textContent = 'Close';

    // Add listeners for dynamic buttons
    list.querySelectorAll('.get-ticket-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const { team, event } = btn.dataset;
        const res = await apiCall('/events/ticket', 'POST', { Teamname: team, eventTitle: event });
        alert(`Ticket Generated! Code: ${res.ticket.ticketCode}`);
        console.log('Ticket Data:', res.ticket);
      });
    });

    list.querySelectorAll('.cancel-reg-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const { team, event } = btn.dataset;
        if (!confirm(`Are you sure you want to cancel registration for ${event}?`)) return;
        const res = await apiCall(`/events/cancel-registration/${team}/${event}`, 'DELETE');
        alert(res.message);
        btn.closest('.item-row').remove();
      });
    });

  } catch (err) {
    document.getElementById('reg-status-list').innerHTML = `<p style="color: var(--secondary); font-size: 0.9rem;">No registrations found for "${teamName}"</p>`;
  }
});

// --- R2Q2: Workshops ---
document.getElementById('view-workshops-btn').addEventListener('click', async () => {
  const result = await apiCall('/w-s/workshops');
  const list = document.getElementById('workshops-list');
  const workshops = result.workshops || [];

  list.innerHTML = workshops.length ? workshops.map(w => `
    <div class="item-row" style="cursor: pointer;" onclick="document.getElementById('booking-workshop-id').value='${w._id}'">
      <strong>${w.title}</strong><br>
      <small>${w.description}</small><br>
      <small>ID: ${w._id}</small>
      <div style="margin-top: 5px;">
        ${w.slots.map(s => `
          <button class="btn-primary" style="padding: 2px 6px; font-size: 0.7rem; width: auto; text-transform: none; display: inline-block; margin: 2px;" 
            onclick="event.stopPropagation(); document.getElementById('booking-workshop-id').value='${w._id}'; document.getElementById('booking-slot-id').value='${s._id}';">
            ${s.time} ${s.available ? '✅' : '❌'}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('') : '<p>No workshops found.</p>';
});

document.getElementById('book-slot-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const result = await apiCall('/w-s/book-slot', 'POST', data);
  alert(result.msg);
});

document.getElementById('check-booking-btn').addEventListener('click', async () => {
  const userId = document.getElementById('check-booking-user-id').value;
  if (!userId) return alert('Please enter a User ID');

  const result = await apiCall(`/w-s/booking-status?userId=${userId}`);
  const list = document.getElementById('user-bookings-list');
  const bookings = result.bookings || [];

  list.innerHTML = bookings.length ? bookings.map(b => `
    <div class="item-row">
      <strong>Workshop: ${b.workshopId?.title || 'Unknown'}</strong><br>
      <small>Time: ${b.slotId?.time || 'Unknown'}</small><br>
      <small>Status: ${b.status}</small>
    </div>
  `).join('') : '<p>No bookings found for this user.</p>';
});

// --- R2Q4: Convenor Hub ---
document.getElementById('verify-ticket-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const ticketId = e.target.ticketId.value;

  // First verify, then mark attendance
  try {
    const verify = await apiCall('/convenor/verify-ticket', 'POST', { ticketId });
    if (verify.valid) {
      const mark = await apiCall('/convenor/attendance-mark', 'POST', { ticketId });
      alert(mark.message);
    }
  } catch (err) { }
});

document.getElementById('fetch-all-teams-btn').addEventListener('click', async () => {
  const teams = await apiCall('/convenor/teams');
  const list = document.getElementById('convenor-teams-list');
  list.innerHTML = teams.map(t => `
    <div class="item-row">
      <strong>${t.Teamname}</strong><br>
      <small>Members: ${t.TeamMembers.map(m => m.name).join(', ')}</small><br>
      <small>ID: ${t._id}</small>
    </div>
  `).join('');
});

document.getElementById('add-winner-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const result = await apiCall('/convenor/winner', 'POST', data);
  alert(result.message);
});

// --- R2Q5: Feedback ---
document.getElementById('submit-feedback-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const result = await apiCall('/f-r/feedback', 'POST', data);
  alert(result.message);
});

document.getElementById('refresh-ratings-btn').addEventListener('click', async () => {
  const stats = await apiCall('/f-r/rating/average');
  document.getElementById('avg-score').textContent = stats.averageRating;
});

// --- R2Q6: Lost & Found ---
document.getElementById('report-item-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const endpoint = data.type === 'Lost' ? '/l-f/lost' : '/l-f/found';

  const result = await apiCall(endpoint, 'POST', data);
  alert(result.message);
});

document.getElementById('view-lost-btn').addEventListener('click', async () => {
  const items = await apiCall('/l-f/lost');
  updateItemList(items, 'lost items');
});

document.getElementById('view-found-btn').addEventListener('click', async () => {
  const items = await apiCall('/l-f/found');
  updateItemList(items, 'found items');
});

function updateItemList(items, typeLabel = 'items') {
  const list = document.getElementById('items-list');
  if (!items || items.length === 0) {
    list.innerHTML = `<p style="text-align: center; color: var(--secondary); padding: 1rem;">No ${typeLabel} found.</p>`;
    return;
  }
  list.innerHTML = items.map(item => `
    <div class="item-row">
      <strong>${item.itemName}</strong> (${item.type})<br>
      <small>Category: ${item.category}</small><br>
      <small>Description: ${item.description}</small><br>
      <small>Location: ${item.location} | Status: ${item.status}</small>
    </div>
  `).join('');
}
