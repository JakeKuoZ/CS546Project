const express = require("express")
const xss = require("xss")
const serviceValidation = require("../utils/serviceValidation")
const data = require("../data")
const uploader = require("../utils/uploader")
const fs = require("fs")
const { ObjectId } = require("mongodb")

const router = express.Router()
const serviceData = data.serviceData
const reviewData = data.reviewData;
const authData = data.authData;
const userData2 = data.userData;

const allowedImageType = ["image/jpeg","image/jpg", "image/png"]
const allowedVideoType = ["video/mp4", "video/x-matroska", "video/mpeg"]

const IMAGE_MAX_SIZE_IN_BYTES = 3145728
const VIDEO_MAX_SIZE_IN_BYTES = 52428800

router
    .route("/")
    .get(async (req, res) => {
        if (!req.session.user) {
            return res.render("signup",{layout: "mainReg"});
        }
        let userId = xss(req.session.user.userId).trim()
        try {
            serviceValidation.isValidId(userId, {})
        } catch(exception) {
            return res.status(401).render("error", {
                title: "Invalid request",
                status: 401,
                msg: "Please login into application to add service."
            })
        }
        let userInfo = null
        try {
            userInfo = await userData2.getUserData(userId)
        } catch(exception) {
            return res.status(401).render("error", {
                title: "Invalid request",
                status: 401,
                msg: exception
            })
        }
        res.status(200).render("addService", {
            title: "Add your service",
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber
        })
    })
    .post(uploader.uploadMediaFile, async (req, res) => {

        if(!req.session.user) {
            if(!req.session.user) {
                return res.status(401).render("error", {
                    title: "Invalid request",
                    status: 401,
                    msg: "Please login into application to add service."
                })
            }
        }

        let errors = {}
        let imageFilesInfo = req.files["imageFile"]
        let videoFilesInfo = req.files["videoFile"]

        let imageFileUploadInfo = uploader.getFileNameForDB(imageFilesInfo, errors, IMAGE_MAX_SIZE_IN_BYTES, allowedImageType, true)
        let imageFileNameForDB = imageFileUploadInfo.fileNameForDB
        if(imageFileUploadInfo.errors.imageFile !== undefined) {
            errors.imageFile = imageFileUploadInfo.errors.imageFile
        }
        let videoFileUploadInfo = uploader.getFileNameForDB(videoFilesInfo, errors, VIDEO_MAX_SIZE_IN_BYTES, allowedVideoType, false)
        let videoFileNameForDB = videoFileUploadInfo.fileNameForDB
        if(videoFileUploadInfo.errors.videoFile !== undefined) {
            errors.videoFile = videoFileUploadInfo.errors.videoFile
        }
        
        let serviceName = xss(req.body.serviceName).trim()
        let serviceDescription = xss(req.body.serviceDescription).trim()
        let serviceCategory = xss(req.body.serviceCategory).trim()
        let otherServiceCategoryName = xss(req.body.otherServiceCategoryName).trim()
        let keywords = xss(req.body.keywords).trim()
        let typicalCharge = xss(req.body.typicalCharge).trim()
        let avgCompletionTime = xss(req.body.avgCompletionTime).trim()
        let phoneNumber = xss(req.body.phoneNumber).trim()
        let email = xss(req.body.email).trim()

        const requestData = {
            serviceName: serviceName,
            description: serviceDescription,
            category: serviceCategory,
            otherCategory: otherServiceCategoryName,
            keywords: keywords,
            typicalCharge: typicalCharge,
            avgCompletionTime: avgCompletionTime,
            phoneNumber: phoneNumber,
            email: email
        }

        try {
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
        } catch (exception) {
            return res.render("addService", {
                hasError: true,
                errors: JSON.stringify(exception) ,
                data: JSON.stringify(requestData)
            })
        }

        try {
            const serviceId = await serviceData.createService(
                req.session.user.userId,
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
            )
            return res.redirect(`/service/${serviceId}`);
        } catch(exception) {
            return res.render("addService", {
                hasError: true,
                errors: JSON.stringify(exception),
                data: JSON.stringify(requestData)
            })
        }        
    })

router
    .route("/alter-service/:serviceId")
    .get(async (req, res) => {

        if(!req.session.user) {
            if(!req.session.user) {
                return res.status(400).render("error", {
                    title: "Invalid request",
                    status: 400,
                    msg: "Please login into application to access your profile."
                })
            }
        }

        let userId = xss(req.session.user.userId).trim()
        let serviceId = xss(req.params.serviceId).trim()

        try {
            serviceValidation.isValidId(serviceId, {})
            serviceValidation.isValidId(userId, {})
        } catch(exception) {
            return res.status(400).render("error", {
                title: "Bad Request",
                status: 400,
                msg: exception.otherErrors
            })
        }

        let serviceObjFromDB = null
        try {
            serviceObjFromDB = await serviceData.getService(serviceId)
            if(serviceObjFromDB === null) {
                return res.status(400).render("error",{
                    title: "Invalid Service.",
                    status: 400,
                    msg: "You are trying to access invalid service."
                } )
            }
        } catch(exception) {
            return res.status(400).render("error", {
                title: "Bad Request",
                status: 400, 
                msg: exception
            })
        }
        
        if(serviceObjFromDB.userId !== userId) {
            return res.status(401).render("error", {
                title: "Unauthorised Access",
                status: 401,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        res.status(200).render("alterService", {
            title: "Update/Delete your service",
            serviceId: xss(req.params.serviceId),
            hasError: true,
            errors: JSON.stringify({}),
            data: JSON.stringify(serviceObjFromDB)
        })
    })
    .put(uploader.uploadMediaFile, async (req, res) => {

        if(!req.session.user) {
            if(!req.session.user) {
                return res.status(400).render("error", {
                    title: "Invalid request",
                    status: 400,
                    msg: "Please login into application to access your profile."
                })
            }
        }

        let userId = xss(req.session.user.userId).trim()
        let serviceId = xss(req.params.serviceId).trim()
        let errors = {}

        let imageFilesInfo = req.files["imageFile"]
        let videoFilesInfo = req.files["videoFile"]

        let imageFileUploadInfo = uploader.getFileNameForDB(imageFilesInfo, errors, IMAGE_MAX_SIZE_IN_BYTES, allowedImageType, true)
        let imageFileNameForDB = imageFileUploadInfo.fileNameForDB
        if(imageFileUploadInfo.errors.imageFile !== undefined) {
            errors.imageFile = imageFileUploadInfo.errors.imageFile
        }
        let videoFileUploadInfo = uploader.getFileNameForDB(videoFilesInfo, errors, VIDEO_MAX_SIZE_IN_BYTES, allowedVideoType, false)
        let videoFileNameForDB = videoFileUploadInfo.fileNameForDB
        if(videoFileUploadInfo.errors.videoFile !== undefined) {
            errors.videoFile = videoFileUploadInfo.errors.videoFile
        }

        if(imageFileNameForDB === null && req.body.crrImageName.length !== 0) {
            imageFileNameForDB = req.body.crrImageName
        }

        if(videoFileNameForDB === null && req.body.crrVideoName.length !== 0) {
            videoFileNameForDB = req.body.crrVideoName
        }

        let serviceName = xss(req.body.serviceName).trim()
        let serviceDescription = xss(req.body.serviceDescription).trim()
        let serviceCategory = xss(req.body.serviceCategory).trim()
        let otherServiceCategoryName = xss(req.body.otherServiceCategoryName).trim()
        let keywords = xss(req.body.keywords).trim()
        let typicalCharge = xss(req.body.typicalCharge).trim()
        let avgCompletionTime = xss(req.body.avgCompletionTime).trim()
        let phoneNumber = xss(req.body.phoneNumber).trim()
        let email = xss(req.body.email).trim()

        const requestData = {
            serviceName: serviceName,
            description: serviceDescription,
            category: serviceCategory,
            otherCategory: otherServiceCategoryName,
            keywords: keywords,
            typicalCharge: typicalCharge,
            avgCompletionTime: avgCompletionTime,
            phoneNumber: phoneNumber,
            email: email
        }

        try {
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
        } catch (exception) {
            return res.render("alterService", {
                hasError: true,
                errors: JSON.stringify(exception) ,
                data: JSON.stringify(requestData)
            })
        }

        let serviceObjFromDB = null
        try {
            serviceObjFromDB = await serviceData.getService(serviceId)
            if(serviceObjFromDB === null || serviceObjFromDB === undefined) {
                errors.otherErrors = "Trying to update invalid service."
                return res.render("alterService", {
                    title: "Update/Delete Service",
                    hasError: true,
                    errors: JSON.stringify(errors),
                    data: JSON.stringify(requestData)
                })

            }
        } catch(exception) {
            errors.otherErrors = exception
            return res.render("alterService", {
                title: "Update/Delete Service",
                hasError: true,
                errors: JSON.stringify(errors),
                data: JSON.stringify(requestData)
            })
        }

        if(serviceObjFromDB !== userId) {
            return res.status(401).render("error", {
                title: "Unauthorised Access",
                status: 401,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        try {
            const updatedServiceId = await serviceData.updateService(
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
            )
            if(updatedServiceId === null || updatedServiceId === undefined) {
                errors.otherErrors = "Can not update your service at this moment. Please try after some time."
                return res.render("alterService", {
                    hasError: true,
                    errors: JSON.stringify(errors),
                    data: JSON.stringify(requestData)
                })
            }
            return res.redirect(`/service/${serviceId}`);
        } catch(exception) {
            return res.render("alterService", {
                hasError: true,
                errors: JSON.stringify(exception),
                data: JSON.stringify(requestData)
            })
        } 
    
    })
    .delete(async (req, res) => {
        
        let userId = xss(req.session.user.userId).trim()
        let serviceId = xss(req.params.serviceId).trim()
        let errors = {}

        try {
            serviceValidation.isValidId(serviceId, {})
            serviceValidation.isValidId(userId, { })
        } catch(exception) {
            errors.otherErrors = "Trying to delete invalid service."
            return res.render("alterService", {
                hasError: true,
                errors: JSON.stringify(exception)
            })
        }

        let serviceObjFromDB = null
        try {
            serviceObjFromDB = await serviceData.getService(serviceId)
            if(serviceObjFromDB === null) {
                errors.otherErrors = "Trying to update invalid service."
                return res.render("alterService", {
                    title: "Update/Delete Service",
                    hasError: true,
                    errors: JSON.stringify(errors)
                })
            }
        } catch(exception) {
            errors.otherErrors = exception
            return res.render("alterService", {
                title: "Update/Delete Service",
                hasError: true,
                errors: JSON.stringify(errors)
            })
        }
        
        if(serviceObjFromDB !== userId) {
            return res.status(401).render("error", {
                title: "Unauthorised Access",
                status: 401,
                msg: "Invalid request. Please login into application to access your profile."
            })
        }

        try {
            const deletionInfo = await serviceData.deleteService(serviceId)
            //TODO move user to their posts in My service
            return res.status(200).json({hasError: false})
        } catch(exception) {
            return res.status(400).json({
                hasError: true,
                errors: JSON.stringify(exception)
            })
        }
    })
        

    router
        .route('/:id')
        .get(async (req, res) => {
            let id = req.params.id;
            id = id.trim();

            console.log(typeof id);
            if (id.length === 0) {
                res.render('error', {
                    status: 400,
                    msg: `id ${req.params.id} invalid. Must contain non-whitespace characters.`
                })
                return;
            }

            if (!ObjectId.isValid(req.params.id)) {
                res.render('error', {
                    status: 400,
                    msg: `id ${req.params.id} invalid. Must be a valid ObjectID`
                })
                return;
            }

            try {
                const foundService = await serviceData.getService(req.params.id);
                const foundReviews = await reviewData.getReviewsByService(req.params.id);
                let avgRating = 0;
                if (foundReviews)
                {
                    for (let i = 0; i < foundReviews.length; i++) {
                        avgRating+=foundReviews[i].rating;
                        const reviewer = await authData.getUsername(foundReviews[i].reviewerId);
                        foundReviews[i].reviewerUsername = reviewer;
                    }
                    avgRating/=foundReviews.length;
                }
                
                const reviewerUsername = 'tempUsername';
                const posterUsername = await authData.getUsername(foundService.userId);
                res.render('viewService', {foundService, foundReviews, reviewerUsername, posterUsername, avgRating});
            } catch (e) {
                res.render('error', {
                    status: 404,
                    msg: e
                })
            }
        });

module.exports = router