const mongoose = require('mongoose');
const validator = require('validator');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error(chalk.red('Email must be a valid email address'));
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error(chalk.red('Age must be a positive number'));
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
			if (value.length < 6) {
				throw new Error(
					chalk.red('Password must be at least 6 characters long')
				);
			}
			if (value.toLowerCase().includes('password')) {
				throw new Error(
					chalk.red("Password cannot contain the word 'password'")
				);
			}
		}
	}
});

userSchema.statics.findByCredentials = async (email, password) => {
    //returns a user document if the email and password match with a record
	const user = await User.findOne({ email });

	if (!user) {
		//if no user is found, it will throw an error and immediately exit this script
		throw new Error(chalk.red('unable to log in'));
	}
	//this code is only reachable if a matching user is found (according to the email)

	//checks if the unhashed password (passed as a parameter) is the same as the hashed password of the user that was found above
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		//if the user's (specified by email) password does not match the entered password, throw an error
		throw new Error(chalk.red('unable to log in'));
	}

	//if the user was found, and the password entered matches the password held in the database, return the user information
	return user;
};

//hash the password before saving
userSchema.pre('save', async function(next) {
	//the above line means: I want to call this function on the user document before it gets saved
	//you don't want to hash an already hashed password, so the below block ensures that
	if (this.isModified('password')) {
		//if the user changed their password, then hash the modified password and update it
		this.password = await bcrypt.hash(this.password, 8);
	}

	next(); //you call next() at the end of this function to signifiy that the operation has completed.
});

const User = mongoose.model('User', userSchema);

module.exports = {
	User: User
};
