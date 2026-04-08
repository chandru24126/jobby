const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Apply for a job
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker')
      return res.status(403).json({ message: 'Only job seekers can apply' });

    const { jobId, coverLetter, resume } = req.body;

    const existing = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    const app = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume,
      status: 'pending'
    });
    await app.save();

    // Increment applicationCount on Job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.json(app);
  } catch (err) {
    console.log('Apply error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get my applications (job seeker)
router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location type')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a job (employer)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (employer)
router.put('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw application (job seeker)
router.delete('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.applicant.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    await app.deleteOne();
    await Job.findByIdAndUpdate(app.job, { $inc: { applicationCount: -1 } });
    res.json({ message: 'Application withdrawn' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;