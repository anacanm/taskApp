const express = require('express');

const { User } = require('../models/user');
const { auth } = require('../middleware/auth');

const router = new express.Router();

router.get('/users/me', auth, (req, res) => {
	//sends user's profile if they are authenticated.
	res.send(req.user);
});

router.get('/users/id/:id', (req, res) => {
	//gets user by id, :id acts as a dynamic route
	User.findById(req.params.id) //req.params has the route parameter that gets provided in the form of an object with the property "id"
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
});

//if the user wants to create data, they would be posting it.
//req = request(requesting from the server)
//res = respond(responding to the client)
router.post('/users/signup', async (req, res) => {
	//when a user posts information to the server
	try {
		const user = new User(req.body); //make a new user with the data posted
		//THEN, generate a token for that user, the updated user then gets saved to the DB in generateAuthToken()

		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
		//NOTE: user login is not fully flushed out, you can only log in to see that you logged in at the moment
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/users/logout', auth, async (req, res) => {
	//logs authorized user out of specific session
	try {
		req.user.tokens = req.user.tokens.filter((elem) => elem.token !== req.token);
		await req.user.save(); //updates user's DB document to have updated array with removed token
		res.status(200).send('logout successful');
	} catch (err) {
		res.status(500).send(err);
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	//logs authorized user out of all sessions
	try {
		req.user.tokens = [];
		await req.user.save(); //updates user's DB document to have updated array with no auth tokens
		res.status(200).send('logged out of all sessions');
	} catch (err) {
		res.status(500).send(err);
	}
});

router.patch('/users/update/:id', async (req, res) => {
	// sets document specified by the id to req.body (what data is sent to the endpoint)
	try {
		const acceptedUpdates = ['name', 'email', 'age', 'password'];
		const updates = Object.keys(req.body); // these are the keys of the object that the client is attempting to send
		const isValid = updates.every((update) => acceptedUpdates.includes(update));

		if (!isValid) {
			return res.status(400).send({ error: 'Nonvalid updates' });
		}

		//removed findByIdAndUpdate, because it avoids middleware

		//the below code sets each property of the user to the properties passed in the patch request
		const user = await User.findById(req.params.id);
		updates.forEach((update) => (user[update] = req.body[update])); //updates is an array of the keys, so for every key passed, update the user's value to the passed value

		await user.save(); //ensures that middleware gets activated

		if (!user) {
			res.status(404).send();
		} else {
			res.status(200).send(user);
		}
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete('/users/delete/:id', async (req, res) => {
	//deletes user by id
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			res.status(404).send();
		} else {
			res.status(200).send(user);
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = {
	userRouter: router
};
