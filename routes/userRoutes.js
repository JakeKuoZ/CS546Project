const express = require("express")
const xss = require("xss")
const data = require("../data")
const bcryptJS = require("bcryptjs")
const serviceValidation = require("../utils/serviceValidation")
const usersValidation = require("../utils/userValidation")

const router = express.Router()
const userData = data.userData

router
    .route("/myprofile")
    .get(async (req, res) => {
        if(!req.session.user) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Please login into application to access your profile."
            })
        }
        let userId = xss(req.session.user.userId).trim()
        let errors = {}
        try {
            serviceValidation.isValidId(userId, errors)
        } catch (exception) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        try {
            let user = await userData.getUserData(userId)
            return res.status(200).render("myprofile", {
                title: "Profile information",
                hasData: true,
                hasError: false,
                data: JSON.stringify(user)
            })    
        } catch (exception) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }
        
    })
    .put(async (req, res) => {
        if(!req.session.user) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Please login into application to access your profile."
            })
        }
        let userId = xss(req.session.user.userId).trim()
        let errors = {}

        try {
            serviceValidation.isValidId(userId, errors)
        } catch (exception) {
            return res.status(400).render("error", {
                title: "Invalid request.",
                status: 400,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        let userFromDB = null
        try {
            userFromDB = await userData.getUserData(userId)
        } catch (exception) {
            return res.status(400).render("error", {
                title: "Invalid request.",
                status: 400,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        let firstName = xss(req.body.firstName).trim()
        let lastName = xss(req.body.lastName).trim()
        let bio = xss(req.body.bio).trim()
        let phoneNumber = xss(req.body.phoneNumber).trim()
        let username = xss(req.body.username).trim()
        let birthDate = xss(req.body.birthDate).trim()
        let facebook = xss(req.body.facebook).trim()
        let instagram = xss(req.body.instagram).trim()
        let website = xss(req.body.website).trim()
        const requestedData = {
            firstName: firstName,
            lastName:lastName,
            bio: bio,
            phoneNumber:phoneNumber,
            email: userFromDB.email,
            username: username,
            birthdate: birthDate,
            facebook: facebook,
            instagram: instagram,
            website: website
        }
        try {
            usersValidation.verifyUserProfileData(
                firstName,
                lastName,
                phoneNumber,
                username,
                birthDate,
                facebook,
                instagram,
                website,
                errors
            )
        } catch(exception) {
            return res.status(400).render("myprofile", {
                title: "Profile information",
                hasData: true,
                hasError: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(errors)
            })    
        }

        try {
            let isUsernameExists = await userData.isUsernameExists(username, userId)
            if(isUsernameExists) {
                errors.username = "Username exists. please choose another one."
                return res.status(400).render("myprofile", {
                    title: "Profile information",
                    hasData: true,
                    hasError: true,
                    data: JSON.stringify(requestedData),
                    errors: JSON.stringify(errors)
                })  
            }
        } catch (exception) {
            errors.username = "Username exists. please choose another one."
            return res.status(400).render("myprofile", {
                title: "Profile information",
                hasData: true,
                hasError: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(errors)
            })
        }

        try {
            const updatedUser = await userData.updateUserInformation(
                userId,
                firstName,
                lastName,
                bio,
                phoneNumber,
                username,
                birthDate,
                facebook,
                instagram,
                website
            )
            if(updatedUser !== null) {
                return res.status(200).render("myprofile", {
                    title: "Profile information",
                    hasData: true,
                    hasError: false,
                    isUpdated: true,
                    data: JSON.stringify(updatedUser)
                })
            }
        } catch(exception) {
            return res.status(400).render("myprofile", {
                title: "Profile information",
                hasData: true,
                hasError: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }
    }) 
    .patch(async (req, res) => {
        if(!req.session.user) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Please login into application to access your profile."
            })
        }

        let userId = xss(req.session.user.userId).trim()
        let errors = { }
        try {
            serviceValidation.isValidId(userId, errors)
        } catch (exception) {
            return res.status(400).render("error", {
                title: "Invalid request.",
                status: 400,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        let currentPassword = xss(req.body.currentPassword).trim()
        let newPassword = xss(req.body.newPassword).trim()
        let confirmPassword = xss(req.body.confirmPassword).trim()

        try {
            usersValidation.checkPasswords(currentPassword, newPassword, confirmPassword, errors)
        } catch(exception) {
            return res.status(400).json(exception)
        }

        let userFromDB = null
        try {
            userFromDB = await userData.getUserData(userId)
            let isMatch = await bcryptJS.compare(currentPassword, userFromDB.password)
            if(!isMatch) {
                errors.currentPassword = "Your password do not match with the current password."
                return res.status(400).json(errors)
            }
        } catch (exception) {
            return res.status(400).json(exception)
        }
        try {
            let result = await userData.updatePassword(userId, currentPassword, newPassword, confirmPassword)
            res.status(200).json({"success": result})
        } catch(exception) {
            res.status(400).json(exception)
        }
    })
router
    .route("/:userId")
    .get(async (req, res) => {
        if(!req.session.user) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Please login into application to access your profile."
            })
        }

        let loggedInUserId = xss(req.session.user.userId).trim()
        let userId = xss(req.params.userId).trim()
        let errors = { }
        try {
            serviceValidation.isValidId(loggedInUserId, errors)
            serviceValidation.isValidId(userId, errors)
        } catch (exception) {
            return res.status(400).render("error", {
                title: "Invalid request",
                status: 400,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }
        if(loggedInUserId === userId) {
            res.redirect("/user/myprofile")
        }

        try {
            let user = await userData.getUserData(userId)
            delete user.password
            delete user.birthdate
            delete user.blockedUsers
            delete user.favoriteServices
            delete user.savedServices
            let title = ""
            if(user.firstName) {
                title = `${user.firstName} ${user.lastName}`
            } else {
                title = "No user info"
            }
            return res.status(200).render("userInfo", {
                title: title, 
                dataString: JSON.stringify(user),
                data: user,
                isDataPosted: user.firstName !== null
            })
        } catch(exception) {
            return res.status(404).render("error", {
                title: "User not found",
                status: 404,
                msg: "Trying to access user thats not exists."
            })
        }
    })
module.exports = router