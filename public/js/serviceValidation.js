function toggleOtherCategoryTextbox(selectionControl){
    let selectedOtherCategoryText = selectionControl.options[selectionControl.selectedIndex].text
    let txtOtherServiceCategoryName = document.getElementById("otherServiceCategoryName")
    if(selectedOtherCategoryText.trim().toLowerCase() === "other..."){
        txtOtherServiceCategoryName.disabled = false 
    } else {
        txtOtherServiceCategoryName.value = ""
        txtOtherServiceCategoryName.disabled = true
    }
}

let updateServiceForm = document.getElementById("updateServiceForm")
updateServiceForm.addEventListener("submit", (event) => {
    if(!validateInformation()) {
        event.preventDefault()
    }
})

let addServiceForm = document.getElementById("addServiceForm")
addServiceForm.addEventListener("submit", (event) => {
    if(!validateInformation()) {
        event.preventDefault()
    }
})

function validateInformation(){
    const txtServiceName = document.getElementById("serviceName")
    const txtServiceDescription = document.getElementById("serviceDescription")
    const selServiceCategory = document.getElementById("serviceCategory")
    const txtOtherServiceCategoryName = document.getElementById("otherServiceCategoryName")
    const txtKeywords = document.getElementById("keywords")
    const txtTypicalCharge = document.getElementById("typicalCharge")
    const txtAvgCompletionTime = document.getElementById("avgCompletionTime")
    const txtImageFile = document.getElementById("imageFile")
    const txtVideoFile = document.getElementById("videoFile")
    const txtEmail = document.getElementById("email")
    const txtPhoneNumber = document.getElementById("phoneNumber")

    const errServiceName  = document.getElementById("errServiceName")
    const errServiceDescription = document.getElementById("errServiceDescription")
    const errServiceCategory = document.getElementById("errServiceCategory")
    const errOtherServiceCategoryName = document.getElementById("errOtherServiceCategoryName")
    const errKeywords = document.getElementById("errKeywords")
    const errTypicalCharge = document.getElementById("errTypicalCharge")
    const errAvgCompletionTime = document.getElementById("errAvgCompletionTime")
    const errImageFile = document.getElementById("errImageFile")
    const errVideoFile = document.getElementById("errVideoFile")
    const errEmail = document.getElementById("errEmail")
    const errPhoneNumber = document.getElementById("errPhoneNumber")

    let serviceName = txtServiceName.value
    let serviceDescription = txtServiceDescription.value
    let serviceCategory = selServiceCategory.options[selServiceCategory.selectedIndex].text
    let otherServiceCategoryName = txtOtherServiceCategoryName.value
    let keywords = txtKeywords.value
    let typicalCharge = txtTypicalCharge.value
    let avgCompletionTime = txtAvgCompletionTime.value
    let imageFiles = txtImageFile.files
    let videoFiles = txtVideoFile.files
    let email = txtEmail.value
    let phoneNumber = txtPhoneNumber.value

    var isValidData = true

    const allowedImageType = ["image/jpeg","image/jpg", "image/png"]
    const allowedVideoType = ["video/mp4", "video/x-matroska", "video/mpeg"]
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

    if(!serviceName || serviceName.trim().length === 0){
        showError(txtServiceName, errServiceName, "Service name can not be empty.")
        isValidData = false
    } else if(!(/^[a-zA-Z\s-']*$/.test(serviceName))){
        showError(txtServiceName, errServiceName, "Service name can contain only alphabets.")
        isValidData = false
    } else {
        hideError(txtServiceName)
    }

    if(!serviceDescription || serviceDescription.trim().length === 0) {
        showError(txtServiceDescription, errServiceDescription, "Service description can not be empty")
        isValidData = false 
    } else {
        hideError(txtServiceDescription)
    }
    
    
    if(serviceCategory.toLowerCase() === "select your service category"){
        showError(selServiceCategory, errServiceCategory, "Please select service category.")
        isValidData = false
    } else {
        hideError(selServiceCategory)
    }

    if(serviceCategory.toLowerCase() === "other..."){
        if(otherServiceCategoryName.trim().length === 0){
            showError(txtOtherServiceCategoryName, errOtherServiceCategoryName, "Please provide name of other service category.")
            isValidData = false
        } else if(!(/^[a-zA-Z\s]*$/.test(otherServiceCategoryName))){
            showError(txtOtherServiceCategoryName, errOtherServiceCategoryName, "Service category can only contains alphabets.")
            isValidData = false
        } else {
            hideError(txtOtherServiceCategoryName)
        }
    } 

    if(!email || email.trim().length === 0) {
        showError(txtEmail, errEmail, "E-Mail can not be empty.")
        isValidData = false
    } else if (!emailRegex.test(email)){
        showError(txtEmail, errEmail, "Please provide valid email address.")
        isValidData = false
    } else {
        hideError(txtEmail)
    }

    if(!phoneNumber || phoneNumber.trim().length === 0) {
        showError(txtPhoneNumber, errPhoneNumber, "Phone number can not be empty.")
    } else if (!phoneRegex.test(phoneNumber)) {
        showError(txtPhoneNumber, errPhoneNumber, "Please provide valid phone number.")
        isValidData = false
    } else {
        hideError(txtPhoneNumber)
    }

    if(!keywords || keywords.trim().length === 0){
        showError(txtKeywords, errKeywords, "Keywords can not be empty.")
        isValidData = false
    } else if(!(/^[a-zA-Z\s,]*$/.test(keywords))){
        showError(txtKeywords, errKeywords, "Keywords can only conaints alphabets and commas.")
        isValidData = false
    } else {
        const keywordArr = keywords.split(/[,]+/)
        if(keywordArr.length === 0) {
            showError(txtKeywords, errKeywords, "Keywords should contain at least one keyword.")
            isValidData = false
        } else if(keywordArr.length > 1) {
            for (let i = 0; i < keywordArr.length; i++) {
                const element = keywordArr[i];
                if(element.trim().length === 0) {
                    showError(txtKeywords, errKeywords, "Keywords should not contain only spaces.")
                    isValidData = false
                    break
                }
            }
        } else {
            hideError(txtKeywords)
        }
    }

    if(!typicalCharge) {
        showError(txtTypicalCharge, errTypicalCharge, "Typical charge can not be empty.")
        isValidData = false
    } else if(!(/^[0-9]*$/.test(typicalCharge))){
        showError(txtTypicalCharge, errTypicalCharge, "Typical charge can only contains positive whole numbers.")
        isValidData = false
    } else {
        typicalCharge = parseInt(typicalCharge)
        if(typicalCharge <= 15 || typicalCharge >= 151){
            showError(txtTypicalCharge, errTypicalCharge, "Typical charge should be inclusively in range of $15 to $150")
            isValidData = false
        } else {
            txtTypicalCharge.classList.remove("is-invalid")
        }
        
    }

    if(!avgCompletionTime) {
        showError(txtAvgCompletionTime, errAvgCompletionTime, "Average completion time can not be empty.")
        isValidData = false
    } else if(!(/^[0-9]*$/.test(avgCompletionTime))) {
        showError(txtAvgCompletionTime, errAvgCompletionTime, "Average completion time can only contains positive whole numbers.")
        isValidData = false
    } else {
        avgCompletionTime = parseInt(avgCompletionTime)
        if(avgCompletionTime <= 0){
            showError(txtAvgCompletionTime, errAvgCompletionTime, "average completion time can be higher than 0")
            isValidData = false
        } else {
            txtAvgCompletionTime.classList.remove("is-invalid")
        }
        
    }

    if(imageFiles.length === 1) {
        let imageFile = imageFiles[0]
        if(imageFile.size > 3145728) {
            showError(txtImageFile, errImageFile, "Image file size should not exceed 3MB.")
            isValidData = false
        } else if(!allowedImageType.includes(imageFile["type"])) {
            showError(txtImageFile, errImageFile, "Image file size should be in jpeg, jpg or png format.")
            isValidData = false
        } else {
            txtImageFile.classList.remove("is-invalid")
        }
    }

    if(videoFiles.length === 1) {
        let videoFile = videoFiles[0]
        if(videoFile.size > 52428800) {
            showError(txtVideoFile, errVideoFile, "Video file size should not exceed 50MB.")
            isValidData = false
        } else if (!allowedVideoType.includes(videoFile["type"])) {
            showError(txtVideoFile, errVideoFile, "Video file size should be in mp4, mkv or mpeg format.")
            isValidData = false
        } else {
            txtVideoFile.classList.remove("is-invalid")
        }
    }
    return isValidData
}

function showErrorsAndFillData(errors, data){
    
    const txtServiceName = document.getElementById("serviceName")
    const txtServiceDescription = document.getElementById("serviceDescription")
    const selServiceCategory = document.getElementById("serviceCategory")
    const txtOtherServiceCategoryName = document.getElementById("otherServiceCategoryName")
    const txtKeywords = document.getElementById("keywords")
    const txtTypicalCharge = document.getElementById("typicalCharge")
    const txtAvgCompletionTime = document.getElementById("avgCompletionTime")
    const txtImageFile = document.getElementById("imageFile")
    const txtVideoFile = document.getElementById("videoFile")
    const txtPhoneNumber = document.getElementById("phoneNumber")
    const txtEmail = document.getElementById("email")
    const divOtherErrorArea = document.getElementById("otherErrorArea")
    const imageViewer = document.getElementById("imageViewer")
    const imageView = document.getElementById("imageView")
    const videoViewer = document.getElementById("videoViewer")
    const videoView = document.getElementById("videoView")

    const errServiceName  = document.getElementById("errServiceName")
    const errServiceDescription = document.getElementById("errServiceDescription")
    const errServiceCategory = document.getElementById("errServiceCategory")
    const errOtherServiceCategoryName = document.getElementById("errOtherServiceCategoryName")
    const errKeywords = document.getElementById("errKeywords")
    const errTypicalCharge = document.getElementById("errTypicalCharge")
    const errAvgCompletionTime = document.getElementById("errAvgCompletionTime")
    const errImageFile = document.getElementById("errImageFile")
    const errVideoFile = document.getElementById("errVideoFile")
    const errPhoneNumber = document.getElementById("errPhoneNumber")
    const errEmail = document.getElementById("errEmail")

    showServerReponseError(txtServiceName, errServiceName, errors.serviceName)
    showServerReponseError(txtServiceDescription, errServiceDescription, errors.serviceDescription)
    showServerReponseError(txtKeywords, errKeywords, errors.keywords)
    showServerReponseError(txtTypicalCharge, errTypicalCharge, errors.typicalCharge)
    showServerReponseError(txtAvgCompletionTime, errAvgCompletionTime, errors.avgCompletionTime)
    showServerReponseError(txtOtherServiceCategoryName, errOtherServiceCategoryName, errors.otherServiceCategoryName)
    showServerReponseError(selServiceCategory, errServiceCategory, errors.serviceCategory)
    showServerReponseError(txtImageFile, errImageFile, errors.imageFile)
    showServerReponseError(txtVideoFile, errVideoFile, errors.videoFile)
    showServerReponseError(txtPhoneNumber, errPhoneNumber, errors.phoneNumber)
    showServerReponseError(txtEmail, errEmail, errors.email)

    if(errors.otherErrors !== undefined) {
        divOtherErrorArea.classList.remove("d-none")
        divOtherErrorArea.innerText = errors.otherErrors
    }

    if(data !== undefined) {
        txtServiceName.value = data.serviceName
        txtServiceDescription.value = data.description
        txtKeywords.value = data.keywords
        txtTypicalCharge.value = data.typicalCharge
        txtAvgCompletionTime.value = getIntegerHours(data.avgCompletionTime)
        if(data.otherCategory) {
            txtOtherServiceCategoryName.disabled = false
            txtOtherServiceCategoryName.value = data.otherCategory
        }
        selServiceCategory.value = data.category
        txtPhoneNumber.value = data.phoneNumber
        txtEmail.value = data.email
        if(data.image) {
            imageView.src = `/uploads/${data.image}`
            imageViewer.classList.remove("d-none")
        } else {
            imageViewer.classList.add("d-none")
        }
        if(data.video) {
            videoView.src = `/uploads/${data.video}`
            videoViewer.classList.remove("d-none")
        } else {
            videoViewer.classList.add("d-none")
        }
        
         // txtImageFile.value = data.imageFile
        // txtVideoFile.value = data.videoFile
    }
}

function showServerReponseError(textField, errorField, errorMessage) {
    if(errorMessage !== undefined) {
        showError(textField, errorField, errorMessage)
    } else {
        hideError(textField)
    }
}

function showError(textField, errorField, errorMessage) {
    textField.classList.add("is-invalid")
    errorField.innerText = errorMessage
}

function hideError(textField) {
    textField.classList.remove("is-invalid")
}

function getIntegerHours(hoursInString) {
    let result = 0
    let hourString = hoursInString.split(" ")[0]
    result = parseInt(hourString)
    return result
}