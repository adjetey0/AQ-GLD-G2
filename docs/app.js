const mobileToggle = document.getElementById('mobileToggle');
const navTabs = document.getElementById('navTabs');
const signIn = document.querySelector('.sign-in-link');
const supportBtn = document.querySelector('.support-btn');

mobileToggle.addEventListener('click', () => {
    navTabs.classList.toggle('mobile-open');
    signIn.classList.toggle('mobile-open');
    supportBtn.classList.toggle('mobile-open');
});

function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        window.location.href = "dashboard/index.html";
    } else {
        alert("Please enter email and password");
    }
}