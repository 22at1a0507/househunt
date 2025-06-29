const Property = require('../models/Property');

// Create Property
exports.createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json({ message: 'Property added successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ approved: true });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Property
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: 'Property updated successfully', updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Property
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property approved successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending (unapproved) properties
exports.getPendingProperties = async (req, res) => {
  try {
    const pending = await Property.find({ approved: false });
    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
