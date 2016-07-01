//function to generate a random number between any two integers
function randomNumBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/*
digits parameter can be hardcoded or can use randomNumBetween function
overall function to generate and validate a random credit card
*/
function randomValidCC(digits) {

  //this function does the validation for the credit card number, and provides the check digit
    function luhn(d) {
        var res = 0;
        var inc = d.length % 2;
        for (var i = 0; i < d.length; ++i) {
            var n = Number(d.charAt(i)) * (2 - (i + inc) % 2);
            res += n > 9 ? n - 9 : n;
        }
        return res;
    }

    var checksum = luhn(digits) % 10;
    var cs = luhn(digits + "0") % 10;
    var checkdigit = cs ? 10 - cs : 0;

    return digits + checkdigit;
}
