const express = require('express');
const { Task } = require('../models/task');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/tasks', auth, async (req, res) => {
	//returns all tasks created by authenticated user
	try {
		const tasks = await Task.find({ owner: req.user._id });
		res.status(200).send(tasks);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get('/tasks/id', auth, async (req, res) => {
	//returns the specified task in the body
	try {
		const task = await Task.findOne({ owner: req.user._id, _id: req.body._id });
		if (!task) {
			res.status(404).send();
		} else {
			res.status(200).send(task);
		}
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get('/tasks/incomplete', auth, async (req, res) => {
	//returns the tasks that are incomplete
	try {
		const tasks = await Task.find({ completed: false, owner: req.user._id });

		res.status(200).send(tasks);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/tasks/add', auth, async (req, res) => {
	//adds a task to the db specified by the body, and adds the created by according to the authenticated user
	try {
		const task = new Task({
			...req.body,
			owner: req.user._id
		});
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.patch('/tasks/update/:id', auth, async (req, res) => {
	//completes a task specified by id
	try {
		const acceptedUpdates = ['description', 'completed'];
		const updates = Object.keys(req.body); //returns an array of strings containing the keys of the passed object
		const isValid = updates.every((update) => acceptedUpdates.includes(update));

		if (!isValid) {
			return res.status(400).send({ error: 'Nonvalid updates' });
		}

		const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

		if (!task) {
			res.status(404).send();
		} else {
			updates.forEach((update) => (task[update] = req.body[update]));
			await task.save();
			res.status(200).send(task);
		}
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete('/tasks/delete/:id', auth, async (req, res) => {
	//deletes task by id
	try {
		const task = await Task.findOneAndDelete({owner: req.user._id, _id:req.params.id});
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
