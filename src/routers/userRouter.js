const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.get('/users', (req, res) => {
	//sending a get request to the users endpoint will return all users from the database
	User.find({}) //using an empty object as the filter will return all documents in the users collection in the database
		.then((users) => res.send(users))
		.catch(() => res.status(500).send());
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
router.post('/users', (req, res) => {
	//when a user posts information to the server
	const user = new User(req.body); //make a new user with the data posted

	user
		.save() //saves the user to the database
		.then(() => res.status(201).send(user)) //sends the user to the client
		.catch((err) => res.status(400).send(err)); //if there is an error, update the status to 400, and send the error
});

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.status(200).send(user)
        //NOTE: user login is not fully flushed out, you can only log in to see that you logged in at the moment
    } catch (err) {
        res.status(400).send(err)
    }
})

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
