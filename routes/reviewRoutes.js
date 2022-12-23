const express = require('express');
const xss = require("xss");
const data = require("../data");
const { ObjectId } = require("mongodb");
const checkReviewData = require('../utils/reviewValidation');
const router = express.Router();
const reviewData = data.reviewData;

router
    .route('/:id')
    .get(async (req, res) => {
        res.json('Temp');
    })
    .post(async (req, res) => {
        try {
            const {
                reviewerIdStr,
                serviceIdStr,
                reviewTitleStr,
                reviewBodyStr,
                ratingVal
            } = checkReviewData(
                req.session.user.userId,
                req.params.id,
                req.body.reviewTitle,
                req.body.reviewBody,
                parseInt(req.body.inlineRadioOptions)
            );

            const insertedId = await reviewData.createReview(
                reviewerIdStr,
                serviceIdStr,
                reviewTitleStr,
                reviewBodyStr,
                ratingVal
            );

            res.redirect(`/service/${req.params.id}`);

        } catch (e) {
            res.json(e);
        }
    })



module.exports = router;