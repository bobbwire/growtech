const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplications,
  getApplication,
  updateApplicationStatus
} = require('../controllers/applicationController');

// Public routes
router.post('/submit', submitApplication);

// Admin routes (you might want to add authentication middleware)
router.get('/', getApplications);
router.get('/:id', getApplication);
router.patch('/:id/status', updateApplicationStatus);

module.exports = router;