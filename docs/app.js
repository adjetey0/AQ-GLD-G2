const mobileToggle = document.getElementById('mobileToggle');
const navTabs = document.getElementById('navTabs');
const signIn = document.querySelector('.sign-in-link');
const supportBtn = document.querySelector('.support-btn');

mobileToggle.addEventListener('click', () => {
    navTabs.classList.toggle('mobile-open');
    signIn.classList.toggle('mobile-open');
    supportBtn.classList.toggle('mobile-open');
});
const API_BASE = "https://aq-gld-g2-1.onrender.com";

function loginUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }) // matches backend now
  })
  .then(async res => {
    const data = await res.json();

    if (!res.ok) {
      toastMsg.textContent = data.error || 'Login failed';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    } else {
      localStorage.setItem('token', data.token);
      toastMsg.textContent = 'Login successful! Redirecting...';
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        window.location.href = 'dashboard/index.html';
      }, 2000);
    }
  })
  .catch(err => {
    toastMsg.textContent = 'Error connecting to server';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
}
localStorage.setItem('token', data.token);
