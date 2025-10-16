/**
 * RJACC2025 - Staff Registration Form Handler
 * จัดการฟอร์มลงทะเบียนคณะทำงาน
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    // Elements
    const positionSelect = document.getElementById('position');
    const otherPositionField = document.getElementById('otherPositionField');
    const otherPositionInput = document.getElementById('otherPosition');
    
    const responsibilitySelect = document.getElementById('responsibility');
    const otherResponsibilityField = document.getElementById('otherResponsibilityField');
    const otherResponsibilityInput = document.getElementById('otherResponsibility');
    
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
        createWorkshopCheckboxes();
        setupConditionalFields();
        setupFormValidation();
        setupFormSubmission();
    }
    
    function createWorkshopCheckboxes() {
        workshopCheckboxes.innerHTML = '';
        
        CONFIG.WORKSHOPS.forEach((workshop) => {
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
        
        // ความรับผิดชอบ - อื่น ๆ
        responsibilitySelect.addEventListener('change', () => {
            if (responsibilitySelect.value === 'other') {
                otherResponsibilityField.classList.add('show');
                otherResponsibilityInput.setAttribute('required', '');
            } else {
                otherResponsibilityField.classList.remove('show');
                otherResponsibilityInput.removeAttribute('required');
                otherResponsibilityInput.value = '';
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
                } else {
                    workshopFields.classList.remove('show');
                    const checkboxes = workshopCheckboxes.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => cb.checked = false);
                }
            });
        });
    }
    
    function setupFormValidation() {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
    
    function validateField(field) {
        clearFieldError(field);
        
        if (!field.required) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'กรุณากรอกข้อมูลในช่องนี้';
        }
        else if (field.type === 'email' && !RJACCUtils.validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }
        else if (field.type === 'tel' && !RJACCUtils.validatePhone(field.value)) {
            isValid = false;
            errorMessage = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)';
        }
        else if (field.id === 'taxId' && field.value.length !== 13) {
            isValid = false;
            errorMessage = 'กรุณากรอกเลขผู้เสียภาษี 13 หลัก';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
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
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function setupFormSubmission() {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) {
                RJACCUtils.showAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', 'error');
                return;
            }
            
            const formData = collectFormData();
            await submitRegistration(formData);
        });
    }
    
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
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
    
    function collectFormData() {
        const formData = {
            registrationType: 'staff',
            fullName: RJACCUtils.sanitizeInput(document.getElementById('fullName').value.trim()),
            department: RJACCUtils.sanitizeInput(document.getElementById('department').value.trim()),
            position: positionSelect.value === 'other' 
                ? RJACCUtils.sanitizeInput(otherPositionInput.value.trim())
                : positionSelect.value,
            responsibility: responsibilitySelect.value === 'other'
                ? RJACCUtils.sanitizeInput(otherResponsibilityInput.value.trim())
                : responsibilitySelect.value,
            employeeId: RJACCUtils.sanitizeInput(document.getElementById('employeeId').value.trim()),
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
        
        if (workshopYes.checked) {
            const selectedCheckboxes = workshopCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
            formData.workshop.selected = Array.from(selectedCheckboxes).map(cb => cb.value);
        }
        
        return formData;
    }
    
    async function submitRegistration(formData) {
        const submitButton = form.querySelector('.btn-submit');
        
        try {
            RJACCUtils.showLoading(submitButton);
            
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
                RJACCUtils.showAlert('ลงทะเบียนสำเร็จ! ระบบได้ส่งอีเมลยืนยันไปที่อีเมลของท่านแล้ว', 'success');
                
                form.reset();
                receiptFields.classList.remove('show');
                workshopFields.classList.remove('show');
                otherPositionField.classList.remove('show');
                otherResponsibilityField.classList.remove('show');
                
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
            RJACCUtils.hideLoading(submitButton);
        }
    }
});
