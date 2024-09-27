class RegistrationData {
    constructor(fullName, dob, gender, nationality, civilStatus, phoneNumber, email, permanentAddress, currentAddress, guardianInfo, motherInfo, fatherInfo, academicInfo, username, password) {
        this.fullName = fullName;
        this.dob = dob;
        this.gender = gender;
        this.nationality = nationality;
        this.civilStatus = civilStatus;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.permanentAddress = permanentAddress;
        this.currentAddress = currentAddress;
        this.guardianInfo = guardianInfo;
        this.motherInfo = motherInfo;
        this.fatherInfo = fatherInfo;
        this.academicInfo = academicInfo;
        this.username = username;
        this.password = password;
    }

    JSONify() {
        const toreturn = {
            "Full Name":  this.fullName,
            "Date of Birth": this.dob,
            "Gender": this.gender,
            "Nationality": this.nationality,
            "Civil Status": this.civilStatus,
            "Phone Number": this.phoneNumber,
            "Email": this.email,
            "Permanent Address": this.permanentAddress,
            "Current Address": this.currentAddress,
            "Academic Info": {
                "High School Name": this.academicInfo.name,
                "High School Address": this.academicInfo.address,
                "High School Graduation Date": this.academicInfo.gd,
                "High School GPA": this.academicInfo.gpa,
                "First Choice": this.academicInfo.firstChoice,
                "Second Choice": this.academicInfo.secondChoice,
                "Third Choice": this.academicInfo.thirdChoice,
                "College Info/Name": this.academicInfo.collegeInfo,
            },
            "Guardian Info": {
                "Full Name": this.guardianInfo.name,
                "Contact": this.guardianInfo.contact,
                "Address": this.guardianInfo.address,
                "Occupation": this.guardianInfo.occupation
            },
            "Mother Info": {
                "Full Name (Maiden)": this.motherInfo.maidenName,
                "Contact": this.motherInfo.contact,
                "Address": this.motherInfo.address,
                "Occupation": this.motherInfo.occupation
            },
            "Father Info": {
                "Full Name": this.fatherInfo.name,
                "Contact": this.fatherInfo.contact,
                "Address": this.fatherInfo.address,
                "Occupation": this.fatherInfo.occupation
            }
        }
        return toreturn
    }
}

export {
    RegistrationData
};
