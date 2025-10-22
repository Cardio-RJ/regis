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
    
    // ========== 4. จัดการ Workshop ==========
    const workshopYes = document.getElementById('workshopYes');
    const workshopNo = document.getElementById('workshopNo');
    const workshopFields = document.getElementById('workshopFields');
    const workshopCheckboxes = document.querySelectorAll('input[name="workshops"]');
    
    function toggleWorkshopFields() {
        if (workshopYes && workshopYes.checked) {
            workshopFields.style.display = 'block';
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
    
    // ========== 5. Validation ฟอร์ม ==========
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            
            // ถ้าผ่านทุกการตรวจสอบ
            if (confirm('คุณต้องการส่งแบบฟอร์มนี้หรือไม่?')) {
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
                
                // ส่งข้อมูลไปยังเซิร์ฟเวอร์ (ปรับแต่ง URL ตามจริง)
                alert('แบบฟอร์มถูกส่งเรียบร้อยแล้ว!\n(ในการใช้งานจริง ข้อมูลจะถูกส่งไปยังเซิร์ฟเวอร์)');
                
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
    
    // ========== 6. เริ่มต้น - ซ่อนฟิลด์ที่เป็น conditional ==========
    if (otherAffiliationField) otherAffiliationField.style.display = 'none';
    if (otherPositionField) otherPositionField.style.display = 'none';
    if (otherFoodTypeField) otherFoodTypeField.style.display = 'none';
    if (workshopFields) workshopFields.style.display = 'none';
});
