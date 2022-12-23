
const validateTitle = (title) => {
    if (!title || title.trim().length === 0)
        throw "Title must contain non-whitespace characters";
    title = title.trim();
    if (!/^[a-zA-Z ]*$/.test(title))
        throw 'Title may only contain letters and spaces';
    const maxTitleLength = 20;
    if (title.length > maxTitleLength)
        throw `Maximum ${maxTitleLength} characters.`;
};

const validateBody = (body) => {
    if (!body || body.trim().length === 0)
        throw "Body must contain non-whitespace characters";
    body = body.trim();
    const maxBodyLength = 200;
    const minBodyLength = 5;
    if (body.length > maxBodyLength)
        throw `Maximum ${maxBodyLength} characters.`;
    if (body.length < minBodyLength)
        throw `Minimum ${minBodyLength} characters.`;
};

const reviewForm = document.getElementById("review-form");
const reviewTitle = document.getElementById("reviewTitle");
const reviewBody = document.getElementById("reviewBody");
const ratings = document.getElementsByName("inlineRadioOptions");

const titleError = document.getElementById("invalidReviewTitle");
const bodyError = document.getElementById("invalidReviewBody");
const radioError = document.getElementById("radioError");



reviewForm.addEventListener('submit', (event) => {
    titleError.hidden = true;
    bodyError.hidden = true;
    radioError.hidden = true;
    try {
        validateTitle(reviewTitle.value);
    } catch (e) {
        event.preventDefault();
        titleError.textContent = e;
        titleError.hidden = false;
    }
    try {
        validateBody(reviewBody.value);
    } catch (e) {
        event.preventDefault();
        bodyError.textContent = e;
        bodyError.hidden = false;
    }

    let checked = false;
    for (let button of ratings) {
        if (button.checked)
            checked = true;
    }


    if (!checked) {
        event.preventDefault();
        radioError.textContent = 'Must select a rating';
        radioError.hidden = false;
    }
});