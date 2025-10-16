/**
 * API Module
 * ฟังก์ชันสำหรับเชื่อมต่อกับ Google Apps Script Backend
 */

const API = {
    /**
     * Helper function to make API calls
     * @param {string} route - API endpoint route
     * @param {string} method - HTTP method (GET or POST)
     * @param {object} data - Data to send (for POST requests)
     * @returns {Promise<object>} - API response
     */
    async request(route, method = 'GET', data = null) {
        try {
            const url = method === 'GET' && data 
                ? `${CONFIG.API_BASE_URL}?${new URLSearchParams(data)}`
                : CONFIG.API_BASE_URL;
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (method === 'POST' && data) {
                options.body = JSON.stringify({ route, ...data });
            }
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    /**
     * Register a new participant
     * @param {object} formData - Registration form data
     * @returns {Promise<object>}
     */
    async register(formData) {
        return await this.request('register', 'POST', formData);
    },
    
    /**
     * Get list of participants
     * @param {string} group - Filter by group (all, external, internal, staff)
     * @param {string} status - Filter by status (pending, confirmed)
     * @returns {Promise<object>}
     */
    async getParticipants(group = 'all', status = '') {
        return await this.request('list', 'GET', { 
            route: 'list', 
            group, 
            status 
        });
    },
    
    /**
     * Confirm a participant
     * @param {string} id - Participant ID
     * @returns {Promise<object>}
     */
    async confirmParticipant(id) {
        return await this.request('confirm', 'POST', { id });
    },
    
    /**
     * Export participants to Excel
     * @returns {Promise<Blob>}
     */
    async exportExcel() {
        try {
            const url = `${CONFIG.API_BASE_URL}?route=exportXlsx`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            return await response.blob();
        } catch (error) {
            console.error('Export Excel Error:', error);
            throw error;
        }
    },
    
    /**
     * Export participants to PDF
     * @returns {Promise<Blob>}
     */
    async exportPdf() {
        try {
            const url = `${CONFIG.API_BASE_URL}?route=exportPdf`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            return await response.blob();
        } catch (error) {
            console.error('Export PDF Error:', error);
            throw error;
        }
    },
    
    /**
     * Get certificate for a participant
     * @param {string} email - Participant email
     * @param {string} id - Participant ID (optional)
     * @returns {Promise<object>}
     */
    async getCertificate(email, id = '') {
        return await this.request('cert', 'GET', { 
            route: 'cert', 
            email, 
            id 
        });
    },
    
    /**
     * Submit an abstract
     * @param {object} formData - Abstract form data
     * @returns {Promise<object>}
     */
    async submitAbstract(formData) {
        return await this.request('submitAbstract', 'POST', formData);
    },
    
    /**
     * Get list of abstracts
     * @returns {Promise<object>}
     */
    async getAbstracts() {
        return await this.request('abstracts', 'GET', { route: 'abstracts' });
    }
};

/**
 * Utility Functions
 */
const Utils = {
    /**
     * Show alert message
     * @param {string} type - Alert type (success, error, warning, info)
     * @param {string} message - Alert message
     * @param {string} containerId - Container element ID (default: 'alertContainer')
     */
    showAlert(type, message, containerId = 'alertContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        container.innerHTML = '';
        container.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    },
    
    /**
     * Sanitize HTML to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string}
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Validate phone number (Thai format)
     * @param {string} phone - Phone number to validate
     * @returns {boolean}
     */
    validatePhone(phone) {
        const re = /^[0-9]{9,10}$/;
        return re.test(phone.replace(/[^0-9]/g, ''));
    },
    
    /**
     * Format date to Thai locale
     * @param {string|Date} date - Date to format
     * @returns {string}
     */
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Download file
     * @param {Blob} blob - File blob
     * @param {string} filename - File name
     */
    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    },
    
    /**
     * Show loading state
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            if (loading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-block';
                button.disabled = true;
            } else {
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                button.disabled = false;
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, Utils };
}
