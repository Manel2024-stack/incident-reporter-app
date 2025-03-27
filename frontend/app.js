async function loadIncidents() {
  const res = await fetch('/incidents');
  const data = await res.json();
  const list = document.getElementById('incidentList');
  list.innerHTML = '';
  data.forEach(incident => {
    const li = document.createElement('li');
    li.innerHTML = `${incident.message} [${incident.priority}] - ${incident.status} 
    ${incident.status === 'open' ? `<button onclick="closeIncident('${incident._id}')">Close</button>` : ''}`;
    list.appendChild(li);
  });
}

async function closeIncident(id) {
  await fetch(`/incidents/${id}/close`, { method: 'PUT' });
  loadIncidents();
}

document.getElementById('incidentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('message').value;
  const priority = document.getElementById('priority').value;
  await fetch('/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, priority })
  });
  e.target.reset();
  loadIncidents();
});

loadIncidents();
