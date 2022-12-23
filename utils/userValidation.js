function checkEmail(email) {
    if(!email) {
      throw "Email is required";
    }
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    email = email.trim();
    if(!validRegex.test(email)) {
      throw "Email is invalid";
    }
    email = email.toLowerCase();
    return email;
  }
  
  function checkPassword(password) {
    if(!password) {
      throw "Password is required";
    }
    if (password.length < 6) {
      throw "Password must be at least 6 characters long";
    }
    if (
      /(?=.*[A-Z])(?=.*[.+!@#$%^&*()_\-={}[\]|;:'",<.>/?])(?=.*[0-9])/.test(
        password
      ) === false
    ) {
      throw "Password must contain at least one uppercase letter, one number, and one special character";
    }
    return password;
  }

  const checkUsername = (username) => {
    if (!username)
        throw "Must supply a username.";
    if (typeof(username) !== 'string' || username.trim().length === 0)
        throw "username must be a string.";
    username = username.trim();
    if (!/^[a-zA-Z1-9_]{4,}$/.test(username))
        throw "username may only contain at least 4 alphanumeric characters or underscores(_).";
    return username.toLowerCase();
};
const verifyUserProfileData = (
	firstName,
	lastName,
	phoneNumber,
	username,
	birthDate,
	facebook,
	instagram,
	website,
	errors
) => {
	let isValidData = true
	if(!firstName) {
		errors.firstName = "You must supply first name."
		isValidData = false
	}

	if(!lastName) {
		errors.lastName = "You must supply last name."
		isValidData = false
	}

	if(!phoneNumber) {
		errors.phoneNumber = "You must supply phone number."
		isValidData = false
	}

	if(!username) {
		errors.username = "You must supply username."
		isValidData = false
	}

	if(!birthDate) {
		errors.birthDate = "You must supply birthdate."
		isValidData = false
	}
	
	if(!isValidData) {
		throw errors
	}

	firstName = firstName.trim()
	lastName = lastName.trim()
	phoneNumber = phoneNumber.trim()
	username = username.trim()
	birthDate = birthDate.trim()

	if(firstName.length === 0) {
		errors.firstName = "First name can not be blank."
		isValidData = false
	}

	if(lastName.length === 0) {
		errors.lastName = "Last name can not be blank."
		isValidData = false
	}

	if(phoneNumber.length === 0) {
		errors.phoneNumber = "Phone number can not be blank."
		isValidData = false
	}

	if(username.length === 0) {
		errors.username = "Username can not be blank."
		isValidData = false
	}

	if(birthDate.length === 0) {
		errors.birthDate = "Birthdate can not be blank."
		isValidData = false
	}

	if(!isValidData) {
		throw errors
	}

	const nameRegex = /^(?=.{2,10}$)[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/
    const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    const usernameRegex = /^[a-zA-Z0-9_.]{4,}$/
    const fbRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/
    const instaRegex = /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
    const websiteRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

	if(!nameRegex.test(firstName)) {
		errors.firstName = "Please provide valid first name."
		isValidData = false
	}

	if(!nameRegex.test(lastName)) {
		errors.lastName = "Please provide valid last name."
		isValidData = false
	}

	if(!phoneRegex.test(phoneNumber)) {
		errors.phoneNumber = "Please provide valid phone number."
		isValidData = false
	}

	if(!usernameRegex.test(username)) {
		errors.username = "Please provide valid username."
		isValidData = false
	}

	try {
		checkValidDate(birthDate)
	} catch (exception) {
		errors.birthDate = "Please provide valid date."
		isValidData = false
	}

	if(facebook.length > 0) {
		if(!fbRegex.test(facebook)){
			errors.facebook = "Please provide valid facebook profile url."
			isValidData = false
		}
	}

	if(instaRegex.length > 0) {
		if(!instaRegex.test(instagram)){
			errors.instagram = "Please provide valid instagram profile url."
			isValidData = false
		}
	}

	if(website.length > 0) {
		if(!websiteRegex.test(website)) {
			errors.website = "Please provide valid website address."
			isValidData = false
		}
	}
	if(!isValidData) {
		throw errors
	}
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

const checkPasswords = (currentPassword, newPassword, confirmPassword, errors) => {
	let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
	currentPassword = currentPassword.trim()
	newPassword = newPassword.trim()
	confirmPassword = confirmPassword.trim()

	let isValidData = true
	if(!currentPassword) {
		errors.currentPassword = "You must supply current password."
		isValidData = false
	}

	if(!newPassword) {
		errors.newPassword = "You must supply new password."
		isValidData = false
	}

	if(!confirmPassword) {
		errors.confirmPassword = "You must supply confirm password."
		isValidData = false
	}

	if(!isValidData) {
		throw errors
	}

	if(currentPassword.length === 0) {
		errors.currentPassword = "Current password can not be blank."
		isValidData = false
	}

	if(newPassword.length === 0) {
		errors.newPassword = "New password can not be blank."
		isValidData = false
	}

	if(confirmPassword.length === 0) {
		errors.confirmPassword = "Confirm password can not be blank."
		isValidData = false
	}

	if(!isValidData) {
		throw errors
	}

	if(!passwordPattern.test(currentPassword)) {
		errors.currentPassword = "Your password do not match with the password criteria."
		isValidData = false
	}

	if(!passwordPattern.test(newPassword)) {
		errors.newPassword = "Your password do not match with the password criteria."
		isValidData = false
	}

	if(!passwordPattern.test(confirmPassword)) {
		errors.confirmPassword = "Your password do not match with the password criteria."
		isValidData = false
	}

	if(!isValidData) {
		throw errors
	}

	if(newPassword === currentPassword) {
		errors.newPassword = "Your new password is the same as current password."
		isValidData = false
	}

	if(newPassword !== confirmPassword) {
		errors.confirmPassword = "Your confirm password do not match with the new password."
		isValidData = false
	}

	if(!isValidData) {
		throw errors
	}

}


module.exports = {
	checkEmail,
	checkPassword,
	checkUsername,
	verifyUserProfileData,
	checkPasswords
};
