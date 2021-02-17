const express = require('express');
const router = express.Router();
const User = require('./schema');
const bcrypt = require('bcrypt');

router.post('/create', async (req, res) => {

    const createUser = async () => {
        try {
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash(req.body.password, salt);
            const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: password});
            const success = await user.save();
            res.json(true);
        } catch(err) {
            throw err;
        }
    }
    
    try {
        const data = await User.find({email: req.body.email});
        if(data.length > 0)
            res.json(false);
        else
            createUser();
    } catch(err) {
        res.json(false);
    }
 });
  
router.post('/login', async (req, res) => {

    try {   
        const users = await User.find({
            email: req.body.email,
        })
        if(users.length > 0){
            const password = await bcrypt.compare(req.body.password, users[0].password);
            if(password)
                res.json(users[0]);
            else
                res.json(false);
        }
        else
            res.json(false);
    }
    catch(err) {
        res.json(false);
    }
});

module.exports = { router };