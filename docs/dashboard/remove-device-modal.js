document.addEventListener('DOMContentLoaded', () => {
    const deviceActionButtons = document.querySelectorAll('[data-device-action]');
    const deviceActionMenu = document.getElementById('deviceActionMenu');
    const removeDeviceBtn = document.getElementById('removeDeviceBtn');
    const closeDeviceMenuBtn = document.getElementById('closeDeviceMenuBtn');
    let currentDeviceCard = null;

    function closeMenu() {
        if (deviceActionMenu) {
            deviceActionMenu.classList.remove('open');
            deviceActionMenu.style.left = '';
            deviceActionMenu.style.top = '';
        }
        currentDeviceCard = null;
    }

    function openMenu(button) {
        if (!deviceActionMenu) return;
        currentDeviceCard = button.closest('.sensor-card');
        const rect = button.getBoundingClientRect();
        const menuRect = deviceActionMenu.getBoundingClientRect();
        const left = Math.min(rect.left, window.innerWidth - menuRect.width - 16);
        const top = rect.bottom + window.scrollY + 8;
        deviceActionMenu.style.left = `${left}px`;
        deviceActionMenu.style.top = `${top}px`;
        deviceActionMenu.classList.add('open');
    }

    deviceActionButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.stopPropagation();
            if (deviceActionMenu && deviceActionMenu.classList.contains('open')) {
                closeMenu();
                return;
            }
            openMenu(button);
        });
    });

    if (removeDeviceBtn) {
        removeDeviceBtn.addEventListener('click', () => {
            if (!currentDeviceCard) return;
            currentDeviceCard.remove();
            closeMenu();
        });
    }

    if (closeDeviceMenuBtn) {
        closeDeviceMenuBtn.addEventListener('click', closeMenu);
    }

    document.addEventListener('click', event => {
        if (!deviceActionMenu) return;
        if (event.target.closest('#deviceActionMenu')) return;
        if (event.target.closest('[data-device-action]')) return;
        closeMenu();
    });

    window.addEventListener('resize', closeMenu);
});