function allVerified(checkObject) {
    if(checkFirstNameLastName(checkObject.firstName), checkFirstNameLastName(checkObject.lastName), 
        checkDate(checkObject.date), checkPhone(checkObject.phone), checkEmail(checkObject.email)) {
        return true;
    }
    return false;
}

function checkFirstNameLastName(firstName) {
    if(firstName && firstName.trim().length) {
        const regexp = /^[A-ZА-Я]{1}[a-zа-я]{1,59}$/;
        if(regexp.test(firstName)){
            return true;
        }
    }
    return false;
}

function checkDate(inputDate) {
    if(inputDate) {
        const date = new Date(inputDate);
        if(date.getTime() > Date.now() || date.getFullYear() < 1930){
            return false;
        }
        return true;
    }
    return false;
}

function checkPhone(phone) {
    if(phone) {
        const regexp = /^0[0-9]{9}$/;
        if(regexp.test(phone)){
            return true;
        }
    }
    return false;
}

function checkEmail(email) {
    if(email) {
        const regexp = /^[A-Za-z]+[A-Za-z._0-9]{3,20}@[A-Za-z]{2,10}\.[A-Za-z]{2,10}$/;
        if(regexp.test(email)){
            return true; 
        }
    }
    return false;
}

export {allVerified, checkFirstNameLastName, checkDate, checkPhone, checkEmail}