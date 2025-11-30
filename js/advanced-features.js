// Advanced Features JavaScript

class AdvancedFeatures {
  constructor() {
    this.initializeFeatures();
  }

  initializeFeatures() {
    this.setupServiceComparison();
    this.setupCostCalculator();
    this.setupServiceGraph();
    this.setupComplexityMeter();
    this.setupAvailabilityMap();
    this.setupSmartSearch();
    this.setupAnimatedIcons();
    this.setupTooltips();
    this.setupPageTransitions();
  }

  // Service Comparison Table
  setupServiceComparison() {
    window.showServiceComparison = (services) => {
      const modal = document.createElement('div');
      modal.className = 'comparison-modal';
      modal.innerHTML = this.generateComparisonTable(services);
      document.body.appendChild(modal);
      modal.style.display = 'flex';
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };
  }

  generateComparisonTable(services) {
    const features = ['Free Tier', 'Scalability', 'Managed', 'Global', 'Real-time'];
    
    return `
      <div class="comparison-table">
        <div class="comparison-header">
          <div class="comparison-cell"><strong>Feature</strong></div>
          ${services.map(s => `<div class="comparison-cell"><strong>${s.name}</strong></div>`).join('')}
        </div>
        ${features.map(feature => `
          <div class="comparison-row">
            <div class="comparison-cell">${feature}</div>
            ${services.map(s => `
              <div class="comparison-cell">
                <span class="${this.hasFeature(s, feature) ? 'feature-check' : 'feature-cross'}">
                  ${this.hasFeature(s, feature) ? '✓' : '✗'}
                </span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  hasFeature(service, feature) {
    const features = {
      'Free Tier': ['EC2', 'S3', 'Lambda', 'DynamoDB'],
      'Scalability': ['Lambda', 'DynamoDB', 'CloudFront', 'ECS'],
      'Managed': ['Lambda', 'DynamoDB', 'RDS', 'ElastiCache'],
      'Global': ['CloudFront', 'Route 53', 'S3', 'IAM'],
      'Real-time': ['Kinesis', 'IoT Core', 'AppSync', 'WebSocket API']
    };
    return features[feature]?.includes(service.name) || false;
  }

  // Cost Calculator Widget
  setupCostCalculator() {
    window.createCostCalculator = (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <div class="cost-calculator">
          <h3>💰 Cost Estimator</h3>
          <div class="cost-slider">
            <label>Monthly Users: <span id="users-value">1000</span></label>
            <input type="range" class="slider-input" id="users-slider" min="100" max="100000" value="1000">
          </div>
          <div class="cost-slider">
            <label>Data Storage (GB): <span id="storage-value">10</span></label>
            <input type="range" class="slider-input" id="storage-slider" min="1" max="1000" value="10">
          </div>
          <div class="cost-estimate">
            Estimated: $<span id="cost-result">23</span>/month
          </div>
        </div>
      `;

      this.bindCostCalculator();
    };
  }

  bindCostCalculator() {
    const usersSlider = document.getElementById('users-slider');
    const storageSlider = document.getElementById('storage-slider');
    
    const updateCost = () => {
      const users = parseInt(usersSlider.value);
      const storage = parseInt(storageSlider.value);
      
      document.getElementById('users-value').textContent = users.toLocaleString();
      document.getElementById('storage-value').textContent = storage;
      
      const cost = Math.round((users * 0.01) + (storage * 0.023) + 5);
      document.getElementById('cost-result').textContent = cost;
    };

    usersSlider?.addEventListener('input', updateCost);
    storageSlider?.addEventListener('input', updateCost);
  }

  // Service Relationship Graph
  setupServiceGraph() {
    window.createServiceGraph = (containerId, services) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '<div class="relationship-graph" id="graph-canvas"></div>';
      
      const canvas = document.getElementById('graph-canvas');
      const nodes = this.generateGraphNodes(services);
      const connections = this.generateConnections(nodes);
      
      nodes.forEach(node => canvas.appendChild(node.element));
      connections.forEach(conn => canvas.appendChild(conn));
    };
  }

  generateGraphNodes(services) {
    const positions = [
      {x: 50, y: 50}, {x: 200, y: 100}, {x: 350, y: 50},
      {x: 100, y: 200}, {x: 300, y: 250}, {x: 450, y: 180}
    ];

    return services.slice(0, 6).map((service, i) => {
      const node = document.createElement('div');
      node.className = 'graph-node';
      node.textContent = service.name;
      node.style.left = positions[i].x + 'px';
      node.style.top = positions[i].y + 'px';
      
      node.addEventListener('click', () => {
        alert(`${service.name}: ${service.description}`);
      });

      return { element: node, x: positions[i].x + 40, y: positions[i].y + 40 };
    });
  }

  generateConnections(nodes) {
    const connections = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const line = document.createElement('div');
      line.className = 'graph-connection';
      
      const dx = nodes[i + 1].x - nodes[i].x;
      const dy = nodes[i + 1].y - nodes[i].y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      line.style.width = length + 'px';
      line.style.left = nodes[i].x + 'px';
      line.style.top = nodes[i].y + 'px';
      line.style.transform = `rotate(${angle}deg)`;
      
      connections.push(line);
    }
    return connections;
  }

  // Usage Complexity Meter
  setupComplexityMeter() {
    window.createComplexityMeter = (level) => {
      const levels = { beginner: 1, intermediate: 2, advanced: 3 };
      const activeLevel = levels[level] || 1;
      
      return `
        <div class="complexity-meter">
          <span>Complexity:</span>
          <div class="complexity-dots">
            ${[1, 2, 3].map(i => `
              <div class="complexity-dot ${i <= activeLevel ? `active ${level}` : ''}"></div>
            `).join('')}
          </div>
          <span>${level.charAt(0).toUpperCase() + level.slice(1)}</span>
        </div>
      `;
    };
  }

  // Regional Availability Map
  setupAvailabilityMap() {
    window.createAvailabilityMap = (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const regions = [
        {name: 'US East', x: '25%', y: '40%'},
        {name: 'US West', x: '15%', y: '45%'},
        {name: 'Europe', x: '55%', y: '35%'},
        {name: 'Asia Pacific', x: '80%', y: '50%'},
        {name: 'South America', x: '35%', y: '70%'}
      ];

      container.innerHTML = `
        <div class="availability-map">
          ${regions.map(region => `
            <div class="region-dot tooltip" style="left: ${region.x}; top: ${region.y}">
              <div class="tooltip-content">${region.name}</div>
            </div>
          `).join('')}
        </div>
      `;
    };
  }

  // Smart Search Suggestions
  setupSmartSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const suggestions = [
      {name: 'Serverless API', icon: '⚡'},
      {name: 'Static Website', icon: '🌐'},
      {name: 'Database Storage', icon: '🗄️'},
      {name: 'File Upload', icon: '📁'},
      {name: 'Real-time Chat', icon: '💬'}
    ];

    let suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.display = 'none';
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(suggestionsContainer);

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
      }

      const filtered = suggestions.filter(s => 
        s.name.toLowerCase().includes(query)
      );

      if (filtered.length > 0) {
        suggestionsContainer.innerHTML = filtered.map(s => `
          <div class="suggestion-item" onclick="selectSuggestion('${s.name}')">
            <span class="suggestion-icon">${s.icon}</span>
            <span>${s.name}</span>
          </div>
        `).join('');
        suggestionsContainer.style.display = 'block';
      } else {
        suggestionsContainer.style.display = 'none';
      }
    });

    window.selectSuggestion = (name) => {
      searchInput.value = name;
      suggestionsContainer.style.display = 'none';
      searchInput.dispatchEvent(new Event('input'));
    };
  }

  // Animated Service Icons
  setupAnimatedIcons() {
    document.querySelectorAll('.service-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Contextual Tooltips
  setupTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-content';
      tooltip.textContent = element.getAttribute('data-tooltip');
      element.appendChild(tooltip);
      element.classList.add('tooltip');
    });
  }

  // Smooth Page Transitions
  setupPageTransitions() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.page-transition').forEach(el => {
      observer.observe(el);
    });

    // Add staggered animations to cards
    document.querySelectorAll('.service-card, .pattern-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('section-fade');
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedFeatures();
});