document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // Shared Navigation & Mobile Drawer
    // --------------------------------------------------------------------------
    const navTabs = document.getElementById('navTabs');
    const mobileToggle = document.getElementById('mobileToggle');
    const signIn = document.querySelector('.sign-in-link');
    const supportBtn = document.querySelector('.support-btn');

    const API_BASE = "https://aq-gld-g2-1.onrender.com";

    if (mobileToggle && navTabs) {
        mobileToggle.addEventListener('click', () => {
            navTabs.classList.toggle('mobile-open');
            signIn.classList.toggle('mobile-open');
            supportBtn.classList.toggle('mobile-open');
        });
    }

    // --------------------------------------------------------------------------
    // Telemetry Dashboard Chart & State Management
    // --------------------------------------------------------------------------
    const ctx = document.getElementById('telemetryChart');
    let telemetryChart = null;

    // Elements for Dynamic State Toggle
    const bannerNormal = document.getElementById('bannerNormal');
    const bannerDanger = document.getElementById('bannerDanger');
    const bannerOffline = document.getElementById('bannerOffline');
    const activeHardwareView = document.getElementById('activeHardwareView');
    const unpairedView = document.getElementById('unpairedView');

    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    const cardMq2 = document.getElementById('cardMq2');
    const badgeMq2 = document.getElementById('badgeMq2');
    const mq2Val = document.getElementById('mq2Val');

    const cardMq5 = document.getElementById('cardMq5');
    const badgeMq5 = document.getElementById('badgeMq5');
    const mq5Val = document.getElementById('mq5Val');

    const cardMq7 = document.getElementById('cardMq7');
    const badgeMq7 = document.getElementById('badgeMq7');
    const mq7Val = document.getElementById('mq7Val');

    const oledMq2 = document.getElementById('oledMq2');
    const oledMq5 = document.getElementById('oledMq5');
    const oledMq7 = document.getElementById('oledMq7');
    const oledStatus = document.getElementById('oledStatus');

    const relayBadge = document.getElementById('relayBadge');
    const audioBox = document.getElementById('audioBox');
    const audioTitle = document.getElementById('audioTitle');
    const audioSub = document.getElementById('audioSub');
    const audioIconBox = document.getElementById('audioIconBox');

    const pairDeviceBtn = document.getElementById('pairDeviceBtn');
    const scanningStatus = document.getElementById('scanningStatus');

    // Chart Datasets per State
    const chartDataPresets = {
        normal: {
            mq2: [120, 125, 114, 140, 130, 122, 128],
            mq5: [85, 88, 83, 95, 90, 87, 89],
            mq7: [15, 19, 14, 22, 19, 16, 17],
            maxScale: 140
        },
        danger: {
            mq2: [120, 122, 125, 140, 185, 260, 350],
            mq5: [85, 88, 83, 92, 90, 88, 89],
            mq7: [15, 19, 14, 20, 19, 18, 17],
            maxScale: 400
        },
        offline: {
            mq2: [120, 125, 114, 128, 128, 128, 128],
            mq5: [85, 88, 83, 89, 89, 89, 89],
            mq7: [15, 19, 14, 17, 17, 17, 17],
            maxScale: 140
        }
    };

    if (ctx && typeof Chart !== 'undefined') {
        const labels = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'];

        telemetryChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'MQ-2 (Combustible Gas)',
                        data: [...chartDataPresets.normal.mq2],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.05)',
                        borderWidth: 2.5,
                        tension: 0.4,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        fill: false
                    },
                    {
                        label: 'MQ-5 (Natural Gas)',
                        data: [...chartDataPresets.normal.mq5],
                        borderColor: '#16a34a',
                        backgroundColor: 'rgba(22, 163, 74, 0.05)',
                        borderWidth: 2.5,
                        tension: 0.4,
                        pointBackgroundColor: '#16a34a',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        fill: false
                    },
                    {
                        label: 'MQ-7 (Carbon Monoxide)',
                        data: [...chartDataPresets.normal.mq7],
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.05)',
                        borderWidth: 2.5,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointBackgroundColor: '#dc2626',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#0f172a',
                        titleFont: { family: 'JetBrains Mono', size: 12 },
                        bodyFont: { family: 'JetBrains Mono', size: 12 },
                        padding: 10,
                        cornerRadius: 6
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#f1f5f9', drawBorder: false },
                        ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94a3b8' }
                    },
                    y: {
                        min: 0,
                        max: 140,
                        ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94a3b8' },
                        grid: { color: '#e2e8f0', borderDash: [4, 4], drawBorder: false }
                    }
                }
            }
        });
    }

    // Master Dashboard State Switcher Function
    function setDashboardState(state) {
        document.body.setAttribute('data-state', state);

        document.querySelectorAll('.state-btn').forEach(btn => {
            if (btn.getAttribute('data-set-state') === state) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (state === 'unpaired') {
            if (activeHardwareView) activeHardwareView.style.display = 'none';
            if (unpairedView) unpairedView.style.display = 'flex';
            if (bannerNormal) bannerNormal.style.display = 'none';
            if (bannerDanger) bannerDanger.style.display = 'none';
            if (bannerOffline) bannerOffline.style.display = 'none';

            if (statusIndicator) {
                statusIndicator.className = 'status-indicator offline';
                if (statusText) statusText.textContent = 'NO DEVICE';
            }
            return;
        }

        if (activeHardwareView) activeHardwareView.style.display = 'block';
        if (unpairedView) unpairedView.style.display = 'none';

        if (state === 'normal') {
            if (bannerNormal) bannerNormal.style.display = 'flex';
            if (bannerDanger) bannerDanger.style.display = 'none';
            if (bannerOffline) bannerOffline.style.display = 'none';

            if (statusIndicator) {
                statusIndicator.className = 'status-indicator online';
                if (statusText) statusText.textContent = 'ONLINE';
            }

            if (cardMq2) cardMq2.className = 'sensor-card';
            if (badgeMq2) { badgeMq2.className = 'status-badge-card'; badgeMq2.textContent = 'SAFE'; }
            if (mq2Val) mq2Val.textContent = '128';

            if (cardMq5) cardMq5.className = 'sensor-card';
            if (badgeMq5) { badgeMq5.className = 'status-badge-card'; badgeMq5.textContent = 'SAFE'; }
            if (mq5Val) mq5Val.textContent = '89';

            if (cardMq7) cardMq7.className = 'sensor-card';
            if (badgeMq7) { badgeMq7.className = 'status-badge-card'; badgeMq7.textContent = 'SAFE'; }
            if (mq7Val) mq7Val.textContent = '17';

            if (oledMq2) oledMq2.textContent = '128';
            if (oledMq5) oledMq5.textContent = '89';
            if (oledMq7) oledMq7.textContent = '17';
            if (oledStatus) { oledStatus.className = 'oled-line safe-text'; oledStatus.textContent = 'AIR QUALITY: SAFE'; }

            if (relayBadge) { relayBadge.className = 'open-badge'; relayBadge.textContent = 'OPEN'; }

            if (audioBox) audioBox.className = 'audio-box';
            if (audioTitle) audioTitle.textContent = 'SILENT';
            if (audioSub) audioSub.textContent = 'NO ALARM CONDITIONS ACTIVE';
            if (audioIconBox) {
                audioIconBox.innerHTML = `
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.75">
                        <polygon points="11 5 L6 9 L2 9 L2 15 L6 15 L11 19 L11 5 Z"></polygon>
                        <line x1="22" y1="9" x2="16" y2="15"></line>
                        <line x1="16" y1="9" x2="22" y2="15"></line>
                    </svg>
                `;
            }

            if (telemetryChart) {
                telemetryChart.options.scales.y.max = chartDataPresets.normal.maxScale;
                telemetryChart.data.datasets[0].data = [...chartDataPresets.normal.mq2];
                telemetryChart.data.datasets[1].data = [...chartDataPresets.normal.mq5];
                telemetryChart.data.datasets[2].data = [...chartDataPresets.normal.mq7];
                telemetryChart.update();
            }
        }
        else if (state === 'danger') {
            if (bannerNormal) bannerNormal.style.display = 'none';
            if (bannerDanger) bannerDanger.style.display = 'flex';
            if (bannerOffline) bannerOffline.style.display = 'none';

            if (statusIndicator) {
                statusIndicator.className = 'status-indicator danger';
                if (statusText) statusText.textContent = 'HAZARD DETECTED';
            }

            if (cardMq2) cardMq2.className = 'sensor-card card-danger';
            if (badgeMq2) { badgeMq2.className = 'status-badge-card badge-danger'; badgeMq2.textContent = 'DANGER'; }
            if (mq2Val) mq2Val.textContent = '350';

            if (cardMq5) cardMq5.className = 'sensor-card';
            if (badgeMq5) { badgeMq5.className = 'status-badge-card'; badgeMq5.textContent = 'SAFE'; }
            if (mq5Val) mq5Val.textContent = '89';

            if (cardMq7) cardMq7.className = 'sensor-card';
            if (badgeMq7) { badgeMq7.className = 'status-badge-card'; badgeMq7.textContent = 'SAFE'; }
            if (mq7Val) mq7Val.textContent = '17';

            if (oledMq2) oledMq2.textContent = '350';
            if (oledMq5) oledMq5.textContent = '89';
            if (oledMq7) oledMq7.textContent = '17';
            if (oledStatus) { oledStatus.className = 'oled-line danger-text'; oledStatus.textContent = 'WARNING: GAS LEAK'; }

            if (relayBadge) { relayBadge.className = 'open-badge badge-danger'; relayBadge.textContent = 'CLOSED'; }

            if (audioBox) audioBox.className = 'audio-box box-danger';
            if (audioTitle) audioTitle.textContent = 'ALERTING';
            if (audioSub) audioSub.textContent = 'HIGH CONCENTRATION DETECTED';
            if (audioIconBox) {
                audioIconBox.innerHTML = `
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
                        <polygon points="11 5 L6 9 L2 9 L2 15 L6 15 L11 19 L11 5 Z"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                `;
            }

            if (telemetryChart) {
                telemetryChart.options.scales.y.max = chartDataPresets.danger.maxScale;
                telemetryChart.data.datasets[0].data = [...chartDataPresets.danger.mq2];
                telemetryChart.data.datasets[1].data = [...chartDataPresets.danger.mq5];
                telemetryChart.data.datasets[2].data = [...chartDataPresets.danger.mq7];
                telemetryChart.update();
            }
        }
        else if (state === 'offline') {
            if (bannerNormal) bannerNormal.style.display = 'none';
            if (bannerDanger) bannerDanger.style.display = 'none';
            if (bannerOffline) bannerOffline.style.display = 'flex';

            if (statusIndicator) {
                statusIndicator.className = 'status-indicator offline';
                if (statusText) statusText.textContent = 'OFFLINE';
            }

            if (cardMq2) cardMq2.className = 'sensor-card card-offline';
            if (badgeMq2) { badgeMq2.className = 'status-badge-card badge-stale'; badgeMq2.textContent = 'STALE DATA'; }

            if (cardMq5) cardMq5.className = 'sensor-card card-offline';
            if (badgeMq5) { badgeMq5.className = 'status-badge-card badge-stale'; badgeMq5.textContent = 'STALE DATA'; }

            if (cardMq7) cardMq7.className = 'sensor-card card-offline';
            if (badgeMq7) { badgeMq7.className = 'status-badge-card badge-stale'; badgeMq7.textContent = 'STALE DATA'; }

            if (oledStatus) { oledStatus.className = 'oled-line muted-text'; oledStatus.textContent = 'DISCONNECTED'; }

            if (telemetryChart) {
                telemetryChart.options.scales.y.max = chartDataPresets.offline.maxScale;
                telemetryChart.data.datasets[0].data = [...chartDataPresets.offline.mq2];
                telemetryChart.data.datasets[1].data = [...chartDataPresets.offline.mq5];
                telemetryChart.data.datasets[2].data = [...chartDataPresets.offline.mq7];
                telemetryChart.update();
            }
        }
    }

    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetState = btn.getAttribute('data-set-state');
            setDashboardState(targetState);
        });
    });

    if (pairDeviceBtn) {
        pairDeviceBtn.addEventListener('click', () => {
            pairDeviceBtn.disabled = true;
            pairDeviceBtn.innerHTML = `<span class="radar-spinner"></span> CONNECTING...`;
            if (scanningStatus) scanningStatus.innerHTML = `<span>PAIRING AQ-GLD-G2 HARDWARE VIA BLUETOOTH...</span>`;

            setTimeout(() => {
                pairDeviceBtn.disabled = false;
                pairDeviceBtn.innerHTML = `<span class="plus-icon">+</span> PAIR NEW DEVICE`;
                if (scanningStatus) scanningStatus.innerHTML = `<span class="radar-spinner"></span><span>SCANNING FOR HARDWARE VIA BLUETOOTH...</span>`;
                setDashboardState('normal');
            }, 2000);
        });
    }
});

// --------------------------------------------------------------------------
// Account Registration Form Logic (register.html)
// --------------------------------------------------------------------------
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('emailAddress').value;
        const password = document.getElementById('regPassword').value;
        const deviceId = document.getElementById('deviceId').value;

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, deviceId })
            });

            const data = await res.json();

            if (!res.ok) {
                // ❌ Backend returned an error (e.g. user already exists)
                toastMsg.textContent = data.error || 'Registration failed';
                toast.classList.add('show');
            } else {
                // ✅ Registration successful
                toastMsg.textContent = `Account created for ${fullName}! Device ${deviceId} linked. Redirecting...`;
                toast.classList.add('show');

                setTimeout(() => {
                    window.location.href = '../../dashboard/index.html';
                }, 2000);
            }
        } catch (err) {
            toastMsg.textContent = 'Error connecting to server';
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }
    });
}
