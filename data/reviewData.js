const { ObjectId } = require("mongodb")
const xss = require("xss")
const mongoCollections = require("../config/mongoCollections")
const dateHelper = require("../utils/dateHelper")
const reviewValidator = require('../utils/reviewValidation');

const reviewStuff = mongoCollections.reviews;
const services = mongoCollections.services;

const createReview = async (
    reviewerId,
    serviceId,
    reviewTitle,
    reviewBody,
    rating
) => {
    const {
        reviewerIdStr,
        serviceIdStr,
        reviewTitleStr,
        reviewBodyStr,
        ratingVal
    } = reviewValidator(
        reviewerId,
        serviceId,
        reviewTitle,
        reviewBody,
        rating
    );

    const reviewCollection = await reviewStuff();

    let review = {
        reviewerId: reviewerIdStr,
        serviceId: serviceIdStr,
        reviewTitle: reviewTitleStr,
        reviewMessage: reviewBodyStr,
        date: dateHelper.getTodaysDate(),
        rating: ratingVal
    };

    const inserted = await reviewCollection.insertOne(review);

    if (!inserted.acknowledged || !inserted.insertedId) {
        throw "Could not add review at this time please try after some time."
    }

    const serviceCollection = await services();
    const updated = await serviceCollection.updateOne({
        _id: ObjectId(serviceId)
    }, {
        $push: { reviews: inserted.insertedId }
    })
    if (updated.matchedCount === 0) throw "no service with given service id."
    if (updated.updatedCount === 0) throw 'unable to add review id to service.'

    return inserted.insertedId;

};

const getReviewsByService = async (serviceId) => {
    if (!serviceId) throw "must provide service id.";
    if (typeof (serviceId) !== 'string' || serviceId.trim().length === 0) throw "serviceid must be a string containing non-whitespace characters.";
    serviceId = xss(serviceId).trim();
    if (!ObjectId.isValid(serviceId)) throw 'service id must be a valid string.';

    const serviceCollection = await services();
    const service = await serviceCollection.findOne({ _id: ObjectId(serviceId) });
    if (!service)
        throw "Unable to find ervice with that id.";
    const { reviews } = service;
    if (reviews.length === 0)
        return undefined;

    const reviewData = [];


    const reviewCollection = await reviewStuff();

    for (let reviewId of reviews) {
        const foundReview = await reviewCollection.findOne({_id: reviewId});
        if (!foundReview) throw `Unable to retrieve review of id=${reviewId}`;
        reviewData.push(foundReview);
    }

    return reviewData;

};

module.exports = {
    createReview,
    getReviewsByService
};