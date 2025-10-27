/**
 * RJACC2025 Registration Quota Manager
 * จัดการ limit การลงทะเบียนและ workshop capacity
 */

// ===========================
// CONFIGURATION
// ===========================

const QUOTA_CONFIG = {
    // Quota สำหรับแต่ละประเภทผู้เข้าร่วม
    registrationLimits: {
        external: 550,    // บุคลากรภายนอก
        internal: 250,    // บุคลากรภายใน
        staff: 100        // คณะทำงาน
    },

    // Quota สำหรับห้องประชุม
    roomCapacity: {
        'โยธี': 150,
        'ราชพฤกษ์': 50,
        'สุพรรณิการ์': 50
    },

    // API endpoint (ปรับตาม backend ของคุณ)
    apiEndpoint: 'https://your-backend-api.com/api',
    
    // Local storage keys
    storageKeys: {
        registrationCount: 'rjacc2025_registration_count',
        workshopCount: 'rjacc2025_workshop_count'
    }
};

// ===========================
// WORKSHOP DATA STRUCTURE
// ===========================

const WORKSHOP_SESSIONS = [
    {
        id: 'workshop1',
        date: 'วันพุธที่ 21 มกราคม 2569',
        time: 'ช่วงเช้า 08.00-12.00',
        topic: 'MIS CVT',
        room: 'โยธี',
        capacity: 150,
        value: 'วันพุธที่ 21 มกราคม 2569 ช่วงเช้า 08.00-12.00 Topic: MIS CVT ห้องประชุมโยธี'
    },
    {
        id: 'workshop2',
        date: 'วันพุธที่ 21 มกราคม 2569',
        time: 'ช่วงบ่าย 13.00-16.00',
        topic: 'MIS CVT',
        room: 'โยธี',
        capacity: 150,
        value: 'วันพุธที่ 21 มกราคม 2569 ช่วงบ่าย 13.00-16.00 Topic: MIS CVT ห้องประชุมโยธี'
    },
    {
        id: 'workshop3',
        date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
        time: 'ช่วงเช้า 08.00-12.00',
        topic: 'Workshop CVT',
        room: 'โยธี',
        capacity: 150,
        value: 'วันพฤหัสบดีที่ 22 มกราคม 2569 ช่วงเช้า 08.00-12.00 Topic: Workshop CVT ห้องประชุมโยธี'
    },
    {
        id: 'workshop4',
        date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
        time: 'ช่วงบ่าย 13.00-16.00',
        topic: 'Workshop CVT',
        room: 'โยธี',
        capacity: 150,
        value: 'วันพฤหัสบดีที่ 22 มกราคม 2569 ช่วงบ่าย 13.00-16.00 Topic: Workshop CVT ห้องประชุมโยธี'
    },
    {
        id: 'workshop5',
        date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
        time: 'ช่วงเช้า 08.00-16.00',
        topic: '……….',
        room: 'ราชพฤกษ์',
        capacity: 50,
        value: 'วันพฤหัสบดีที่ 22 มกราคม 2569 ช่วงเช้า 08.00-16.00 Topic: ………. ห้องประชุมราชพฤกษ์'
    },
    {
        id: 'workshop6',
        date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
        time: 'ช่วงบ่าย 13.00-16.00',
        topic: 'กายภาพบำบัด',
        room: 'ราชพฤกษ์',
        capacity: 50,
        value: 'วันพฤหัสบดีที่ 22 มกราคม 2569 ช่วงบ่าย 13.00-16.00 Topic: กายภาพบำบัด ห้องประชุมราชพฤกษ์'
    },
    {
        id: 'workshop7',
        date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
        time: 'ช่วงเช้า 08.00-12.00',
        topic: 'เภสัชกร',
        room: 'สุพรรณิการ์',
        capacity: 50,
        value: 'วันพฤหัสบดีที่ 22 มกราคม 2569 ช่วงเช้า 08.00-12.00 Topic: เภสัชกร ห้องประชุมสุพรรณิการ์'
    },
    {
        id: 'workshop8',
        date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
        time: 'ช่วงบ่าย 13.00-16.00',
        topic: 'เภสัชกร',
        room: 'สุพรรณิการ์',
        capacity: 50,
        value: 'วันพฤหัสบดีที่ 22 มกราคม 2569 ช่วงบ่าย 13.00-16.00 Topic: เภสัชกร ห้องประชุมสุพรรณิการ์'
    }
];

// ===========================
// QUOTA MANAGER CLASS
// ===========================

class QuotaManager {
    constructor(registrationType) {
        this.registrationType = registrationType; // 'external', 'internal', 'staff'
        this.workshopCounts = this.loadWorkshopCounts();
        this.registrationCount = this.loadRegistrationCount();
    }

    // ===========================
    // REGISTRATION QUOTA
    // ===========================

    /**
     * โหลดจำนวนการลงทะเบียนจาก localStorage หรือ API
     */
    loadRegistrationCount() {
        // ในการใช้งานจริง ควรโหลดจาก API
        // สำหรับ demo ใช้ localStorage
        const stored = localStorage.getItem(
            `${QUOTA_CONFIG.storageKeys.registrationCount}_${this.registrationType}`
        );
        return stored ? parseInt(stored) : 0;
    }

    /**
     * บันทึกจำนวนการลงทะเบียน
     */
    saveRegistrationCount(count) {
        localStorage.setItem(
            `${QUOTA_CONFIG.storageKeys.registrationCount}_${this.registrationType}`,
            count.toString()
        );
        this.registrationCount = count;
    }

    /**
     * ตรวจสอบว่ายังมี quota เหลือหรือไม่
     */
    checkRegistrationQuota() {
        const limit = QUOTA_CONFIG.registrationLimits[this.registrationType];
        const remaining = limit - this.registrationCount;
        
        return {
            available: remaining > 0,
            limit: limit,
            current: this.registrationCount,
            remaining: remaining
        };
    }

    /**
     * เพิ่มจำนวนการลงทะเบียน
     */
    incrementRegistrationCount() {
        const quota = this.checkRegistrationQuota();
        if (quota.available) {
            this.saveRegistrationCount(this.registrationCount + 1);
            return true;
        }
        return false;
    }

    // ===========================
    // WORKSHOP QUOTA
    // ===========================

    /**
     * โหลดจำนวนคนเข้า workshop แต่ละรอบ
     */
    loadWorkshopCounts() {
        const stored = localStorage.getItem(QUOTA_CONFIG.storageKeys.workshopCount);
        if (stored) {
            return JSON.parse(stored);
        }
        
        // สร้างข้อมูลเริ่มต้น
        const counts = {};
        WORKSHOP_SESSIONS.forEach(session => {
            counts[session.id] = 0;
        });
        return counts;
    }

    /**
     * บันทึกจำนวนคนเข้า workshop
     */
    saveWorkshopCounts() {
        localStorage.setItem(
            QUOTA_CONFIG.storageKeys.workshopCount,
            JSON.stringify(this.workshopCounts)
        );
    }

    /**
     * ตรวจสอบ quota workshop
     */
    checkWorkshopQuota(workshopId) {
        const session = WORKSHOP_SESSIONS.find(s => s.id === workshopId);
        if (!session) return null;

        const current = this.workshopCounts[workshopId] || 0;
        const remaining = session.capacity - current;

        return {
            available: remaining > 0,
            capacity: session.capacity,
            current: current,
            remaining: remaining,
            session: session
        };
    }

    /**
     * เพิ่มจำนวนคนเข้า workshop
     */
    incrementWorkshopCount(workshopId) {
        const quota = this.checkWorkshopQuota(workshopId);
        if (quota && quota.available) {
            this.workshopCounts[workshopId] = (this.workshopCounts[workshopId] || 0) + 1;
            this.saveWorkshopCounts();
            return true;
        }
        return false;
    }

    /**
     * ดึงสถานะทั้งหมดของ workshop
     */
    getAllWorkshopStatus() {
        return WORKSHOP_SESSIONS.map(session => {
            const quota = this.checkWorkshopQuota(session.id);
            return {
                ...session,
                ...quota
            };
        });
    }
}

// ===========================
// UI HELPER FUNCTIONS
// ===========================

/**
 * แสดงข้อความเต็มใน workshop checkbox
 */
function updateWorkshopUI(quotaManager) {
    const workshopStatus = quotaManager.getAllWorkshopStatus();
    
    workshopStatus.forEach(workshop => {
        const checkbox = document.getElementById(workshop.id);
        if (!checkbox) return;

        const label = checkbox.nextElementSibling;
        if (!label) return;

        // ลบข้อความเตือนเก่า (ถ้ามี)
        const existingWarning = label.querySelector('.workshop-full-warning');
        if (existingWarning) {
            existingWarning.remove();
        }

        // ถ้าเต็มแล้ว
        if (!workshop.available) {
            // Disable checkbox
            checkbox.disabled = true;
            checkbox.checked = false;

            // เพิ่มข้อความเตือน
            const warning = document.createElement('span');
            warning.className = 'workshop-full-warning';
            warning.innerHTML = ' <strong style="color: #d32f2f; font-weight: 700;">จำนวนคนเข้าร่วมประชุมเต็มแล้ว</strong>';
            label.appendChild(warning);

            // เพิ่ม CSS class
            label.style.opacity = '0.6';
            label.style.textDecoration = 'line-through';
        } else {
            // แสดงจำนวนที่เหลือ
            const remaining = document.createElement('span');
            remaining.className = 'workshop-remaining';
            remaining.style.color = workshop.remaining < 20 ? '#ff9800' : '#4CAF50';
            remaining.style.fontWeight = '600';
            remaining.style.marginLeft = '8px';
            remaining.innerHTML = `(เหลืออีก ${workshop.remaining} ที่นั่ง)`;
            label.appendChild(remaining);

            // Enable checkbox
            checkbox.disabled = false;
            label.style.opacity = '1';
            label.style.textDecoration = 'none';
        }
    });
}

/**
 * แสดงสถานะ registration quota
 */
function showRegistrationQuotaStatus(quotaManager) {
    const quota = quotaManager.checkRegistrationQuota();
    
    // สร้าง element แสดงสถานะ
    const statusDiv = document.createElement('div');
    statusDiv.className = 'quota-status-banner';
    statusDiv.innerHTML = `
        <div class="quota-info">
            <span class="quota-label">จำนวนผู้ลงทะเบียน:</span>
            <span class="quota-count">${quota.current}/${quota.limit}</span>
            <span class="quota-remaining" style="color: ${quota.remaining < 50 ? '#d32f2f' : '#4CAF50'}">
                (เหลืออีก ${quota.remaining} ที่นั่ง)
            </span>
        </div>
    `;

    // แทรกก่อนฟอร์ม
    const form = document.querySelector('form');
    if (form && !document.querySelector('.quota-status-banner')) {
        form.parentNode.insertBefore(statusDiv, form);
    }

    // ถ้าเต็มแล้ว แสดง overlay
    if (!quota.available) {
        showQuotaFullOverlay(quota);
    }
}

/**
 * แสดง overlay เมื่อ quota เต็ม
 */
function showQuotaFullOverlay(quota) {
    const overlay = document.createElement('div');
    overlay.className = 'quota-full-overlay';
    overlay.innerHTML = `
        <div class="quota-full-modal">
            <div class="quota-full-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>ขออภัย การลงทะเบียนเต็มแล้ว</h2>
            <p>จำนวนผู้ลงทะเบียนได้ถึงขีดจำกัดแล้ว (${quota.limit} คน)</p>
            <p>กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามข้อมูลเพิ่มเติม</p>
            <button onclick="window.location.href='index.html'" class="btn btn-primary">
                กลับสู่หน้าหลัก
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Disable form
    const form = document.querySelector('form');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => input.disabled = true);
    }
}

/**
 * ตรวจสอบ workshop ที่เลือกก่อน submit
 */
function validateWorkshopSelection(quotaManager, selectedWorkshops) {
    const unavailableWorkshops = [];

    selectedWorkshops.forEach(workshopId => {
        const quota = quotaManager.checkWorkshopQuota(workshopId);
        if (quota && !quota.available) {
            unavailableWorkshops.push(quota.session);
        }
    });

    if (unavailableWorkshops.length > 0) {
        const workshopNames = unavailableWorkshops.map(w => 
            `${w.date} ${w.time} - ${w.topic} (${w.room})`
        ).join('\n');

        alert(`ขออภัย Workshop ต่อไปนี้เต็มแล้ว:\n\n${workshopNames}\n\nกรุณาเลือก Workshop อื่น`);
        return false;
    }

    return true;
}

// ===========================
// FORM INTEGRATION
// ===========================

/**
 * เริ่มต้นระบบ quota สำหรับแต่ละประเภทฟอร์ม
 */
function initializeQuotaSystem(registrationType) {
    const quotaManager = new QuotaManager(registrationType);

    // ตรวจสอบ registration quota
    const registrationQuota = quotaManager.checkRegistrationQuota();
    
    // แสดงสถานะ
    showRegistrationQuotaStatus(quotaManager);

    // ถ้า registration เต็ม ไม่ต้องทำอะไรต่อ
    if (!registrationQuota.available) {
        return null;
    }

    // อัพเดท workshop UI (สำหรับฟอร์ม external เท่านั้น)
    if (registrationType === 'external') {
        // รอให้ DOM โหลดเสร็จ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                updateWorkshopUI(quotaManager);
            });
        } else {
            updateWorkshopUI(quotaManager);
        }

        // Refresh workshop status ทุก 30 วินาที
        setInterval(() => {
            updateWorkshopUI(quotaManager);
        }, 30000);
    }

    return quotaManager;
}

/**
 * Handle form submission with quota check
 */
function handleFormSubmitWithQuota(event, quotaManager, registrationType) {
    // ตรวจสอบ registration quota
    const registrationQuota = quotaManager.checkRegistrationQuota();
    if (!registrationQuota.available) {
        event.preventDefault();
        alert('ขออภัย การลงทะเบียนเต็มแล้ว');
        return false;
    }

    // สำหรับฟอร์ม external ให้ตรวจสอบ workshop ด้วย
    if (registrationType === 'external') {
        const workshopYes = document.querySelector('input[name="workshopInterest"]:checked');
        
        if (workshopYes && workshopYes.value === 'yes') {
            const selectedWorkshops = Array.from(
                document.querySelectorAll('input[name="workshops"]:checked')
            ).map(cb => cb.id);

            if (selectedWorkshops.length > 0) {
                if (!validateWorkshopSelection(quotaManager, selectedWorkshops)) {
                    event.preventDefault();
                    return false;
                }

                // เพิ่มจำนวนคนเข้า workshop
                selectedWorkshops.forEach(workshopId => {
                    quotaManager.incrementWorkshopCount(workshopId);
                });
            }
        }
    }

    // เพิ่มจำนวน registration
    quotaManager.incrementRegistrationCount();

    return true;
}

// ===========================
// ADMIN FUNCTIONS
// ===========================

/**
 * Reset quota (สำหรับ admin เท่านั้น)
 */
function resetAllQuotas(adminPassword) {
    if (adminPassword !== 'RJACC2025@ADMIN') {
        console.error('Invalid admin password');
        return false;
    }

    localStorage.clear();
    alert('Reset all quotas successfully!');
    window.location.reload();
    return true;
}

/**
 * ดูสถานะ quota ทั้งหมด (สำหรับ admin)
 */
function viewAllQuotaStatus(adminPassword) {
    if (adminPassword !== 'RJACC2025@ADMIN') {
        console.error('Invalid admin password');
        return null;
    }

    const status = {
        registration: {},
        workshops: {}
    };

    // Registration counts
    ['external', 'internal', 'staff'].forEach(type => {
        const manager = new QuotaManager(type);
        status.registration[type] = manager.checkRegistrationQuota();
    });

    // Workshop counts
    const workshopManager = new QuotaManager('external');
    status.workshops = workshopManager.getAllWorkshopStatus();

    console.table(status.registration);
    console.table(status.workshops);

    return status;
}

// ===========================
// EXPORT
// ===========================

// Export สำหรับใช้ใน HTML
window.QuotaManager = QuotaManager;
window.initializeQuotaSystem = initializeQuotaSystem;
window.handleFormSubmitWithQuota = handleFormSubmitWithQuota;
window.resetAllQuotas = resetAllQuotas;
window.viewAllQuotaStatus = viewAllQuotaStatus;
window.WORKSHOP_SESSIONS = WORKSHOP_SESSIONS;
