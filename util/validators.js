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






module.exports = {isEmpty,isEmailValid,utils}