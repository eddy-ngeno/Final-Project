import mongoose from 'mongoose';

const farmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [100, 'Farm name cannot exceed 100 characters'],
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  specializations: [{
    type: String,
    trim: true,
  }],
  certifications: [{
    name: String,
    issuer: String,
    dateIssued: Date,
    expiryDate: Date,
    certificateUrl: String,
  }],
  deliveryRadiusKm: {
    type: Number,
    default: 10,
    min: [1, 'Delivery radius must be at least 1km'],
    max: [100, 'Delivery radius cannot exceed 100km'],
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Delivery fee cannot be negative'],
  },
  freeDeliveryMinimum: {
    type: Number,
    default: 0,
    min: [0, 'Free delivery minimum cannot be negative'],
  },
  pickupAvailable: {
    type: Boolean,
    default: true,
  },
  pickupInstructions: {
    type: String,
    maxlength: [500, 'Pickup instructions cannot exceed 500 characters'],
  },
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: true } },
  },
  paymentMethods: [{
    type: String,
    enum: ['mpesa', 'cash', 'bank_transfer'],
    default: ['mpesa', 'cash'],
  }],
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
    swiftCode: String,
  },
  mpesaNumber: {
    type: String,
    match: [/^\+254[17]\d{8}$/, 'Please enter a valid M-Pesa number'],
  },
  // Rating and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  // Statistics
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  // Status
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDocuments: [{
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
farmerProfileSchema.index({ userId: 1 }, { unique: true });
farmerProfileSchema.index({ isVerified: 1 });
farmerProfileSchema.index({ isActive: 1 });
farmerProfileSchema.index({ averageRating: -1 });
farmerProfileSchema.index({ totalOrders: -1 });

// Populate user information
farmerProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Update rating
farmerProfileSchema.methods.updateRating = function(newRating) {
  const totalRatingSum = this.averageRating * this.totalReviews;
  this.totalReviews += 1;
  this.averageRating = (totalRatingSum + newRating) / this.totalReviews;
};

// Check if delivery is available for distance
farmerProfileSchema.methods.isDeliveryAvailable = function(distanceKm) {
  return distanceKm <= this.deliveryRadiusKm;
};

// Calculate delivery fee
farmerProfileSchema.methods.calculateDeliveryFee = function(orderTotal, distanceKm) {
  if (!this.isDeliveryAvailable(distanceKm)) {
    return null; // Delivery not available
  }
  
  if (this.freeDeliveryMinimum > 0 && orderTotal >= this.freeDeliveryMinimum) {
    return 0; // Free delivery
  }
  
  return this.deliveryFee;
};

const FarmerProfile = mongoose.model('FarmerProfile', farmerProfileSchema);

export default FarmerProfile;