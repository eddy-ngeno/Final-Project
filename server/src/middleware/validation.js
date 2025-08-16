import Joi from 'joi';

// Validation middleware factory
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message,
      });
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // User schemas
  register: Joi.object({
    name: Joi.string().trim().max(100).required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().pattern(/^\+254[17]\d{8}$/).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('buyer', 'farmer').default('buyer'),
    county: Joi.string().trim().required(),
    location: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),

  verifyEmail: Joi.object({
    token: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().trim().max(100),
    phone: Joi.string().pattern(/^\+254[17]\d{8}$/),
    county: Joi.string().trim(),
    location: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }),
  }),

  // Listing schemas
  createListing: Joi.object({
    title: Joi.string().trim().max(200).required(),
    description: Joi.string().trim().max(1000).required(),
    category: Joi.string().valid(
      'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Legumes', 
      'Herbs & Spices', 'Nuts & Seeds', 'Beverages', 'Other'
    ).required(),
    pricePerUnit: Joi.number().positive().required(),
    unitType: Joi.string().valid(
      'kg', 'g', 'tonnes', 'pieces', 'bunches', 
      'crates', 'bags', 'litres', 'ml', 'packets'
    ).required(),
    quantityAvailable: Joi.number().positive().required(),
    minimumOrder: Joi.number().positive().default(1),
    maximumOrder: Joi.number().positive(),
    harvestDate: Joi.date().required(),
    expiryDate: Joi.date().greater(Joi.ref('harvestDate')),
    photos: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string(),
      isPrimary: Joi.boolean().default(false),
    })).min(1).required(),
    location: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
    county: Joi.string().trim().required(),
    address: Joi.string().trim(),
    organicCertified: Joi.boolean().default(false),
    farmingMethod: Joi.string().valid(
      'Organic', 'Conventional', 'Hydroponic', 'Greenhouse', 'Other'
    ).default('Conventional'),
    storageInstructions: Joi.string().max(500),
    tags: Joi.array().items(Joi.string().trim().lowercase()),
  }),

  updateListing: Joi.object({
    title: Joi.string().trim().max(200),
    description: Joi.string().trim().max(1000),
    category: Joi.string().valid(
      'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Legumes', 
      'Herbs & Spices', 'Nuts & Seeds', 'Beverages', 'Other'
    ),
    pricePerUnit: Joi.number().positive(),
    unitType: Joi.string().valid(
      'kg', 'g', 'tonnes', 'pieces', 'bunches', 
      'crates', 'bags', 'litres', 'ml', 'packets'
    ),
    quantityAvailable: Joi.number().min(0),
    minimumOrder: Joi.number().positive(),
    maximumOrder: Joi.number().positive(),
    harvestDate: Joi.date(),
    expiryDate: Joi.date(),
    photos: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string(),
      isPrimary: Joi.boolean().default(false),
    })),
    isActive: Joi.boolean(),
    organicCertified: Joi.boolean(),
    farmingMethod: Joi.string().valid(
      'Organic', 'Conventional', 'Hydroponic', 'Greenhouse', 'Other'
    ),
    storageInstructions: Joi.string().max(500),
    tags: Joi.array().items(Joi.string().trim().lowercase()),
  }),

  // Farmer profile schemas
  updateFarmerProfile: Joi.object({
    farmName: Joi.string().trim().max(100),
    bio: Joi.string().max(500),
    specializations: Joi.array().items(Joi.string().trim()),
    deliveryRadiusKm: Joi.number().min(1).max(100),
    deliveryFee: Joi.number().min(0),
    freeDeliveryMinimum: Joi.number().min(0),
    pickupAvailable: Joi.boolean(),
    pickupInstructions: Joi.string().max(500),
    paymentMethods: Joi.array().items(
      Joi.string().valid('mpesa', 'cash', 'bank_transfer')
    ),
    bankDetails: Joi.object({
      bankName: Joi.string(),
      accountNumber: Joi.string(),
      accountName: Joi.string(),
      swiftCode: Joi.string(),
    }),
    mpesaNumber: Joi.string().pattern(/^\+254[17]\d{8}$/),
  }),

  // Order schemas
  createOrder: Joi.object({
    items: Joi.array().items(Joi.object({
      listingId: Joi.string().hex().length(24).required(),
      quantity: Joi.number().positive().required(),
    })).min(1).required(),
    fulfillmentMethod: Joi.string().valid('pickup', 'delivery').required(),
    deliveryAddress: Joi.when('fulfillmentMethod', {
      is: 'delivery',
      then: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        coordinates: Joi.array().items(Joi.number()).length(2),
      }).required(),
      otherwise: Joi.optional(),
    }),
    preferredTimeWindow: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().greater(Joi.ref('start')).required(),
    }),
    notes: Joi.string().max(500),
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string().valid(
      'pending', 'confirmed', 'in_transit', 'completed', 'cancelled'
    ).required(),
    notes: Joi.string().max(500),
  }),

  // Query schemas
  listingQuery: Joi.object({
    search: Joi.string().trim(),
    category: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().positive(),
    county: Joi.string(),
    withinKm: Joi.number().positive().max(100),
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
    sort: Joi.string().valid('newest', 'oldest', 'price_asc', 'price_desc', 'distance'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
  }),

  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  // Payment schemas
  initiateMpesaPayment: Joi.object({
    orderId: Joi.string().hex().length(24).required(),
    phoneNumber: Joi.string().pattern(/^\+254[17]\d{8}$/).required(),
  }),

  createStripePaymentIntent: Joi.object({
    orderId: Joi.string().hex().length(24).required(),
  }),
};

// ObjectId validation
export const validateObjectId = (paramName = 'id') => {
  return validate(
    Joi.object({
      [paramName]: Joi.string().hex().length(24).required(),
    }),
    'params'
  );
};

// Pagination helper
export const getPaginationData = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};