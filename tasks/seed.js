const connection = require("../config/mongoConnections")
const mongoCollections = require("../config/mongoCollections")
const serviceData = require("../data/serviceData")
const authData = require("../data/authData")
const userData = require("../data/userData")
const { ObjectId } = require("mongodb")
const bcryptJS = require("bcryptjs")

async function main() {
    const db = await connection.dbConnection()
    await db.dropDatabase()
    const users = mongoCollections.users
    const userCollection = await users()

    let john = null
    let mark = null
    let maddy = null
    let marcos = null
    let lisa = null
    let jimmy = null
    let ponny = null
    let donald = null

    let johnPassword = await bcryptJS.hash("John@123", 10)
    let markPassword = await bcryptJS.hash("Mark101$", 10)
    let maddyPassword = await bcryptJS.hash("maddyisChillGirl", 10)
    let marcosPassword = await bcryptJS.hash("marcospassword", 10)
    let lisaPassword = await bcryptJS.hash("smithlisa", 10)
    let jimmyPassword = await bcryptJS.hash("SubstoPewDiePie1Time$$", 10)
    let ponnyPassword = await bcryptJS.hash("$692Nj", 10)
    let donaldPassword = await bcryptJS.hash("makeAMERICAgreatagain", 10)

    john = {
        _id : new ObjectId(),
        bio: "😊",
        firstName: "John",
        lastName: "Dae",
        email: "johndae123@gmail.com",
        password: johnPassword,
        username: "john123",
        phoneNumber: "123 456 7890",
        avgRating: 3,
        socialMedias: {
            instagram: "https://www.instagram.com/johnIsTheOne",
            website: "https://www.thisisjohn.com"
        },
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "2022-11-30"
    }
    await userCollection.insertOne(john)

    mark = {
        _id : new ObjectId(),
        bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        firstName: "Mark",
        lastName: "Tartaglia",
        email: "mark.men.good@gmail.com",
        password: markPassword,
        username: "markisMen",
        phoneNumber: "012 345 6789",
        avgRating: 4,
        socialMedias: {
            website: "https://www.markismen.com"
        },
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "1998-11-30"
    }
    await userCollection.insertOne(mark)

    maddy = {
        _id : new ObjectId(),
        bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        firstName: "Maddy",
        lastName: "O'Conner",
        email: "maddy.service.heating@gmail.com",
        password: maddyPassword,
        username: "maddytheserver",
        phoneNumber: "456 123 9870",
        avgRating: 5,
        socialMedias: {
            facebook: "https://www.facebook.com/maddy.oconner.36",
            website: "https://www.markismen.com"
        },
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "2000-11-30"
    }
    await userCollection.insertOne(maddy)
    
    marcos = {
        _id : new ObjectId(),
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        firstName: "Marcos",
        lastName: "Martin",
        email: "marcosmartin@gmail.com",
        password: marcosPassword,
        username: "markomartin",
        phoneNumber: "202-555-0106",
        avgRating: 4,
        socialMedias: {
            instagram: "https://www.instagram.com/markooninsta",
        },
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "1995-11-30"
    }
    await userCollection.insertOne(marcos)

    lisa = {
        _id : new ObjectId(),
        bio: "When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        firstName: "Lisa",
        lastName: "Smith",
        email: "lisa.houseware@gmail.com",
        password: lisaPassword,
        username: "thissmithisuniqe",
        phoneNumber: "(202) 555 0104",
        avgRating: 4,
        socialMedias: {
            instagram: "https://www.instagram.com/thissmithisunique",
        },
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "1997-01-01"
    }
    await userCollection.insertOne(lisa)

    jimmy = {
        _id : new ObjectId(),
        bio: "This is dummy bio it is not relavant to service. Jimmy Donaldson, better known as MrBeast, is an American YouTube personality, credited with pioneering a genre of YouTube videos that centers on expensive stunts. His main channel, MrBeast, is the fourth-most-subscribed on the platform, and the highest by any individual. 🤑🪙💰💵💳🪙🍔🍔",
        firstName: "Jimmy",
        lastName: "Donaldson",
        email: "shopmrbeast@beast.edu",
        password: jimmyPassword,
        username: "mrbeast",
        phoneNumber: "202-555-0157",
        avgRating: 5,
        socialMedias: {
            facebook: "https://www.facebook.com/MrBeast6000/",
            instagram: "https://www.instagram.com/mrbeast",
            website: "https://linkpop.com/mrbeast"
        },
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "1997-01-01"
    }
    await userCollection.insertOne(jimmy)

    ponny = {
        _id : new ObjectId(),
        bio: "I am great.",
        firstName: "Ponny",
        lastName: "McKarthy",
        email: "ponnymc@myschool.edu",
        password: ponnyPassword,
        username: "ponnytail",
        phoneNumber: "202-555-0104",
        avgRating: 2,
        socialMedias: {},
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "2002-02-22"
    }
    await userCollection.insertOne(ponny)

    donald = {
        _id : new ObjectId(),
        bio: "Only one thing to say, MAKE AMERICA GREAT AGAIN. 🌎",
        firstName: "Donald",
        lastName: "Trump",
        email: "dtrump@penatagon.org",
        password: donaldPassword,
        username: "makeamericagreateagain",
        phoneNumber: "111-222-3333",
        avgRating: 5,
        socialMedias: {},
        favoriteServices: [],
        savedServices: [],
        blockedUsers: [],
        birthdate: "1947-06-14"
    }
    await userCollection.insertOne(donald)
    
    await connection.closeConnection();
    console.log("Done!");
}

main();