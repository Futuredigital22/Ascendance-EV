// Vehicle Configuration Script
class VehicleConfigurator {
    constructor() {
        this.basePrice = 5000;
        this.selectedOptions = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.calculatePrice();
        this.updateDisplay();
    }

    bindEvents() {
        // Radio button changes
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleOptionChange(e.target);
            });
        });

        // Checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleOptionChange(e.target);
            });
        });

        // Quote request button
        const quoteBtn = document.querySelector('.btn-request-quote-modern');
        if (quoteBtn) {
            quoteBtn.addEventListener('click', () => this.requestQuote());
        }
    }

    handleOptionChange(element) {
        const name = element.name;
        const value = element.value;
        const price = parseFloat(element.dataset.price) || 0;

        if (element.type === 'radio') {
            this.selectedOptions.set(name, { value, price });
        } else if (element.type === 'checkbox') {
            if (element.checked) {
                this.selectedOptions.set(name, { value, price });
            } else {
                this.selectedOptions.delete(name);
            }
        }

        this.calculatePrice();
        this.updateDisplay();
    }

    calculatePrice() {
        let totalPrice = this.basePrice;
        let selectedOptions = [];

        this.selectedOptions.forEach((option, key) => {
            totalPrice += option.price;
            selectedOptions.push({
                name: this.getOptionName(key),
                value: this.getOptionValueName(key, option.value),
                price: option.price
            });
        });

        return { totalPrice, selectedOptions };
    }

    getOptionName(key) {
        const optionNames = {
            'power': 'Power System',
            'battery': 'Battery Capacity',
            'window': 'Window Type',
            'safety': 'Safety Features',
            'comfort': 'Comfort Features'
        };
        return optionNames[key] || key;
    }

    getOptionValueName(key, value) {
        const valueNames = {
            'power': {
                '1wd': '1 Wheel Drive',
                '2wd': '2 Wheel Drive',
                '3wd': '3 Wheel Drive'
            },
            'battery': {
                '5kw': '5kW Battery',
                '10kw': '10kW Battery',
                '15kw': '15kW Battery',
                '20kw': '20kW Battery'
            },
            'window': {
                'manual': 'Manual Windows',
                'auto': 'Auto Windows'
            }
        };

        return valueNames[key]?.[value] || value;
    }

    updateDisplay() {
        const { totalPrice, selectedOptions } = this.calculatePrice();
        
        // Update total price display
        const totalElement = document.getElementById('calculatedTotal');
        if (totalElement) {
            totalElement.textContent = `$${totalPrice.toLocaleString()}`;
        }

        // Update selected options display
        const optionsContainer = document.querySelector('.selected-options-modern');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            
            selectedOptions.forEach(option => {
                if (option.price > 0) {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'option-item-modern';
                    optionDiv.innerHTML = `
                        <span>${option.value}</span>
                        <span>+$${option.price.toLocaleString()}</span>
                    `;
                    optionsContainer.appendChild(optionDiv);
                }
            });
        }

        // Update base price display
        const basePriceElement = document.querySelector('.base-price-modern span:last-child');
        if (basePriceElement) {
            basePriceElement.textContent = `$${this.basePrice.toLocaleString()}`;
        }
    }

    requestQuote() {
        const { totalPrice, selectedOptions } = this.calculatePrice();
        
        // Create configuration summary
        const configSummary = {
            basePrice: this.basePrice,
            totalPrice: totalPrice,
            selectedOptions: Array.from(this.selectedOptions.entries()),
            timestamp: new Date().toISOString()
        };

        // Store in localStorage for the contact page
        localStorage.setItem('vehicleConfig', JSON.stringify(configSummary));
        
        // Redirect to contact page with configuration
        window.location.href = `contact.html?config=${encodeURIComponent(JSON.stringify(configSummary))}`;
    }
}

// Initialize configurator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const configurator = new VehicleConfigurator();
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add loading animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    document.querySelectorAll('.config-section-modern, .pricing-card-modern').forEach(el => {
        observer.observe(el);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar-custom');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
