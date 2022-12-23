const xss = require("xss")
const mongoCollections = require("../config/mongoCollections")
const dateHelper = require("../utils/dateHelper")
const serviceValidation = require("../utils/serviceValidation")
const { ObjectId } = require("mongodb")

const services = mongoCollections.services

const createService = async (
    userId,
    serviceName, 
    serviceDescription, 
    serviceCategory,
    otherServiceCategoryName,
    keywords,
    typicalCharge,
    avgCompletionTime,
    imageFileNameForDB,
    videoFileNameForDB,
    phoneNumber,
    email
) => {
    let errors = {}
    serviceName = xss(serviceName).trim()
    serviceDescription = xss(serviceDescription).trim()
    serviceCategory = xss(serviceCategory).trim()
    otherServiceCategoryName = xss(otherServiceCategoryName).trim()
    keywords = xss(keywords).trim()
    typicalCharge = xss(typicalCharge).trim()
    avgCompletionTime = xss(avgCompletionTime).trim()
    phoneNumber = xss(phoneNumber).trim()
    email = xss(email).trim()

    serviceValidation.verifyAddServiceData(
        serviceName,
        serviceDescription,
        serviceCategory,
        otherServiceCategoryName,
        keywords,
        typicalCharge,
        avgCompletionTime,
        phoneNumber,
        email,
        errors
    )

    let otherCategory = null
    if(!otherServiceCategoryName) {
        otherCategory = null
    } else if(otherServiceCategoryName.length === 0) {
        otherCategory = null
    } else {
        otherCategory = otherServiceCategoryName
    }

    let service = {
        userId: userId,
        serviceName: serviceName,
        description: serviceDescription,
        category: serviceCategory,
        otherCategory: otherCategory,
        image: imageFileNameForDB,
        video: videoFileNameForDB,
        keywords: keywords,
        phoneNumber: phoneNumber,
        email: email,
        datePosted: dateHelper.getTodaysDate(),
        avgCompletionTime: `${avgCompletionTime} hours`,
        typicalCharge: parseInt(typicalCharge),
        reviews: []
    }
    const serviceCollection = await services()
    const insertInfo = await serviceCollection.insertOne(service) 
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
        errors.otherErrors = "Could not add service at this time please try after some time."
		throw errors
	}
    const newId = insertInfo.insertedId.toString()
    return newId
}

const updateService = async (
    serviceId,
    userId,
    serviceName, 
    serviceDescription, 
    serviceCategory,
    otherServiceCategoryName,
    keywords,
    typicalCharge,
    avgCompletionTime,
    imageFileNameForDB,
    videoFileNameForDB,
    phoneNumber,
    email
) => {
    let errors = {}

    serviceId = xss(serviceId).trim()
    userId = xss(userId).trim()
    serviceName = xss(serviceName).trim()
    serviceDescription = xss(serviceDescription).trim()
    serviceCategory = xss(serviceCategory).trim()
    otherServiceCategoryName = xss(otherServiceCategoryName).trim()
    keywords = xss(keywords).trim()
    typicalCharge = xss(typicalCharge).trim()
    avgCompletionTime = xss(avgCompletionTime).trim()
    phoneNumber = xss(phoneNumber).trim()
    email = xss(email).trim()

    serviceValidation.verifyAddServiceData(
        serviceName,
        serviceDescription,
        serviceCategory,
        otherServiceCategoryName,
        keywords,
        typicalCharge,
        avgCompletionTime,
        phoneNumber,
        email,
        errors
    )

    serviceValidation.isValidId(serviceId, errors)
    serviceValidation.isValidId(userId, errors)

    let otherCategory = null
    if(!otherServiceCategoryName) {
        otherCategory = null
    } else if(otherServiceCategoryName.length === 0) {
        otherCategory = null
    } else {
        otherCategory = otherServiceCategoryName
    }

    let serviceObjFromDB = await getService(serviceId)
    if(serviceObjFromDB === null || serviceObjFromDB._id === undefined) {
        errors.otherErrors = "Trying to update invalid service."
        throw errors
    }

    // TODO check user is not deleting others service
    if(serviceObjFromDB.userId !== userId) {
        errors.otherErrors = "Trying to update invalid service."
        throw errors
    }

    let updatedService = {
        userId: "tempuserid",
        serviceName: serviceName,
        description: serviceDescription,
        category: serviceCategory,
        otherCategory: otherCategory,
        image: imageFileNameForDB,
        video: videoFileNameForDB,
        keywords: keywords,
        phoneNumber: phoneNumber,
        email: email,
        datePosted: dateHelper.getTodaysDate(),
        avgCompletionTime: `${avgCompletionTime} hours`,
        typicalCharge: parseInt(typicalCharge),
        reviews: serviceObjFromDB.reviews
    }

    

    const serviceCollection = await services()
    const updateInfo = await serviceCollection.updateOne({
        _id: ObjectId(serviceId)
    }, {
        $set: updatedService
    })
    if(updateInfo.modifiedCount === 0) {
        errors.otherErrors = "Could not update service at this time please try after some time."
		throw errors
    }
    return serviceId
}

const deleteService = async (serviceId, userId) => {
    serviceId = xss(serviceId).trim()
    userId = xss(userId).trim()

    let errors = {}
    serviceValidation.isValidId(serviceId, errors)
    serviceCollection.isValidId(userId, errors)

    let serviceObjFromDB = await getService(serviceId)
    if(serviceObjFromDB === null || serviceObjFromDB._id === undefined) {
        errors.otherErrors = "Trying to delete invalid service."
        throw errors
    }

    // TODO check user is not deleting others service
    if(serviceObjFromDB.userId !== userId) {
        errors.otherErrors = "Trying to update invalid service."
        throw errors
    }
    
    const serviceCollection = await services()
    const deletionInfo = await serviceCollection.deleteOne({_id: ObjectId(serviceId)})
    if(deletionInfo.deleteCount === 0){
        errors.otherErrors = "Could not delete your service at this moment please try after some time."
		throw errors
	}
    return serviceId

};
const getService = async (serviceId) => {
    if (!serviceId) throw "Error: Must provide serviceId";
    if (typeof(serviceId) !== 'string') throw "Error: serviceId must be a string.";

    serviceId = xss(serviceId).trim();

    if (serviceId.length === 0)
        throw "Error: id must contain non-whitespace characters.";

    if (!ObjectId.isValid(serviceId))
        throw "Id must be a valid object id.";
    
    const serviceCollection = await services();
    const service = await serviceCollection.findOne({_id: ObjectId(serviceId)});

    if (!service)
        throw "no service with that id.";

    return {...service, _id:service._id.toString()};
}

module.exports = {
    createService,
    updateService,
    deleteService,
    getService
}