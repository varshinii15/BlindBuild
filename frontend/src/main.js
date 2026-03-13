import './style.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  alert('Team Created! ID: ' + result.participant._id);
});

document.getElementById('fetch-events-btn').addEventListener('click', async () => {
  const events = await apiCall('/events/events');
  const list = document.getElementById('events-list');
  list.innerHTML = events.map(ev => `
    <div class="item-row">
      <strong>${ev.title}</strong><br>
      <small>${ev.description}</small><br>
      <small>ID: ${ev._id}</small>
    </div>
  `).join('');
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
      <button class="tab-btn" style="margin-top: 10px; font-size: 0.8rem; padding: 4px;" onclick="event.stopPropagation(); window.viewWorkshopData('${w._id}')">View Details (API Test)</button>
    </div>
  `).join('') : '<p>No workshops found.</p>';
});

// Helper for testing getWorkshopById and getWorkshopSlots
window.viewWorkshopData = async (workshopId) => {
  try {
    const wsDetails = await apiCall(`/w-s/workshops/${workshopId}`);
    const wsSlots = await apiCall(`/w-s/workshops/${workshopId}/slots`);
    alert(`Workshop Details:\nTitle: ${wsDetails.workshop.title}\nDescription: ${wsDetails.workshop.description}\nAvailable Slots: ${wsSlots.slots.length}`);
  } catch (err) {
    console.error(err);
  }
};

document.getElementById('workshop-details-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('specific-workshop-id').value.trim();
  if (!id) return;
  const result = await apiCall(`/w-s/workshops/${id}`);
  const w = result.workshop;
  document.getElementById('specific-workshop-result').innerHTML = `
    <div class="item-row">
      <strong>${w.title}</strong><br>
      <small>${w.description}</small><br>
      <small>Total Slots Configured: ${w.slots ? w.slots.length : 0}</small>
    </div>
  `;
});

document.getElementById('fetch-slots-btn').addEventListener('click', async () => {
  const id = document.getElementById('specific-workshop-id').value.trim();
  if (!id) return alert('Enter a Workshop ID first');
  const result = await apiCall(`/w-s/workshops/${id}/slots`);
  const slots = result.slots || [];
  document.getElementById('specific-workshop-result').innerHTML = slots.length ? slots.map(s => `
    <div class="item-row">
      <strong>Slot ID: ${s._id}</strong><br>
      <small>Time: ${s.time} | Available: ${s.available ? '✅ Yes' : '❌ No'}</small>
    </div>
  `).join('') : '<p>No slots found.</p>';
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
      <small>Booking ID: ${b._id}</small><br>
      <small>Time: ${b.slotId?.time || 'Unknown'}</small><br>
      <small>Status: ${b.status}</small>
      ${b.status !== 'cancelled' ? `<br><button class="tab-btn remove-member" style="margin-top: 5px; color: var(--secondary); padding: 2px 5px;" onclick="window.cancelBooking('${b._id}')">Cancel Booking</button>` : ''}
    </div>
  `).join('') : '<p>No bookings found for this user.</p>';
});

window.cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  try {
    const result = await apiCall('/w-s/cancel-slot', 'DELETE', { bookingId });
    alert(result.msg);
    document.getElementById('check-booking-btn').click(); // Refresh list
  } catch (err) {
    console.error(err);
  }
};

document.getElementById('cancel-booking-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const bookingId = document.getElementById('cancel-booking-id').value.trim();
  if (!bookingId) return;
  const result = await apiCall('/w-s/cancel-slot', 'DELETE', { bookingId });
  alert(result.msg);
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
  } catch (err) {}
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
