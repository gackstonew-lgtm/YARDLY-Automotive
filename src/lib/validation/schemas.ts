import { z } from 'zod';

// ============================================================
// AUTH & USER VALIDATION SCHEMAS
// ============================================================

export const UserRoleSchema = z.enum([
  'buyer',
  'seller',
  'dealer',
  'staff',
  'yard_admin',
  'admin',
  'super_admin'
]);

export const SellerTypeSchema = z.enum(['private', 'dealer', 'importer', 'business']);

export const SignUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number (e.g. 0712345678 or +254712345678)').optional().or(z.literal('')),
  role: z.enum(['buyer', 'seller']).default('buyer'),
  sellerType: SellerTypeSchema.optional(),
  businessName: z.string().max(100).optional()
});

export const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Invalid phone number format').optional().or(z.literal('')),
  business_name: z.string().max(100).optional(),
  seller_type: SellerTypeSchema.optional(),
  avatar_url: z.string().url().optional().or(z.literal(''))
});

// ============================================================
// VEHICLE VALIDATION SCHEMAS
// ============================================================

export const VehicleStatusSchema = z.enum([
  'pending_review',
  'active',
  'available',
  'reserved',
  'sold',
  'rejected',
  'draft',
  'archived'
]);

export const FuelTypeSchema = z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']);
export const TransmissionTypeSchema = z.enum(['Automatic', 'Manual', 'CVT']);
export const BodyTypeSchema = z.enum([
  'SUV',
  'Sedan',
  'Hatchback',
  'Station Wagon',
  'Pickup / Truck',
  'Van / Minibus',
  'Coupe / Convertible',
  'Motorcycle'
]);

export const VehicleInputSchema = z.object({
  make: z.string().min(1, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be greater than zero'),
  currency: z.string().default('KES'),
  mileage: z.number().nonnegative('Mileage cannot be negative'),
  engine_cc: z.number().positive('Engine capacity is required'),
  fuel_type: FuelTypeSchema,
  transmission: TransmissionTypeSchema,
  body_type: BodyTypeSchema,
  drive_type: z.enum(['2WD', '4WD', 'AWD', 'RWD', 'FWD']).optional(),
  color: z.string().min(1, 'Color is required').max(30),
  location: z.string().min(1, 'Location is required').max(50),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  vin: z.string().length(17, 'VIN must be exactly 17 characters').optional().or(z.literal('')),
  registration_number: z.string().max(20).optional(),
  seller_type: SellerTypeSchema.default('private'),
  dealer_name: z.string().max(100).optional(),
  status: VehicleStatusSchema.default('active'),
  verification_status: z.enum(['pending', 'verified', 'rejected']).default('verified'),
  logbook_verified: z.boolean().default(false),
  featured: z.boolean().default(false)
});

// ============================================================
// INQUIRY, TEST DRIVE & INSPECTION SCHEMAS
// ============================================================

export const InquiryInputSchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle ID is required'),
  buyer_id: z.string().uuid().optional().or(z.literal('')),
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Valid Kenyan phone number required (e.g. 0712345678)'),
  email: z.string().email('Valid email address required'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000),
  source: z.string().default('web')
});

export const TestDriveInputSchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle ID is required'),
  user_id: z.string().uuid().optional().or(z.literal('')),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  preferred_date: z.string().min(1, 'Date is required'),
  preferred_time: z.string().min(1, 'Time is required'),
  location: z.string().default('Nairobi Yard'),
  notes: z.string().max(500).optional()
});

export const InspectionInputSchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle ID is required'),
  buyer_id: z.string().uuid().optional().or(z.literal('')),
  buyer_name: z.string().min(2, 'Name is required'),
  buyer_phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Valid phone number required'),
  buyer_email: z.string().email('Valid email required'),
  preferred_date: z.string().min(1, 'Date is required'),
  preferred_time: z.string().min(1, 'Time is required'),
  location: z.string().default('Nairobi Yard'),
  notes: z.string().max(500).optional()
});

// ============================================================
// AUCTION & BID SCHEMAS
// ============================================================

export const AuctionBidSchema = z.object({
  auction_id: z.string().min(1, 'Auction ID is required'),
  buyer_id: z.string().min(1, 'Buyer ID is required'),
  buyer_name: z.string().min(2, 'Buyer name is required'),
  buyer_email: z.string().email('Valid email is required'),
  amount: z.number().positive('Bid amount must be positive')
});

// ============================================================
// PAYMENT SCHEMAS
// ============================================================

export const PaymentInitiateSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  amount: z.number().positive('Amount must be positive'),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Valid phone number required (e.g. 0712345678)'),
  email: z.string().email('Valid email address required'),
  fullName: z.string().min(2, 'Full name is required'),
  provider: z.enum(['mpesa', 'payhero', 'test']).default('test')
});
