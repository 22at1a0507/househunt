const express = require('express');
const router = express.Router();

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  approveProperty,
  getPendingProperties,
} = require('../controllers/propertyController');

const { protect } = require('../middleware/authMiddleware');

// 🟢 Public Routes
router.get('/all', getAllProperties);
router.get('/pending', getPendingProperties);      // ✅ Must come before `/:id`
router.get('/:id', getPropertyById);

// 🔐 Protected Routes
router.post('/', protect, createProperty);
router.put('/approve/:id', protect, approveProperty); // ✅ Needs protect middleware
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
