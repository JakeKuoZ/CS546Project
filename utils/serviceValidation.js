const { ObjectId } = require("mongodb")

const verifyAddServiceData = (
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
) => {
  let isValidData = true;

  if (Object.keys(errors).length > 0) {
    isValidData = false;
  }
  if (!serviceName) {
    errors.serviceName = "You must supply service name.";
    isValidData = false;
  }
  if (!serviceDescription) {
    errors.serviceDescription = "You must supply service description";
    isValidData = false;
  }

  if (!serviceCategory) {
    errors.serviceCategory = "You must supply service category";
    isValidData = false;
  }

  if (!keywords) {
    errors.keywords = "You must supply keywords.";
    isValidData = false;
  }

  if (!typicalCharge) {
    errors.typicalCharge = "You must supply typical charge.";
    isValidData = false;
  }

  if (!avgCompletionTime) {
    errors.avgCompletionTime = "You must supply average completion time.";
    isValidData = false;
  }

  if (!phoneNumber) {
    errors.phoneNumber = "You must supply phone number.";
    isValidData = false;
  }

  if (!email) {
    errors.email = "You must supply E-Mail address.";
    isValidData = false;
  }
  if (!isValidData) {
    throw errors;
  }

  if (serviceName.trim().length === 0) {
    errors.serviceName = "Service name can not be blank.";
    isValidData = false;
  }

  if (serviceDescription.trim().length === 0) {
    errors.serviceDescription = "Service description can not be blank.";
    isValidData = false;
  }

  if (serviceCategory.trim().length === 0) {
    errors.serviceCategory = "Service category can not be blank.";
    isValidData = false;
  }

  if (serviceCategory.trim().toLowerCase() === "other...") {
    if (!otherServiceCategoryName) {
      errors.otherServiceCategoryName =
        "You must supply name of other category.";
      isValidData = false;
    } else if (otherServiceCategoryName.trim().length === 0) {
      errors.otherServiceCategoryName = "Other service name can not be blank.";
      isValidData = false;
    }
  }

  if (keywords.trim().length === 0) {
    errors.keywords = "keywords can not be blank.";
    isValidData = false;
  }

  if (typicalCharge.trim().length === 0) {
    errors.typicalCharge = "Typical charge can not be blank.";
    isValidData = false;
  }

  if (avgCompletionTime.trim().length == 0) {
    errors.avgCompletionTime = "Average completion time can not be blank.";
    isValidData = false;
  }

  if (phoneNumber.trim().length == 0) {
    errors.phoneNumber = "Phone number can not be empty.";
    isValidData = false;
  }

  if (email.trim().length === 0) {
    errors.email = "E-Mail address can not be empty.";
    isValidData = false;
  }

  if (!isValidData) {
    throw errors;
  }

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  if (!/^[a-zA-Z'-\s]*$/.test(serviceName)) {
    errors.serviceName = "Service name can only contains alphabets.";
    isValidData = false;
  }

  if (serviceCategory.trim().toLowerCase() === "select your service category") {
    errors.serviceCategory = "You must select service category.";
    isValidData = false;
  }
  if (
    serviceCategory.trim().toLowerCase() === "other..." &&
    !/^[a-zA-Z\s]*$/.test(otherServiceCategoryName)
  ) {
    errors.otherServiceCategoryName =
      "Other service name can contains only alphabets.";
    isValidData = false;
  }

  if (!/^[a-zA-Z\s,]*$/.test(keywords)) {
    errors.keywords = "Keywords can only contains alphabets and commas";
    isValidData = false;
  } else {
    const keywordArr = keywords.split(/[,]+/);
    if (keywordArr.length === 0) {
      errors.keywords = "Keywords should contain at least one keyword.";
      isValidData = false;
    }
    for (let i = 0; i < keywordArr.length; i++) {
      const element = keywordArr[i];
      if (element.trim().length === 0) {
        errors.keywords = "Keywords can not be just empty spaces.";
        isValidData = false;
        break;
      }
    }
  }

  if (!/^[0-9]*$/.test(typicalCharge)) {
    errors.typicalCharge = "Typical charge can only contains whole number.";
    isValidData = false;
  } else {
    typicalCharge = parseInt(typicalCharge);
    if (typicalCharge <= 15 || typicalCharge >= 151) {
      errors.typicalCharge =
        "Typical charge should be inclusively in range of $15 to $150";
      isValidData = false;
    }
  }

  if (!/^[0-9]*$/.test(avgCompletionTime)) {
    errors.avgCompletionTime =
      "Average completion time can only contains whold number.";
    isValidData = false;
  } else {
    avgCompletionTime = parseInt(avgCompletionTime);
    if (avgCompletionTime <= 0) {
      errors.avgCompletionTime =
        "Average completion time can be greater than 0";
      isValidData = false;
    }
  }

  if (!phoneRegex.test(phoneNumber)) {
    errors.phoneNumber = "Please provide valid phone number.";
    isValidData = false;
  }

  if (!emailRegex.test(email)) {
    errors.email = "Please provide valid E-Main address.";
    isValidData = false;
  }

  if (!isValidData) {
    throw errors;
  }
};

function checkUsername(username) {
  if (!username) {
    throw "Username is required";
  }
  if (username.length < 4) {
    throw "Username must be at least 4 characters long";
  }
  if (/^[a-zA-Z0-9]+$/.test(username) === false) {
    throw "Username must contain only alphanumeric characters";
  }
  username = username.toLowerCase();
  return username;
}

function checkPassword(password) {
  if (!password) {
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

const isValidId = (id, errors) => {
    if (!id) {
		errors.otherErrors = 'Trying to update invalid service.'
      	throw errors
	}
    if (typeof id !== 'string') {
		errors.otherErrors = 'Trying to update invalid service.'
    	throw errors
	}
    if (id.trim().length === 0){
		errors.otherErrors = 'Trying to update invalid service.'
    	throw errors
	}
    id = id.trim();
    if (!ObjectId.isValid(id)) {
		errors.otherErrors = 'Trying to update invalid service.'
    	throw errors
	} 
}

module.exports = {
  verifyAddServiceData,
  checkUsername,
  checkPassword,
    isValidId
};
