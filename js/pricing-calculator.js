/**
 * Ascendance EV Pricing Calculator
 * Real-time vehicle configuration and pricing
 */

class AscendancePricingCalculator {
    constructor() {
        this.basePrice = 5000;
        this.configuration = {
            power: { value: '1wd', price: 0 },
            battery: { value: '5kw', price: 0 },
            windows: { value: 'standard', price: 0 },
            color: { value: 'standard', price: 0 },
            wheels: { value: 'standard', price: 0 },
            interior: { value: 'standard', price: 0 },
            accessories: []
        };
        
        this.pricingData = {
            power: {
                '1wd': 0,
                '2wd': 3000,
                '3wd': 4500
            },
            battery: {
                '5kw': 0,
                '10kw': 3000,
                '15kw': 4000,
                '20kw': 5000
            },
            windows: {
                'standard': 0,
                'tinted': 500,
                'double-pane': 800
            },
            color: {
                'standard': 0,
                'metallic': 1000,
                'matte': 1500,
                'pearl': 2000
            },
            wheels: {
                'standard': 0,
                'alloy': 1200,
                'premium': 2500
            },
            interior: {
                'standard': 0,
                'leather': 2000,
                'premium-leather': 3500
            },
            accessories: {
                'sound-system': 800,
                'gps-navigation': 1200,
                'backup-camera': 600,
                'heated-seats': 400,
                'sunroof': 1500,
                'towing-package': 1000
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadFromURL();
        this.updateDisplay();
    }
    
    bindEvents() {
        // Radio button changes
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleRadioChange(e);
            });
        });
        
        // Checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e);
            });
        });
        
        // Save configuration button
        const saveBtn = document.getElementById('save-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveConfiguration());
        }
        
        // Share configuration button
        const shareBtn = document.getElementById('share-config');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareConfiguration());
        }
        
        // Print button
        const printBtn = document.getElementById('print-config');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printConfiguration());
        }
    }
    
    handleRadioChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        const price = parseInt(event.target.dataset.price) || 0;
        
        this.configuration[name] = { value, price };
        this.updateDisplay();
        this.updateURL();
    }
    
    handleCheckboxChange(event) {
        const accessory = event.target.value;
        const price = parseInt(event.target.dataset.price) || 0;
        
        if (event.target.checked) {
            if (!this.configuration.accessories.includes(accessory)) {
                this.configuration.accessories.push(accessory);
            }
        } else {
            this.configuration.accessories = this.configuration.accessories.filter(a => a !== accessory);
        }
        
        this.updateDisplay();
        this.updateURL();
    }
    
    calculateTotal() {
        let total = this.basePrice;
        
        // Add prices for each configuration option
        Object.keys(this.configuration).forEach(key => {
            if (key === 'accessories') {
                this.configuration[key].forEach(acc => {
                    total += this.pricingData.accessories[acc] || 0;
                });
            } else {
                total += this.configuration[key].price || 0;
            }
        });
        
        return total;
    }
    
    updateDisplay() {
        const total = this.calculateTotal();
        const totalDisplay = document.getElementById('calculatedTotal');
        
        if (totalDisplay) {
            totalDisplay.textContent = `$${total.toLocaleString()}`;
        }
        
        this.updateSummary();
    }
    
    updateSummary() {
        const summaryContainer = document.querySelector('.selected-options-modern');
        if (!summaryContainer) return;
        
        summaryContainer.innerHTML = '';
        
        // Add selected options to summary
        Object.keys(this.configuration).forEach(key => {
            if (key === 'accessories') return;
            
            const option = this.configuration[key];
            if (option.price > 0) {
                const div = document.createElement('div');
                div.className = 'base-price-modern';
                div.innerHTML = `
                    <span>${key.charAt(0).toUpperCase() + key.slice(1)}: ${option.value}</span>
                    <span>+$${option.price.toLocaleString()}</span>
                `;
                summaryContainer.appendChild(div);
            }
        });
        
        // Add accessories
        this.configuration.accessories.forEach(acc => {
            const div = document.createElement('div');
            div.className = 'base-price-modern';
            div.innerHTML = `
                <span>${acc.replace('-', ' ').toUpperCase()}</span>
                <span>+$${this.pricingData.accessories[acc].toLocaleString()}</span>
            `;
            summaryContainer.appendChild(div);
        });
    }
    
    saveConfiguration() {
        const config = {
            ...this.configuration,
            totalPrice: this.calculateTotal(),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('ascendanceConfig', JSON.stringify(config));
        this.showNotification('Configuration saved successfully!', 'success');
    }
    
    loadConfiguration() {
        const saved = localStorage.getItem('ascendanceConfig');
        if (saved) {
            const config = JSON.parse(saved);
            this.configuration = config;
            this.updateDisplay();
        }
    }
    
    shareConfiguration() {
        const params = new URLSearchParams();
        
        Object.keys(this.configuration).forEach(key => {
            if (key === 'accessories') {
                params.set('acc', this.configuration[key].join(','));
            } else {
                params.set(key, this.configuration[key].value);
            }
        });
        
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('Configuration URL copied to clipboard!', 'success');
        });
    }
    
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        params.forEach((value, key) => {
            if (key === 'acc') {
                this.configuration.accessories = value.split(',').filter(Boolean);
            } else if (this.configuration[key]) {
                const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
                if (radio) {
                    radio.checked = true;
                    this.configuration[key] = {
                        value,
                        price: parseInt(radio.dataset.price) || 0
                    };
                }
            }
        });
    }
    
    updateURL() {
        const params = new URLSearchParams();
        
        Object.keys(this.configuration).forEach(key => {
            if (key === 'accessories') {
                params.set('acc', this.configuration[key].join(','));
            } else {
                params.set(key, this.configuration[key].value);
            }
        });
        
        const newURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newURL);
    }
    
    printConfiguration() {
        const printWindow = window.open('', '_blank');
        const total = this.calculateTotal();
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Ascendance EV Configuration</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .config-summary { max-width: 600px; margin: 0 auto; }
                        .config-item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
                        .total { font-size: 24px; font-weight: bold; color: #007bff; }
                    </style>
                </head>
                <body>
                    <div class="config-summary">
                        <h1>Ascendance EV Configuration Summary</h1>
                        <div class="config-item">
                            <strong>Base Price:</strong> $${this.basePrice.toLocaleString()}
                        </div>
                        ${Object.keys(this.configuration).map(key => {
                            if (key === 'accessories') return '';
                            const option = this.configuration[key];
                            return option.price > 0 ? `
                                <div class="config-item">
                                    <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${option.value} (+$${option.price.toLocaleString()})
                                </div>
                            ` : '';
                        }).join('')}
                        ${this.configuration.accessories.map(acc => `
                            <div class="config-item">
                                <strong>Accessory:</strong> ${acc.replace('-', ' ').toUpperCase()} (+$${this.pricingData.accessories[acc].toLocaleString()})
                            </div>
                        `).join('')}
                        <div class="config-item total">
                            <strong>Total Price: $${total.toLocaleString()}</strong>
                        </div>
                    </div>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pricingCalculator = new AscendancePricingCalculator();
});
