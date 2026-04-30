const express = require('express');
const {
	listTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
} = require('../controllers/taskController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
