/**
 * Configuration File
 * กำหนดค่าที่ใช้ทั่วทั้งระบบ
 * 
 * ⚠️ IMPORTANT: เปลี่ยนค่าเหล่านี้ก่อนใช้งานจริง
 */

const CONFIG = {
    // Google Apps Script Web App URL
    // ⚠️ ต้องแก้เป็น URL ของ Apps Script ที่ Deploy แล้ว
    API_BASE_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    
    // Google Spreadsheet ID (เก็บข้อมูล participants)
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
    
    // Google Docs Template ID (สำหรับสร้างใบประกาศ)
    TEMPLATE_DOC_ID: 'YOUR_TEMPLATE_DOC_ID',
    
    // Auto-refresh interval (milliseconds)
    AUTO_REFRESH_INTERVAL: 180000, // 3 minutes
    
    // Form URLs (Google Forms หรือฟอร์มภายใน)
    FORMS: {
        pretest: 'https://forms.gle/YOUR_PRETEST_FORM_ID',
        posttest: 'https://forms.gle/YOUR_POSTTEST_FORM_ID',
        satisfaction_day1: 'https://forms.gle/YOUR_DAY1_FORM_ID',
        satisfaction_day2: 'https://forms.gle/YOUR_DAY2_FORM_ID',
        satisfaction_day3: 'https://forms.gle/YOUR_DAY3_FORM_ID'
    },
    
    // Contact Information
    CONTACT: {
        email: 'conference@university.ac.th',
        phone: '+66 12-345-6789',
        address: 'มหาวิทยาลัยนานาชาติ | International University'
    },
    
    // Conference Details
    CONFERENCE: {
        name: 'Academic Conference 2025',
        dates: '15-17 มกราคม 2025 | January 15-17, 2025',
        location: 'มหาวิทยาลัยนานาชาติ'
    },
    
    // Validation Rules
    VALIDATION: {
        minNameLength: 3,
        maxNameLength: 100,
        maxOrgLength: 150,
        minPhoneLength: 9,
        maxPhoneLength: 10,
        maxAbstractLength: 2000,
        maxFileSize: 5 * 1024 * 1024 // 5MB
    }
};

// Freeze config to prevent accidental modification
Object.freeze(CONFIG);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
