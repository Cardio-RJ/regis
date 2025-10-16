 
Registration external · JS
Download

/**
 * RJACC2025 - External Registration Form Handler
 * จัดการฟอร์มลงทะเบียนบุคลากรภายนอก
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    // Elements
    const positionSelect = document.getElementById('position');
    const otherPositionField = document.getElementById('otherPositionField');
    const otherPositionInput = document.getElementById('otherPosition');
    
    const receiptYes = document.getElementById('receiptYes');
    const receiptNo = document.getElementById('receiptNo');
    const receiptFields = document.getElementById('receiptFields');
    const receiptName = document.getElementById('receiptName');
    const receiptAddress = document.getElementById('receiptAddress');
    const taxId = document.getElementById('taxId');
    
    const workshopYes = document.getElementById('workshopYes');
    const workshopNo = document.getElementById('workshopNo');
    const workshopFields = document.getElementById('workshopFields');
    const workshopCheckboxes = document.getElementById('workshopCheckboxes');
    
    // Initialize
    init();
    
    function init() {
        // สร้าง Workshop Checkboxes
        createWorkshopCheckboxes();
        
        // Event Listeners
        setupConditionalFields();
        setupFormValidation();
        setupFormSubmission();
    }
    
    /**
     * สร้าง Workshop Checkboxes จาก CONFIG
     */
    function createWorkshopCheckboxes() {
        workshopCheckboxes.innerHTML = '';
        
        CONFIG.WORKSHOPS.forEach((workshop, index) => {
            const checkboxOption = document.createElement('div');
            checkboxOption.className = 'checkbox-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `workshop_${workshop.id}`;
            checkbox.name = 'workshops';
            checkbox.value = workshop.id;
            
            const label = document.createElement('label');
            label.htmlFor = `workshop_${workshop.id}`;
            label.innerHTML = `<strong>${workshop.date}</strong> ${workshop.time}<br>
                               Topic: ${workshop.topic} - ${workshop.room}`;
            
            checkboxOption.appendChild(checkbox);
            checkboxOption.appendChild(label);
            workshopCheckboxes.appendChild(checkboxOption);
        });
    }
    
    /**
     * ตั้งค่า Conditional Fields
     */
    function setupConditionalFields() {
        // ตำแหน่ง - อื่น ๆ
        positionSelect.addEventListener('change', () => {
            if (positionSelect.value === 'other') {
                otherPositionField.classList.add('show');
                otherPositionInput.setAttribute('required', '');
            } else {
                otherPositionField.classList.remove('show');
                otherPositionInput.removeAttribute('required');
                otherPositionInput.value = '';
            }
        });
        
        // ใบเสร็จ
        [receiptYes, receiptNo].forEach(radio => {
            radio.addEventListener('change', () => {
                if (receiptYes.checked) {
                    receiptFields.classList.add('show');
                    receiptName.setAttribute('required', '');
                    receiptAddress.setAttribute('required', '');
                    taxId.setAttribute('required', '');
                } else {
                    receiptFields.classList.remove('show');
                    receiptName.removeAttribute('required');
                    receiptAddress.removeAttribute('required');
                    taxId.removeAttribute('required');
                    receiptName.value = '';
                    receiptAddress.value = '';
                    taxId.value = '';
                }
            });
        });
        
        // Workshop
        [workshopYes, workshopNo].forEach(radio => {
            radio.addEventListener('change', () => {
                if (workshopYes.checked) {
                    workshopFields.classList.add('show');
                    // ไม่บังคับให้เลือก workshop (optional)
                } else {
                    workshopFields.classList.remove('show');
                    // ยกเลิกการเลือก checkboxes ทั้งหมด
                    const checkboxes = workshopCheckboxes.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => cb.checked = false);
                }
            });
        });
    }
    
    /**
     * ตั้งค่า Form Validation
     */
    function setupFormValidation() {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
    
    /**
     * Validate Field
     */
    function validateField(field) {
        clearFieldError(field);
        
        if (!field.required) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // ตรวจสอบว่ากรอกข้อมูลหรือยัง
        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'กรุณากรอกข้อมูลในช่องนี้';
        }
        // ตรวจสอบ Email
        else if (field.type === 'email' && !RJACCUtils.validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }
        // ตรวจสอบเบอร์โทร
        else if (field.type === 'tel' && !RJACCUtils.validatePhone(field.value)) {
            isValid = false;
            errorMessage = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)';
        }
        // ตรวจสอบเลขผู้เสียภาษี
        else if (field.id === 'taxId' && field.value.length !== 13) {
            isValid = false;
            errorMessage = 'กรุณากรอกเลขผู้เสียภาษี 13 หลัก';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    /**
     * แสดง Error บน Field
     */
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorDiv = field.parentElement.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
    
    /**
     * ลบ Error จาก Field
     */
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    /**
     * ตั้งค่า Form Submission
     */
    function setupFormSubmission() {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate Form
            if (!validateForm()) {
                RJACCUtils.showAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', 'error');
                return;
            }
            
            // Collect Form Data
            const formData = collectFormData();
            
            // Submit to API
            await submitRegistration(formData);
        });
    }
    
    /**
     * Validate Form
     */
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // ตรวจสอบ Radio Groups
        const receiptChecked = receiptYes.checked || receiptNo.checked;
        if (!receiptChecked) {
            RJACCUtils.showAlert('กรุณาเลือกความต้องการรับใบเสร็จ', 'error');
            isValid = false;
        }
        
        const workshopChecked = workshopYes.checked || workshopNo.checked;
        if (!workshopChecked) {
            RJACCUtils.showAlert('กรุณาเลือกความต้องการเข้าร่วม Workshop', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Collect Form Data
     */
    function collectFormData() {
        const formData = {
            registrationType: 'external',
            fullName: RJACCUtils.sanitizeInput(document.getElementById('fullName').value.trim()),
            organization: RJACCUtils.sanitizeInput(document.getElementById('organization').value.trim()),
            position: positionSelect.value === 'other' 
                ? RJACCUtils.sanitizeInput(otherPositionInput.value.trim())
                : positionSelect.value,
            email: document.getElementById('email').value.trim().toLowerCase(),
            phone: document.getElementById('phone').value.trim(),
            receipt: {
                want: receiptYes.checked,
                name: receiptYes.checked ? RJACCUtils.sanitizeInput(receiptName.value.trim()) : '',
                address: receiptYes.checked ? RJACCUtils.sanitizeInput(receiptAddress.value.trim()) : '',
                taxId: receiptYes.checked ? taxId.value.trim() : ''
            },
            workshop: {
                interested: workshopYes.checked,
                selected: []
            },
            specialNeeds: RJACCUtils.sanitizeInput(document.getElementById('specialNeeds').value.trim()),
            timestamp: new Date().toISOString()
        };
        
        // Collect Selected Workshops
        if (workshopYes.checked) {
            const selectedCheckboxes = workshopCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
            formData.workshop.selected = Array.from(selectedCheckboxes).map(cb => cb.value);
        }
        
        return formData;
    }
    
    /**
     * Submit Registration to API
     */
    async function submitRegistration(formData) {
        const submitButton = form.querySelector('.btn-submit');
        
        try {
            // แสดง Loading
            RJACCUtils.showLoading(submitButton);
            
            // เรียก API
            const response = await fetch(`${CONFIG.API_BASE_URL}?route=register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            
            if (result.success) {
                // แสดงความสำเร็จ
                RJACCUtils.showAlert('ลงทะเบียนสำเร็จ! ระบบได้ส่งอีเมลยืนยันไปที่อีเมลของท่านแล้ว', 'success');
                
                // Reset Form
                form.reset();
                receiptFields.classList.remove('show');
                workshopFields.classList.remove('show');
                otherPositionField.classList.remove('show');
                
                // Redirect หลัง 3 วินาที
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                throw new Error(result.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
            }
            
        } catch (error) {
            console.error('Registration Error:', error);
            RJACCUtils.showAlert('เกิดข้อผิดพลาด: ' + error.message, 'error');
        } finally {
            // ซ่อน Loading
            RJACCUtils.hideLoading(submitButton);
        }
    }
});

// Add CSS for field errors
const style = document.createElement('style');
style.textContent = `
    .field-error {
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: #f44336 !important;
    }
`;
document.head.appendChild(style);
