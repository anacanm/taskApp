const express = require('express');
const { Task } = require('../models/task');
const { auth } = require('../middleware/auth')

const router = express.Router();

router.get('/tasks', (req, res) => {
	//returns all tasks
	Task.find({})
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
});

router.get('/tasks/id/:id', (req, res) => {
	//returns the specified task
	Task.findById(req.params.id)
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
});

router.get('/tasks/incomplete', (req, res) => {
	//returns the tasks that are incomplete
	Task.find({ completed: false })
		.then((task) => res.status(200).send(task))
		.catch((err) => res.status(500).send(err));
});

router.post('/tasks/add', (req, res) => {
	//adds a task to the db specified by the body
	const task = new Task(req.body);

	task
		.save()
		.then(() => res.status(201).send(task))
		.catch((err) => res.status(400).send(err));
});

router.patch('/tasks/update/:id', async (req, res) => {
	//completes a task specified by id
	try {
		const acceptedUpdates = ['description', 'completed'];
		const updates = Object.keys(req.body); //returns an array of strings containing the keys of the passed object
		const isValid = updates.every((update) => acceptedUpdates.includes(update));

		if (!isValid) {
			return res.status(400).send({ error: 'Nonvalid updates' });
		}

		const task = await Task.findById(req.params.id);
		updates.forEach((update) => (task[update] = req.body[update]));

		task.save();

		if (!task) {
			res.status(404).send();
		} else {
			res.status(200).send(task);
		}
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete('/tasks/delete/:id', async (req, res) => {
	//deletes task by id
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			res.status(404).send();
		} else {
			res.status(200).send(task);
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = {
	taskRouter: router
};
