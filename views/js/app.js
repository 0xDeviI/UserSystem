//* Primary Inputs
var header = document.getElementById("app_header");
var forms = document.getElementById("container");
var dashboard = document.getElementById("dashboard");

//! Sign-in Inputs
var signInUsername = document.getElementById("si_username");
var signInPassword = document.getElementById("si_password");

//? Sign-up Inputs
var signUpName = document.getElementById("su_name");
var signUpUsername = document.getElementById("su_username");
var signUpEmail = document.getElementById("su_email");
var signUpPassword = document.getElementById("su_password");
var signUpPasswordVerify = document.getElementById("su_passwordverify");

//* Dashboard Inputs
var dashboardName = document.getElementById("dash_name");
var dashboardUsername = document.getElementById("dash_username");
var dashboardEmail = document.getElementById("dash_email");
var dashboardPassword = document.getElementById("dash_password");


// ------------------------------------------------------------------------

// Initialize LocalStorage
if (localStorage.getItem("loggedIn") != null && localStorage.getItem("loggedIn_user") != null) {
    var user = JSON.parse(localStorage.getItem("loggedIn_user"));
    header.innerHTML = `${user["name"]} عزيز، خوش آمديد!`;
    dashboardName.value = user["name"];
    dashboardUsername.value = user["username"];
    dashboardEmail.value = user["email"];
    dashboardPassword.value = user["password"];
    forms.hidden = true;
    dashboard.hidden = false;
} else {
    forms.hidden = false;
    dashboard.hidden = true;
    if (localStorage.getItem("loggedIn") != null)
        localStorage.removeItem("loggedIn");
    if (localStorage.getItem("loggedIn_user") != null)
        localStorage.removeItem("loggedIn_user");
}
// ------------------------------------------------------------------------

//* Application Functions
//TODO: User will not interact with these functions directly.
//TODO: these functions will call from client methods.
function logout() {
    if (localStorage.getItem("loggedIn") != null)
        localStorage.removeItem("loggedIn");
    if (localStorage.getItem("loggedIn_user") != null)
        localStorage.removeItem("loggedIn_user");
    location.reload();
}

function isValidName(name) {
    var p = /^[a-zA-Z\u0600-\u06FF\s]+$/;

    if (!p.test(name)) {
        return false;
    } else {
        return true;
    }
}

function isValidUserName(username) {
    var p = /^[a-zA-Z0-9\s]+$/;

    if (!p.test(username)) {
        return false;
    } else {
        return true;
    }
}

function isValidPassword(password) {
    var p = /^[a-zA-Z0-9!@#$\s]+$/;

    if (!p.test(password)) {
        return false;
    } else {
        return true;
    }
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidSignupCondition() {
    return signUpName.value != "" && signUpUsername.value != "" && signUpEmail.value != "" &&
        signUpPassword.value != "" && signUpPassword.value === signUpPasswordVerify.value &&
        isValidName(signUpName.value) && isValidUserName(signUpUsername.value) &&
        isValidPassword(signUpPassword.value) && isValidEmail(signUpEmail.value);
}

function isValidSigninCondition() {
    return signInUsername.value != "" && signInPassword.value != "" && isValidUserName(signInUsername.value) &&
        isValidPassword(signInPassword.value);
}

function clearSignUpFields() {
    signUpName.value = "";
    signUpUsername.value = "";
    signUpEmail.value = "";
    signUpPassword.value = "";
    signUpPasswordVerify.value = "";
}


// ------------------------------------------------------------------------

//* Client Functions
//TODO: User will interact with these functions directly.
function singup() {
    if (isValidSignupCondition()) {
        // registerNewUser(signUpName.value, signUpUsername.value, signUpEmail.value, signUpPassword.value);
        $.ajax({
            type: "POST",
            url: "signup",
            data: {
                name: signUpName.value,
                username: signUpUsername.value,
                email: signUpEmail.value,
                password: signUpPassword.value
            },
            cache: false,
            success: function(html) {
                var parsedJson = JSON.parse(html);
                alert(parsedJson["message"]);
                if (parsedJson["error"] == false)
                    clearSignUpFields();
            }
        });
    } else
        alert("ورودي ها كامل نيستند يا كلمه عبور مشابه نيست.");
}

function signin() {
    if (isValidSigninCondition()) {
        $.ajax({
            type: "POST",
            url: "signin",
            data: {
                username: signInUsername.value,
                password: signInPassword.value
            },
            cache: false,
            success: function(html) {
                var parsedJson = JSON.parse(html);
                if (parsedJson["error"] == false) {
                    localStorage.setItem("loggedIn", true);
                    localStorage.setItem("loggedIn_user", parsedJson["user"]);
                    header.innerHTML = `${JSON.parse(parsedJson["user"])["name"]} عزيز، خوش آمديد!`;
                    dashboardName.value = JSON.parse(parsedJson["user"])["name"];
                    dashboardUsername.value = JSON.parse(parsedJson["user"])["username"];
                    dashboardEmail.value = JSON.parse(parsedJson["user"])["email"];
                    dashboardPassword.value = JSON.parse(parsedJson["user"])["password"];
                    forms.hidden = true;
                    dashboard.hidden = false;
                } else {
                    alert(parsedJson["message"]);
                }
            }
        });
    } else
        alert("نام كابري يا كلمه عبور مجاز نيست!");
}

function passrecover() {
    var username = prompt("enter your username: ");
    var email = prompt(`enter email for ${username}: `);
    var newPassword = prompt("enter new password: ");
    if (isValidUserName(username) && isValidEmail(email) && isValidPassword(newPassword)) {
        $.ajax({
            type: "POST",
            url: "passrecover",
            data: {
                username: username,
                email: email,
                password: newPassword
            },
            cache: false,
            success: function(html) {
                var parsedJson = JSON.parse(html);
                if (parsedJson["error"] == false) {
                    alert("كلمه عبور شما ويرايش شد!");
                } else {
                    alert("نتيجه اي يافت نشد.");
                }
            }
        });
    } else {
        alert("نام كاربري يا ايميل يا كلمه عبور جديد مجاز نيست!");
    }
}