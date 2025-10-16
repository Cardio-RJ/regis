/**
 * RJACC2025 - Testing & Evaluation Handler
 * จัดการเปิดลิงก์ Google Forms สำหรับแบบทดสอบและแบบประเมิน
 */

document.addEventListener('DOMContentLoaded', () => {
    setupTestingButtons();
});

function setupTestingButtons() {
    // Pre-test
    const btnPretest = document.getElementById('btnPretest');
    if (btnPretest) {
        btnPretest.addEventListener('click', (e) => {
            e.preventDefault();
            openForm('preTest', 'Pre-test');
        });
    }
    
    // Post-test
    const btnPosttest = document.getElementById('btnPosttest');
    if (btnPosttest) {
        btnPosttest.addEventListener('click', (e) => {
            e.preventDefault();
            openForm('postTest', 'Post-test');
        });
    }
    
    // Day 1 Satisfaction
    const btnDay1 = document.getElementById('btnDay1');
    if (btnDay1) {
        btnDay1.addEventListener('click', (e) => {
            e.preventDefault();
            openForm('satisfactionDay1', 'แบบประเมินความพึงพอใจ DAY 1');
        });
    }
    
    // Day 2 Satisfaction
    const btnDay2 = document.getElementById('btnDay2');
    if (btnDay2) {
        btnDay2.addEventListener('click', (e) => {
            e.preventDefault();
            openForm('satisfactionDay2', 'แบบประเมินความพึงพอใจ DAY 2');
        });
    }
    
    // Day 3 Satisfaction
    const btnDay3 = document.getElementById('btnDay3');
    if (btnDay3) {
        btnDay3.addEventListener('click', (e) => {
            e.preventDefault();
            openForm('satisfactionDay3', 'แบบประเมินความพึงพอใจ DAY 3');
        });
    }
}

/**
 * เปิด Google Form
 */
function openForm(formType, formTitle) {
    const formUrl = CONFIG.FORMS[formType];
    
    if (!formUrl || formUrl.includes('YOUR_')) {
        RJACCUtils.showAlert(
            `ขออภัย ลิงก์ ${formTitle} ยังไม่พร้อมใช้งาน กรุณาติดต่อเจ้าหน้าที่`,
            'warning'
        );
        return;
    }
    
    // เปิดใน tab ใหม่
    window.open(formUrl, '_blank', 'noopener,noreferrer');
    
    // แสดงข้อความแจ้งเตือน
    RJACCUtils.showAlert(
        `กำลังเปิด ${formTitle} ในหน้าต่างใหม่`,
        'success'
    );
}

/**
 * ตรวจสอบสถานะการทำแบบทดสอบ (Optional)
 * สามารถเชื่อมต่อกับ API เพื่อตรวจสอบว่าผู้ใช้ทำแบบทดสอบแล้วหรือยัง
 */
async function checkTestingStatus(email) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=checkTestingStatus&email=${email}`);
        
        if (!response.ok) {
            throw new Error('Failed to check status');
        }
        
        const result = await response.json();
        
        return {
            preTest: result.preTest || false,
            postTest: result.postTest || false,
            satisfactionDay1: result.satisfactionDay1 || false,
            satisfactionDay2: result.satisfactionDay2 || false,
            satisfactionDay3: result.satisfactionDay3 || false
        };
        
    } catch (error) {
        console.error('Check Testing Status Error:', error);
        return null;
    }
}

/**
 * แสดงสถานะการทำแบบทดสอบ (Optional)
 */
function displayTestingStatus(status) {
    if (!status) return;
    
    const cards = document.querySelectorAll('.testing-card');
    
    cards.forEach(card => {
        const btn = card.querySelector('[data-form-type]');
        if (!btn) return;
        
        const formType = btn.dataset.formType;
        
        if (status[formType]) {
            // ทำแล้ว - แสดงเครื่องหมายถูก
            card.classList.add('completed');
            
            const completedBadge = document.createElement('div');
            completedBadge.className = 'completed-badge';
            completedBadge.innerHTML = '<i class="fas fa-check-circle"></i> ทำแล้ว';
            card.appendChild(completedBadge);
            
            btn.innerHTML = '<i class="fas fa-redo"></i> ทำอีกครั้ง';
        }
    });
}
