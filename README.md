# 🏥 RJACC2025 - ระบบประชุมวิชาการออนไลน์

ระบบลงทะเบียนและจัดการประชุมวิชาการ Rajavithi Academic Conference on Cardiac Care 2025

## 📋 สารบัญ

- [คุณสมบัติหลัก](#คุณสมบัติหลัก)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [การติดตั้ง](#การติดตั้ง)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [การใช้งาน](#การใช้งาน)
- [การ Deploy](#การ-deploy)
- [FAQ](#faq)

---

## 🌟 คุณสมบัติหลัก

### ✅ ระบบลงทะเบียน (3 ประเภท)
- **บุคลากรภายนอก** (สีเขียว #4CAF50)
- **บุคลากรภายใน** (สีชมพู #E91E63)
- **คณะทำงาน** (สีชมพู #E91E63)

### 📊 Dashboard
- แสดงสถิติแบบ Real-time
- แยกรายชื่อตามประเภท
- Workshop Dashboard
- Auto-refresh ทุก 3 นาที
- Export Excel/PDF

### 📝 Testing & Evaluation
- Pre-test และ Post-test
- แบบประเมินความพึงพอใจ 3 วัน
- เชื่อมต่อ Google Forms

### 📥 ศูนย์ดาวน์โหลด
- เอกสารประกอบการประชุม
- ใบประกาศผู้เข้าร่วม
- แบบฟอร์มห้องพัก (10 โรงแรม)

### 🎨 UI/UX Features
- สี Theme: #471D55 (ม่วง)
- สไลด์รูปภาพอัตโนมัติ (20 รูป + 5 รูป)
- Responsive Design
- Font: Sarabun
- Icon: Font Awesome

---

## 🛠 เทคโนโลยีที่ใช้

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Email:** Gmail API
- **Hosting:** GitHub Pages
- **No Dependencies:** ไม่ต้องติดตั้งอะไรเพิ่ม!

---

## 📦 การติดตั้ง

### 1. เตรียม Google Sheets

1. สร้าง Google Spreadsheet ใหม่
2. สร้าง Sheets ดังนี้:
   - `Registrations` - เก็บข้อมูลผู้ลงทะเบียน
   - `Certificates` - เก็บข้อมูลใบประกาศ
   - `WorkshopTracking` - ติดตาม Workshop

3. คัดลอก **Spreadsheet ID** จาก URL
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

### 2. ตั้งค่า Google Apps Script

1. เปิด Google Sheets > Extensions > Apps Script
2. ลบโค้ดเดิมออก
3. วาง Code จากไฟล์ `Code.gs`
4. แก้ไข CONFIG:
   ```javascript
   SPREADSHEET_ID: 'ใส่ ID ของคุณ',
   EMAIL_FROM: 'อีเมลของคุณ',
   BASE_URL: 'https://your-username.github.io/rjacc2025'
   ```

5. Deploy:
   - คลิก Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - คัดลอก **Web App URL**

### 3. ตั้งค่า Frontend

1. แก้ไขไฟล์ `assets/js/config.js`:
   ```javascript
   API_BASE_URL: 'ใส่ Web App URL ที่ได้จากขั้นตอน 2'
   ```

2. แก้ไข FORMS URLs (Google Forms):
   ```javascript
   FORMS: {
       preTest: 'https://forms.gle/YOUR_FORM_ID',
       postTest: 'https://forms.gle/YOUR_FORM_ID',
       satisfactionDay1: 'https://forms.gle/YOUR_FORM_ID',
       satisfactionDay2: 'https://forms.gle/YOUR_FORM_ID',
       satisfactionDay3: 'https://forms.gle/YOUR_FORM_ID'
   }
   ```

3. แก้ไข HOTELS (10 โรงแรม):
   ```javascript
   HOTELS: [
       { id: 1, name: 'โรงแรมที่ 1', link: 'URL' },
       // ... เพิ่ม 10 โรงแรม
   ]
   ```

### 4. เพิ่มรูปภาพ

1. สร้างโฟลเดอร์ `assets/images/`
2. เพิ่มไฟล์:
   - `logo.png` - โลโก้
   - `banner.jpg` - แบนเนอร์
   - `slide-1.jpg` ถึง `slide-20.jpg` - สไลด์หลัก
   - `vertical-1.jpg` ถึง `vertical-5.jpg` - สไลด์รายละเอียด

---

## 📁 โครงสร้างโปรเจกต์

```
rjacc2025/
├── index.html                  # หน้าแรก
├── registration-external.html  # ฟอร์มบุคลากรภายนอก
├── registration-internal.html  # ฟอร์มบุคลากรภายใน
├── registration-staff.html     # ฟอร์มคณะทำงาน
├── dashboard.html             # Dashboard + Workshop Dashboard
├── testing.html               # Testing & Evaluation
├── download.html              # ศูนย์ดาวน์โหลด
├── contact.html               # ติดต่อเรา
│
├── assets/
│   ├── css/
│   │   └── rjacc-styles.css   # CSS หลัก (สี Theme ทั้งหมด)
│   │
│   ├── js/
│   │   ├── config.js          # ⚙️ Configuration (แก้ตรงนี้!)
│   │   ├── navigation.js      # Navigation + Utilities
│   │   ├── slider.js          # Image Slider (auto 5 วินาที)
│   │   ├── registration-external.js
│   │   ├── registration-internal.js
│   │   ├── registration-staff.js
│   │   ├── dashboard.js       # Dashboard + Auto-refresh
│   │   ├── testing.js         # Testing & Evaluation
│   │   └── download.js        # Download + Certificate
│   │
│   └── images/
│       ├── logo.png
│       ├── banner.jpg
│       └── slides/
│
└── Code.gs                    # Google Apps Script Backend
```

---

## 🚀 การใช้งาน

### สำหรับผู้ลงทะเบียน

1. เลือกประเภทการลงทะเบียน (บุคลากรภายนอก/ภายใน/คณะทำงาน)
2. กรอกแบบฟอร์ม:
   - ข้อมูลส่วนตัว
   - เลือกรับใบเสร็จ (ถ้าต้องการ)
   - เลือก Workshop (ได้มากกว่า 1)
3. ส่งแบบฟอร์ม → รับอีเมลยืนยัน

### สำหรับเจ้าหน้าที่

1. **Dashboard:**
   - ดูสถิติ Real-time
   - กรองและค้นหา
   - Export Excel/PDF
   - Workshop Dashboard

2. **Testing & Evaluation:**
   - ติดตาม Pre/Post-test
   - ประเมินความพึงพอใจ

3. **Download:**
   - จัดการเอกสาร
   - ตรวจสอบสิทธิ์ใบประกาศ
   - รายชื่อโรงแรม

---

## 🌐 การ Deploy

### GitHub Pages

1. สร้าง Repository ใหม่บน GitHub
2. Upload ไฟล์ทั้งหมด (ยกเว้น Code.gs)
3. Settings > Pages
4. Source: Deploy from a branch
5. Branch: main / root
6. Save

เว็บจะอยู่ที่: `https://your-username.github.io/rjacc2025`

### Custom Domain (Optional)

1. เพิ่ม CNAME file:
   ```
   your-domain.com
   ```
2. ตั้งค่า DNS:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   CNAME www   your-username.github.io
   ```

---

## 🎨 การปรับแต่งสี Theme

แก้ไขใน `assets/css/rjacc-styles.css`:

```css
:root {
    /* สี Theme หลัก */
    --primary-purple: #471D55;
    
    /* สีบุคลากรภายนอก */
    --external-primary: #4CAF50;
    
    /* สีบุคลากรภายใน + คณะทำงาน */
    --internal-primary: #E91E63;
}
```

---

## 📧 การตั้งค่าอีเมล

อีเมลจะถูกส่งอัตโนมัติผ่าน GmailApp ใน Apps Script:

1. **อีเมลยืนยันการลงทะเบียน:** ส่งทันทีหลังลงทะเบียน
2. **อีเมลติดต่อ:** ส่งถึงเจ้าหน้าที่

Template อีเมลอยู่ใน `Code.gs` > `sendConfirmationEmail()`

---

## 🔒 ความปลอดภัย

✅ **ที่มีอยู่แล้ว:**
- Input Sanitization
- XSS Protection
- Email/Phone Validation
- HTTPS (GitHub Pages)

⚠️ **ที่ควรเพิ่ม (Production):**
- reCAPTCHA
- Rate Limiting
- Authentication สำหรับ Dashboard
- Database Backup

---

## 📱 Responsive Design

✅ รองรับทุกอุปกรณ์:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

---

## ❓ FAQ

### Q: ทำไมใช้ Google Sheets แทน Database?
**A:** ฟรี, ไม่ต้องตั้งค่า, Export ง่าย, รองรับ 100K+ rows

### Q: สามารถรองรับผู้ใช้พร้อมกันได้กี่คน?
**A:** Google Apps Script รองรับ ~30 concurrent users, เพียงพอสำหรับงานขนาดกลาง

### Q: จะเพิ่ม reCAPTCHA ได้ไหม?
**A:** ได้ครับ! เพิ่มใน HTML Forms:
```html

```

### Q: จะทำ Auto-backup ได้ไหม?
**A:** ได้! ใช้ Apps Script Time-driven triggers:
```javascript
function createBackup() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  DriveApp.createFile(ss.getBlob());
}
```

---

## 🤝 การสนับสนุน

หากต้องการความช่วยเหลือ:

📧 Email: info.nst@rajavithi.go.th
📞 Tel: 065-896-4590, 082-580-3334

---

## 📄 License

© 2025 RJACC2025 - โรงพยาบาลราชวิถี
ศูนย์ความเป็นเลิศทางการแพทย์เฉพาะทาง ด้านโรคหัวใจและหลอดเลือด

---

## 🎉 สิ่งที่ทำเสร็จแล้ว

✅ **ข้อ 1-6:** JavaScript handlers, UI/UX, ฟีเจอร์, แก้บั๊ก, ไอคอน, Clean โค้ด
✅ **ข้อ 7-8:** ใบเสร็จ (แสดง/ซ่อนตามเงื่อนไข)
✅ **ข้อ 9:** Workshop (Checkbox หลายตัวเลือก)
✅ **ข้อ 10:** Dropdown "อื่นๆ" แสดงช่องกรอก
✅ **ข้อ 11-13:** สี Theme (เขียว/ชมพู) ตามประเภท
✅ **ข้อ 14:** สี Theme #471D55
✅ **ข้อ 15:** ปุ่มลงทะเบียนตรงกลาง
✅ **ข้อ 16:** Dashboard แยกคณะทำงาน/บุคลากรภายใน
✅ **ข้อ 17:** รวม Workshop Dashboard ใน Dashboard
✅ **ข้อ 18:** เปลี่ยนเป็น Testing & Evaluation
✅ **ข้อ 19:** สไลด์ 20 รูป (5 วินาที)
✅ **ข้อ 20-21:** Download menu (เอกสาร/Certificate/ฟอร์มห้องพัก)
✅ **ข้อ 22:** สไลด์รายละเอียด 5 รูป
✅ **ข้อ 23:** โลโก้ Title
✅ **ข้อ 24:** ข้อมูลติดต่อผู้ประสานงาน
✅ **ข้อ 25:** Footer ครบถ้วน

---

# คำแนะนำการเพิ่มรูป QR Code LINE OA

## ตำแหน่งไฟล์

ไฟล์รูป QR Code LINE OA ต้องอยู่ที่:
```
assets/images/qrcode-line.png
```

## ข้อกำหนดรูปภาพ

- **ชื่อไฟล์:** `qrcode-line.png`
- **ขนาดแนะนำ:** 500x500 pixels หรือ 1000x1000 pixels
- **รูปแบบ:** PNG (รองรับพื้นหลังโปร่งใส)
- **ขนาดไฟล์:** ไม่เกิน 500 KB

## วิธีการสร้าง QR Code LINE OA

1. เข้าสู่ LINE Official Account Manager
2. ไปที่เมนู **แชท** > **ข้อความตอบกลับอัตโนมัติ**
3. คลิก **รับ QR Code**
4. ดาวน์โหลดรูป QR Code
5. บันทึกเป็นชื่อ `qrcode-line.png`
6. วางไฟล์ใน `assets/images/`

## ตัวอย่างการแสดงผล

รูป QR Code จะแสดงในส่วน Footer ของทุกหน้า:
- **ด้านซ้าย:** ข้อมูลติดต่อ
- **ด้านขวา:** QR Code LINE OA พร้อมข้อความ

## หมายเหตุ

- หากยังไม่มีรูป QR Code ระบบจะแสดง broken image
- รูปจะถูกปรับขนาดเป็น 150x150 pixels อัตโนมัติ
- รูปจะมีพื้นหลังสีขาวและมุมโค้ง

## ทดสอบ

หลังจากเพิ่มรูปแล้ว:
1. เปิดเว็บไซต์
2. Scroll ลงไปที่ Footer
3. ตรวจสอบว่ารูป QR Code แสดงถูกต้อง
4. ทดสอบ Scan QR Code ด้วยมือถือ


**พร้อมใช้งานเลย! 🚀**
