const mobileToggle = document.getElementById('mobileToggle');
const navTabs = document.getElementById('navTabs');

mobileToggle.addEventListener('click', () => {
    navTabs.classList.toggle('mobile-open');
});

function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Example check (replace with real logic later)
    if (email && password) {
        window.location.href = "dashboard/index.html";
    } else {
        alert("Please enter email and password");
    }
}