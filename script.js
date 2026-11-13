const SB_URL = 'https://ohuuhqncjpqdvjpyhegf.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXVocW5janBxZHZqcHloZWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMTg3MTUsImV4cCI6MjEwMzY5NDcxNX0.dYWEQTl0blpkxboX0mk7ijbv4bH83dLdhRnNNUC7QC0';
const H = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };

document.getElementById('signForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const company = document.getElementById('company').value.trim();
  if (!name) return;
  const btn = this.querySelector('button');
  btn.disabled = true;
  try {
    const res = await fetch(SB_URL + '/rest/v1/signatures', {
      method: 'POST', headers: { ...H, Prefer: 'return=minimal' },
      body: JSON.stringify({ name: name, company: company || null })
    });
    if (!res.ok) throw new Error('fail');
    this.reset();
    loadSignatures();
  } catch (err) {
    alert('Could not save your signature. Please try again.');
  }
  btn.disabled = false;
});

async function loadSignatures() {
  const listEl = document.getElementById('signaturesList');
  const countEl = document.getElementById('count');
  try {
    let rows = [];
    for (let from = 0; ; from += 1000) {
      const res = await fetch(SB_URL + '/rest/v1/signatures?select=name,company&order=id.desc', {
        headers: { ...H, Range: from + '-' + (from + 999) }
      });
      if (!res.ok) throw new Error('fail');
      const batch = await res.json();
      rows = rows.concat(batch);
      if (batch.length < 1000) break;
    }
    countEl.textContent = '(' + rows.length + ')';
    if (rows.length === 0) {
      listEl.innerHTML = '<p>No signatures yet. Be the first!</p>';
      return;
    }
    const ul = document.createElement('ul');
    rows.forEach(r => {
      const li = document.createElement('li');
      li.textContent = r.company ? r.name + ', ' + r.company : r.name;
      ul.appendChild(li);
    });
    listEl.innerHTML = '';
    listEl.appendChild(ul);
  } catch (err) {
    listEl.innerHTML = '<p>Could not load signatures.</p>';
  }
}

loadSignatures();
setInterval(loadSignatures, 10000);
