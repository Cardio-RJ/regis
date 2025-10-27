/**
 * RJACC2025 - Dashboard Handler
 * จัดการแสดงข้อมูลผู้ลงทะเบียนแบบแยกตามประเภท
 */

let allRegistrations = [];
let filteredData = [];
let autoRefreshInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    setupTabs();
    setupFilters();
    setupExportButtons();
    loadDashboardData();
    startAutoRefresh();
}

/**
 * ตั้งค่า Tab Navigation
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

/**
 * ตั้งค่า Filters
 */
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    
    searchInput.addEventListener('input', () => filterAndRenderData());
    statusFilter.addEventListener('change', () => filterAndRenderData());
    refreshBtn.addEventListener('click', () => loadDashboardData());
}

/**
 * ตั้งค่า Export Buttons
 */
function setupExportButtons() {
    const exportExcel = document.getElementById('exportExcel');
    const exportPDF = document.getElementById('exportPDF');
    
    exportExcel.addEventListener('click', () => exportToExcel());
    exportPDF.addEventListener('click', () => exportToPDF());
}

/**
 * โหลดข้อมูล Dashboard
 */
async function loadDashboardData() {
    try {
        showLoading();
        
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=list&group=all`);
        
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        
        const result = await response.json();
        
        if (result.success) {
            allRegistrations = result.data || [];
            updateStats();
            filterAndRenderData();
            updateLastRefreshTime();
        } else {
            throw new Error(result.message || 'Failed to load data');
        }
        
    } catch (error) {
        console.error('Dashboard Error:', error);
        RJACCUtils.showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * แสดง Loading
 */
function showLoading() {
    const tables = ['all', 'external', 'internal', 'staff'];
    tables.forEach(table => {
        const tbody = document.getElementById(`${table}TableBody`);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...
                    </td>
                </tr>
            `;
        }
    });
}

/**
 * ซ่อน Loading
 */
function hideLoading() {
    // จะถูกเรียกหลังจาก render data เสร็จ
}

/**
 * อัพเดท Stats Cards
 */
function updateStats() {
    const total = allRegistrations.length;
    const external = allRegistrations.filter(r => r.registrationType === 'external').length;
    const internal = allRegistrations.filter(r => r.registrationType === 'internal').length;
    const staff = allRegistrations.filter(r => r.registrationType === 'staff').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('externalCount').textContent = external;
    document.getElementById('internalCount').textContent = internal;
    document.getElementById('staffCount').textContent = staff;
}

/**
 * กรองและแสดงข้อมูล
 */
function filterAndRenderData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    // กรองข้อมูล
    filteredData = allRegistrations.filter(item => {
        // Filter by search term
        const matchesSearch = !searchTerm || 
            item.fullName.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm) ||
            item.phone.includes(searchTerm);
        
        // Filter by status
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    // Render ทุก table
    renderAllTable();
    renderExternalTable();
    renderInternalTable();
    renderStaffTable();
    renderWorkshopDashboard();
}

/**
 * Render All Table
 */
function renderAllTable() {
    const tbody = document.getElementById('allTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox"></i> ไม่มีข้อมูล
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><span class="badge badge-${item.registrationType}">${getTypeName(item.registrationType)}</span></td>
            <td>${item.fullName}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td><span class="status-badge status-${item.status}">${getStatusName(item.status)}</span></td>
            <td>${formatDate(item.timestamp)}</td>
        </tr>
    `).join('');
}

/**
 * Render External Table
 */
function renderExternalTable() {
    const tbody = document.getElementById('externalTableBody');
    const data = filteredData.filter(r => r.registrationType === 'external');
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox"></i> ไม่มีข้อมูล
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.fullName}</td>
            <td>${item.organization || '-'}</td>
            <td>${item.position || '-'}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td><span class="status-badge status-${item.status}">${getStatusName(item.status)}</span></td>
        </tr>
    `).join('');
}

/**
 * Render Internal Table
 */
function renderInternalTable() {
    const tbody = document.getElementById('internalTableBody');
    const data = filteredData.filter(r => r.registrationType === 'internal');
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox"></i> ไม่มีข้อมูล
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.fullName}</td>
            <td>${item.department || '-'}</td>
            <td>${item.position || '-'}</td>
            <td>${item.employeeId || '-'}</td>
            <td>${item.email}</td>
            <td><span class="status-badge status-${item.status}">${getStatusName(item.status)}</span></td>
        </tr>
    `).join('');
}

/**
 * Render Staff Table
 */
function renderStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    const data = filteredData.filter(r => r.registrationType === 'staff');
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox"></i> ไม่มีข้อมูล
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.fullName}</td>
            <td>${item.department || '-'}</td>
            <td>${item.position || '-'}</td>
            <td>${item.responsibility || '-'}</td>
            <td>${item.email}</td>
            <td><span class="status-badge status-${item.status}">${getStatusName(item.status)}</span></td>
        </tr>
    `).join('');
}

/**
 * Render Workshop Dashboard
 */
function renderWorkshopDashboard() {
    const workshopStatsGrid = document.getElementById('workshopStatsGrid');
    const workshopDetails = document.getElementById('workshopDetails');
    
    // นับจำนวนผู้สนใจแต่ละ workshop
    const workshopCounts = {};
    const workshopParticipants = {};
    
    CONFIG.WORKSHOPS.forEach(workshop => {
        workshopCounts[workshop.id] = 0;
        workshopParticipants[workshop.id] = [];
    });
    
    allRegistrations.forEach(reg => {
        if (reg.workshop && reg.workshop.interested && reg.workshop.selected) {
            reg.workshop.selected.forEach(wsId => {
                if (workshopCounts[wsId] !== undefined) {
                    workshopCounts[wsId]++;
                    workshopParticipants[wsId].push(reg);
                }
            });
        }
    });
    
    // Render Stats Cards
    workshopStatsGrid.innerHTML = CONFIG.WORKSHOPS.map(workshop => `
        <div class="stat-card">
            <div class="stat-number">${workshopCounts[workshop.id]}</div>
            <div class="stat-label">${workshop.topic}</div>
            <div class="form-note">${workshop.date} ${workshop.time}</div>
        </div>
    `).join('');
    
    // Render Details
    workshopDetails.innerHTML = CONFIG.WORKSHOPS.map(workshop => {
        const participants = workshopParticipants[workshop.id];
        
        return `
            <div class="workshop-detail-card">
                <h5>
                    <i class="fas fa-chalkboard-teacher"></i> 
                    ${workshop.topic} (${participants.length} คน)
                </h5>
                <p class="form-note">${workshop.date} ${workshop.time} - ${workshop.room}</p>
                ${participants.length > 0 ? `
                    <table style="width: 100%; margin-top: 1rem;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>ประเภท</th>
                                <th>อีเมล</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.map((p, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${p.fullName}</td>
                                    <td><span class="badge badge-${p.registrationType}">${getTypeName(p.registrationType)}</span></td>
                                    <td>${p.email}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="text-align: center; padding: 1rem; color: #999;">ยังไม่มีผู้สนใจ</p>'}
            </div>
        `;
    }).join('');
}

/**
 * Export to Excel
 */
async function exportToExcel() {
    try {
        RJACCUtils.showAlert('กำลังสร้างไฟล์ Excel...', 'warning');
        
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=exportXlsx`);
        
        if (!response.ok) {
            throw new Error('Failed to export');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RJACC2025_Registrations_${formatDateForFilename()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        RJACCUtils.showAlert('ดาวน์โหลดไฟล์สำเร็จ!', 'success');
        
    } catch (error) {
        console.error('Export Excel Error:', error);
        RJACCUtils.showAlert('เกิดข้อผิดพลาดในการ Export', 'error');
    }
}

/**
 * Export to PDF
 */
async function exportToPDF() {
    try {
        RJACCUtils.showAlert('กำลังสร้างไฟล์ PDF...', 'warning');
        
        const response = await fetch(`${CONFIG.API_BASE_URL}?route=exportPdf`);
        
        if (!response.ok) {
            throw new Error('Failed to export');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RJACC2025_Report_${formatDateForFilename()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        RJACCUtils.showAlert('ดาวน์โหลดไฟล์สำเร็จ!', 'success');
        
    } catch (error) {
        console.error('Export PDF Error:', error);
        RJACCUtils.showAlert('เกิดข้อผิดพลาดในการ Export', 'error');
    }
}

/**
 * Start Auto-refresh
 */
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        loadDashboardData();
    }, CONFIG.DASHBOARD_CONFIG.autoRefreshInterval);
}

/**
 * อัพเดทเวลา Refresh ล่าสุด
 */
function updateLastRefreshTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString('th-TH');
}

/**
 * Helper Functions
 */
function getTypeName(type) {
    const types = {
        external: 'บุคลากรภายนอก',
        internal: 'บุคลากรภายใน',
        staff: 'คณะทำงาน'
    };
    return types[type] || type;
}

function getStatusName(status) {
    const statuses = {
        pending: 'รอยืนยัน',
        confirmed: 'ยืนยันแล้ว',
        cancelled: 'ยกเลิก'
    };
    return statuses[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateForFilename() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
