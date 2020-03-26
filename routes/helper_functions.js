function convertHouseType(type){
    if (type == 'Landed' || type == 'landed'){
        return 'L';
    }
    else if (type == 'Condominium' || type == 'condominium'){
        return 'C';
    }
    else if (type == 'HDB' || type == 'hdb'){
        return 'H';
    }
    else {
        return null
    }
}

function convertGender(gender){
    if (gender == "Male" || gender =="male"){
        return "M";
    }
    else if (gender == "Female" || gender == "female"){
        return "F";
    }
    else{
        return null;
    }
}

function convertMarital(status){
    if (status == "single" || status =="Single"){
        return "S";
    }
    else if (status == "married" || status == "Married"){
        return "M";
    }
    else{
        return null;
    }
}

function convertOccupation(occupation){
    if (occupation == "Unemployed" || occupation =="unemployed"){
        return "U";
    }
    else if (occupation == "Student" || occupation == "student"){
        return "S";
    }
    else if (occupation == "Employed" || occupation == "employed"){
        return "E";
    }
    else{
        return null;
    }
}
helper = {};
helper.convertGender = convertGender;
helper.convertHouseType = convertHouseType;
helper.convertMarital = convertMarital;
helper.convertOccupation = convertOccupation;
module.exports=helper;