// Visual Service Builder - Drag & Drop Architecture Designer
// Build AWS architectures visually with real-time cost calculation

const VisualServiceBuilder = {
  canvas: null,
  services: [],
  connections: [],
  selectedService: null,
  isDragging: false,
  totalCost: 0,
  
  init(canvasElement) {
    this.canvas = canvasElement;
    this.setupCanvas();
    this.bindEvents();
    this.loadServicePalette();
  },
  
  setupCanvas() {
    this.canvas.innerHTML = `
      <div class="builder-container">
        <div class="service-palette">
          <div class="palette-header">
            <i data-lucide="layers" data-lucide-size="20"></i>
            <h3>AWS Services</h3>
            <input type="text" class="palette-search" placeholder="Search services...">
          </div>
          <div class="palette-categories" id="palette-categories"></div>
          <div class="palette-services" id="palette-services"></div>
        </div>
        
        <div class="builder-canvas" id="builder-canvas">
          <div class="canvas-grid"></div>
          <div class="canvas-services" id="canvas-services"></div>
          <svg class="canvas-connections" id="canvas-connections"></svg>
          <div class="canvas-hint">
            <i data-lucide="mouse-pointer-2" data-lucide-size="32"></i>
            <p>Drag services from the left panel to build your architecture</p>
          </div>
        </div>
        
        <div class="builder-sidebar">
          <div class="cost-calculator">
            <div class="cost-header">
              <i data-lucide="calculator" data-lucide-size="20"></i>
              <h3>Cost Estimate</h3>
            </div>
            <div class="cost-total">
              <span class="cost-label">Monthly Total</span>
              <span class="cost-amount" id="total-cost">$0.00</span>
            </div>
            <div class="cost-breakdown" id="cost-breakdown"></div>
            <button class="btn-primary" id="generate-template">
              <i data-lucide="download" data-lucide-size="18"></i>
              Generate CloudFormation
            </button>
          </div>
          
          <div class="service-details" id="service-details">
            <div class="details-placeholder">
              <i data-lucide="info" data-lucide-size="32"></i>
              <p>Click a service to view details</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  loadServicePalette() {
    const categories = {
      'Compute': ['ec2', 'lambda', 'ecs', 'eks'],
      'Storage': ['s3', 'ebs', 'efs', 'glacier'],
      'Database': ['rds', 'dynamodb', 'aurora', 'redshift'],
      'Networking': ['vpc', 'cloudfront', 'route53', 'elb'],
      'Security': ['iam', 'cognito', 'secrets-manager', 'kms'],
      'Analytics': ['athena', 'glue', 'quicksight', 'kinesis']
    };
    
    const categoriesContainer = document.getElementById('palette-categories');
    const servicesContainer = document.getElementById('palette-services');
    
    // Render categories
    Object.keys(categories).forEach(category => {
      const categoryBtn = document.createElement('button');
      categoryBtn.className = 'category-btn';
      categoryBtn.textContent = category;
      categoryBtn.onclick = () => this.showCategoryServices(category, categories[category]);
      categoriesContainer.appendChild(categoryBtn);
    });
    
    // Show first category by default
    this.showCategoryServices('Compute', categories['Compute']);
  },
  
  showCategoryServices(category, serviceIds) {
    const servicesContainer = document.getElementById('palette-services');
    servicesContainer.innerHTML = `<h4>${category}</h4>`;
    
    serviceIds.forEach(serviceId => {
      const serviceCard = document.createElement('div');
      serviceCard.className = 'palette-service-card';
      serviceCard.draggable = true;
      serviceCard.dataset.serviceId = serviceId;
      
      // Use real AWS service icon
      const iconPath = `assets/icons/${serviceId}.svg`;
      
      serviceCard.innerHTML = `
        <img src="${iconPath}" alt="${this.formatServiceName(serviceId)}" width="24" height="24" style="flex-shrink: 0;">
        <span>${this.formatServiceName(serviceId)}</span>
        <div class="drag-handle">
          <i data-lucide="grip-vertical" data-lucide-size="16"></i>
        </div>
      `;
      
      serviceCard.addEventListener('dragstart', (e) => this.handleDragStart(e, serviceId));
      servicesContainer.appendChild(serviceCard);
    });
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  bindEvents() {
    const canvas = document.getElementById('builder-canvas');
    
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });
    
    canvas.addEventListener('dragleave', () => {
      canvas.classList.remove('drag-over');
    });
    
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');
      this.handleDrop(e);
    });
    
    // Generate template button
    const generateBtn = document.getElementById('generate-template');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateCloudFormation());
    }
  },
  
  handleDragStart(e, serviceId) {
    e.dataTransfer.setData('serviceId', serviceId);
    e.dataTransfer.effectAllowed = 'copy';
  },
  
  handleDrop(e) {
    const serviceId = e.dataTransfer.getData('serviceId');
    if (!serviceId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.addServiceToCanvas(serviceId, x, y);
  },
  
  addServiceToCanvas(serviceId, x, y) {
    const service = {
      id: `${serviceId}-${Date.now()}`,
      type: serviceId,
      x: x,
      y: y,
      cost: this.getServiceCost(serviceId)
    };
    
    this.services.push(service);
    this.renderService(service);
    this.updateCostCalculator();
    this.hideCanvasHint();
  },
  
  renderService(service) {
    const servicesContainer = document.getElementById('canvas-services');
    
    const serviceElement = document.createElement('div');
    serviceElement.className = 'canvas-service';
    serviceElement.id = service.id;
    serviceElement.style.left = `${service.x}px`;
    serviceElement.style.top = `${service.y}px`;
    
    // Use real AWS service icon
    const iconPath = `assets/icons/${service.type}.svg`;
    
    serviceElement.innerHTML = `
      <div class="service-icon">
        <img src="${iconPath}" alt="${this.formatServiceName(service.type)}" width="40" height="40">
      </div>
      <div class="service-label">${this.formatServiceName(service.type)}</div>
      <div class="service-cost">${service.cost}/mo</div>
      <button class="service-remove" data-service-id="${service.id}">
        <i data-lucide="x" data-lucide-size="16"></i>
      </button>
      <div class="connection-points">
        <div class="connection-point top" data-position="top"></div>
        <div class="connection-point right" data-position="right"></div>
        <div class="connection-point bottom" data-position="bottom"></div>
        <div class="connection-point left" data-position="left"></div>
      </div>
    `;
    
    // Make draggable
    this.makeServiceDraggable(serviceElement);
    
    // Click to select
    serviceElement.addEventListener('click', (e) => {
      if (!e.target.closest('.service-remove')) {
        this.selectService(service);
      }
    });
    
    // Remove button
    const removeBtn = serviceElement.querySelector('.service-remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeService(service.id);
    });
    
    servicesContainer.appendChild(serviceElement);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Animate in
    setTimeout(() => serviceElement.classList.add('active'), 10);
  },
  
  makeServiceDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    element.addEventListener('mousedown', (e) => {
      if (e.target.closest('.service-remove') || e.target.closest('.connection-point')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = element.offsetLeft;
      initialY = element.offsetTop;
      
      element.classList.add('dragging');
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      element.style.left = `${initialX + dx}px`;
      element.style.top = `${initialY + dy}px`;
      
      this.updateConnections();
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.classList.remove('dragging');
        
        // Update service position
        const service = this.services.find(s => s.id === element.id);
        if (service) {
          service.x = element.offsetLeft;
          service.y = element.offsetTop;
        }
      }
    });
  },
  
  selectService(service) {
    // Deselect all
    document.querySelectorAll('.canvas-service').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Select this one
    const element = document.getElementById(service.id);
    element.classList.add('selected');
    
    this.selectedService = service;
    this.showServiceDetails(service);
  },
  
  showServiceDetails(service) {
    const detailsContainer = document.getElementById('service-details');
    
    // Use real AWS service icon
    const iconPath = `assets/icons/${service.type}.svg`;
    
    detailsContainer.innerHTML = `
      <div class="details-header">
        <img src="${iconPath}" alt="${this.formatServiceName(service.type)}" width="32" height="32">
        <h3>${this.formatServiceName(service.type)}</h3>
      </div>
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Service Type</span>
          <span class="detail-value">${service.type.toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Monthly Cost</span>
          <span class="detail-value">${service.cost}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Instance ID</span>
          <span class="detail-value">${service.id}</span>
        </div>
      </div>
      <div class="details-actions">
        <button class="btn-secondary" onclick="VisualServiceBuilder.duplicateService('${service.id}')">
          <i data-lucide="copy" data-lucide-size="16"></i>
          Duplicate
        </button>
        <button class="btn-secondary btn-danger" onclick="VisualServiceBuilder.removeService('${service.id}')">
          <i data-lucide="trash-2" data-lucide-size="16"></i>
          Remove
        </button>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  removeService(serviceId) {
    this.services = this.services.filter(s => s.id !== serviceId);
    const element = document.getElementById(serviceId);
    if (element) {
      element.classList.add('removing');
      setTimeout(() => element.remove(), 300);
    }
    
    this.updateCostCalculator();
    
    if (this.services.length === 0) {
      this.showCanvasHint();
    }
  },
  
  duplicateService(serviceId) {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      this.addServiceToCanvas(service.type, service.x + 50, service.y + 50);
    }
  },
  
  updateCostCalculator() {
    this.totalCost = this.services.reduce((sum, service) => {
      return sum + parseFloat(service.cost.replace('$', ''));
    }, 0);
    
    document.getElementById('total-cost').textContent = `$${this.totalCost.toFixed(2)}`;
    
    // Update breakdown
    const breakdown = document.getElementById('cost-breakdown');
    breakdown.innerHTML = this.services.map(service => `
      <div class="cost-item">
        <span class="cost-service">${this.formatServiceName(service.type)}</span>
        <span class="cost-value">${service.cost}</span>
      </div>
    `).join('');
  },
  
  getServiceCost(serviceId) {
    const costs = {
      'ec2': '$50.00',
      'lambda': '$5.00',
      'ecs': '$30.00',
      'eks': '$75.00',
      's3': '$10.00',
      'ebs': '$15.00',
      'efs': '$20.00',
      'glacier': '$4.00',
      'rds': '$60.00',
      'dynamodb': '$25.00',
      'aurora': '$80.00',
      'redshift': '$100.00',
      'vpc': '$0.00',
      'cloudfront': '$15.00',
      'route53': '$5.00',
      'elb': '$20.00',
      'iam': '$0.00',
      'cognito': '$10.00',
      'secrets-manager': '$5.00',
      'kms': '$3.00',
      'athena': '$15.00',
      'glue': '$25.00',
      'quicksight': '$20.00',
      'kinesis': '$30.00'
    };
    
    return costs[serviceId] || '$10.00';
  },
  
  generateCloudFormation() {
    const template = {
      AWSTemplateFormatVersion: '2010-09-09',
      Description: 'Generated by AWS Blueprint Visual Builder',
      Resources: {}
    };
    
    this.services.forEach((service, index) => {
      const resourceName = `${this.formatServiceName(service.type).replace(/\s/g, '')}${index + 1}`;
      template.Resources[resourceName] = {
        Type: this.getCloudFormationType(service.type),
        Properties: this.getDefaultProperties(service.type)
      };
    });
    
    // Download as JSON
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aws-architecture-template.json';
    a.click();
    URL.revokeObjectURL(url);
    
    // Show success message
    this.showNotification('CloudFormation template generated successfully!', 'success');
  },
  
  getCloudFormationType(serviceId) {
    const types = {
      'ec2': 'AWS::EC2::Instance',
      'lambda': 'AWS::Lambda::Function',
      's3': 'AWS::S3::Bucket',
      'rds': 'AWS::RDS::DBInstance',
      'dynamodb': 'AWS::DynamoDB::Table',
      'vpc': 'AWS::EC2::VPC',
      'cloudfront': 'AWS::CloudFront::Distribution'
    };
    
    return types[serviceId] || 'AWS::CloudFormation::CustomResource';
  },
  
  getDefaultProperties(serviceId) {
    // Return minimal default properties
    return {
      Tags: [
        { Key: 'CreatedBy', Value: 'AWSBlueprint' },
        { Key: 'Environment', Value: 'Development' }
      ]
    };
  },
  
  updateConnections() {
    // Update SVG connections between services
    // This would draw lines between connected services
  },
  
  hideCanvasHint() {
    const hint = document.querySelector('.canvas-hint');
    if (hint) {
      hint.style.opacity = '0';
      setTimeout(() => hint.style.display = 'none', 300);
    }
  },
  
  showCanvasHint() {
    const hint = document.querySelector('.canvas-hint');
    if (hint) {
      hint.style.display = 'flex';
      setTimeout(() => hint.style.opacity = '1', 10);
    }
  },
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" data-lucide-size="20"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
  
  formatServiceName(serviceId) {
    return serviceId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
};

// Export
window.VisualServiceBuilder = VisualServiceBuilder;
