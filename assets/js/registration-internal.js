// ===========================
// QUOTA SYSTEM INITIALIZATION
// ===========================
let quotaManager = null;

// ฟังก์ชันสำหรับแสดง/ซ่อนฟิลด์ตามเงื่อนไข
document.addEventListener('DOMContentLoaded', function() {
    
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
    
    // ========== 4. Validation ฟอร์ม + Quota Check ==========
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // ===========================
            // QUOTA VALIDATION
            // ===========================
            if (!handleFormSubmitWithQuota(e, quotaManager, 'internal')) {
                return;
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
                
                // ส่งข้อมูลไปยังเซิร์ฟเวอร์ (ปรับแต่ง URL ตามจริง)
                setTimeout(() => {
                    alert('แบบฟอร์มถูกส่งเรียบร้อยแล้ว!\n(ในการใช้งานจริง ข้อมูลจะถูกส่งไปยังเซิร์ฟเวอร์)');
                    form.reset();
                    
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
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
                })
                .catch(error => {
                    alert('เกิดข้อผิดพลาด: ' + error.message);
                });
                */
            }
        });
    }
    
    // ========== 5. เริ่มต้น - ซ่อนฟิลด์ที่เป็น conditional ==========
    if (otherAffiliationField) otherAffiliationField.style.display = 'none';
    if (otherPositionField) otherPositionField.style.display = 'none';
    if (otherFoodTypeField) otherFoodTypeField.style.display = 'none';
    
    // ===========================
    // INITIALIZE QUOTA SYSTEM (ทำงานหลังจาก setup UI events)
    // ===========================
    quotaManager = initializeQuotaSystem('internal');
    
    if (!quotaManager) {
        console.warn('Registration is full or quota manager failed to initialize');
    }
});
