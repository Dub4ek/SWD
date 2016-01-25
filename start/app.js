/*
Your code goes here!
 */

/*
You might find you want to use RegEx. As this quiz is about setCustomValidity
and not RegEx, here are some RegEx patterns you might find useful:

match one of the required symbols: /[\!\@\#\$\%\^\&\*]/g
match a number: /[0-9]/g or /\d/g
match a lowercase letter: /[a-z]/g
match an uppercase letter: /[A-Z]/g
match a character that isn't allowed in this password: /[^A-z0-9\!\@\#\$\%\^\&\*]/g
 */

/*
Grabbing a few inputs to help you get started...
 */
var firstPasswordInput = document.querySelector('#first');
var secondPasswordInput = document.querySelector('#second');
var submit = document.querySelector('#submit');

/*
You'll probably find this function useful...
 */
function checkInput(control) {
    var funcCollection = [checkLength, checkNumber, checkSymbol, checkLowerLetter, checkUpperLetter, checkIllegalLetter];

    funcCollection.every(function(item) {
        return item.call(null, control);
    });
}

function checkLength(control) {
    var value = control.value;

    if (value.length < 16) {
        control.setCustomValidity('More than 16 characters');
        return false;
    }

    if (value.length > 100) {
        control.setCustomValidity('Less than 100 characters');
        return false;
    }

    return true;
}

function checkSomething(control, regexp, message) {
    var value = control.value;

    if (!regexp.test(value)) {
        control.setCustomValidity(message);
        return false;
    }

    return true;
}

function checkUpperLetter(control) {
    return checkSomething(control, /[A-Z]/g, 'Required one uppercase letter');
}

function checkIllegalLetter(control) {
    var value = control.value,
        regexp = /[^A-z0-9\!\@\#\$\%\^\&\*]/g;

    if (regexp.test(value)) {
        control.setCustomValidity('Password contain illegal symbols');
        return false;
    }

    return true;
}

function checkLowerLetter(control) {
    return checkSomething(control, /[a-z]/g, 'Required one lowercase letter');
}

function checkNumber(control) {
    return checkSomething(control, /\d/g, 'Missing any number')
}

function checkSymbol(control) {
    return checkSomething(control, /[\!\@\#\$\%\^\&\*]/g, 'Missing required symbol character')
}

function checkPasswordsMatching(firstPasswordInput, secondPasswordInput) {
    if (firstPasswordInput.value !== secondPasswordInput.value) {
        secondPasswordInput.setCustomValidity('Passwords don\'t match');
    }
}


submit.onclick = function () {
    firstPasswordInput.setCustomValidity('');
    secondPasswordInput.setCustomValidity('');
    checkInput(firstPasswordInput);
    checkInput(secondPasswordInput);
    checkPasswordsMatching(firstPasswordInput, secondPasswordInput);
};
