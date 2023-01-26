const auth = require('../auth')
const User = require('../model/user-model')
const Note = require('../model/note-model')
const bcrypt = require('bcryptjs')
// const postmark = require("postmark");


registerUser = async (req, res) => {
    console.log("___________________________")
    console.log(req.body)
    console.log("___________________________")
    try {
        const { _id, username, email, password, passwordVerify } = req.body;
        if (!email || !password || !passwordVerify || !username) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        const existingUser2 = await User.findOne({ username: username });
        if (existingUser2) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const shared_notes = []
        const my_notes = []
        const profile_picture = "https://res.cloudinary.com/natialemu47/image/upload/v1650264061/samples/animals/kitten-playing.gif"


        const newUser = new User({
            username, email, passwordHash, shared_notes, my_notes, profile_picture
        });

        if(_id) {
            newUser._id = _id
        }

        // const client = new postmark.ServerClient("e6e0a7f9-eaed-43f2-986c-a4a8267fef50");

        //   try{
        //     const message = {
        //         "From": "sean.yang@stonybrook.edu",
        //         "To": newUser.email,
        //         "Subject": "Welcome " + first_name + "!",
        //         "HtmlBody": "Welcome to Tileslate, we're here to make art together.",
        //         "MessageStream": "outbound"
        //     };
        //     await client.sendEmail(message);
        //     //console.log(client.getBounces)
        //   }
        //   catch(error) {
        //     return res.status(400).json({
        //         errorMessage: "Not a real email!"
        //     })
        //   }

        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: savedUser
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

login = async(req, res) => {
    const { email, username, password } = req.body;
    const loggedInUser = await User.findOne({ email: email });
    if (!loggedInUser) {
        return res.status(400).json({errorMessage:"User not found, please check you have entered the correct email address and password"});
    }
    const passwordCorrect = await bcrypt.compare(password, loggedInUser.passwordHash);
    if(!passwordCorrect) {
        return res.status(400).json({errorMessage:"User not found, please check you have entered the correct email address and password"});
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // LOGIN THE USER
    const token = auth.signToken(loggedInUser);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json({
        success: true,
        user: loggedInUser
    }).send();
}

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        if(!loggedInUser) {
            return res.status(200).json({
                loggedIn: false,
                user: null
            })
        }

        return res.status(200).json({
            loggedIn: true,
            user: loggedInUser
        })
    })
}

// for getting the user that's getting their password changed
emailVerified = async (req, res) => {
    const { email } = req.body;

    const possibleUser = await User.findOne({ email: email });
    if(!possibleUser) {
        return res.status(400).json({errorMessage:"Email not found"});

    }
    // LOGIN THE USER
    const token = auth.signToken(possibleUser);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json({
        success: true,
        user: possibleUser
    }).send();
}

logout = async(req, res) => {
    const token = auth.signToken(null);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json({
        success: true,
        user: null
    })
}

updateUser = async(req, res) => {
    
    const { email, username, _id, my_notes, shared_notes, profile_picture } = req.body;

    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const loggedInUser = await User.findOne({ _id: _id });
    const body = req.body
    if (!loggedInUser) {
        return res.status(400).json({errorMessage:"User not found"});
    }

    if(loggedInUser.username != username) {
        const sameName = await User.findOne({username: username})
        if(sameName) {
            return res.status(400).json({errorMessage: "Username already taken!"})
        }
    }

    if(loggedInUser.email != email) {
        const sameName = await User.findOne({email: email})
        if(sameName) {
            return res.status(400).json({errorMessage: "Email already taken!"})
        }
    }

    loggedInUser.username = username;
    loggedInUser.email = email;
    loggedInUser.my_notes = my_notes;
    loggedInUser.shared_notes = shared_notes;
    loggedInUser.profile_picture = profile_picture;
    
    loggedInUser
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                username: loggedInUser.username,
                user: loggedInUser,
                message: 'user updated!',
            })
        })
        .catch(error => {
            console.log((error));
            return res.status(404).json({
                error,
                message: 'user not updated!',
            })
        })

}

changePassword = async(req, res) => {
    const { id, currentPassword, password, passwordVerify} = req.body;
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update the Password!',
        })
    }
    if (password !== passwordVerify) {
        return res.status(400).json({
            success: false,
            error: 'New Password must match Password Verify!',
        })
    }
    const loggedInUser = await User.findOne({ _id: id });

    const passwordCorrect = await bcrypt.compare(currentPassword, loggedInUser.passwordHash);
    if(!passwordCorrect) {
        return res.status(400).json({errorMessage:"Wrong Password, please check you have entered your current Password correctly"});
    }
    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    loggedInUser.passwordHash = passwordHash
    loggedInUser.save()
        .then(() => {
            return res.status(200).json({
                success: true,
                username: loggedInUser.username,
                user: loggedInUser,
                message: 'Password updated!',
            })
        })
        .catch(error => {
            console.log((error));
            return res.status(404).json({
                error,
                message: 'Password not updated!',
            })
        })


}


passwordReset = async(req, res) => {
    const { id, password, passwordVerify} = req.body;
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update the Password!',
        })
    }
    if (password !== passwordVerify) {
        return res.status(400).json({
            success: false,
            error: 'New Password must match Password Verify!',
        })
    }
    const loggedInUser = await User.findOne({ _id: id });
    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    loggedInUser.passwordHash = passwordHash
    loggedInUser.save()
        .then(() => {
            return res.status(200).json({
                success: true,
                username: loggedInUser.username,
                user: loggedInUser,
                message: 'Password updated!',
            })
        })
        .catch(error => {
            console.log((error));
            return res.status(404).json({
                error,
                message: 'Password not updated!',
            })
        })
}


deleteUser = async(req, res) => {
    try{
        const {id }= req.body;
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an id to delete',
            })
        }

        const loggedInUser = await User.findOne({ _id: id });

        if (!loggedInUser) {
            return res.status(404).json({errorMessage:"User not found"});
        }

        for (let i = 0; i < loggedInUser.my_notes.length; i++) {
            await Note.findOneAndDelete({_id: loggedInUser.my_notes[i]})    
        }
        
        const deletedUser = await User.findOneAndDelete({_id: id});
        return res.status(200).json({
            success:true,
            message: "deleted user successfully!",
            user: loggedInUser
        })
    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


module.exports = {
    getLoggedIn,
    registerUser,
    login,
    logout,
    updateUser,
    deleteUser,
    changePassword,
    emailVerified,
    passwordReset
}