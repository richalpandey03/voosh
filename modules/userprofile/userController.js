const user = require("../../model/user")
const jwt = require('jsonwebtoken');

async function updateUserProfileView (req,res){
    try{
        if(!req.body && !req.body.email){
            res.status(400).send({
                message : "Please provide email id"
            })
        }
        if(!req.body.profile_type){
            res.status(400).send({
                message : "Please provide profile type"
            })
        }
        if(req.body.email != req.user.email){
            return res.status(401).send({
                message : "User not authorized"
            })
        }
        const updateProfileView = await user.collection.updateOne({email : req.body.email}, {$set: {profile_type : req.body.profile_type}})
        console.log(updateProfileView)
        if(updateProfileView.acknowledged){
            res.status(200).send({
                message : "Updated"
            })
        }else{
            res.status(500).send({
                message : "Updation Failed"
            })
        }
        
    }catch(err){
        res.status(500).json({ message: err});
    }
}

async function getProfiles(req,res){
    try{
        if(!req.body && !req.body.email){
            res.status(400).send({
                message : "Please provide email id"
            })
        }
        if(req.body.email != req.user.email){
            return res.status(401).send({
                message : "User not authorized"
            })
        }
        const userExists = await user.collection.findOne({ email : req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userRole = userExists.role;
        const queryForUser = {
                profile_type : "public",
                role : {$ne : "admin"}
        }
        const profileToFetch = userRole == "admin" ? {} : queryForUser;
        const projection = { password: 0 , _id : 0};
        const profiles = await user.find(profileToFetch, projection)
        res.status(200).send({
            message : profiles
        })
    }catch(err){
        res.status(500).json({ message: err});
    }
}

async function authCheck(req,res, next){
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.sendStatus(401);
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }catch(err){
        res.status(500).json({ message: err});
    }
}

async function getJwtToken(req,res){
    try{
        if(!req.body && !req.body.email){
            res.status(400).send({
                message : "Please provide email id"
            })
        }
        const userExists = await user.find({email : req.body.email})
        if(userExists.length == 0){
            res.status(400).send({
                message : "User does not exists"
            })
        }
        const email = req.body.email;
        const userData = {email : email};
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h' });
        res.json({ accessToken: accessToken });
    }catch(err){
        res.status(500).json({ message: err});
    }
}

module.exports = {
   getJwtToken, authCheck, updateUserProfileView, getProfiles
}
