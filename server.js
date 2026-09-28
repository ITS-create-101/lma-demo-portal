const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'demo-secret', resave: false, saveUninitialized: false }));
app.use((req, res, next) => { res.locals.user = req.session.user || null; next(); });

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return seedData();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function saveData(d) { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

function seedData() {
  const hash = bcrypt.hashSync('password123', 10);
  const d = {
    users: [
      { id: 1, name: 'Admin User', email: 'admin@lma.com', password: hash, role: 'admin' },
      { id: 2, name: 'Member User', email: 'member@lma.com', password: hash, role: 'member' },
      { id: 3, name: 'Board User', email: 'board@lma.com', password: hash, role: 'board' },
      { id: 4, name: 'Finance User', email: 'finance@lma.com', password: hash, role: 'finance' },
      { id: 5, name: 'Committee User', email: 'committee@lma.com', password: hash, role: 'committee' }
    ],
    members: [
      { id: 1, company: 'Marine Corp', contact_name: 'John Doe', email: 'john@marinecorp.com', phone: '+971 50 123 4567', industry: 'Marina', tier: 'Gold', country: 'UAE', status: 'Active', joined_date: '2025-01-15', renewal_date: '2026-10-15', membership_fee: 12000, website: 'https://marinecorp.example', description: 'Leading marina operator in the Gulf.' },
      { id: 2, company: 'Ocean Yachts', contact_name: 'Jane Smith', email: 'jane@oceanyachts.com', phone: '+971 50 765 4321', industry: 'Yacht', tier: 'Silver', country: 'UAE', status: 'Active', joined_date: '2025-03-20', renewal_date: '2026-10-20', membership_fee: 8000, website: 'https://oceanyachts.example', description: 'Luxury yacht sales and brokerage.' },
      { id: 3, company: 'Gulf Marine Services', contact_name: 'Ali Hassan', email: 'ali@gulfmarine.ae', phone: '+971 50 111 2222', industry: 'Services', tier: 'Gold', country: 'UAE', status: 'Active', joined_date: '2025-06-10', renewal_date: '2026-11-01', membership_fee: 12000, website: 'https://gulfmarine.example', description: 'Marine maintenance and engineering.' },
      { id: 4, company: 'Dubai Diving Co', contact_name: 'Sara Khan', email: 'sara@dubaidiving.ae', phone: '+971 50 333 4444', industry: 'Diving', tier: 'Bronze', country: 'UAE', status: 'Active', joined_date: '2025-09-01', renewal_date: '2026-12-01', membership_fee: 5000, website: 'https://dubaidiving.example', description: 'Diving equipment and training.' }
    ],
    applications: [
      { id: 1, company: 'Abu Dhabi Sailing Club', trade_license: 'CN-1234567', website: 'https://adsailing.example', country: 'UAE', industry: 'Sailing', contact_name: 'Rashid Al Marri', job_title: 'General Manager', email: 'rashid@adsailing.ae', phone: '+971 50 999 8888', q_industry: 'Yes', q_license: 'Yes', eligible: true, references: [ { name: 'John Doe', company: 'Marine Corp', email: 'john@marinecorp.com' }, { name: 'Jane Smith', company: 'Ocean Yachts', email: 'jane@oceanyachts.com' } ], tier: 'Silver', bio: 'Abu Dhabi Sailing Club promotes sailing across the Emirates.', logo_url: '', agreed: { articles: true, aims: true, understand: true, logo: true, truth: true }, status: 'Pending', submitted_at: '2026-09-20', notes: 'Referred by Marine Corp' }
    ],
    events: [
      { id: 1, title: 'Annual Marine Expo', date: '2026-11-10', location: 'Dubai World Trade Centre', description: 'Networking and exhibition.' },
      { id: 2, title: 'Members Networking Night', date: '2026-12-05', location: 'Abu Dhabi Marina', description: 'Casual networking.' }
    ],
    resources: [
      { id: 1, title: 'LMA Membership Guide', type: 'PDF', url: '#', description: 'Guide for new members.' },
      { id: 2, title: 'Industry Report 2026', type: 'PDF', url: '#', description: 'Latest marine industry report.' }
    ],
    registrations: [
      { id: 1, event_id: 1, member_id: 1, registered_at: '2026-09-01' },
      { id: 2, event_id: 1, member_id: 2, registered_at: '2026-09-05' }
    ],
    invoices: [
      { id: 1, member_id: 1, amount: 12000, status: 'Paid', issued_date: '2026-01-15', paid_date: '2026-01-20', description: 'Annual membership 2026' },
      { id: 2, member_id: 2, amount: 8000, status: 'Paid', issued_date: '2026-03-20', paid_date: '2026-03-25', description: 'Annual membership 2026' },
      { id: 3, member_id: 3, amount: 12000, status: 'Pending', issued_date: '2026-06-10', paid_date: null, description: 'Annual membership 2026' },
      { id: 4, member_id: 4, amount: 5000, status: 'Overdue', issued_date: '2026-09-01', paid_date: null, description: 'Annual membership 2026' }
    ],
    reminders: [ { id: 1, member_id: 1, sent_at: '2026-09-15', type: 'Renewal reminder (30 days)', status: 'Sent' } ],
    sponsors: [
      { id: 1, company: 'Emirates Marine Group', tier: 'Platinum', contact_name: 'Khalid Bin Saeed', email: 'khalid@emiratesmarine.ae', phone: '+971 50 555 1111', amount: 50000, contract_start: '2026-01-01', contract_end: '2026-12-31' },
      { id: 2, company: 'Gulf Boat Builders', tier: 'Gold', contact_name: 'Nadia Al Farsi', email: 'nadia@gulfboats.ae', phone: '+971 50 555 2222', amount: 25000, contract_start: '2026-03-01', contract_end: '2027-02-28' }
    ],
    committees: [
      { id: 1, name: 'Events Committee', chair: 'John Doe', members: ['John Doe', 'Jane Smith', 'Ali Hassan'] },
      { id: 2, name: 'Membership Committee', chair: 'Sara Khan', members: ['Sara Khan', 'Jane Smith'] },
      { id: 3, name: 'Marketing Committee', chair: 'Ali Hassan', members: ['Ali Hassan', 'John Doe'] }
    ],
    campaigns: [
      { id: 1, name: 'September Newsletter', subject: 'LMA MENA News — September', segment: 'All members', recipients: 4, sent_at: '2026-09-01', status: 'Sent' },
      { id: 2, name: 'Expo Invite', subject: 'Join us at Annual Marine Expo', segment: 'Gold tier', recipients: 2, sent_at: '2026-09-15', status: 'Sent' }
    ],
    newsletters: [],
    audit: [ { id: 1, action: 'System seeded', actor: 'system', at: new Date().toISOString() } ]
  };
  saveData(d);
  return d;
}

let db = loadData();

function logAudit(action, actor) {
  db.audit.unshift({ id: db.audit.length + 1, action, actor: actor || 'system', at: new Date().toISOString() });
  if (db.audit.length > 100) db.audit = db.audit.slice(0, 100);
  saveData(db);
}

app.get('/', (req, res) => {
  res.render('public-home', {
    featuredMembers: db.members.slice(0, 4),
    upcomingEvents: db.events.slice(0, 3)
  });
});

app.get('/about', (req, res) => res.render('public-about', { committees: db.committees }));
app.get('/public-members', (req, res) => res.render('public-members', { members: db.members }));
app.get('/public-events', (req, res) => res.render('public-events', { events: db.events }));
app.get('/contact', (req, res) => res.render('public-contact', { sent: req.query.sent === '1' }));
app.post('/contact', (req, res) => {
  db.contacts = db.contacts || [];
  db.contacts.push({ id: db.contacts.length + 1, name: req.body.name, email: req.body.email, company: req.body.company, message: req.body.message, at: new Date().toISOString() });
  saveData(db);
  logAudit('Contact form: ' + req.body.email, req.body.email);
  res.redirect('/contact?sent=1');
});function requireLogin(req, res, next) { if (!req.session.user) return res.redirect('/login'); next(); }
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    if (!roles.includes(req.session.user.role)) return res.status(403).send('Access denied');
    next();
  };
}

app.get('/', (req, res) => res.render('home', { events: db.events.slice(0, 3), signedUp: req.query.signup === '1' }));

app.post('/newsletter', (req, res) => {
  db.newsletters.push({ id: db.newsletters.length + 1, email: req.body.email, at: new Date().toISOString() });
  saveData(db);
  res.redirect('/?signup=1');
});

app.get('/apply', (req, res) => res.render('apply', { success: false }));

app.post('/apply', (req, res) => {
  const eligible = req.body.q_industry === 'Yes' && req.body.q_license === 'Yes';
  db.applications.push({
    id: db.applications.length + 1,
    company: req.body.company,
    trade_license: req.body.trade_license,
    website: req.body.website,
    country: req.body.country,
    industry: req.body.industry,
    contact_name: req.body.contact_name,
    job_title: req.body.job_title,
    email: req.body.email,
    phone: req.body.phone,
    q_industry: req.body.q_industry,
    q_license: req.body.q_license,
    eligible,
    references: [
      { name: req.body.ref1_name, company: req.body.ref1_company, email: req.body.ref1_email },
      { name: req.body.ref2_name, company: req.body.ref2_company, email: req.body.ref2_email }
    ],
    tier: req.body.tier,
    bio: req.body.bio,
    logo_url: req.body.logo_url,
    agreed: { articles: !!req.body.agree_articles, aims: !!req.body.agree_aims, understand: !!req.body.agree_understand, logo: !!req.body.agree_logo, truth: !!req.body.agree_truth },
    status: 'Pending',
    submitted_at: new Date().toISOString().slice(0, 10),
    notes: ''
  });
  logAudit('Application received: ' + req.body.company, req.body.email);
  res.render('apply', { success: true });
});

app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', (req, res) => {
  const user = db.users.find(u => u.email === req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.password))
    return res.render('login', { error: 'Invalid email or password' });
  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  logAudit('Login: ' + user.email, user.email);
  res.redirect('/dashboard');
});
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

app.get('/dashboard', requireLogin, (req, res) => {
  const member = db.members.find(m => m.email === req.session.user.email);
  const role = req.session.user.role;
  const stats = {
    members: db.members.length,
    events: db.events.length,
    registrations: db.registrations.length,
    revenue: db.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
    pending: db.invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0),
    applications: db.applications.filter(a => a.status === 'Pending').length,
    sponsors: db.sponsors.length,
    sponsorshipRevenue: db.sponsors.reduce((s, x) => s + x.amount, 0)
  };
  const upcomingRenewals = db.members.filter(m => m.renewal_date)
    .sort((a, b) => a.renewal_date.localeCompare(b.renewal_date)).slice(0, 5)
    .map(m => ({ ...m, days: Math.ceil((new Date(m.renewal_date) - new Date()) / 86400000) }));
  res.render('dashboard', { member, stats, role, upcomingRenewals, activity: db.audit.slice(0, 8) });
});

app.get('/members', requireLogin, (req, res) => {
  let list = [...db.members];
  const q = (req.query.q || '').toLowerCase();
  const tier = req.query.tier || '';
  const industry = req.query.industry || '';
  const country = req.query.country || '';
  if (q) list = list.filter(m => (m.company + m.contact_name + m.email).toLowerCase().includes(q));
  if (tier) list = list.filter(m => m.tier === tier);
  if (industry) list = list.filter(m => m.industry === industry);
  if (country) list = list.filter(m => m.country === country);
  res.render('members', {
    members: list,
    tiers: [...new Set(db.members.map(m => m.tier))],
    industries: [...new Set(db.members.map(m => m.industry))],
    countries: [...new Set(db.members.map(m => m.country))],
    q: req.query.q || '', tier, industry, country
  });
});

app.get('/members/:id', requireLogin, (req, res) => {
  const member = db.members.find(m => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).send('Member not found');
  const invoices = db.invoices.filter(i => i.member_id === member.id);
  const registrations = db.registrations.filter(r => r.member_id === member.id)
    .map(r => ({ ...r, event: db.events.find(e => e.id === r.event_id) }));
  const reminders = db.reminders.filter(r => r.member_id === member.id);
  res.render('member-profile', { member, invoices, registrations, reminders });
});

app.get('/events', requireLogin, (req, res) => {
  const member = db.members.find(m => m.email === req.session.user.email);
  const regs = member ? db.registrations.filter(r => r.member_id === member.id).map(r => r.event_id) : [];
  res.render('events', { events: db.events, registeredEventIds: regs, member });
});
app.post('/events/:id/register', requireLogin, (req, res) => {
  const eventId = parseInt(req.params.id);
  const member = db.members.find(m => m.email === req.session.user.email);
  if (!member) return res.status(400).send('Only members can register.');
  if (!db.registrations.find(r => r.event_id === eventId && r.member_id === member.id)) {
    db.registrations.push({ id: db.registrations.length + 1, event_id: eventId, member_id: member.id, registered_at: new Date().toISOString().slice(0, 10) });
    logAudit('Event registration: ' + member.company, req.session.user.email);
  }
  res.redirect('/events');
});
app.get('/admin/events/:id/attendees', requireRole(['admin', 'board', 'committee']), (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = db.events.find(e => e.id === eventId);
  const attendees = db.registrations.filter(r => r.event_id === eventId)
    .map(r => ({ ...r, member: db.members.find(m => m.id === r.member_id) }));
  res.render('event-attendees', { event, attendees });
});

app.get('/resources', requireLogin, (req, res) => res.render('resources', { resources: db.resources }));

app.get('/admin/renewals', requireRole(['admin', 'finance']), (req, res) => {
  const now = new Date();
  const withDays = db.members.map(m => ({ ...m, days: m.renewal_date ? Math.ceil((new Date(m.renewal_date) - now) / 86400000) : null }))
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));
  res.render('renewals', { members: withDays, reminders: db.reminders, sent: req.query.sent });
});
app.post('/admin/renewals/:id/remind', requireRole(['admin', 'finance']), (req, res) => {
  const memberId = parseInt(req.params.id);
  db.reminders.push({ id: db.reminders.length + 1, member_id: memberId, sent_at: new Date().toISOString().slice(0, 10), type: 'Renewal reminder (manual)', status: 'Sent' });
  logAudit('Reminder sent to member #' + memberId, req.session.user.email);
  res.redirect('/admin/renewals');
});
app.post('/admin/renewals/bulk', requireRole(['admin', 'finance']), (req, res) => {
  const now = new Date();
  let count = 0;
  db.members.forEach(m => {
    if (!m.renewal_date) return;
    const days = Math.ceil((new Date(m.renewal_date) - now) / 86400000);
    if (days < 30) {
      db.reminders.push({ id: db.reminders.length + 1, member_id: m.id, sent_at: new Date().toISOString().slice(0, 10), type: 'Renewal reminder (bulk <30d)', status: 'Sent' });
      count++;
    }
  });
  logAudit('Bulk reminders sent to ' + count + ' members', req.session.user.email);
  res.redirect('/admin/renewals?sent=' + count);
});

app.get('/admin/payments', requireRole(['admin', 'finance']), (req, res) => {
  const invoices = db.invoices.map(i => ({ ...i, member: db.members.find(m => m.id === i.member_id) }))
    .sort((a, b) => b.issued_date.localeCompare(a.issued_date));
  const totals = {
    paid: db.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
    pending: db.invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0),
    overdue: db.invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)
  };
  res.render('payments', { invoices, totals });
});
app.post('/admin/payments/:id/pay', requireRole(['admin', 'finance']), (req, res) => {
  const inv = db.invoices.find(i => i.id === parseInt(req.params.id));
  if (inv) { inv.status = 'Paid'; inv.paid_date = new Date().toISOString().slice(0, 10); logAudit('Invoice INV-' + String(inv.id).padStart(4, '0') + ' marked paid', req.session.user.email); }
  res.redirect('/admin/payments');
});

app.get('/admin/reports', requireRole(['admin', 'board', 'finance']), (req, res) => {
  const memberGrowth = {};
  db.members.forEach(m => { const month = m.joined_date.slice(0, 7); memberGrowth[month] = (memberGrowth[month] || 0) + 1; });
  const months = Object.keys(memberGrowth).sort();
  let cumulative = 0;
  const growthData = months.map(m => (cumulative += memberGrowth[m]));
  const revenueByMonth = {};
  db.invoices.filter(i => i.status === 'Paid').forEach(i => { const month = i.paid_date.slice(0, 7); revenueByMonth[month] = (revenueByMonth[month] || 0) + i.amount; });
  const revenueLabels = Object.keys(revenueByMonth).sort();
  const revenueData = revenueLabels.map(m => revenueByMonth[m]);
  const tierCounts = {};
  db.members.forEach(m => { tierCounts[m.tier] = (tierCounts[m.tier] || 0) + 1; });
  res.render('reports', {
    growthLabels: JSON.stringify(months),
    growthData: JSON.stringify(growthData),
    revenueLabels: JSON.stringify(revenueLabels),
    revenueData: JSON.stringify(revenueData),
    tierLabels: JSON.stringify(Object.keys(tierCounts)),
    tierData: JSON.stringify(Object.values(tierCounts))
  });
});

app.get('/admin/members', requireRole(['admin']), (req, res) => res.render('admin-members', { members: db.members }));
app.post('/admin/members', requireRole(['admin']), (req, res) => {
  db.members.push({
    id: db.members.length + 1,
    company: req.body.company, contact_name: req.body.contact_name,
    email: req.body.email, phone: req.body.phone,
    industry: req.body.industry, tier: req.body.tier, country: req.body.country,
    status: req.body.status || 'Active',
    joined_date: new Date().toISOString().slice(0, 10),
    renewal_date: req.body.renewal_date || new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
    membership_fee: parseInt(req.body.membership_fee) || 0,
    website: req.body.website || '', description: req.body.description || ''
  });
  logAudit('Member added: ' + req.body.company, req.session.user.email);
  res.redirect('/admin/members');
});

app.post('/admin/members/:id/logo', requireRole(['admin']), (req, res) => {
  const m = db.members.find(x => x.id === parseInt(req.params.id));
  if (m) {
    m.logo_url = req.body.logo_url || '';
    saveData(db);
    logAudit('Logo updated for ' + m.company, req.session.user.email);
  }
  res.redirect('/admin/members');
});
app.get('/admin/applications', requireRole(['admin']), (req, res) => res.render('applications', { applications: db.applications }));
app.post('/admin/applications/:id/approve', requireRole(['admin']), (req, res) => {
  const a = db.applications.find(x => x.id === parseInt(req.params.id));
  if (a) {
    a.status = 'Approved';
    db.members.push({
      id: db.members.length + 1,
      company: a.company, contact_name: a.contact_name, email: a.email, phone: a.phone,
      industry: a.industry, tier: a.tier, country: a.country, status: 'Active',
      joined_date: new Date().toISOString().slice(0, 10),
      renewal_date: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      membership_fee: a.tier === 'Gold' ? 12000 : a.tier === 'Silver' ? 8000 : 5000,
      website: a.website, description: a.bio
    });
    logAudit('Application approved: ' + a.company, req.session.user.email);
  }
  res.redirect('/admin/applications');
});
app.post('/admin/applications/:id/reject', requireRole(['admin']), (req, res) => {
  const a = db.applications.find(x => x.id === parseInt(req.params.id));
  if (a) { a.status = 'Rejected'; logAudit('Application rejected: ' + a.company, req.session.user.email); }
  res.redirect('/admin/applications');
});

app.get('/admin/sponsors', requireRole(['admin', 'board']), (req, res) => {
  res.render('sponsors', { sponsors: db.sponsors, total: db.sponsors.reduce((s, x) => s + x.amount, 0) });
});
app.post('/admin/sponsors', requireRole(['admin']), (req, res) => {
  db.sponsors.push({
    id: db.sponsors.length + 1,
    company: req.body.company, tier: req.body.tier,
    contact_name: req.body.contact_name, email: req.body.email, phone: req.body.phone,
    amount: parseInt(req.body.amount) || 0,
    contract_start: req.body.contract_start, contract_end: req.body.contract_end
  });
  logAudit('Sponsor added: ' + req.body.company, req.session.user.email);
  res.redirect('/admin/sponsors');
});

app.get('/committees', requireLogin, (req, res) => res.render('committees', { committees: db.committees }));

app.get('/admin/campaigns', requireRole(['admin', 'board']), (req, res) => res.render('campaigns', { campaigns: db.campaigns, sent: req.query.sent }));
app.post('/admin/campaigns', requireRole(['admin', 'board']), (req, res) => {
  const seg = req.body.segment;
  const recipients = seg === 'Gold tier' ? db.members.filter(m => m.tier === 'Gold').length
    : seg === 'Silver tier' ? db.members.filter(m => m.tier === 'Silver').length
    : db.members.length;
  db.campaigns.unshift({
    id: db.campaigns.length + 1,
    name: req.body.name, subject: req.body.subject, segment: seg,
    recipients, sent_at: new Date().toISOString().slice(0, 10), status: 'Sent'
  });
  logAudit('Campaign sent: ' + req.body.name, req.session.user.email);
  res.redirect('/admin/campaigns?sent=' + recipients);
});

app.get('/admin/audit', requireRole(['admin']), (req, res) => res.render('audit', { entries: db.audit }));

app.listen(PORT, () => console.log('Demo portal running at http://localhost:' + PORT));
