const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcryptjs");
const validation = require("../utils/userValidation");
const { ObjectId } = require('mongodb');

const createUser = async (username, email, password, confirm) => {
    if (!email || !password || !confirm || !username) {
        throw "email and password and comfirm and username and password are required";
    }
    email = validation.checkEmail(email);
    const userCollection = await users();
    username = validation.checkUsername(username);
    const exist = await userCollection.findOne({ $or: [{ email }, { username }] });
    if (exist) {
        throw "Email already exists";
    }
    password = password.trim();
    confirm = confirm.trim();
    if (password !== confirm) {
        throw "Password and confirm password are not the same";
    }
    password = validation.checkPassword(password);
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const user = await userCollection.insertOne({
            bio: null,
            firstName: null,
            lastName: null,
            email: email,
            password: hashedPassword,
            username: username,
            age: null,
            phoneNumber: null,
            avgRating: null,
            socialMedias: {},
            favoriteServices: [],
            savedServices: [],
            blockedUsers: [],
        });
        if (user) {
            return { insertedUser: true, username };
        }
    } catch (e) {
        throw "unable to add user"
    }
};

const checkUser = async (email, password) => {
    if (!email || !password) {
        throw "Username and password are required";
    }
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);
    const userCollection = await users();
    const user = await userCollection.findOne({
        email,
    });
    if (user === null) {
        throw "Either the email or password is invalid";
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        return {
            email: email,
            userId: user._id,
            username: user.username,
            firstName: user.firstName,
            authenticatedUser: true,
        };
    } else {
        throw "Either the email or password is invalid";
    }
};

const getUsername = async (id) => {
    if (!id) throw "must give an id";
    if (!ObjectId.isValid(id)) throw "id must be a valid ObjectId";

    const userCollection = await users();

    const foundUser = await userCollection.findOne({ _id: ObjectId(id) });

    if (!foundUser) return 'user_deleted'
    else return foundUser.username;
};

const updateUser = async (
    bio,
    firstName,
    lastName,
    username,
    age,
    phoneNumber,
    socialMedias
) => {
    const userCollection = await users();
    const updatedUser = {};
};

module.exports = {
    createUser,
    checkUser,
    updateUser,
    getUsername,
};
