// ===========================
// QUOTA SYSTEM INITIALIZATION
// ===========================
let quotaManager = null;

// เริ่มต้น Quota Manager
document.addEventListener('DOMContentLoaded', function() {
    // สร้าง Quota Manager สำหรับบุคลากรภายนอก
    quotaManager = initializeQuotaSystem('external');
    
    if (!quotaManager) {
        console.warn('Registration is full or quota manager failed to initialize');
        return;
    }
    
    // ===========================
    // EXISTING CODE - ฟังก์ชันสำหรับแสดง/ซ่อนฟิลด์ตามเงื่อนไข
    // ===========================
    
    // ========== 1. จัดการสังกัดอื่นๆ ==========
    const affiliationSelect = document.getElementById('affiliation');
    const otherAffiliationField = document.getElementById('affiliation_other');
    
    if (affiliationSelect && otherAffiliationField) {
        affiliationSelect.addEventListener('change', function() {
            if (this.value === 'อื่นๆ') {
                otherAffiliationField.style.display = 'block';
                otherAffiliationField.required = true;
            } else {
                otherAffiliationField.style.display = 'none';
                otherAffiliationField.required = false;
                otherAffiliationField.value = '';
            }
        });
    }
    
    // ========== 2. จัดการตำแหน่งอื่นๆ ==========
    const positionSelect = document.getElementById('position');
    const otherPositionField = document.getElementById('position_other');
    
    if (positionSelect && otherPositionField) {
        positionSelect.addEventListener('change', function() {
            if (this.value === 'อื่นๆ') {
                otherPositionField.style.display = 'block';
                otherPositionField.required = true;
            } else {
                otherPositionField.style.display = 'none';
                otherPositionField.required = false;
                otherPositionField.value = '';
            }
        });
    }
    
    // ========== 3. จัดการประเภทอาหารอื่นๆ ==========
    const foodTypeSelect = document.getElementById('foodType');
    const otherFoodTypeField = document.getElementById('food_other');
    
    if (foodTypeSelect && otherFoodTypeField) {
        foodTypeSelect.addEventListener('change', function() {
            if (this.value === 'อื่นๆ') {
                otherFoodTypeField.style.display = 'block';
                otherFoodTypeField.required = true;
            } else {
                otherFoodTypeField.style.display = 'none';
                otherFoodTypeField.required = false;
                otherFoodTypeField.value = '';
            }
        });
    }
    
    // ========== 4. จัดการใบเสร็จ ==========
    const receiptYes = document.getElementById('receiptYes');
    const receiptNo = document.getElementById('receiptNo');
    const receiptFields = document.getElementById('receiptFields');
    const receiptNameInput = document.getElementById('receiptName');
    const receiptAddressInput = document.getElementById('receiptAddress');
    
    function toggleReceiptFields() {
        if (receiptYes && receiptYes.checked) {
            receiptFields.style.display = 'block';
            receiptNameInput.required = true;
            receiptAddressInput.required = true;
        } else {
            receiptFields.style.display = 'none';
            receiptNameInput.required = false;
            receiptAddressInput.required = false;
            receiptNameInput.value = '';
            receiptAddressInput.value = '';
        }
    }
    
    if (receiptYes) {
        receiptYes.addEventListener('change', toggleReceiptFields);
    }
    if (receiptNo) {
        receiptNo.addEventListener('change', toggleReceiptFields);
    }
    
    // ========== 5. จัดการ Workshop ==========
    const workshopYes = document.getElementById('workshopYes');
    const workshopNo = document.getElementById('workshopNo');
    const workshopFields = document.getElementById('workshopFields');
    const workshopCheckboxes = document.querySelectorAll('input[name="workshops"]');
    
    function toggleWorkshopFields() {
        if (workshopYes && workshopYes.checked) {
            workshopFields.style.display = 'block';
            // อัปเดท UI ของ workshop
            updateWorkshopUI(quotaManager);
        } else {
            workshopFields.style.display = 'none';
            // ยกเลิกการเลือก checkbox ทั้งหมด
            workshopCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    }
    
    if (workshopYes) {
        workshopYes.addEventListener('change', toggleWorkshopFields);
    }
    if (workshopNo) {
        workshopNo.addEventListener('change', toggleWorkshopFields);
    }
    
    // ========== 6. Validation ฟอร์ม + Quota Check ==========
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // ===========================
            // QUOTA VALIDATION
            // ===========================
            if (!handleFormSubmitWithQuota(e, quotaManager, 'external')) {
                return;
            }
            
            // ===========================
            // EXISTING VALIDATION
            // ===========================
            
            // ตรวจสอบว่าถ้าเลือก "ต้องการเข้าร่วม Workshop" ต้องเลือกอย่างน้อย 1 workshop
            if (workshopYes && workshopYes.checked) {
                const selectedWorkshops = Array.from(workshopCheckboxes).filter(cb => cb.checked);
                if (selectedWorkshops.length === 0) {
                    alert('กรุณาเลือก Workshop อย่างน้อย 1 หัวข้อ');
                    return;
                }
            }
            
            // ตรวจสอบเบอร์โทรศัพท์
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                const phonePattern = /^[0-9]{10}$/;
                if (!phonePattern.test(phoneInput.value)) {
                    alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
                    phoneInput.focus();
                    return;
                }
            }
            
            // ตรวจสอบไฟล์หลักฐานการชำระเงิน
            const paymentProofInput = document.getElementById('paymentProof');
            if (paymentProofInput && paymentProofInput.files.length === 0) {
                alert('กรุณาแนบหลักฐานการชำระเงิน');
                paymentProofInput.focus();
                return;
            }
            
            // ตรวจสอบนามสกุลไฟล์
            if (paymentProofInput && paymentProofInput.files.length > 0) {
                const allowedExtensions = ['png', 'jpg', 'jpeg'];
                const fileName = paymentProofInput.files[0].name;
                const fileExtension = fileName.split('.').pop().toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    alert('กรุณาแนบไฟล์ประเภท PNG หรือ JPG เท่านั้น');
                    paymentProofInput.focus();
                    return;
                }
            }
            
            // ถ้าผ่านทุกการตรวจสอบ
            if (confirm('คุณต้องการส่งแบบฟอร์มนี้หรือไม่?')) {
                // แสดง loading state
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
                
                // รวบรวมข้อมูล
                const formData = new FormData(form);
                
                // แสดงข้อมูลที่จะส่ง (สำหรับทดสอบ)
                console.log('=== ข้อมูลที่จะส่ง ===');
                for (let [key, value] of formData.entries()) {
                    console.log(key + ': ' + value);
                }
                
                // รวมข้อมูล workshops ที่เลือก
                const selectedWorkshops = Array.from(workshopCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                console.log('Workshops ที่เลือก:', selectedWorkshops);
                
                // ===========================
                // SUCCESS - อัปเดต Quota
                // ===========================
                // Quota ได้ถูกอัปเดตแล้วใน handleFormSubmitWithQuota
                
                // ส่งข้อมูลไปยังเซิร์ฟเวอร์ (ปรับแต่ง URL ตามจริง)
                setTimeout(() => {
                    alert('แบบฟอร์มถูกส่งเรียบร้อยแล้ว!\n(ในการใช้งานจริง ข้อมูลจะถูกส่งไปยังเซิร์ฟเวอร์)');
                    
                    // รีเซ็ต form
                    form.reset();
                    
                    // รีเซ็ต loading state
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                    
                    // รีโหลดหน้าเพื่ออัปเดตสถานะ
                    // window.location.reload();
                }, 1000);
                
                // สามารถใช้ fetch API เพื่อส่งข้อมูล
                /*
                fetch('your-api-endpoint.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    alert('ลงทะเบียนสำเร็จ!');
                    form.reset();
                    window.location.reload();
                })
                .catch(error => {
                    alert('เกิดข้อผิดพลาด: ' + error.message);
                    // รีเซ็ต loading state
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                });
                */
            }
        });
    }
    
    // ========== 7. เริ่มต้น - ซ่อนฟิลด์ที่เป็น conditional ==========
    if (otherAffiliationField) otherAffiliationField.style.display = 'none';
    if (otherPositionField) otherPositionField.style.display = 'none';
    if (otherFoodTypeField) otherFoodTypeField.style.display = 'none';
    if (receiptFields) receiptFields.style.display = 'none';
    if (workshopFields) workshopFields.style.display = 'none';
});
