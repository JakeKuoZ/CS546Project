const xss = require("xss");
const { ObjectId } = require('mongodb');

const checkReviewData = (
    reviewerId,
    serviceId,
    reviewTitle,
    reviewBody,
    rating
) => {
    if (!reviewerId) throw 'Must provide reviewerId';
    if (!serviceId) throw 'Must provide serviceId';
    if (!reviewTitle) throw 'Must provide reviewTitle';
    if (!reviewBody) throw 'Must provide reviewBody';
    if (!rating) throw 'Must provide rating';

    if (typeof (reviewerId) !== 'string' || reviewerId.trim().length === 0) throw 'reviewerId must be a non-empty string.'
    if (typeof (serviceId) !== 'string' || serviceId.trim().length === 0) throw 'serviceId must be a non-empty string.'
    if (typeof (reviewTitle) !== 'string' || reviewTitle.trim().length === 0) throw 'reviewTitle must be a non-empty string.'
    if (typeof (reviewBody) !== 'string' || reviewBody.trim().length === 0) throw 'reviewBody must be a non-empty string.'
    if (typeof (rating) !== 'number') throw 'rating must be a non-empty number.'

    reviewerId = xss(reviewerId).trim();
    serviceId = xss(serviceId).trim();
    reviewTitle = xss(reviewTitle).trim();
    reviewBody = xss(reviewBody).trim();

    if (!ObjectId.isValid(reviewerId)) throw 'reviewer id must be a valid object id';
    if (!ObjectId.isValid(serviceId)) throw 'service id must be a valid object id';

    if (rating < 1 || rating > 5)
        throw 'Invalid rating';

    if (!/^[a-zA-Z ]*$/.test(reviewTitle))
        throw 'Title may only contain letters and spaces';
    const maxTitleLength = 20;
    if (reviewTitle.length > maxTitleLength)
        throw `Maximum ${maxTitleLength} characters.`;

    const maxBodyLength = 200;
    const minBodyLength = 5;
    if (reviewBody.length > maxBodyLength)
        throw `Maximum ${maxBodyLength} characters.`;
    if (reviewBody.length < minBodyLength)
        throw `Minimum ${minBodyLength} characters.`;

    return {
        reviewerIdStr: reviewerId,
        serviceIdStr: serviceId,
        reviewTitleStr: reviewTitle,
        reviewBodyStr: reviewBody,
        ratingVal: rating
    }

}
module.exports = checkReviewData;