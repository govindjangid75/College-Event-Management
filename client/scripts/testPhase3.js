// CampusSphere Phase 3 - Comprehensive Verification Test Suite
// Verifies Spring Boot Java Backend, MongoDB Atlas Live Storage & 30-Min Venue Buffer Engine

const BASE_URL = 'http://localhost:8080/api';

async function runPhase3Tests() {
  console.log('========================================================================');
  console.log('🚀 CampusSphere Phase 3: Event Engine & 30-Min Buffer Verification Test');
  console.log('🏛️  Arya College of Engineering & IT (ACEIT), Jaipur');
  console.log('🍃 Target Database: MongoDB Atlas (Live Cloud Cluster)');
  console.log('☕ Backend Runtime: Java 21 / Spring Boot 3.3.4 (port 8080)');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Verify Venues from MongoDB Atlas
    console.log('👉 [1/6] Testing Institutional Venues in MongoDB Atlas...');
    const venuesRes = await fetch(`${BASE_URL}/venues`);
    const venuesData = await venuesRes.json();
    assert(venuesData.success === true, 'Venues API returns success: true');
    assert(Array.isArray(venuesData.data) && venuesData.data.length >= 6, `Retrieved ${venuesData.data?.length} Arya College venues`);
    
    const audiVenue = venuesData.data.find(v => v.code === 'AUDI_MAIN');
    assert(!!audiVenue, 'Dr. Radhakrishnan Central Auditorium (AUDI_MAIN) found in Atlas');

    // 2. Verify Clubs from MongoDB Atlas
    console.log('\n👉 [2/6] Testing Master 15 Clubs in MongoDB Atlas...');
    const clubsRes = await fetch(`${BASE_URL}/clubs`);
    const clubsData = await clubsRes.json();
    assert(clubsData.success === true, 'Clubs API returns success: true');
    assert(Array.isArray(clubsData.data) && clubsData.data.length === 15, `All 15 official Arya College clubs loaded from Atlas`);
    const testClub = clubsData.data[0];

    // 3. Verify Existing Events in MongoDB Atlas
    console.log('\n👉 [3/6] Testing Existing Events in MongoDB Atlas...');
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsData = await eventsRes.json();
    assert(eventsData.success === true, 'Events API returns success: true');
    assert(Array.isArray(eventsData.data) && eventsData.data.length > 0, `Events retrieved (${eventsData.data.length} events active)`);
    
    // Find an existing approved event to test collision against
    const existingEvt = eventsData.data.find(e => e.venueId === audiVenue.id && e.status === 'APPROVED');
    assert(!!existingEvt, `Found reference approved event at AUDI_MAIN: "${existingEvt?.title}"`);

    // 4. Test 30-Min Venue Buffer Clash Detection Engine
    console.log('\n👉 [4/6] Testing 30-Min Setup & Teardown Buffer Clash Detection...');
    // Existing event start: e.g. 2026-10-20T14:00:00Z. Setup buffer starts at 13:30:00Z.
    // We propose a slot ending at 13:45:00Z (within the setup buffer window!)
    const clashCheckPayload = {
      venueId: audiVenue.id,
      startTime: '2026-10-20T11:00:00Z',
      endTime: '2026-10-20T13:45:00Z', // 15 mins before existing event starts, but inside 30m setup buffer!
    };

    const clashRes = await fetch(`${BASE_URL}/venues/check-clash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clashCheckPayload),
    });
    const clashData = await clashRes.json();
    assert(clashData.data?.clash === true, 'Clash Engine successfully detected 30-min setup buffer collision!');
    assert(
      clashData.data?.bufferExplanation?.includes('30-min setup buffer'),
      'Buffer explanation details mandatory 30-min setup and teardown institutional rule'
    );
    assert(
      Array.isArray(clashData.data?.alternativeVenues) && clashData.data.alternativeVenues.length > 0,
      `Clash Engine suggested ${clashData.data?.alternativeVenues?.length} alternative available venues`
    );

    // 5. Propose a Valid Non-Conflicting Event
    console.log('\n👉 [5/6] Proposing New Non-Conflicting Institutional Event...');
    const validProposalPayload = {
      title: `Arya Autonomous Drone & Robotics Expo ${Date.now()}`,
      clubId: testClub.id,
      category: 'TECHNICAL',
      tags: ['Drones', 'Robotics', 'ACEIT'],
      shortSummary: 'State-level robotics design sprint and micro-UAV aerial demonstration at Ramanujan Seminar Hall.',
      descriptionMarkdown: 'Complete details on autonomous navigation, obstacle clearance, and AI vision compute units.',
      venueId: venuesData.data.find(v => v.code === 'SEM_A')?.id || audiVenue.id,
      startTime: '2026-11-05T10:00:00Z',
      endTime: '2026-11-05T15:00:00Z',
      registrationType: 'TEAM',
      minTeamSize: 2,
      maxTeamSize: 4,
      isPaid: false,
      ticketPrice: 0,
      maxCapacity: 120,
      activityPointsAwarded: 20,
    };

    const proposeRes = await fetch(`${BASE_URL}/events/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validProposalPayload),
    });
    const proposeData = await proposeRes.json();
    assert(proposeData.success === true, 'Event proposal accepted by backend');
    assert(proposeData.data?.status === 'PENDING_APPROVAL', 'Initial proposal status is PENDING_APPROVAL awaiting Dean');
    const createdEventId = proposeData.data?.id;

    // 6. Dean Approval Workflow
    console.log('\n👉 [6/6] Testing Dean Approval Workflow...');
    const approveRes = await fetch(
      `${BASE_URL}/events/${createdEventId}/approve?deanId=dean_arora_01&comments=Dean+Sanction+Granted`,
      { method: 'PUT' }
    );
    const approveData = await approveRes.json();
    assert(approveData.success === true, 'Dean approval processed successfully');
    assert(approveData.data?.status === 'APPROVED', 'Event status transitioned to APPROVED in MongoDB Atlas');
    assert(approveData.data?.approvedBy?.includes('Dean'), 'ApprovedBy audit trail records Dean authorization');

    console.log('\n========================================================================');
    console.log(`🏁 Phase 3 Verification Completed: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runPhase3Tests();
