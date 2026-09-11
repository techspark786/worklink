const assert = require('assert');

const API_BASE = 'http://localhost:5000/api';
const AI_BASE = 'http://localhost:8000';

async function runTests() {
  console.log('🧪 Starting ShramSetu Full Platform Test Suite...\n');
  const timestamp = Date.now();

  // ==========================================
  // TEST 1: New Worker Registration & Profile
  // ==========================================
  console.log('▶ [TEST 1] Registering New Worker with Profile Setup...');
  const workerEmail = `vikas.worker.${timestamp}@shramsetu.in`;
  const workerRegPayload = {
    name: 'Vikas Sahu',
    email: workerEmail,
    password: 'password123',
    role: 'WORKER',
    phone: '+91 94500 12345',
    profession: 'Plumber',
    skills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings'],
    experienceYears: 5,
    hourlyRate: 450,
    serviceRadiusKm: 10,
    isAvailable: true,
    about: 'Experienced licensed plumber with 5 years cooperative background in Lucknow.',
    address: 'Sector 14, Indira Nagar',
    city: 'Lucknow',
  };

  const regWorkerRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workerRegPayload),
  });
  assert.strictEqual(regWorkerRes.status, 201, `Worker registration failed: ${regWorkerRes.status}`);
  const workerData = await regWorkerRes.json();
  assert(workerData.token, 'Worker JWT token missing');
  assert.strictEqual(workerData.user.name, 'Vikas Sahu');
  assert.strictEqual(workerData.user.role, 'WORKER');
  assert(workerData.user.workerProfile, 'Worker profile missing from registration');
  assert.strictEqual(workerData.user.workerProfile.profession, 'Plumber');
  assert.strictEqual(workerData.user.workerProfile.hourlyRate, 450);
  console.log('  ✔ Worker account created with unique ID:', workerData.user.id);
  console.log('  ✔ Worker profile created with profession:', workerData.user.workerProfile.profession);

  // Verify Worker Profile via GET /api/workers/me
  const workerMeRes = await fetch(`${API_BASE}/workers/me`, {
    headers: { Authorization: `Bearer ${workerData.token}` },
  });
  assert.strictEqual(workerMeRes.status, 200, 'GET /workers/me failed');
  const workerMeData = await workerMeRes.json();
  assert.strictEqual(workerMeData.worker.profession, 'Plumber');
  assert.strictEqual(workerMeData.worker.userId.name, 'Vikas Sahu');
  console.log('  ✔ GET /workers/me loaded exact authenticated worker (Not Ramesh Kumar)');

  // Verify Worker Bookings is strictly empty for new worker
  const workerBookingsRes = await fetch(`${API_BASE}/bookings?workerId=${workerMeData.worker._id}`);
  const workerBookingsData = await workerBookingsRes.json();
  assert.strictEqual(workerBookingsData.bookings.length, 0, 'New worker should have 0 bookings initially');
  console.log('  ✔ New worker has 0 bookings (No demo orders like ORD-8492 leaked)\n');

  // ==========================================
  // TEST 2: New Customer Registration & Isolation
  // ==========================================
  console.log('▶ [TEST 2] Registering New Customer...');
  const customerEmail = `priya.customer.${timestamp}@shramsetu.in`;
  const customerRegPayload = {
    name: 'Priya Singh',
    email: customerEmail,
    password: 'password123',
    role: 'CUSTOMER',
    phone: '+91 98765 44332',
    address: 'Flat 102, Gomti Nagar',
    city: 'Lucknow',
    pincode: '226010',
  };

  const regCustomerRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerRegPayload),
  });
  assert.strictEqual(regCustomerRes.status, 201, `Customer registration failed: ${regCustomerRes.status}`);
  const customerData = await regCustomerRes.json();
  assert(customerData.token, 'Customer token missing');
  assert.strictEqual(customerData.user.name, 'Priya Singh');
  assert.strictEqual(customerData.user.role, 'CUSTOMER');
  console.log('  ✔ Customer account created with unique ID:', customerData.user.id);

  // Verify Customer Bookings is strictly empty for new customer
  const customerBookingsRes = await fetch(`${API_BASE}/bookings?customerId=${customerData.user.id}`);
  const customerBookingsData = await customerBookingsRes.json();
  assert.strictEqual(customerBookingsData.bookings.length, 0, 'New customer should have 0 bookings initially');
  console.log('  ✔ New customer has 0 bookings (No demo bookings b-demo-1 or b-demo-2 leaked)\n');

  // ==========================================
  // TEST 3: Login Authentication & Credentials Verification
  // ==========================================
  console.log('▶ [TEST 3] Testing Authentication & Login Verification...');
  // Valid Worker Login
  const loginWorkerRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: workerEmail, password: 'password123' }),
  });
  assert.strictEqual(loginWorkerRes.status, 200, 'Valid worker login failed');
  const loginWorkerData = await loginWorkerRes.json();
  assert.strictEqual(loginWorkerData.user.role, 'WORKER');
  assert(loginWorkerData.user.workerProfile, 'Logged in worker must have linked workerProfile');
  console.log('  ✔ Worker login successful -> role = WORKER, token persisted');

  // Valid Customer Login
  const loginCustRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: customerEmail, password: 'password123' }),
  });
  assert.strictEqual(loginCustRes.status, 200, 'Valid customer login failed');
  const loginCustData = await loginCustRes.json();
  assert.strictEqual(loginCustData.user.role, 'CUSTOMER');
  console.log('  ✔ Customer login successful -> role = CUSTOMER, token persisted');

  // Invalid Credentials
  const invalidLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: customerEmail, password: 'wrongpassword' }),
  });
  assert.strictEqual(invalidLoginRes.status, 401, 'Invalid login should return 401');
  const invalidData = await invalidLoginRes.json();
  assert.strictEqual(invalidData.message, 'Invalid email or password.');
  console.log('  ✔ Invalid login properly rejected with: "Invalid email or password."\n');

  // ==========================================
  // TEST 4: Protected Routes & Auth Token Guard
  // ==========================================
  console.log('▶ [TEST 4] Testing Route Protection...');
  const unauthRes = await fetch(`${API_BASE}/workers/me`);
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated /workers/me should return 401');
  console.log('  ✔ Access denied to protected worker profile without JWT\n');

  // ==========================================
  // TEST 5: AI Assistant Diagnosis
  // ==========================================
  console.log('▶ [TEST 5] Testing AI Assistant Chat & Symptom Diagnosis...');
  // Hindi vernacular emergency query
  const aiHindiRes = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'सीलिंग पंखा बहुत गर्म हो रहा है और उसमें से धुआं निकल रहा है' }),
  });
  assert.strictEqual(aiHindiRes.status, 200, 'AI Hindi diagnosis failed');
  const aiHindiData = await aiHindiRes.json();
  assert.strictEqual(aiHindiData.diagnosis.detectedTrade, 'Electrician');
  assert.strictEqual(aiHindiData.diagnosis.recommendedUrgency, 'EMERGENCY_45_MIN');
  assert(aiHindiData.response.includes('Electrician'), 'AI response must recommend Electrician');
  console.log('  ✔ Vernacular Hindi symptom: detectedTrade =', aiHindiData.diagnosis.detectedTrade, ', Urgency =', aiHindiData.diagnosis.recommendedUrgency);

  // English plumbing query
  const aiEnglishRes = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Kitchen tap pipe is leaking water continuously under the sink' }),
  });
  assert.strictEqual(aiEnglishRes.status, 200, 'AI English diagnosis failed');
  const aiEngData = await aiEnglishRes.json();
  assert.strictEqual(aiEngData.diagnosis.detectedTrade, 'Plumber');
  console.log('  ✔ English symptom: detectedTrade =', aiEngData.diagnosis.detectedTrade, ', Urgency =', aiEngData.diagnosis.recommendedUrgency, '\n');

  // ==========================================
  // TEST 6: Smart Booking Flow
  // ==========================================
  console.log('▶ [TEST 6] Testing Smart Booking Flow with Real IDs...');
  const bookingPayload = {
    customerId: customerData.user.id,
    workerId: workerMeData.worker._id,
    workerName: workerData.user.name,
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    serviceTitle: 'Plumbing Valve & Leakage Overhaul',
    serviceCategory: 'Plumbing & Drainage',
    description: 'Kitchen sink pipe leaking water continuously under the sink.',
    urgency: 'SAME_DAY',
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 04:00 PM',
    customerLocation: {
      address: 'Flat 102, Gomti Nagar, Lucknow',
      city: 'Lucknow',
      pincode: '226010',
    },
    baseWage: 450,
    matchScore: 96,
    customerNotes: 'Please ring bell twice upon arrival',
  };

  const createBookingRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload),
  });
  assert.strictEqual(createBookingRes.status, 201, `Create booking failed: ${createBookingRes.status}`);
  const createdBookingData = await createBookingRes.json();
  assert(createdBookingData.booking._id, 'Booking ID missing');
  assert(createdBookingData.booking.startOtp, 'Start OTP missing');
  assert(createdBookingData.booking.completionOtp, 'Completion OTP missing');
  assert.strictEqual(createdBookingData.booking.status, 'REQUESTED');
  console.log('  ✔ Booking created in MongoDB with ID:', createdBookingData.booking._id);
  console.log('  ✔ Start OTP:', createdBookingData.booking.startOtp, '| Completion OTP:', createdBookingData.booking.completionOtp);

  // Verify Customer sees this booking
  const checkCustomerBookings = await fetch(`${API_BASE}/bookings?customerId=${customerData.user.id}`);
  const custBookings = await checkCustomerBookings.json();
  assert.strictEqual(custBookings.bookings.length, 1, 'Customer should see exactly 1 booking');
  assert.strictEqual(custBookings.bookings[0].description, bookingPayload.description);
  console.log('  ✔ Verified: Customer sees ONLY their newly created booking');

  // Verify Worker sees this booking
  const checkWorkerBookings = await fetch(`${API_BASE}/bookings?workerId=${workerMeData.worker._id}`);
  const wBookings = await checkWorkerBookings.json();
  assert.strictEqual(wBookings.bookings.length, 1, 'Worker should see exactly 1 booking');
  console.log('  ✔ Verified: Worker sees ONLY their assigned booking');

  console.log('\n=========================================');
  console.log('🎉 ALL 6 COMPREHENSIVE TEST SCENARIOS PASSED 100%!');
  console.log('=========================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
