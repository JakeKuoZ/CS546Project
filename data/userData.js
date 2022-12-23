const xss = require("xss")
const bcryptJS = require("bcryptjs")
const mongoCollections = require("../config/mongoCollections")
const serviceValidation = require("../utils/serviceValidation")
const usersValidation = require("../utils/userValidation")
const { ObjectId } = require("mongodb")

const users = mongoCollections.users

const getUserData = async (userId) => {
    userId = xss(userId).trim()
    let errors = {}
    serviceValidation.isValidId(userId, errors)
    
    const userCollection = await users()
    const user = await userCollection.findOne({_id: ObjectId(userId)})
    if(user === null) {
        throw "No user with this id."
    }
    return user
}

const updateUserInformation = async (
    userId,
    firstName,
    lastName,
    bio,
    phoneNumber,
    username,
    birthdate,
    facebook,
    instagram,
    website
) => {
    let errors = { }

    firstName = xss(firstName).trim()
    lastName = xss(lastName).trim()
    bio = xss(bio).trim()
    phoneNumber = xss(phoneNumber).trim()
    username = xss(username).trim()
    birthdate = xss(birthdate).trim()
    facebook = xss(facebook).trim()
    instagram = xss(instagram).trim()
    website = xss(website).trim()

    usersValidation.verifyUserProfileData(
        firstName,
        lastName,
        phoneNumber,
        username,
        birthdate,
        facebook,
        instagram,
        website,
        errors
    )

    let isUsernameThere = await isUsernameExists(username, userId)
    if(isUsernameThere) {
        errors.username = "Username exists. Please choose another one."
        throw errors
    }

    let userFromDB = await getUserData(userId)

    let socialMedias = {}
    if(facebook.length > 0) {
        socialMedias.facebook = facebook
    }
    if(instagram.length > 0) {
        socialMedias.instagram = instagram
    }
    if(website.length > 0) {
        socialMedias.website = website
    }
    let user = {
        bio: bio,
        firstName: firstName,
        lastName: lastName,
        email: userFromDB.email,
        password: userFromDB.password,
        username: username.toLowerCase(),
        birthdate: birthdate,
        phoneNumber: phoneNumber,
        avgRating: userFromDB.avgRating,
        socialMedias: socialMedias,
        favoriteServices: userFromDB.favoriteServices,
        savedServices: userFromDB.savedServices,
        blockedUsers: userFromDB.blockedUsers
    }

    const userCollection = await users()
    const updateInfo = await userCollection.updateOne({
        _id: ObjectId(userId)
    }, {
        $set: user
    })
    if(updateInfo.matchedCount === 1 && updateInfo.modifiedCount === 0){

    } else if(updateInfo.modifiedCount === 0) {
        errors.otherErrors = "Could not update your profile information at this moment. Please try after some time."
        throw errors
    }
    let updatedUser = await getUserData(userId)
    return updatedUser
}

const updatePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    userId = xss(userId).trim()
    currentPassword = xss(currentPassword).trim()
    newPassword = xss(newPassword).trim()
    confirmPassword = xss(confirmPassword).trim()
    let errors = {}

    serviceValidation.isValidId(userId, errors)
    
    usersValidation.checkPasswords(currentPassword, newPassword, confirmPassword, errors)

    let userFromDB = await getUserData(userId)

    let isMatch = await bcryptJS.compare(currentPassword, userFromDB.password)
    if(!isMatch) {
        errors.currentPassword = "Your password do not match with the current password."
        throw errors
    }

    let encryptedPassword = await bcryptJS.hash(newPassword, 10)

    const userCollection = await users()
    const updateInfo = await userCollection.updateOne({_id: ObjectId(userId)}, {$set: {password: encryptedPassword}})
    if(updateInfo.modifiedCount === 0) {
        errors.otherErrors = "Could not change your password at this moment. Please try after some time."
        throw errors
    }
    return "Your password updated successfully."
}

const isUsernameExists = async (username, userId) => {
    username = xss(username).trim()
    userId = xss(userId).trim()

    const userCollection = await users()
    const condition = {
        $and:[
            {username:username.toLowerCase()}, 
            {_id: {$ne:ObjectId(userId)}}
        ]
    }
    const userList = await userCollection.find(condition).toArray()
    if(userList === null) {
        return false
    }
    if(userList.length > 0) {
        return true
    }
    return false
}

module.exports = {
    getUserData,
    isUsernameExists,
    updateUserInformation,
    updatePassword
}