const jwt = require('jsonwebtoken')
const { User } = require('../models/user')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'randomcharacters') //decoded is the payload that the token was carrying, decoded by the secretkey
        
        
        //the below code finds the user with a matching id that has the authentication token specified in the Authorization header
            //if the user were to log out, the authentication token would be removed, and therefore the user would not be authenticated
        const user = await User.findOne({_id: decoded._id , 'tokens.token': token})  
        
        if(!user){
            throw new Error()
        }

        // since we are fetching the user from the database here in the middleware, there is no reason for the following route handlers to -->
        //have to fetch that user as well, so we will store the user in request, so that the route handlers will be able to access it
        req.token = token  //the current token is specific to the current session
        req.user = user
        next()

    } catch (err) {
        res.status(401).send({error: 'Please authenticate'})
    }

};

module.exports = {
	auth: auth
};
