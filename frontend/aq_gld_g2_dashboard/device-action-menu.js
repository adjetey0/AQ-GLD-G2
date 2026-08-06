document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('.btn-icon');
    const actionMenu = document.createElement('div');
    actionMenu.className = 'device-action-menu';
    actionMenu.id = 'deviceActionMenu';
    actionMenu.innerHTML = `
        <button class="menu-button remove-action" type="button" id="removeDeviceBtn">Remove Device</button>
        <button class="menu-button close-action" type="button" id="closeDeviceMenuBtn">Cancel</button>
    `;
    document.body.appendChild(actionMenu);

    let currentRow = null;

    function closeMenu() {
        actionMenu.classList.remove('open');
        actionMenu.style.left = '';
        actionMenu.style.top = '';
        currentRow = null;
    }

    function openMenu(button) {
        currentRow = button.closest('tr');
        if (!currentRow) return;
        const rect = button.getBoundingClientRect();
        actionMenu.style.left = `${Math.min(rect.left, window.innerWidth - actionMenu.offsetWidth - 16)}px`;
        actionMenu.style.top = `${rect.bottom + window.scrollY + 8}px`;
        actionMenu.classList.add('open');
    }

    actionButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.stopPropagation();
            if (actionMenu.classList.contains('open') && currentRow === button.closest('tr')) {
                closeMenu();
                return;
            }
            openMenu(button);
        });
    });

    actionMenu.addEventListener('click', event => {
        event.stopPropagation();
        const target = event.target;
        if (target.id === 'removeDeviceBtn' && currentRow) {
            currentRow.remove();
            closeMenu();
        }
        if (target.id === 'closeDeviceMenuBtn') {
            closeMenu();
        }
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.device-action-menu') && !event.target.closest('.btn-icon')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', closeMenu);
});