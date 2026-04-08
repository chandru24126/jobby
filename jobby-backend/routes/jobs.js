const router = require('express').Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Get all jobs (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, location, type, category } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (category) query.category = category;
    const jobs = await Job.find(query).populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my posted jobs (employer)
router.get('/my', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a job (employer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer')
      return res.status(403).json({ message: 'Only employers can post jobs' });
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;