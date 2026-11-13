const REPO = 'Signal-Drifts/petition'; // Change if you name the repo differently
const LABEL = 'signature';

document.getElementById('signForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const company = document.getElementById('company').value.trim();
  if (!name) return;

  let display = name;
  if (company) display += ', ' + company;

  const title = encodeURIComponent('Signature: ' + display);
  const body = encodeURIComponent('Name: ' + name + '\nCompany: ' + (company || 'N/A') + '\n\nSigned via the petition site.');
  const url = `https://github.com/${REPO}/issues/new?title=${title}&body=${body}&labels=${LABEL}`;

  window.open(url, '_blank');
});

async function loadSignatures() {
  const listEl = document.getElementById('signaturesList');
  const countEl = document.getElementById('count');
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/issues?labels=${LABEL}&state=all&per_page=100`);
    if (!res.ok) throw new Error('Failed to load');
    const issues = await res.json();
    // Filter out pull requests if any
    const sigs = issues.filter(i => !i.pull_request);
    countEl.textContent = `(${sigs.length})`;
    if (sigs.length === 0) {
      listEl.innerHTML = '<p>No signatures yet. Be the first!</p>';
      return;
    }
    const ul = document.createElement('ul');
    sigs.forEach(issue => {
      const li = document.createElement('li');
      // Prefer title after "Signature: " or the whole title
      let text = issue.title.replace(/^Signature:\s*/i, '');
      li.textContent = text;
      ul.appendChild(li);
    });
    listEl.innerHTML = '';
    listEl.appendChild(ul);
  } catch (err) {
    listEl.innerHTML = '<p>Could not load signatures. The repository may not exist yet or the label is missing.</p>';
    countEl.textContent = '';
  }
}

loadSignatures();
// Refresh every 60 seconds for near-realtime
setInterval(loadSignatures, 60000);
