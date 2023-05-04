let express = require('express');
let router = express.Router();
const accountService = require('../services/accountService');
const bcrypt = require('bcrypt');

/*
 * This is a POST route that the path /login
 * It will check the username and password against the fake database
 * If the credentials are valid, it will create a session and return the user object
 * If the credentials are invalid, it will return an error message
 * @param {string} username - username
 * @param {string} password - password
 * @return {object} user - user object
 * @return {string} error - error message
*/

router.post("/login", async (req, res) => {
    let user = await accountService.getAccountByEmail(req.body.email);
    if (user && user.status == 'inactive') {
        res.status(401).json("Account is inactive");
        return;
    }
    const ERROR = "Invalid credentials";
    if (user) {
        req.session.regenerate(async (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                try {
                    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
                    if (passwordMatch) {
                        req.session.user = user;
                        res.status(200).json(user);
                    } else {
                        res.status(401).json(ERROR);
                    }
                } catch (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                }
            }
        });
    } else {
        res.status(401).json(ERROR);
    }
});

router.get("/who", (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).send("No user logged in");
    }
});



/*
 * This is a POST route that the path /logout
 * It will destroy the session and redirect to the home page
*/
router.post("/logout", (req, res) => {
   req.session.regenerate( () => {
    res.status(200).json({ message : "User logged out" });
   });
});

module.exports = router;