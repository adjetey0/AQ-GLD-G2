document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('aq-gld-theme', theme);
    const icon = toggle.querySelector('.theme-toggle__icon');
    const label = toggle.querySelector('.theme-toggle__label');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (label) {
      label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  };

  const savedTheme = localStorage.getItem('aq-gld-theme');
  const initialTheme = savedTheme || 'light';
  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
});
