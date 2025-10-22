/**
 * RJACC2025 Configuration File
 * ไฟล์กำหนดค่าสำหรับระบบ
 */

const CONFIG = {
    // Google Apps Script API URL
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycby8sCFIMGdeAUQUjo1ThgSpP-039trhQxgWKh6detFWQapOrT7VRUCnSn7IT2jvE5kx/exec',
    
    // ข้อมูลการประชุม
    EVENT_INFO: {
        name: 'RJACC2025',
        fullName: 'Rajavithi Academic Conference on Cardiac Care 2025',
        dates: '21-23 มกราคม 2569',
        location: 'โรงพยาบาลราชวิถี',
        organizer: 'ศูนย์ความเป็นเลิศทางการแพทย์เฉพาะทาง ด้านโรคหัวใจและหลอดเลือด'
    },
    
    // ตั้งค่า Slider
    SLIDER_CONFIG: {
        autoPlayInterval: 5000, // 5 วินาที
        transitionDuration: 800 // 0.8 วินาที
    },
    
    // ตั้งค่า Dashboard
    DASHBOARD_CONFIG: {
        autoRefreshInterval: 180000, // 3 นาที
        itemsPerPage: 20
    },
    
    // สี Theme
    THEME_COLORS: {
        primary: '#471D55',
        external: '#4CAF50',
        internal: '#E91E63',
        staff: '#E91E63'
    },
    
    // ข้อมูลติดต่อ
    CONTACT_INFO: {
        coordinator: {
            name: 'นายณัฐชัย  รัศมีดารา',
            position: 'ผู้ช่วยพยาบาล',
            phone: ['065-8964590', '082-5803334'],
            email: 'info.nst@rajavithi.go.th'
        },
        hospital: {
            name: 'โรงพยาบาลราชวิถี กรมการแพทย์',
            department: 'งานถ่ายทอดการพยาบาล กลุ่มงานวิชาการพยาบาล',
            address: 'เลขที่ 2 ชั้น 9 อาคารเฉลิมพระเกียรติฯ ถนนพญาไท แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400',
            phone: '02-260-2900 ต่อ 78042',
            email: 'info.nst@rajavithi.go.th'
        }
    },
    
    // Workshop Options
    WORKSHOPS: [
        {
            id: 'ws1',
            date: 'วันพุธที่ 21 มกราคม 2569',
            time: 'ช่วงบ่าย 13.00-16.00',
            topic: 'MIS CVT',
            room: 'ห้องประชุมโยธี'
        },
        {
            id: 'ws2',
            date: 'วันพุธที่ 21 มกราคม 2569',
            time: 'ช่วงบ่าย 13.00-16.00',
            topic: 'Cath Lab',
            room: 'ห้องประชุมราชพฤกษ์'
        },
        {
            id: 'ws3',
            date: 'วันพุธที่ 21 มกราคม 2569',
            time: 'ช่วงบ่าย 13.00-16.00',
            topic: 'Crisis management',
            room: 'ห้องประชุมสุพรรณิการ์'
        },
        {
            id: 'ws4',
            date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
            time: 'ช่วงเช้า 08.00-12.00',
            topic: 'Workshop CVT',
            room: 'ห้องประชุมโยธี'
        },
        {
            id: 'ws5',
            date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
            time: 'ช่วงบ่าย 13.00-16.00',
            topic: 'Workshop CVT',
            room: 'ห้องประชุมโยธี'
        },
        {
            id: 'ws6',
            date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
            time: 'ช่วงเช้า 08.00-16.00',
            topic: '……….',
            room: 'ห้องประชุมราชพฤกษ์'
        },
        {
            id: 'ws7',
            date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
            time: 'ช่วงบ่าย 13.00-16.00',
            topic: 'กายภาพบำบัด',
            room: 'ห้องประชุมราชพฤกษ์'
        },
        {
            id: 'ws8',
            date: 'วันพฤหัสบดีที่ 22 มกราคม 2569',
            time: 'ช่วงเช้า 08.00-12.00',
            topic: 'เภสัชกร',
            room: 'ห้องประชุมสุพรรณิการ์'
        },
        {
            id: 'ws9',
            date: 'วันศุกร์ที่ 23 มกราคม 2569',
            time: 'ช่วงเช้า 08.00-12.00',
            topic: 'โภชนาการ',
            room: 'ห้องประชุมโยธี'
        },
        {
            id: 'ws10',
            date: 'วันศุกร์ที่ 23 มกราคม 2569',
            time: 'ช่วงเช้า 08.00-12.00',
            topic: 'นำเสนอผลงานวิชาการทางการพยาบาล/Innovation+CQI ทางการพยาบาล',
            room: 'ห้องประชุมราชพฤกษ์'
        },
        {
            id: 'ws11',
            date: 'วันศุกร์ที่ 23 มกราคม 2569',
            time: 'ช่วงเช้า 08.00-12.00',
            topic: 'การจัดการเครื่องมือแพทย์',
            room: 'ห้องประชุมสุพรรณิการ์'
        }
    ],
    
    // Google Forms URLs (แก้ไข URLs เหล่านี้)
    FORMS: {
        preTest: 'https://forms.gle/YOUR_PRETEST_FORM_ID',
        postTest: 'https://forms.gle/YOUR_POSTTEST_FORM_ID',
        satisfactionDay1: 'https://forms.gle/YOUR_DAY1_FORM_ID',
        satisfactionDay2: 'https://forms.gle/YOUR_DAY2_FORM_ID',
        satisfactionDay3: 'https://forms.gle/YOUR_DAY3_FORM_ID'
    },
    
    // Hotel List (เพิ่มข้อมูลโรงแรม)
    HOTELS: [
        {
            id: 1,
            name: 'โรงแรม Asia Hotel',
            link: 'https://drive.google.com/file/d/1epTKlThKBGyElXG4F5agN_MgaPUPjYaS/view?usp=sharing'
        },
        {
            id: 2,
            name: 'โรงแรม Centurypark Hotel',
            link: 'https://drive.google.com/file/d/12lNzwkf_zC282WfbV2JeNfbkedDafV56/view?usp=sharing'
        },
        {
            id: 3,
            name: 'โรงแรมที่ 3',
            link: 'https://example.com/hotel3'
        },
        {
            id: 4,
            name: 'โรงแรมที่ 4',
            link: 'https://example.com/hotel4'
        },
        {
            id: 5,
            name: 'โรงแรมที่ 5',
            link: 'https://example.com/hotel5'
        },
        {
            id: 6,
            name: 'โรงแรมที่ 6',
            link: 'https://example.com/hotel6'
        },
        {
            id: 7,
            name: 'โรงแรมที่ 7',
            link: 'https://example.com/hotel7'
        },
        {
            id: 8,
            name: 'โรงแรมที่ 8',
            link: 'https://example.com/hotel8'
        },
        {
            id: 9,
            name: 'โรงแรมที่ 9',
            link: 'https://example.com/hotel9'
        },
        {
            id: 10,
            name: 'โรงแรมที่ 10',
            link: 'https://example.com/hotel10'
        }
    ]
};

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
