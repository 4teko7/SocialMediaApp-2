var errors = {};

const utils = {
    emailValidationRegex: /^([a-zA-Z0-9_\-\.]{3,50})@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    try : "deneme"
}

const isEmpty = string =>{
    if(string.trim() === "") return true;
    else return false;
}

const isEmailValid = email =>{
    if(email.match(utils.emailValidationRegex)) return true;
    else return false;
}


const validataSignupData = data =>{
    errors = {};

    if(isEmpty(data.email))
        errors.email = "Must not be empty";
    else if(!isEmailValid(data.email))
        errors.email = "Must be a valid email address !";
    
    if(isEmpty(data.password)) errors.password = "Must not be empty";
    else if(data.password.length < 2) errors.password = "Size must be larger than 2";
    else if(data.password !== data.confirmPassword) errors.password = "Password and Confirm password do not match !";

    if(isEmpty(data.handle)) errors.handle = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}


const validateLoginData = data =>{
    errors = {};

    if(isEmpty(data.email)) errors.email = "Must not be empty";
    if(isEmpty(data.password)) errors.password = "Must not be empty";


    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}


const reduceUserDetails = (reqBody) =>{
    let userDetails = {};
    // if(!isEmpty(reqBody.bio)) 
    userDetails.bio = reqBody.bio;
    // if(!isEmpty(reqBody.website)) 
    userDetails.website = reqBody.website.startsWith("http") ? reqBody.website.trim() : `http://${reqBody.website.trim()}`;
    // if(!isEmpty(reqBody.location)) 
    userDetails.location = reqBody.location;


    return userDetails;
}

module.exports = {isEmpty,isEmailValid,validataSignupData,validateLoginData,reduceUserDetails}