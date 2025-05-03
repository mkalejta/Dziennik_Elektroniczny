const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', subjectController.getAllSubjects);
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;