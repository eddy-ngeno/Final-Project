import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Fruits',
      'Vegetables',
      'Grains',
      'Dairy',
      'Legumes',
      'Herbs & Spices',
      'Nuts & Seeds',
      'Beverages',
      'Other'
    ],
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: [0, 'Price cannot be negative'],
  },
  unitType: {
    type: String,
    required: [true, 'Unit type is required'],
    enum: ['kg', 'g', 'tonnes', 'pieces', 'bunches', 'crates', 'bags', 'litres', 'ml', 'packets'],
  },
  quantityAvailable: {
    type: Number,
    required: [true, 'Quantity available is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  minimumOrder: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order must be at least 1'],
  },
  maximumOrder: {
    type: Number,
    validate: {
      validator: function(v) {
        return !v || v >= this.minimumOrder;
      },
      message: 'Maximum order must be greater than minimum order',
    },
  },
  harvestDate: {
    type: Date,
    required: [true, 'Harvest date is required'],
  },
  expiryDate: {
    type: Date,
  },
  photos: [{
    url: {
      type: String,
      required: true,
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  county: {
    type: String,
    required: [true, 'County is required'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  // Status and visibility
  isActive: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: true, // Auto-approve for now, can be changed for moderation
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  // Additional details
  organicCertified: {
    type: Boolean,
    default: false,
  },
  farmingMethod: {
    type: String,
    enum: ['Organic', 'Conventional', 'Hydroponic', 'Greenhouse', 'Other'],
    default: 'Conventional',
  },
  storageInstructions: {
    type: String,
    maxlength: [500, 'Storage instructions cannot exceed 500 characters'],
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
  // SEO and search
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  // Statistics
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSold: {
    type: Number,
    default: 0,
  },
  // Availability schedule
  availableFrom: {
    type: Date,
    default: Date.now,
  },
  availableTo: {
    type: Date,
  },
  // Admin fields
  adminNotes: {
    type: String,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
listingSchema.index({ location: '2dsphere' });
listingSchema.index({ title: 'text', description: 'text', tags: 'text' });
listingSchema.index({ category: 1, isActive: 1, isApproved: 1 });
listingSchema.index({ farmerId: 1, isActive: 1 });
listingSchema.index({ county: 1, isActive: 1, isApproved: 1 });
listingSchema.index({ pricePerUnit: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ views: -1 });
listingSchema.index({ isPremium: -1, createdAt: -1 });
listingSchema.index({ harvestDate: 1 });
listingSchema.index({ expiryDate: 1 });

// Virtual for farmer details
listingSchema.virtual('farmer', {
  ref: 'User',
  localField: 'farmerId',
  foreignField: '_id',
  justOne: true,
});

listingSchema.virtual('farmerProfile', {
  ref: 'FarmerProfile',
  localField: 'farmerId',
  foreignField: 'userId',
  justOne: true,
});

// Generate slug before saving
listingSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim() + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Instance methods
listingSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

listingSchema.methods.updateQuantity = function(soldQuantity) {
  this.quantityAvailable -= soldQuantity;
  this.totalSold += soldQuantity;
  this.totalOrders += 1;
  
  if (this.quantityAvailable <= 0) {
    this.isActive = false;
  }
  
  return this.save({ validateBeforeSave: false });
};

listingSchema.methods.isAvailable = function(quantity = 1) {
  return (
    this.isActive && 
    this.isApproved && 
    this.quantityAvailable >= quantity &&
    quantity >= this.minimumOrder &&
    (!this.maximumOrder || quantity <= this.maximumOrder) &&
    (!this.availableTo || new Date() <= this.availableTo)
  );
};

listingSchema.methods.getPrimaryPhoto = function() {
  const primary = this.photos.find(photo => photo.isPrimary);
  return primary || this.photos[0] || null;
};

listingSchema.methods.calculateDistance = function(lat, lng) {
  if (!this.location?.coordinates) return null;
  
  const [listingLng, listingLat] = this.location.coordinates;
  const R = 6371; // Earth's radius in km
  
  const dLat = (lat - listingLat) * (Math.PI / 180);
  const dLng = (lng - listingLng) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(listingLat * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in km
};

// Static methods
listingSchema.statics.findByLocation = function(lat, lng, maxDistance = 50000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    isActive: true,
    isApproved: true
  });
};

listingSchema.statics.findByCategory = function(category) {
  return this.find({
    category,
    isActive: true,
    isApproved: true
  });
};

listingSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true,
    isApproved: true
  }).select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
};

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;