let btnCurrentPasswordToggle = document.getElementById("currentPasswordToggle")
let btnNewPasswordToggle = document.getElementById("newPasswordToggle")
let btnConfirmPasswordToggle = document.getElementById("confirmPasswordToggle")
let currentPasswordToggleIcon = document.getElementById("currentPasswordToggleIcon")
let newPasswordToggleIcon = document.getElementById("newPasswordToggleIcon")
let confirmPasswordToggleIcon = document.getElementById("confirmPasswordToggleIcon")
let btnUpdatePassword = document.getElementById("updatePassword")
let btnBirthDatePicker = document.getElementById("birthDatePicker")
let btnChangePassword = document.getElementById("changePassword")

let txtFirstName = document.getElementById("firstName")
let txtLastName = document.getElementById("lastName")
let txtBio = document.getElementById("bio")
let txtPhoneNumber = document.getElementById("phoneNumber")
let txtEmail = document.getElementById("email")
let txtUsername = document.getElementById("username")
let txtCurrentPassword = document.getElementById("currentPassword")
let txtNewPassword = document.getElementById("newPassword")
let txtConfirmPassword = document.getElementById("confirmPassword")
let txtBirthDate = document.getElementById("birthDate")
let txtFacebook = document.getElementById("facebook")
let txtInstagram = document.getElementById("instagram")
let txtWebsite = document.getElementById("website")

let errFirstName = document.getElementById("errFirstName")
let errLastName = document.getElementById("errLastName")
let errPhoneNumber = document.getElementById("errPhoneNumber")
let errEmail = document.getElementById("errEmail")
let errUsername = document.getElementById("errUsername")
let errCurrentPassword = document.getElementById("errCurrentPassword")
let errNewPassword = document.getElementById("errNewPassword")
let errConfirmPassword = document.getElementById("errConfirmPassword")
let errBirthDate = document.getElementById("errBirthDate")
let errFacebook = document.getElementById("errFacebook")
let errInstagram = document.getElementById("errInstagram")
let errWebsite = document.getElementById("errWebsite")

let divOtherErrorArea = document.getElementById("otherErrorArea")
let divSuccessNotificationArea = document.getElementById("successNotificationArea")

let profileInformationForm = document.getElementById("profileInformationForm")

btnCurrentPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtCurrentPassword, currentPasswordToggleIcon)
})

btnNewPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtNewPassword, newPasswordToggleIcon)
})

btnConfirmPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtConfirmPassword, confirmPasswordToggleIcon)
})

txtNewPassword.addEventListener("input", (event) => {
    event.preventDefault()
    checkPasswordEqual()
})

txtConfirmPassword.addEventListener("input", (event) => {
    event.preventDefault()
    checkPasswordEqual()
})

btnUpdatePassword.addEventListener("click", (event) => {
    event.preventDefault()
    updatePassword()
})

profileInformationForm.addEventListener("submit", (event) => {
    if(!validateData()) {
        event.preventDefault()
    }
})

btnChangePassword.addEventListener("click", (event) => {
    resetPasswordTextFields()
})

function togglePasswordVisibility(txtview, iconView) {
    if(txtview.type === "password") {
        txtview.type = "text"
        iconView.classList.remove("bi-eye-slash-fill")
        iconView.classList.add("bi-eye-fill")
    } else {
        txtview.type = "password"
        iconView.classList.remove("bi-eye-fill")
        iconView.classList.add("bi-eye-slash-fill")
    }
}

function checkPasswordEqual() {
    let password = txtNewPassword.value
    let confirmPassword = txtConfirmPassword.value
    if(confirmPassword.length === 0) return
    if(password === confirmPassword) {
        txtConfirmPassword.classList.add("is-valid")
        txtConfirmPassword.classList.remove("is-invalid")
        errConfirmPassword.classList.add("valid-feedback")
        errConfirmPassword.classList.remove("invalid-feedback")
        errConfirmPassword.innerText = "Password match."
    } else {
        txtConfirmPassword.classList.remove("is-valid")
        txtConfirmPassword.classList.add("is-invalid")
        errConfirmPassword.classList.add("invalid-feedback")
        errConfirmPassword.classList.remove("valid-feedback")
        errConfirmPassword.innerText = "Password do not match."
    }
}

function updatePassword() {
    let isPasswordValid = checkIsPasswordValid()
    if (!isPasswordValid) {
        return
    }
    let currentPassword = txtCurrentPassword.value
    let newPassword = txtNewPassword.value
    let confirmPassword = txtConfirmPassword.value
    let data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    }
    $.ajax({
        url: "/user/myprofile",
        type: "PATCH",
        contentType:'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (data) {
            $("#passwordChangeConfirmationDialog").modal("hide")
            divSuccessNotificationArea.classList.remove("d-none")
            divSuccessNotificationArea.innerText = "Your password successfully changed."
        },
        error : function (data) {
            let errors = JSON.parse(data.responseText)
            showErrorsOfPasswordModal(errors)

            if(errors.otherErrors) {
                $("#passwordChangeConfirmationDialog").modal("hide")
                divOtherErrorArea.classList.remove("d-none")
                divOtherErrorArea.innerText = errors.otherErrors
            }
        }
    })
}

function checkIsPasswordValid() {
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    let currentPassword = txtCurrentPassword.value
    let newPassword = txtNewPassword.value
    let confirmPassword = txtConfirmPassword.value

    let isPasswordValid = true

    if(!passwordPattern.test(currentPassword)) {
        isPasswordValid = false
        txtCurrentPassword.classList.remove("is-valid")
        txtCurrentPassword.classList.add("is-invalid")
        errCurrentPassword.innerText = "Your password do not match with the password criteria."
    } else {
        txtCurrentPassword.classList.remove("is-invalid")
    }

    if(!passwordPattern.test(newPassword)) {
        isPasswordValid = false
        txtNewPassword.classList.remove("is-valid")
        txtNewPassword.classList.add("is-invalid")
        errNewPassword.innerText = "Your password do not match with the password criteria."
    } else {
        txtNewPassword.classList.remove("is-invalid")
    }

    if(!passwordPattern.test(confirmPassword)) {
        isPasswordValid = false
        txtConfirmPassword.classList.remove("is-valid")
        txtConfirmPassword.classList.add("is-invalid")
        errConfirmPassword.classList.add("invalid-feedback")
        errConfirmPassword.classList.remove("valid-feedback")
        errConfirmPassword.innerText = "Your password do not match with the password criteria."
    } else {
        txtConfirmPassword.classList.remove("is-invalid")
    }

    if(newPassword === currentPassword) {
        isPasswordValid = false
        txtNewPassword.classList.remove("is-valid")
        txtNewPassword.classList.add("is-invalid")
        errNewPassword.classList.add("invalid-feedback")
        errNewPassword.classList.remove("valid-feedback")
        errNewPassword.innerText = "Your new password is the same as current password."
    }

    if (newPassword !== confirmPassword) {
        isPasswordValid = false
        txtConfirmPassword.classList.remove("is-valid")
        txtConfirmPassword.classList.add("is-invalid")
        errConfirmPassword.classList.add("invalid-feedback")
        errConfirmPassword.classList.remove("valid-feedback")
        errConfirmPassword.innerText = "Password do not match."
    }
    return isPasswordValid
}

function validateData() {
    let firstName = txtFirstName.value.trim()
    let lastName = txtLastName.value.trim()
    let phoneNumber = txtPhoneNumber.value.trim()
    let username = txtUsername.value.trim()
    let birthDate = txtBirthDate.value.trim()
    let facebook = txtFacebook.value.trim()
    let instagram = txtInstagram.value.trim()
    let website = txtWebsite.value.trim()

    let isValidData = true

    const nameRegex = /^(?=.{2,10}$)[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/
    const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    const usernameRegex = /^[a-zA-Z0-9_.]{4,}$/
    const fbRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/
    const instaRegex = /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
    const websiteRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

    if(!firstName || firstName.length === 0) {
        showError(txtFirstName, errFirstName, "First name should not be empty.")
        isValidData = false
    } else if(!nameRegex.test(firstName)) {
        showError(txtFirstName, errFirstName, "First Name should contain alphabets, ' and - sign.")
        isValidData = false
    } else {
        hideError(txtFirstName)
    }

    if(!lastName || lastName.length === 0){ 
        showError(txtLastName, errLastName, "Last name should not be empty.")
        isValidData = false
    } else if(!nameRegex.test(lastName)) {
        showError(txtLastName, errLastName, "First Name should contain alphabets, ' and - sign.")
        isValidData = false
    } else {
        hideError(txtLastName)
    }

    if(!phoneNumber || phoneNumber.length === 0) {
        showError(txtPhoneNumber, errPhoneNumber, "Phone number should not be empty.")
        isValidData = false
    } else if(!phoneRegex.test(phoneNumber)) {
        showError(txtPhoneNumber, errPhoneNumber, "Please provide valid phone number.")
        isValidData = false
    } else {
        hideError(txtPhoneNumber)
    }

    if(!username || username.length === 0) {
        showError(txtUsername, errUsername, "Username should not be empty.")
        isValidData = false
    } else if (!usernameRegex.test(username)){
        showError(txtUsername, errUsername, "Please provide valid username.")
        isValidData = false
    } else {
        hideError(txtUsername)
    }

    try {
        checkValidDate(birthDate)
        hideError(txtBirthDate)
    } catch(exception) {
        showError(txtBirthDate, errBirthDate, exception)
        isValidData = false
    }

    if(facebook.length > 0 && !(fbRegex.test(facebook))) {
        showError(txtFacebook, errFacebook, "Please provice valid facebook profile URL.")
        isValidData = false
    } else {
        hideError(txtFacebook)
    }

    if(instagram.length > 0 && !(instaRegex.test(instagram))) {
        showError(txtInstagram, errInstagram, "Please provice valid instagram profile URL.")
        isValidData = false
    } else {
        hideError(txtInstagram)
    }

    if(website.length > 0 && !(websiteRegex.test(website))) {
        showError(txtWebsite, errWebsite, "Please provice valid website profile URL.")
        isValidData = false
    } else {
        hideError(txtWebsite)
    }
    return isValidData
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

function checkValidDate(dateString) {
    let dateArray = dateString.split("-")
    let yearString =  dateArray[0]
    let monthString = dateArray[1]
    let dayString = dateArray[2]

    if(!(/^[0-9]{4}$/.test(yearString))) {
        throw "Please provide valid date."
    }

    if(!(/^[0-9]{2}$/.test(monthString))) {
        throw "Please provide valid date."
    }

    if(!(/^[0-9]{2}$/.test(dayString))) {
        throw "Please provice valid date."
    }
    
    let year = parseInt(yearString)
    let month = parseInt(monthString)
    let day = parseInt(dayString)
    if(month < 1 || month > 12) {
        throw "Please provide valid date."
    }

    let daysInMonth = new Date(year, month,0).getDate()
    if(day < 1 || day > daysInMonth){
        throw "Please provide valid date."
    }

    let date = new Date(`${year}-${month}-${day}`)
    let todaysDate = new Date()

    if(date.getTime() >= todaysDate.getTime()) {
        throw "Please provide valid date."
    }
}


function fillData(user) {
    txtFirstName.value = user.firstName
    txtLastName.value = user.lastName
    txtBio.value = user.bio
    txtPhoneNumber.value = user.phoneNumber
    txtEmail.value = user.email
    txtUsername.value = user.username
    txtBirthDate.value = user.birthdate
    console.log(user.birthDate)
    if(user.socialMedias) {
        if(user.socialMedias.facebook) {
            txtFacebook.value = user.socialMedias.facebook
        }
        if(user.socialMedias.instagram){
            txtInstagram.value = user.socialMedias.instagram
        }
        if(user.socialMedias.website) {
            txtWebsite.value = user.socialMedias.website
        }
    }
    if(user.facebook) {
        txtFacebook.value = user.facebook
    }    
    if(user.instagram) {
        txtInstagram.value = user.instagram
    }
    if(user.website) {
        txtWebsite.value = user.website
    }
}

function showErrors(errors) {
    showServerReponseError(txtFirstName, errFirstName, errors.firstName)
    showServerReponseError(txtLastName, errLastName, errors.lastName)
    showServerReponseError(txtPhoneNumber, errPhoneNumber, errors.phoneNumber)
    showServerReponseError(txtUsername, errUsername, errors.username)
    showServerReponseError(txtBirthDate, errBirthDate, errors.birthDate)
    showServerReponseError(txtFacebook, errFacebook, errors.facebook)
    showServerReponseError(txtInstagram, errInstagram, errors.instagram)
    showServerReponseError(txtWebsite, errWebsite, errors.website)

    if(errors.otherErrors !== undefined) {
        divOtherErrorArea.classList.remove("d-none")
        divOtherErrorArea.innerText = errors.otherErrors
    } else {
        divOtherErrorArea.classList.add("d-none")
    }
}

function showErrorsOfPasswordModal(errors) {
    showServerReponseError(txtCurrentPassword, errCurrentPassword, errors.currentPassword)
    showServerReponseError(txtNewPassword, errNewPassword, errors.newPassword)
    showServerReponseError(txtConfirmPassword, errConfirmPassword, errors.confirmPassword)
}

function showSuccessUpdate() {
    divSuccessNotificationArea.classList.remove("d-none")
    divSuccessNotificationArea.innerText = "Your profile information has been updated successfully."
}

function hideSuccessUpdate() {
    divSuccessNotificationArea.classList.add("d-none")
}

function resetPasswordTextFields() {
    txtCurrentPassword.value = null
    txtNewPassword.value = null
    txtConfirmPassword.value = null

    hideError(txtCurrentPassword)
    hideError(txtNewPassword)
    hideError(txtConfirmPassword)
    txtConfirmPassword.classList.remove("is-valid")
}