/**
 * RJACC2025 - Download Page Handler
 * จัดการหน้าดาวน์โหลดเอกสาร, ใบประกาศ, และข้อมูลโรงแรม
 */

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupDownloadButtons();
    setupCertificateCheck();
    renderHotelList();
});

/**
 * ตั้งค่า Tab Navigation
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

/**
 * ตั้งค่าปุ่มดาวน์โหลดเอกสาร
 */
function setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const fileType = btn.dataset.file;
            downloadFile(fileType);
        });
    });
}

/**
 * ดาวน์โหลดไฟล์
 */
async function downloadFile(fileType) {
    try {
        RJACCUtils.showAlert('กำลังเตรียมไฟล์...', 'warning');
        
        // เรียก API เพื่อดาวน์โหลดไฟล์
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=downloadDocument&type=${fileType}`);
        
        if (!response.ok) {
            throw new Error('File not found');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RJACC2025_${fileType}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        RJACCUtils.showAlert('ดาวน์โหลดสำเร็จ!', 'success');
        
    } catch (error) {
        console.error('Download Error:', error);
        RJACCUtils.showAlert('ไฟล์ยังไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง', 'error');
    }
}

/**
 * ตั้งค่าการตรวจสอบใบประกาศ
 */
function setupCertificateCheck() {
    const btnCheck = document.getElementById('btnCheckCertificate');
    const certEmail = document.getElementById('certEmail');
    const certPhone = document.getElementById('certPhone');
    const resultDiv = document.getElementById('certificateResult');
    
    if (!btnCheck) return;
    
    btnCheck.addEventListener('click', async () => {
        const email = certEmail.value.trim();
        const phone = certPhone.value.trim();
        
        // Validate
        if (!email || !RJACCUtils.validateEmail(email)) {
            RJACCUtils.showAlert('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
            return;
        }
        
        if (!phone || !RJACCUtils.validatePhone(phone)) {
            RJACCUtils.showAlert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง', 'error');
            return;
        }
        
        // Check certificate
        await checkCertificate(email, phone, resultDiv);
    });
}

/**
 * ตรวจสอบสิทธิ์ใบประกาศ
 */
async function checkCertificate(email, phone, resultDiv) {
    try {
        RJACCUtils.showLoading(document.getElementById('btnCheckCertificate'));
        
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=checkCertificate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, phone })
        });
        
        if (!response.ok) {
            throw new Error('Failed to check certificate');
        }
        
        const result = await response.json();
        
        resultDiv.style.display = 'block';
        
        if (result.eligible) {
            // มีสิทธิ์
            resultDiv.innerHTML = `
                <div class="alert alert-success show">
                    <h4><i class="fas fa-check-circle"></i> คุณมีสิทธิ์รับใบประกาศ!</h4>
                    <p><strong>ชื่อ:</strong> ${result.fullName}</p>
                    <p><strong>ประเภท:</strong> ${result.registrationType}</p>
                    <p><strong>สถานะ:</strong> ${result.status}</p>
                    <button class="btn-submit" onclick="downloadCertificate('${result.certificateId}', '${result.fullName}')">
                        <i class="fas fa-download"></i> ดาวน์โหลดใบประกาศ
                    </button>
                </div>
            `;
        } else {
            // ไม่มีสิทธิ์
            resultDiv.innerHTML = `
                <div class="alert alert-warning show">
                    <h4><i class="fas fa-exclamation-triangle"></i> คุณยังไม่มีสิทธิ์รับใบประกาศ</h4>
                    <p><strong>เหตุผล:</strong> ${result.reason}</p>
                    <p><strong>สิ่งที่ต้องทำ:</strong></p>
                    <ul>
                        ${result.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Certificate Check Error:', error);
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="alert alert-error show">
                <i class="fas fa-times-circle"></i> 
                ไม่พบข้อมูลการลงทะเบียน กรุณาตรวจสอบอีเมลและเบอร์โทรศัพท์อีกครั้ง
            </div>
        `;
    } finally {
        RJACCUtils.hideLoading(document.getElementById('btnCheckCertificate'));
    }
}

/**
 * ดาวน์โหลดใบประกาศ
 */
async function downloadCertificate(certificateId, fullName) {
    try {
        RJACCUtils.showAlert('กำลังสร้างใบประกาศ...', 'warning');
        
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=downloadCertificate&id=${certificateId}`);
        
        if (!response.ok) {
            throw new Error('Failed to download certificate');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RJACC2025_Certificate_${fullName.replace(/\s/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        RJACCUtils.showAlert('ดาวน์โหลดใบประกาศสำเร็จ!', 'success');
        
    } catch (error) {
        console.error('Download Certificate Error:', error);
        RJACCUtils.showAlert('เกิดข้อผิดพลาดในการดาวน์โหลด', 'error');
    }
}

/**
 * แสดงรายชื่อโรงแรม
 */
function renderHotelList() {
    const hotelList = document.getElementById('hotelList');
    
    if (!hotelList) return;
    
    hotelList.innerHTML = CONFIG.HOTELS.map(hotel => `
        <div class="hotel-card">
            <div class="hotel-icon">
                <i class="fas fa-hotel"></i>
            </div>
            <h4>${hotel.name}</h4>
            <a href="${hotel.link}" class="btn-hotel" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-external-link-alt"></i> แบบฟอร์มจองโรงแรม
            </a>
        </div>
    `).join('');
}

// Export function for global access
window.downloadCertificate = downloadCertificate;
