document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');
    const complexityBars = document.querySelectorAll('.bar-segment');
    const complexityStatus = document.getElementById('complexityStatus');
    const matchIcon = document.getElementById('matchIcon');
    const passwordForm = document.getElementById('passwordForm');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const navTabs = document.getElementById('navTabs');
    const mobileToggle = document.getElementById('mobileToggle');
    const signIn = document.querySelector('.sign-in-link');
    const supportBtn = document.querySelector('.support-btn');

    // Tab Navigation Interaction
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Mobile Navigation Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navTabs.classList.toggle('mobile-open');
            signIn.classList.toggle('mobile-open');
            supportBtn.classList.toggle('mobile-open');
        });
    }

    // Toggle Password Visibility
    if (toggleNewPasswordBtn && newPasswordInput) {
        toggleNewPasswordBtn.addEventListener('click', () => {
            const isPassword = newPasswordInput.type === 'password';
            newPasswordInput.type = isPassword ? 'text' : 'password';
            
            toggleNewPasswordBtn.innerHTML = isPassword ? `
                <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            ` : `
                <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        });
    }

    // Password Complexity Logic
    function evaluatePasswordStrength(password) {
        let score = 0;

        if (!password) return { score: 0, status: 'PENDING', color: '#e2e8f0' };

        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

        let status = 'WEAK';
        let color = '#ef4444'; // Red

        if (score === 2) {
            status = 'MODERATE';
            color = '#f59e0b'; // Amber
        } else if (score === 3) {
            status = 'GOOD';
            color = '#3b82f6'; // Blue
        } else if (score >= 4) {
            status = 'STRONG';
            color = '#10b981'; // Green
        }

        return { score, status, color };
    }

    function updateComplexityMeter() {
        const val = newPasswordInput.value;
        const { score, status, color } = evaluatePasswordStrength(val);

        complexityStatus.textContent = status;
        complexityStatus.style.color = val ? color : '#94a3b8';

        complexityBars.forEach((bar, index) => {
            if (index < score) {
                bar.style.backgroundColor = color;
            } else {
                bar.style.backgroundColor = '#e2e8f0';
            }
        });

        checkMatch();
    }

    // Check Password Match
    function checkMatch() {
        const pass1 = newPasswordInput.value;
        const pass2 = confirmPasswordInput.value;

        if (!pass2) {
            matchIcon.innerHTML = '';
            return;
        }

        if (pass1 && pass1 === pass2) {
            matchIcon.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
        } else {
            matchIcon.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
        }
    }

    newPasswordInput.addEventListener('input', updateComplexityMeter);
    confirmPasswordInput.addEventListener('input', checkMatch);

    // Toast Notification helper
    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Form Submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass1 = newPasswordInput.value;
            const pass2 = confirmPasswordInput.value;

            if (pass1.length < 8) {
                showToast('Password should be at least 8 characters long.');
                return;
            }

            if (pass1 !== pass2) {
                showToast('Passwords do not match. Please verify.');
                return;
            }

            showToast('Password updated successfully! Redirecting...');

            setTimeout(() => {
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
                updateComplexityMeter();
            }, 2500);
        });
    }
});
