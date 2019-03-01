$(document).ready(function () {
    var loginBut = document.getElementById("loginBut");

    async function loginClick() {
        setTimeout(function(){ swal("Login Error","Please double check the ID and Password","error"); }, 1000);
    }

    loginBut.addEventListener("click", loginClick);
});