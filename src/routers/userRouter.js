const express = require('express');

const { User } = require('../models/user');
const { auth } = require('../middleware/auth');

const router = new express.Router();

router.get('/users/me', auth, (req, res) => {
	//sends user's profile if they are authenticated.
	res.send(req.user);
});

//if the user wants to create data, they would be posting it.
//req = request(requesting from the server)
//res = respond(responding to the client)
router.post('/users/signup', async (req, res) => {
	//when a user posts information to the server
	try {
		const user = new User(req.body); //make a new user with the data posted
		//THEN, generate a token for that user, the updated user then gets saved to the DB in generateAuthToken()

		const token = await user.generateAuthToken(); //in generateAuthToken, the token gets saved to the user's tokens array
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });  //sends back token so that user can respond with the token in its header
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

router.patch('/users/me', auth, async (req, res) => {
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
		updates.forEach((update) => (req.user[update] = req.body[update])); //updates is an array of the keys, so for every key passed, update the user's value to the passed value

		await req.user.save(); //ensures that middleware gets activated

		res.status(200).send(req.user);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete('/users/me/delete', auth, async (req, res) => {
	//deletes user by id
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = {
	userRouter: router
};
