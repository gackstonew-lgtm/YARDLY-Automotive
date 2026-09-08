import { getPaymentProvider } from '../lib/payments/factory.js';
import { 
  VehicleService, 
  AuthService, 
  requireAdminRole, 
  isAdminRole, 
  isStaffRole, 
  hasRequiredRole 
} from '../lib/supabase/client.js';
import { EmailService } from '../lib/email/resend.js';
import { 
  SignUpSchema, 
  InquiryInputSchema, 
  TestDriveInputSchema, 
  VehicleInputSchema,
  AuctionBidSchema
} from '../lib/validation/schemas.js';

async function runVerificationSuite() {
  console.log('====================================================');
  console.log('RUNNING YARDLY AUTOMOTIVE PRODUCTION INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Payment Provider Factory & Test Mode Execution
  try {
    const testProvider = getPaymentProvider('test');
    const paymentRes = await testProvider.initiatePayment({
      vehicleId: 'a1000000-0000-0000-0000-000000000001',
      amount: 50000,
      phone: '0712345678',
      email: 'buyer@yardly.co.ke',
      fullName: 'Test Buyer'
    });
    assert(paymentRes.success === true && paymentRes.status === 'paid', 'Test Mode M-Pesa Payment Initiation');
  } catch (e) {
    assert(false, `Test Mode Payment Exception: ${e}`);
  }

  // TEST 2: Payment Provider Failure Simulation (phone ending in 0000)
  try {
    const testProvider = getPaymentProvider('test');
    const paymentRes = await testProvider.initiatePayment({
      vehicleId: 'a1000000-0000-0000-0000-000000000001',
      amount: 50000,
      phone: '0712340000',
      email: 'buyer@yardly.co.ke',
      fullName: 'Decline Buyer'
    });
    assert(paymentRes.success === false && paymentRes.status === 'failed', 'Payment Decline Handling (0000)');
  } catch (e) {
    assert(false, `Payment Failure Handling Exception: ${e}`);
  }

  // TEST 3: Vehicle Service Filtering Engine
  try {
    const toyotaSUVList = await VehicleService.filterVehicles({
      make: 'Toyota',
      bodyType: 'SUV'
    });
    assert(
      toyotaSUVList.length > 0 && toyotaSUVList.every(v => v.make.toLowerCase() === 'toyota' && v.body_type === 'SUV'),
      'Vehicle Filtering by Make & Body Type'
    );
  } catch (e) {
    assert(false, `Vehicle Filter Exception: ${e}`);
  }

  // TEST 4: Price Sorting (Price High -> Low)
  try {
    const sortedList = await VehicleService.filterVehicles({
      sortBy: 'price_high'
    });
    assert(
      sortedList.length > 0 && sortedList[0].price >= sortedList[sortedList.length - 1].price,
      'Vehicle Sorting by Price High to Low'
    );
  } catch (e) {
    assert(false, `Price Sort Exception: ${e}`);
  }

  // TEST 5: Targeted Vehicle Lookup by ID / Slug
  try {
    const vehicle = await VehicleService.getById('a1000000-0000-0000-0000-000000000001');
    assert(
      vehicle !== null && vehicle.id === 'a1000000-0000-0000-0000-000000000001' && vehicle.images.length > 0,
      'Targeted Vehicle Lookup with Resolved Images'
    );
  } catch (e) {
    assert(false, `Targeted Vehicle Lookup Exception: ${e}`);
  }

  // TEST 6: Email HTML Generation
  try {
    const html = EmailService.generateReservationEmailHtml('Jane Doe', '2019 Toyota Harrier', 50000, 'res-101');
    assert(
      html.includes('Jane Doe') && html.includes('Toyota Harrier') && html.includes('50,000'),
      'Transactional Reservation Email HTML Generation'
    );
  } catch (e) {
    assert(false, `Email HTML Generation Exception: ${e}`);
  }

  // TEST 7: Role Hierarchy & Permission Helpers
  try {
    assert(
      isAdminRole('super_admin') && isAdminRole('admin') && isAdminRole('yard_admin') && !isAdminRole('buyer') && !isAdminRole('seller'),
      'isAdminRole Verification for Admin Roles'
    );
    assert(
      isStaffRole('staff') && isStaffRole('yard_admin') && isStaffRole('admin') && !isStaffRole('buyer'),
      'isStaffRole Verification for Staff Hierarchy'
    );
    assert(
      hasRequiredRole('admin', 'staff') && hasRequiredRole('super_admin', 'admin') && !hasRequiredRole('buyer', 'staff'),
      'hasRequiredRole Hierarchy Verification'
    );
  } catch (e) {
    assert(false, `Role Hierarchy Helper Exception: ${e}`);
  }

  // TEST 8: Public Registration Validation & Role Sanitization
  try {
    const validBuyer = SignUpSchema.safeParse({
      email: 'buyer@yardly.co.ke',
      password: 'SecurePassword123!',
      fullName: 'Valid Buyer',
      role: 'buyer'
    });
    const invalidRoleAttempt = SignUpSchema.safeParse({
      email: 'intruder@test.com',
      password: 'SecurePassword123!',
      fullName: 'Intruder',
      role: 'admin' as any
    });
    assert(
      validBuyer.success === true && invalidRoleAttempt.success === false,
      'Public Registration Role Validation (cannot submit admin/staff role)'
    );
  } catch (e) {
    assert(false, `Registration Validation Exception: ${e}`);
  }

  // TEST 9: Zod Schema Validation for Vehicle Inquiries
  try {
    const validInquiry = InquiryInputSchema.safeParse({
      vehicle_id: 'a1000000-0000-0000-0000-000000000001',
      name: 'John Kamau',
      phone: '0712345678',
      email: 'john@example.com',
      message: 'I would like to view this car tomorrow.'
    });
    const invalidPhoneInquiry = InquiryInputSchema.safeParse({
      vehicle_id: 'a1000000-0000-0000-0000-000000000001',
      name: 'John',
      phone: '12345',
      email: 'invalid-email',
      message: 'Hi'
    });
    assert(
      validInquiry.success === true && invalidPhoneInquiry.success === false,
      'Vehicle Inquiry Zod Input Validation'
    );
  } catch (e) {
    assert(false, `Inquiry Validation Exception: ${e}`);
  }

  // TEST 10: Zod Schema Validation for Test Drive Requests
  try {
    const validTestDrive = TestDriveInputSchema.safeParse({
      vehicle_id: 'a1000000-0000-0000-0000-000000000001',
      name: 'Sarah Mwangi',
      phone: '+254712345678',
      email: 'sarah@example.com',
      preferred_date: '2026-09-15',
      preferred_time: '10:00 AM'
    });
    assert(validTestDrive.success === true, 'Test Drive Request Zod Input Validation');
  } catch (e) {
    assert(false, `Test Drive Validation Exception: ${e}`);
  }

  // TEST 11: Zod Schema Validation for Auction Bids
  try {
    const validBid = AuctionBidSchema.safeParse({
      auction_id: 'auc-101',
      buyer_id: 'u-101',
      buyer_name: 'Bidder One',
      buyer_email: 'bidder@yardly.co.ke',
      amount: 4500000
    });
    const invalidNegativeBid = AuctionBidSchema.safeParse({
      auction_id: 'auc-101',
      buyer_id: 'u-101',
      buyer_name: 'Bidder One',
      buyer_email: 'bidder@yardly.co.ke',
      amount: -500
    });
    assert(
      validBid.success === true && invalidNegativeBid.success === false,
      'Auction Bid Zod Positive Amount Validation'
    );
  } catch (e) {
    assert(false, `Auction Bid Validation Exception: ${e}`);
  }

  // TEST 12: Reactive onAuthStateChange Subscription
  try {
    const unsub = AuthService.onAuthStateChange(() => {});
    assert(typeof unsub === 'function', 'AuthService.onAuthStateChange Returns Unsubscribe Handler');
    unsub();
  } catch (e) {
    assert(false, `onAuthStateChange Exception: ${e}`);
  }

  // TEST 13: Admin Guard Rejection for Unauthenticated / Non-Admin Users
  try {
    let threw = false;
    try {
      await requireAdminRole();
    } catch {
      threw = true;
    }
    assert(threw === true, 'requireAdminRole Guard Enforces Admin Authorization');
  } catch (e) {
    assert(false, `requireAdminRole Guard Exception: ${e}`);
  }

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runVerificationSuite();
