/**
 * End-to-End Integration Test Suite for COBALT SKIES Platform
 */
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting COBALT SKIES End-to-End Test Suite ---');
  let failures = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failures++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'healthy', 'Health check endpoint returns 200 healthy');

    // 2. Fetch Events
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsData = await eventsRes.json();
    assert(eventsRes.status === 200 && eventsData.count >= 8, `Fetch events returns ${eventsData.count} items`);
    const testEvent = eventsData.data[0];

    // 3. Fetch Games
    const gamesRes = await fetch(`${BASE_URL}/games`);
    const gamesData = await gamesRes.json();
    assert(gamesRes.status === 200 && gamesData.count >= 6, `Fetch games returns ${gamesData.count} items`);
    const testGame = gamesData.data[0];

    // 4. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cobaltskies.com',
        password: 'AdminPassword@2026',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.data.token, 'Admin login succeeds with JWT token');
    const adminToken = adminLoginData.data.token;

    // 5. Normal User Registration
    const testEmail = `student_${Date.now()}@testuniv.edu`;
    const userRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Sundaram',
        email: testEmail,
        password: 'Password@2026',
        phone: '+91 98888 77777',
        college: 'IIT Madras',
        usn: 'CS22B045',
      }),
    });
    const userRegData = await userRegRes.json();
    assert(userRegRes.status === 201 && userRegData.data.token, 'Participant registration succeeds with JWT token');
    const userToken = userRegData.data.token;

    // 6. User Login
    const userLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@2026',
      }),
    });
    const userLoginData = await userLoginRes.json();
    assert(userLoginRes.status === 200 && userLoginData.data.name === 'Priya Sundaram', 'Participant login succeeds');

    // 7. Payment Order Creation (Backend calculates fee strictly)
    const orderRes = await fetch(`${BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        itemType: 'Event',
        itemId: testEvent._id,
        teamName: 'Priya Nova Squad',
        teamMembers: [
          { name: 'Kiran Rao', email: 'kiran@testuniv.edu', phone: '+91 97777 66666', college: 'IIT Madras' },
        ],
      }),
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 200 && orderData.data.orderId, 'Payment order creation returns valid orderId and registrationId');

    // 8. Payment Verification (Simulated UPI flow)
    const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        razorpay_order_id: orderData.data.orderId,
        razorpay_payment_id: `pay_e2e_test_${Date.now()}`,
        razorpay_signature: `sig_e2e_test_${Date.now()}`,
        registrationId: orderData.data.registrationId,
        paymentMethod: 'UPI',
      }),
    });
    const verifyData = await verifyRes.json();
    assert(verifyRes.status === 200 && verifyData.data.paymentStatus === 'PAID', 'Payment verification marks registration as PAID with QR payload');

    // 9. User Dashboard Registrations
    const myRegsRes = await fetch(`${BASE_URL}/registrations/my-registrations`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const myRegsData = await myRegsRes.json();
    assert(myRegsRes.status === 200 && myRegsData.count >= 1, `Participant can retrieve confirmed event pass (${myRegsData.count} items)`);

    // 10. Admin Stats Dashboard
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.data.totalRegistrations > 0, `Admin stats returns totalRegistrations = ${statsData.data.totalRegistrations}, revenue = ₹${statsData.data.totalRevenue}`);

    // 11. Normal User Cannot Access Admin Stats (Role-based access check)
    const unauthorizedRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(unauthorizedRes.status === 403, 'Normal participant blocked from admin routes (HTTP 403)');

    // 12. Export Registrations CSV
    const csvRes = await fetch(`${BASE_URL}/admin/export/registrations`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const csvText = await csvRes.text();
    assert(csvRes.status === 200 && csvText.includes('Registration ID'), 'Admin can export registrations CSV with proper headers');

    console.log(`\n--- Test Suite Summary: ${failures === 0 ? 'ALL PASSED 🎉' : `${failures} FAILS`} ---`);
    process.exit(failures === 0 ? 0 : 1);
  } catch (err) {
    console.error('Test runner exception:', err);
    process.exit(1);
  }
}

runTests();
