const fs = require('fs');

const files = {
  'applications.ejs': `<%- include('header') %>
<h2>Membership Applications</h2>
<% if (!applications.length) { %>
  <p>No applications yet.</p>
<% } else { %>
  <% applications.forEach(a => { %>
    <div class="app-card">
      <div class="app-head">
        <strong><%= a.company %></strong>
        <span class="badge badge-<%= a.status === 'Pending' ? 'pending' : a.status === 'Approved' ? 'paid' : 'overdue' %>"><%= a.status %></span>
        <% if (a.eligible) { %><span class="badge badge-paid">Eligible: Full voting rights</span><% } else { %><span class="badge badge-pending">Conditional</span><% } %>
      </div>
      <p><strong>Contact:</strong> <%= a.contact_name %> (<%= a.email %>)<br>
      <strong>Trade License:</strong> <%= a.trade_license || '—' %><br>
      <strong>Country:</strong> <%= a.country %> · <strong>Industry:</strong> <%= a.industry %><br>
      <strong>Tier requested:</strong> <%= a.tier %><br>
      <strong>Submitted:</strong> <%= a.submitted_at %></p>
      <p><strong>Eligibility:</strong> Industry = <%= a.q_industry %>, License = <%= a.q_license %></p>
      <% if (a.references && a.references.length) { %>
        <p><strong>References:</strong></p>
        <ul>
          <% a.references.forEach(r => { %>
            <li><%= r.name %> — <%= r.company %> (<%= r.email %>)</li>
          <% }) %>
        </ul>
      <% } %>
      <% if (a.bio) { %><p><strong>Bio:</strong> <%= a.bio %></p><% } %>
      <% if (a.status === 'Pending') { %>
        <form method="POST" action="/admin/applications/<%= a.id %>/approve" style="display:inline"><button type="submit">Approve</button></form>
        <form method="POST" action="/admin/applications/<%= a.id %>/reject" style="display:inline"><button type="submit" class="btn-danger">Reject</button></form>
      <% } %>
    </div>
  <% }) %>
<% } %>
<%- include('footer') %>`,

  'sponsors.ejs': `<%- include('header') %>
<h2>Sponsors</h2>
<p><strong>Total sponsorship value:</strong> AED <%= total.toLocaleString() %></p>
<h3>Add Sponsor</h3>
<form method="POST" action="/admin/sponsors">
  <label>Company: <input name="company" required></label>
  <label>Tier: <select name="tier"><option>Platinum</option><option>Gold</option><option>Silver</option></select></label>
  <label>Contact Name: <input name="contact_name"></label>
  <label>Email: <input type="email" name="email"></label>
  <label>Phone: <input name="phone"></label>
  <label>Amount (AED): <input type="number" name="amount" value="25000"></label>
  <label>Contract Start: <input type="date" name="contract_start"></label>
  <label>Contract End: <input type="date" name="contract_end"></label>
  <button type="submit">Add Sponsor</button>
</form>
<h3>Active Sponsors</h3>
<table>
  <tr><th>Company</th><th>Tier</th><th>Contact</th><th>Email</th><th>Amount (AED)</th><th>Contract</th></tr>
  <% sponsors.forEach(s => { %>
    <tr><td><%= s.company %></td><td><span class="badge badge-paid"><%= s.tier %></span></td><td><%= s.contact_name %></td><td><%= s.email %></td><td><%= s.amount.toLocaleString() %></td><td><%= s.contract_start %> → <%= s.contract_end %></td></tr>
  <% }) %>
</table>
<%- include('footer') %>`,

  'campaigns.ejs': `<%- include('header') %>
<h2>Email Campaigns</h2>
<% if (sent) { %><p class="ok">✅ Campaign sent to <%= sent %> recipients (simulated).</p><% } %>
<h3>New Campaign</h3>
<form method="POST" action="/admin/campaigns">
  <label>Campaign Name: <input name="name" required></label>
  <label>Subject: <input name="subject" required></label>
  <label>Segment: <select name="segment"><option>All members</option><option>Gold tier</option><option>Silver tier</option></select></label>
  <button type="submit">Send Campaign (simulated)</button>
</form>
<h3>Campaign History</h3>
<table>
  <tr><th>Name</th><th>Subject</th><th>Segment</th><th>Recipients</th><th>Sent</th><th>Status</th></tr>
  <% campaigns.forEach(c => { %>
    <tr><td><%= c.name %></td><td><%= c.subject %></td><td><%= c.segment %></td><td><%= c.recipients %></td><td><%= c.sent_at %></td><td><span class="badge badge-paid"><%= c.status %></span></td></tr>
  <% }) %>
</table>
<%- include('footer') %>`,

  'audit.ejs': `<%- include('header') %>
<h2>Audit Log</h2>
<table>
  <tr><th>When</th><th>Actor</th><th>Action</th></tr>
  <% entries.forEach(e => { %>
    <tr><td><%= e.at %></td><td><%= e.actor %></td><td><%= e.action %></td></tr>
  <% }) %>
</table>
<%- include('footer') %>`,

  'committees.ejs': `<%- include('header') %>
<h2>Committees</h2>
<% committees.forEach(c => { %>
  <div class="app-card">
    <div class="app-head"><strong><%= c.name %></strong></div>
    <p><strong>Chair:</strong> <%= c.chair %></p>
    <p><strong>Members:</strong> <%= c.members.join(', ') %></p>
  </div>
<% }) %>
<%- include('footer') %>`,

  'member-profile.ejs': `<%- include('header') %>
<h2><%= member.company %></h2>
<p><a href="/members">← Back to directory</a></p>
<div class="two-col">
  <div>
    <h3>Profile</h3>
    <p><strong>Contact:</strong> <%= member.contact_name %></p>
    <p><strong>Email:</strong> <%= member.email %></p>
    <p><strong>Phone:</strong> <%= member.phone %></p>
    <p><strong>Industry:</strong> <%= member.industry %></p>
    <p><strong>Tier:</strong> <%= member.tier %></p>
    <p><strong>Country:</strong> <%= member.country %></p>
    <p><strong>Status:</strong> <%= member.status %></p>
    <p><strong>Joined:</strong> <%= member.joined_date %></p>
    <p><strong>Renewal:</strong> <%= member.renewal_date %></p>
    <p><strong>Website:</strong> <a href="<%= member.website %>" target="_blank"><%= member.website %></a></p>
    <p><strong>About:</strong> <%= member.description %></p>
  </div>
  <div>
    <h3>Invoices</h3>
    <table>
      <tr><th>Invoice</th><th>Amount</th><th>Status</th></tr>
      <% invoices.forEach(i => { %>
        <tr><td>INV-<%= String(i.id).padStart(4, '0') %></td><td>AED <%= i.amount.toLocaleString() %></td><td><span class="badge badge-<%= i.status.toLowerCase() %>"><%= i.status %></span></td></tr>
      <% }) %>
    </table>
    <h3>Event History</h3>
    <% if (!registrations.length) { %><p>No event registrations.</p><% } else { %>
      <ul>
        <% registrations.forEach(r => { %><li><%= r.event ? r.event.title : 'Event #' + r.event_id %> — registered <%= r.registered_at %></li><% }) %>
      </ul>
    <% } %>
    <h3>Reminder History</h3>
    <% if (!reminders.length) { %><p>No reminders sent.</p><% } else { %>
      <ul>
        <% reminders.forEach(r => { %><li><%= r.type %> — <%= r.sent_at %></li><% }) %>
      </ul>
    <% } %>
  </div>
</div>
<%- include('footer') %>`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync('views/' + name, content);
  console.log('✅ ' + name);
}
console.log('\nDone.');
