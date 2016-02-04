// ==UserScript==
// @name         Application Auto Filler
// @namespace    */Applicants/CreateApplicant/*
// @version      0.5
// @description  Automatically fills out an application for you with the option to fill out the Co-Applicant. 
//               Dynamically clears out hidden Bank & Card form items and fills them back in upon becoming visible. 
//               When Has Co-Applicant checkbox is deselected after initial page load, the Co-Applicant form items are cleared out.
//               
//               **ONLY USABLE IN THE NEW APPLICATION PAGE. NOT USABLE ON THE AGENT/RETAILER PORTAL APPLICATION.
//               
// @author       Carlos Cruz, David Cruz
// @match        http://*/Applicants/CreateApplicant/*
// @grant        none
// ==/UserScript==

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeFirstLetterOfEachWord(string) {

    var array = string.split(/(\s+)/),
        length = array.length,
        i = 0,
        word;

    while (i < length) {
        //array[i] = array[i].toLowerCase(); // make words lowercased first if you want
        word = array[i];
        if (word.length > 2) {
            array[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }

        i += 1;
    }

    return array.join("");
}

function findPlace(x) {
    // Finds the 'place' of the number X
    // e.g. x = 43,210 findPlace(x) = 10,000
    n = 1;
    while (x >= 10) {
        x /= 10;
        n *= 10;
    }
    return n;
}

function findMaxFromPlace(x) {
    // Finds the max number of length X
    n = 1;
    y = 0;
    for (i = 1; i <= x; i++) {
        y += 9 * n;
        n *= 10;
    }

    return y;
}

function randomNumWithXDigits(n) {
    // With n = 5 places
    // y = 99999
    // x = 10000
    // result example: 12345

    var y = findMaxFromPlace(n);
    var x = findPlace(y);
    return Math.floor(Math.random() * (y - x) + x);
}

function randomNumBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomPhone() {
    return ("(" + randomNumWithXDigits(3) + ") " + randomNumWithXDigits(3) + "-" + randomNumWithXDigits(4));
}

function randomSocial() {
    return (randomNumWithXDigits(3) + "-" + randomNumWithXDigits(2) + "-" + randomNumWithXDigits(4));
}

function hasCoApplicant() {
    return confirm("Should this Applicant have a Co-Applicant?\nMake sure to Refresh if you used the Back Button.");
}

function appendLessThan10(x) {
    // Appends a 0 in from of any number less than 10
    if (x < 10) {
        x = "0" + x;
    }

    return x;
}

/* ----------------------------------------------- */
var hasCoApp = hasCoApplicant();

$.ajax({
    url: 'http://api.randomuser.me/',
    dataType: 'json',
    success: function (data) {
        var user = data.results[0].user;
        var firstName = capitalizeFirstLetter(user.name.first);
        var lastName = capitalizeFirstLetter(user.name.last);
        var generatedEmail = user.email.replace(/ /g, "_");
        var email = generatedEmail.replace("@example", (randomNumWithXDigits(3) + "@gmail"));
        var address = user.location.street;
        var streetLine1 = capitalizeFirstLetterOfEachWord(address);

        $("#FirstName").val(firstName);
        $("#LastName").val(lastName);
        $("#EmailAddress").val(email);
        $("#StreetLine1").val(streetLine1);

        $("#CardholderName").val(firstName + ' ' + lastName);

        if (hasCoApp) {
            $('input[id=CoApplicant]').prop('checked', true).change();
            $("#HasCoApplicant").val(true);

            $.ajax({
                url: 'http://api.randomuser.me/',
                dataType: 'json',
                success: function (coAppData) {
                    var coAppUser = coAppData.results[0].user;
                    var coAppFirstName = capitalizeFirstLetter(coAppUser.name.first);
                    var coAppLastName = capitalizeFirstLetter(coAppUser.name.last);
                    var coAppGeneratedEmail = coAppUser.email.replace(/ /g, "_");
                    var coAppEmail = coAppGeneratedEmail.replace("@example", (randomNumWithXDigits(3) + "@gmail"));

                    $("#CoApplicantFirstName").val(coAppFirstName);
                    $("#CoApplicantLastName").val(coAppLastName);
                    $("#CoApplicantEmailAddress").val(coAppEmail);
                }
            });

            $('input[id=SameApplicantAddress]').prop('checked', true).change();
            $("#SameAsApplicantAddress").val(true);
        }

    }
});

// VARIABLES
var today = new Date();
var month = appendLessThan10(today.getMonth() + 1);
var year = today.getFullYear();

// APPLICANT INFO
var dobYear = randomNumBetween(year - 70, year - 21);
var dobMonth = appendLessThan10(randomNumBetween(1, 12));
var dobDay = appendLessThan10(randomNumBetween(1, 28)); //in case of Feb
$("#DateOfBirth").val(dobMonth + "/" + dobDay + "/" + dobYear);
$("#SocialSecurityNumber").val(randomSocial());
$("#PrimaryPhone").val(randomPhone());
$("#SecondaryPhone").val(randomPhone());
$("#IsSecondaryPhoneCell").val(true);
$("#City").val("Salt Lake City");
$("#StateID").val("UT");
$("#PostalCode").val(randomNumWithXDigits(5));

if ($("#DriversLicenseRequired").val().toLowerCase() === "true") {
    $("#DriversLicenseNumber").val("DRIVERS-LICENSE-" + randomNumWithXDigits(7));
    $("#DriversLicenseState").val("UT");
}

$("#MonthlyIncome").val(randomNumBetween(2, 15) * 1000);

// BANK & CARD INFO
var hba = $("#HasBankAccount").val().toLowerCase() === "true";
var uba = $("#AllowUnbankedCustomers").val().toLowerCase() === "true";
var ipr = $("#InitialPaymentRequired").val().toLowerCase() === "true";
var fpr = $("#FirstPaymentRequired").val().toLowerCase() === "true";

var bankInfoReq = (!uba || hba);
var cardInfoReq = (fpr || ipr || (uba && !hba));

if (bankInfoReq) {
    $("#AccountNumberEntry").val(randomNumWithXDigits(14));
    $("#RoutingNumber").val("122000030");
    $("#BankName").val("BANK OF AMERICA NA");

    var openMonth = appendLessThan10(randomNumBetween(1, 5));
    var openYear = appendLessThan10(randomNumBetween(year - 2010, year - 2001));
    $("#AccountOpenDate").val(openMonth + "/" + openYear);
} else {
    $("#AccountNumber").val('');
    $("#RoutingNumber").val('');
    $("#BankName").val('');
    $("#AccountOpenDate").val('');
}

if (cardInfoReq) {
    $("#CardholderName").val($("#FirstName").val() + ' ' + $("#LastName").val());
    $("#CardNumberEntry").val("4111111111111111");
    $("#ExpirationMonth").val(appendLessThan10(randomNumBetween(1, 12)));
    $("#ExpirationYear").val(randomNumBetween(2016, 2019));
} else {
    $("#CardholderName").val('');
    $("#CardNumberEntry").val('');
    $("#ExpirationMonth").val('');
    $("#ExpirationYear").val('');
}

// REFERENCES INFO
$("#Reference1Name").val("Yamamoto Kun");
$("#Reference1PhoneNumber").val(randomPhone());
$("#Reference2Name").val("Kohina Ichimatsu");
$("#Reference2PhoneNumber").val(randomPhone());

//EMPLOYER INFO
$("#EmployerName").val("Run Run Company");
$("#EmployerPhone").val(randomPhone());
var hireDay = appendLessThan10(randomNumBetween(1, 28));
var hireMonth = appendLessThan10(randomNumBetween(1, 12));
var hireYear = appendLessThan10(randomNumBetween(year - 2010, year - 2001));
$("#HireDate").val(hireMonth + "/" + hireDay + "/" + hireYear);
$("#LastPayDate").val(month + "/01/" + year);
$("#NextPayDate").val(month + "/15/" + year);
$("#PayPeriodTypeID").val(3);

//COAPPLICANT INFO
if (hasCoApp) {
    $("#CoApplicantEmployerName").val("MgRonald's");
    var coHireDay = appendLessThan10(randomNumBetween(1, 28));
    var coHireMonth = appendLessThan10(randomNumBetween(1, 12));
    var coHireYear = appendLessThan10(randomNumBetween(year - 2010, year - 2001));
    $("#CoApplicantHireDate").val(coHireMonth + "/" + coHireDay + "/" + coHireYear);
    var coDobYear = randomNumBetween(year - 70, year - 21);
    var coDobMonth = appendLessThan10(randomNumBetween(1, 12));
    var coDobDay = appendLessThan10(randomNumBetween(1, 28)); //in case of Feb
    $("#CoApplicantDateOfBirth").val(coDobMonth + "/" + coDobDay + "/" + coDobYear);
    $("#CoApplicantSocialSecurityNumber").val(randomSocial());
    $("#CoApplicantMonthlyIncome").val(randomNumBetween(1, 5) * 1000);
    $("#CoApplicantPrimaryPhone").val(randomPhone());
    $("#CoApplicantSecondaryPhone").val(randomPhone());
    $("#CoApplicantPrimaryPhoneCell")[0].checked = true;
    $("#IsCoApplicantPrimaryPhoneCell").val(true);
}

//CLEAR COAPPLICANT INFO IF CHECKBOX BECOMES UNCHECKED
$("#CoApplicant").change(function () {
    if (!$("#CoApplicant").is(':checked')) {
        $("#CoApplicantFirstName").val('');
        $("#CoApplicantLastName").val('');
        $("#CoApplicantEmailAddress").val('');
        $("#CoApplicantEmployerName").val('');
        $("#CoApplicantHireDate").val('');
        $("#CoApplicantDateOfBirth").val('');
        $("#CoApplicantSocialSecurityNumber").val('');
        $("#CoApplicantMonthlyIncome").val('');
        $("#CoApplicantPrimaryPhone").val('');
        $("#CoApplicantSecondaryPhone").val('');
        $("#CoApplicantPrimaryPhoneCell")[0].checked = false;
        $("#IsCoApplicantPrimaryPhoneCell").val(false);

        $("#SameApplicantAddress")[0].checked = false;
        $("#SameAsApplicantAddress").val(false);
        $("#CoApplicantStreetLine1").val('');
        $("#CoApplicantStreetLine2").val('');
        $("#CoApplicantCity").val('');
        $("#CoApplicantStateID [value='']").attr('selected', true);
        $("#CoApplicantPostalCode").val('');
    }
});

//UPDATE BANK & CARD INFO BASED ON THEIR DYNAMIC REQUIREMENTS
$("#BankAccount").change(function () {
    var month = appendLessThan10(randomNumBetween(1, 12));
    var year = randomNumBetween(2016, 2019);

    var firstName = $("#FirstName").val().toString();
    var lastName = $("#LastName").val().toString();

    var hba = $("#HasBankAccount").val().toLowerCase() === "true";
    var uba = $("#AllowUnbankedCustomers").val().toLowerCase() === "true";
    var ipr = $("#InitialPaymentRequired").val().toLowerCase() === "true";
    var fpr = $("#FirstPaymentRequired").val().toLowerCase() === "true";

    var bankInfoReq = (!uba || hba);
    var cardInfoReq = (fpr || ipr || (uba && !hba));

    if (bankInfoReq) {
        $("#AccountNumberEntry").val(randomNumWithXDigits(14));
        $("#RoutingNumber").val("122000030");
        $("#BankName").val("BANK OF AMERICA NA");
        var openMonth = appendLessThan10(randomNumBetween(1, 12));
        var openYear = appendLessThan10(randomNumBetween(year - 2010, year - 2001));
        $("#AccountOpenDate").val(openMonth + "/" + openYear);
    } else {
        $("#AccountNumberEntry").val('');
        $("#RoutingNumber").val('');
        $("#BankName").val('');
        $("#AccountOpenDate").val('');
    }

    if (cardInfoReq) {
        $("#CardholderName").val(firstName + ' ' + lastName);
        $("#CardNumberEntry").val("4111111111111111");
        $("#ExpirationMonth").val(month);
        $("#ExpirationYear").val(year + 2);
    } else {
        $("#CardholderName").val('');
        $("#CardNumberEntry").val('');
        $("#ExpirationMonth").val('');
        $("#ExpirationYear").val('');
    }
});

/*  WORKING ON POSSIBLE LUHN ALGORITHM FUNCTION
function randomNumBetween(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
}

function randomCCNumber()
{
    var number = randomNumBetween(100000000000090, 999999999999960).toString().split("");
    var cc = [];
    for (var i = 0; i < number.length; i++)
    {
        var newNumber = parseInt(number[i] * 2);
        if (newNumber > 9)
        {
            var twoDigit = newNumber.toString().split("");
            var addedDigits = parseInt(twoDigit[0]) + parseInt(twoDigit[1]);
        }
        cc.unshift(parseInt(newNumber[i]));
    }

    console.log(newNumber[i]);
    return cc;
};
*/