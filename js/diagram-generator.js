// Diagram Generator Module
class DiagramGenerator {
    constructor() {
        this.selectedServices = new Set();
        this.currentCategory = 'compute';
        this.services = {
            compute: [
                { id: 'lambda', name: 'Lambda', desc: 'Serverless compute', icon: '⚡' },
                { id: 'ec2', name: 'EC2', desc: 'Virtual servers', icon: '🖥️' },
                { id: 'ecs', name: 'ECS', desc: 'Container service', icon: '📦' },
                { id: 'fargate', name: 'Fargate', desc: 'Serverless containers', icon: '🚀' }
            ],
            storage: [
                { id: 's3', name: 'S3', desc: 'Object storage', icon: '🪣' },
                { id: 'ebs', name: 'EBS', desc: 'Block storage', icon: '💾' },
                { id: 'efs', name: 'EFS', desc: 'File system', icon: '📁' },
                { id: 'glacier', name: 'Glacier', desc: 'Archive storage', icon: '🧊' }
            ],
            database: [
                { id: 'rds', name: 'RDS', desc: 'Relational database', icon: '🗄️' },
                { id: 'dynamodb', name: 'DynamoDB', desc: 'NoSQL database', icon: '⚡' },
                { id: 'redshift', name: 'Redshift', desc: 'Data warehouse', icon: '📊' },
                { id: 'elasticache', name: 'ElastiCache', desc: 'In-memory cache', icon: '⚡' }
            ],
            networking: [
                { id: 'vpc', name: 'VPC', desc: 'Virtual network', icon: '🌐' },
                { id: 'cloudfront', name: 'CloudFront', desc: 'CDN', icon: '🌍' },
                { id: 'route53', name: 'Route 53', desc: 'DNS service', icon: '🗺️' },
                { id: 'elb', name: 'Load Balancer', desc: 'Traffic distribution', icon: '⚖️' }
            ]
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderServices();
    }

    bindEvents() {
        // Modal controls
        const diagramBtn = document.getElementById('diagram-generator-btn');
        const modal = document.getElementById('diagram-modal');
        const closeBtn = document.getElementById('diagram-modal-close');
        const overlay = document.getElementById('diagram-modal-overlay');

        if (diagramBtn) {
            diagramBtn.addEventListener('click', () => this.openModal());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Category buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                this.switchCategory(e.target.dataset.category);
            }
        });

        // Service selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-item')) {
                const serviceItem = e.target.closest('.service-item');
                this.toggleService(serviceItem.dataset.serviceId);
            }
        });

        // Remove selected service
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('selected-service-remove')) {
                const serviceId = e.target.dataset.serviceId;
                this.removeService(serviceId);
            }
        });

        // Generate diagram
        const generateBtn = document.getElementById('generate-diagram-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateDiagram());
        }

        // Export diagram
        const exportBtn = document.getElementById('export-diagram-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDiagram());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('diagram-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('diagram-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderServices();
    }

    renderServices() {
        const grid = document.getElementById('diagram-service-grid');
        if (!grid) return;

        const services = this.services[this.currentCategory] || [];
        
        grid.innerHTML = services.map(service => `
            <div class="service-item ${this.selectedServices.has(service.id) ? 'selected' : ''}" 
                 data-service-id="${service.id}">
                <div class="service-item-icon">${service.icon}</div>
                <div class="service-item-text">
                    <div class="service-item-name">${service.name}</div>
                    <div class="service-item-desc">${service.desc}</div>
                </div>
            </div>
        `).join('');
    }

    toggleService(serviceId) {
        if (this.selectedServices.has(serviceId)) {
            this.removeService(serviceId);
        } else {
            this.addService(serviceId);
        }
    }

    addService(serviceId) {
        this.selectedServices.add(serviceId);
        this.renderServices();
        this.renderSelectedServices();
        this.updateButtons();
    }

    removeService(serviceId) {
        this.selectedServices.delete(serviceId);
        this.renderServices();
        this.renderSelectedServices();
        this.updateButtons();
    }

    renderSelectedServices() {
        const container = document.getElementById('selected-services');
        if (!container) return;

        if (this.selectedServices.size === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4 4"/>
                        <path d="M24 16V32M16 24H32" stroke="#cbd5e0" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p>Select services to add to your diagram</p>
                </div>
            `;
            container.classList.remove('has-items');
        } else {
            const selectedServicesHtml = Array.from(this.selectedServices).map(serviceId => {
                const service = this.findServiceById(serviceId);
                if (!service) return '';
                
                return `
                    <div class="selected-service-chip">
                        <span>${service.icon} ${service.name}</span>
                        <button class="selected-service-remove" data-service-id="${serviceId}">×</button>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = selectedServicesHtml;
            container.classList.add('has-items');
        }
    }

    findServiceById(serviceId) {
        for (const category of Object.values(this.services)) {
            const service = category.find(s => s.id === serviceId);
            if (service) return service;
        }
        return null;
    }

    updateButtons() {
        const generateBtn = document.getElementById('generate-diagram-btn');
        const exportBtn = document.getElementById('export-diagram-btn');
        
        const hasServices = this.selectedServices.size > 0;
        
        if (generateBtn) {
            generateBtn.disabled = !hasServices;
        }
        
        if (exportBtn) {
            exportBtn.disabled = !hasServices;
        }
    }

    generateDiagram() {
        if (this.selectedServices.size === 0) return;

        const preview = document.getElementById('diagram-preview');
        if (!preview) return;

        // Show loading state
        preview.innerHTML = `
            <div class="loading-state">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="#e2e8f0" stroke-width="4"/>
                    <path d="M24 4C35.0457 4 44 12.9543 44 24" stroke="#667eea" stroke-width="4" stroke-linecap="round">
                        <animateTransform attributeName="transform" type="rotate" dur="1s" values="0 24 24;360 24 24" repeatCount="indefinite"/>
                    </path>
                </svg>
                <p>Generating diagram...</p>
            </div>
        `;

        // Simulate diagram generation
        setTimeout(() => {
            this.renderDiagram();
        }, 1500);
    }

    renderDiagram() {
        const preview = document.getElementById('diagram-preview');
        if (!preview) return;

        const services = Array.from(this.selectedServices).map(id => this.findServiceById(id)).filter(Boolean);
        
        // Create SVG diagram
        const svgWidth = 600;
        const svgHeight = 400;
        const serviceWidth = 120;
        const serviceHeight = 80;
        const spacing = 40;
        
        let svg = `
            <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="diagram-canvas">
                <defs>
                    <linearGradient id="serviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea"/>
                        <stop offset="100%" style="stop-color:#764ba2"/>
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.1)"/>
                    </filter>
                </defs>
        `;

        // Calculate positions
        const cols = Math.ceil(Math.sqrt(services.length));
        const rows = Math.ceil(services.length / cols);
        const startX = (svgWidth - (cols * serviceWidth + (cols - 1) * spacing)) / 2;
        const startY = (svgHeight - (rows * serviceHeight + (rows - 1) * spacing)) / 2;

        // Draw connections
        if (services.length > 1) {
            for (let i = 0; i < services.length - 1; i++) {
                const row1 = Math.floor(i / cols);
                const col1 = i % cols;
                const row2 = Math.floor((i + 1) / cols);
                const col2 = (i + 1) % cols;
                
                const x1 = startX + col1 * (serviceWidth + spacing) + serviceWidth / 2;
                const y1 = startY + row1 * (serviceHeight + spacing) + serviceHeight / 2;
                const x2 = startX + col2 * (serviceWidth + spacing) + serviceWidth / 2;
                const y2 = startY + row2 * (serviceHeight + spacing) + serviceHeight / 2;
                
                svg += `
                    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                          stroke="#cbd5e0" stroke-width="2" stroke-dasharray="5,5">
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-10" repeatCount="indefinite"/>
                    </line>
                `;
            }
        }

        // Draw services
        services.forEach((service, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = startX + col * (serviceWidth + spacing);
            const y = startY + row * (serviceHeight + spacing);
            
            svg += `
                <g class="service-node" transform="translate(${x}, ${y})">
                    <rect width="${serviceWidth}" height="${serviceHeight}" rx="12" 
                          fill="url(#serviceGradient)" filter="url(#shadow)">
                        <animate attributeName="opacity" dur="0.5s" values="0;1" begin="${index * 0.2}s"/>
                    </rect>
                    <text x="${serviceWidth / 2}" y="${serviceHeight / 2 - 10}" 
                          text-anchor="middle" fill="white" font-size="24" font-family="Arial">
                        ${service.icon}
                    </text>
                    <text x="${serviceWidth / 2}" y="${serviceHeight / 2 + 15}" 
                          text-anchor="middle" fill="white" font-size="12" font-weight="600" font-family="Arial">
                        ${service.name}
                    </text>
                </g>
            `;
        });

        svg += '</svg>';
        
        preview.innerHTML = svg;
        
        // Enable export button
        const exportBtn = document.getElementById('export-diagram-btn');
        if (exportBtn) {
            exportBtn.disabled = false;
        }
    }

    exportDiagram() {
        const canvas = document.querySelector('.diagram-canvas');
        if (!canvas) return;

        // Create a temporary canvas
        const svgData = new XMLSerializer().serializeToString(canvas);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // White background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.drawImage(img, 0, 0);
            
            // Download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `aws-architecture-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            
            URL.revokeObjectURL(svgUrl);
        };
        
        img.src = svgUrl;
    }
}

// Navigation scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DiagramGenerator();
});

// Make scrollToSection globally available
window.scrollToSection = scrollToSection;