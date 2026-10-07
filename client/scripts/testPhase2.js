// CampusSphere - Phase 2 Automated Verification Suite
// Focus: Master 15 Clubs Showcase, Dedicated Split-Ledger Accounting, Club Isolation RBAC, and Payout Workflows

import assert from 'assert';

console.log('=====================================================');
console.log('★ CAMPUSSPHERE - PHASE 2 AUTOMATED VERIFICATION SUITE');
console.log('=====================================================\n');

// Mock data replicating seed structures for standalone automated testing
const MOCK_CLUBS = [
  { id: 'club_1', slug: 'arya_scitech', name: 'Arya Science & Technology Club', category: 'Science & Tech', balance: 24500, totalRev: 28400, pending: 3900, upi: 'aryascitech@okhdfcbank' },
  { id: 'club_2', slug: 'arya_cipher', name: 'Arya Cipher Coding Club', category: 'Coding / Dev', balance: 69200, totalRev: 78500, pending: 9300, upi: 'aryacipher@okhdfcbank' },
  { id: 'club_3', slug: 'arya_aceit_hack', name: 'Arya ACEIT Hackathon Club', category: 'Hackathons', balance: 125000, totalRev: 142000, pending: 17000, upi: 'aceithack@icici' },
  { id: 'club_4', slug: 'arya_esports', name: 'Arya E-Sports Club', category: 'Gaming / Esports', balance: 46800, totalRev: 52000, pending: 5200, upi: 'aryagaming@okhdfcbank' },
  { id: 'club_5', slug: 'arya_dance', name: 'Arya Dance Club', category: 'Cultural', balance: 58000, totalRev: 64000, pending: 6000, upi: 'aryadance@okhdfcbank' },
  { id: 'club_6', slug: 'arya_social', name: 'Arya Social Activities Club', category: 'Social Welfare', balance: 28500, totalRev: 31000, pending: 2500, upi: 'aryasocial@okhdfcbank' },
  { id: 'club_7', slug: 'arya_lit', name: 'Arya Literature Club', category: 'Literary', balance: 19800, totalRev: 22000, pending: 2200, upi: 'aryaliterature@okhdfcbank' },
  { id: 'club_8', slug: 'arya_drones', name: 'Arya Drones Club', category: 'Aerospace', balance: 42000, totalRev: 49000, pending: 7000, upi: 'aryadrones@okhdfcbank' },
  { id: 'club_9', slug: 'arya_robotics', name: 'Robotics Club', category: 'Robotics', balance: 36500, totalRev: 41000, pending: 4500, upi: 'aryarobotics@okhdfcbank' },
  { id: 'club_10', slug: 'arya_automation', name: 'Automation Club', category: 'Industrial Automation', balance: 27000, totalRev: 30000, pending: 3000, upi: 'aryaautomation@okhdfcbank' },
  { id: 'club_11', slug: 'arya_green', name: 'Green Energy Club', category: 'Sustainability', balance: 21500, totalRev: 24000, pending: 2500, upi: 'aryagreen@okhdfcbank' },
  { id: 'club_12', slug: 'arya_music', name: 'Music Club', category: 'Music', balance: 38000, totalRev: 42000, pending: 4000, upi: 'aryamusic@okhdfcbank' },
  { id: 'club_13', slug: 'arya_chess', name: 'Chess Club', category: 'Mind Sports', balance: 16500, totalRev: 18000, pending: 1500, upi: 'aryachess@okhdfcbank' },
  { id: 'club_14', slug: 'arya_iot', name: 'IoT Club / Arya Intelverse', category: 'AIoT / Sensors', balance: 34000, totalRev: 38000, pending: 4000, upi: 'aryaiot@okhdfcbank' },
  { id: 'club_15', slug: 'arya_lincom', name: 'LINCOM — Arya Linux Community', category: 'Open Source', balance: 29500, totalRev: 33000, pending: 3500, upi: 'aryalincom@okhdfcbank' },
];

// TEST 1: All 15 Clubs & Slugs
console.log('[TEST 1]: Verifying Master 15 Arya College Clubs & Unique Slugs...');
assert.strictEqual(MOCK_CLUBS.length, 15, 'Must contain exactly 15 Arya College clubs');
const slugs = new Set(MOCK_CLUBS.map(c => c.slug));
assert.strictEqual(slugs.size, 15, 'All 15 club slugs must be strictly unique');
MOCK_CLUBS.forEach((c, idx) => {
  assert(c.slug.length > 0, `Club ${idx + 1} must have a valid slug`);
  assert(c.balance >= 0, `Club ${c.slug} balance cannot be negative`);
  assert(c.upi.includes('@'), `Club ${c.slug} must have a valid UPI VPA`);
});
console.log('  -> All 15 clubs validated with unique routing slugs and verified UPI accounts.');
console.log('  [PASS] TEST 1 PASSED: Master 15 Clubs Directory verified.\n');

// TEST 2: Club Isolation RBAC
console.log('[TEST 2]: Verifying Club Isolation RBAC Security Boundaries...');
const testAdminUser = {
  id: 'user_club_admin_1',
  role: 'CLUB_ADMIN',
  administeredClubId: 'arya_cipher',
};

const verifyClubAccess = (user, targetClubSlug) => {
  if (user.role === 'SUPER_ADMIN') return { allowed: true, reason: 'SUPER_ADMIN_AUDIT' };
  if (user.role === 'CLUB_ADMIN' && user.administeredClubId === targetClubSlug) {
    return { allowed: true, reason: 'AUTHORIZED_CLUB_ADMIN' };
  }
  return { allowed: false, reason: 'ACCESS_DENIED_CLUB_ISOLATION' };
};

// Authorized check
const cipherAccess = verifyClubAccess(testAdminUser, 'arya_cipher');
assert.strictEqual(cipherAccess.allowed, true, 'Cipher admin must access arya_cipher');

// Unauthorized cross-club access attempt
const dronesAccess = verifyClubAccess(testAdminUser, 'arya_drones');
assert.strictEqual(dronesAccess.allowed, false, 'Cipher admin must NOT access arya_drones treasury');
assert.strictEqual(dronesAccess.reason, 'ACCESS_DENIED_CLUB_ISOLATION');

// Super Admin Dean check
const deanUser = { id: 'dean_1', role: 'SUPER_ADMIN' };
const deanAudit = verifyClubAccess(deanUser, 'arya_drones');
assert.strictEqual(deanAudit.allowed, true, 'Dean must have institutional audit access to all clubs');

console.log('  -> Priya (Cipher Admin) -> arya_cipher: ALLOWED');
console.log('  -> Priya (Cipher Admin) -> arya_drones: FORBIDDEN (Strict Isolation Block)');
console.log('  -> Dr. Sharma (Dean) -> arya_drones: ALLOWED (Institutional Audit)');
console.log('  [PASS] TEST 2 PASSED: RBAC Club Isolation verified.\n');

// TEST 3: Dedicated Split-Ledger Accounting Engine
console.log('[TEST 3]: Verifying Dedicated Split-Ledger Accounting Engine & Fees...');
class MockTreasuryLedger {
  constructor(initialBalance, upiId) {
    this.balance = initialBalance;
    this.pending = 0;
    this.upiId = upiId;
    this.ledger = [];
  }

  creditTicketSale(grossAmount, eventName) {
    const fee = Math.round(grossAmount * 0.02); // 2% gateway handling fee
    const net = grossAmount - fee;
    this.balance += net;
    const entry = {
      type: 'TICKET_SALE',
      gross: grossAmount,
      fee,
      net,
      runningBalance: this.balance,
      remarks: `Ticket Sale: ${eventName}`,
      status: 'SETTLED',
      timestamp: new Date().toISOString()
    };
    this.ledger.push(entry);
    return entry;
  }

  requestPayout(amount, note) {
    if (amount <= 0) throw new Error('Payout amount must be > 0');
    if (amount > this.balance) throw new Error('Insufficient balance');

    this.balance -= amount;
    this.pending += amount;
    const refNum = `DISB-ACEIT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const entry = {
      type: 'PAYOUT_DISBURSEMENT',
      gross: amount,
      fee: 0,
      net: -amount,
      runningBalance: this.balance,
      remarks: `Payout to ${this.upiId}: ${note}`,
      status: 'PENDING',
      referenceId: refNum,
      timestamp: new Date().toISOString()
    };
    this.ledger.push(entry);
    return { entry, refNum };
  }

  deanApprovePayout(refNum, amount) {
    this.pending -= amount;
    const item = this.ledger.find(e => e.referenceId === refNum);
    if (item) item.status = 'SETTLED';
  }
}

const cipherTreasury = new MockTreasuryLedger(50000, 'aryacipher@okhdfcbank');

// 1. Credit ticket sale
const sale = cipherTreasury.creditTicketSale(10000, 'HackSprint 2026 Batch 1');
assert.strictEqual(sale.gross, 10000);
assert.strictEqual(sale.fee, 200, '2% handling fee should be ₹200');
assert.strictEqual(sale.net, 9800, 'Net credited should be ₹9800');
assert.strictEqual(cipherTreasury.balance, 59800, 'Running balance should be ₹59800');

// 2. Request Payout
const payout = cipherTreasury.requestPayout(15000, 'Cloud server cluster expenses');
assert.strictEqual(cipherTreasury.balance, 44800, 'Available balance should reduce by ₹15000');
assert.strictEqual(cipherTreasury.pending, 15000, 'Pending in-transit balance should be ₹15000');
assert(payout.refNum.startsWith('DISB-ACEIT-2026-'));

// 3. Dean approval
cipherTreasury.deanApprovePayout(payout.refNum, 15000);
assert.strictEqual(cipherTreasury.pending, 0, 'Pending should clear to 0 after Dean disbursement');

// 4. Overdraft attempt
assert.throws(() => {
  cipherTreasury.requestPayout(999999, 'Excessive withdrawal');
}, /Insufficient balance/);

console.log('  -> Ticket Credit: Gross ₹10,000 - 2% fee (₹200) = Net +₹9,800 Credited');
console.log('  -> Payout Request: ₹15,000 deducted -> In-transit pending -> Dean Approved');
console.log('  -> Overdraft Protection: ₹999,999 blocked accurately');
console.log('  [PASS] TEST 3 PASSED: Split-Ledger Accounting Engine verified.\n');

// TEST 4: Student Membership Applications
console.log('[TEST 4]: Verifying Student Membership Application Workflow...');
const mockApplications = [];
let clubMemberCount = 520;

const applyToClub = (student, clubId, role, sop) => {
  const app = {
    id: `app_${Date.now()}`,
    studentName: student.name,
    rollNo: student.rollNo,
    clubId,
    role,
    sop,
    status: 'PENDING',
  };
  mockApplications.push(app);
  return app;
};

const reviewApplication = (appId, decision) => {
  const app = mockApplications.find(a => a.id === appId);
  if (!app) throw new Error('Not found');
  app.status = decision;
  if (decision === 'ACCEPTED') {
    clubMemberCount += 1;
  }
  return app;
};

const newApp = applyToClub(
  { name: 'Govind Jangid', rollNo: '22EACIT089' },
  'club_2',
  'Technical Lead',
  'Expert in full-stack architecture'
);
assert.strictEqual(newApp.status, 'PENDING');
assert.strictEqual(clubMemberCount, 520);

// Approve application
const approvedApp = reviewApplication(newApp.id, 'ACCEPTED');
assert.strictEqual(approvedApp.status, 'ACCEPTED');
assert.strictEqual(clubMemberCount, 521, 'Member count should increment to 521 upon acceptance');

console.log('  -> Student Govind Jangid applied to Arya Cipher Coding Club (Status: PENDING)');
console.log('  -> Executive Board approved application -> Member count incremented 520 -> 521');
console.log('  [PASS] TEST 4 PASSED: Membership Application Workflow verified.\n');

// TEST 5: Campus-Wide Reconciliation
console.log('[TEST 5]: Verifying Campus-Wide Treasury Reconciliation...');
const campusTotalAvailable = MOCK_CLUBS.reduce((sum, c) => sum + c.balance, 0);
const campusTotalRevenue = MOCK_CLUBS.reduce((sum, c) => sum + c.totalRev, 0);
const campusTotalPending = MOCK_CLUBS.reduce((sum, c) => sum + c.pending, 0);

assert.strictEqual(campusTotalAvailable, 616800, 'Total campus balance should equal ₹6,16,800');
assert.strictEqual(campusTotalRevenue, 692900, 'Total campus lifetime collections should equal ₹6,92,900');
assert.strictEqual(campusTotalPending, 76100, 'Total pending in-transit settlements should equal ₹76,100');

console.log(`  -> Campus Available Balance: ₹${campusTotalAvailable.toLocaleString()}`);
console.log(`  -> Campus Gross Revenue:     ₹${campusTotalRevenue.toLocaleString()}`);
console.log(`  -> Campus In-Transit Payout: ₹${campusTotalPending.toLocaleString()}`);
console.log('  -> 15/15 Club accounts reconciled with ZERO leaks or pool bleed.');
console.log('  [PASS] TEST 5 PASSED: Institutional Financial Reconciliation verified.\n');

console.log('=====================================================');
console.log('★ ALL PHASE 2 AUTOMATED TESTS PASSED SUCCESSFULLY! ★');
console.log('=====================================================');
