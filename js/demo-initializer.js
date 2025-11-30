// Demo Initializer for Advanced Features

document.addEventListener('DOMContentLoaded', () => {
  // Initialize demo features after a short delay
  setTimeout(() => {
    // Initialize Cost Calculator Demo
    createCostCalculator('cost-calculator-demo');
    
    // Initialize Availability Map Demo
    createAvailabilityMap('availability-map-demo');
    
    // Initialize Service Graph Demo
    const demoServices = [
      {name: 'Lambda', description: 'Serverless compute'},
      {name: 'API Gateway', description: 'API management'},
      {name: 'DynamoDB', description: 'NoSQL database'},
      {name: 'S3', description: 'Object storage'},
      {name: 'CloudFront', description: 'CDN service'},
      {name: 'Cognito', description: 'Authentication'}
    ];
    createServiceGraph('service-graph-demo', demoServices);
    
    // Add complexity meters to existing service cards
    document.querySelectorAll('.service-card').forEach(card => {
      const complexity = ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)];
      const meterHtml = createComplexityMeter(complexity);
      
      const existingMeter = card.querySelector('.complexity-meter');
      if (!existingMeter) {
        const cardContent = card.querySelector('.card-content') || card;
        cardContent.insertAdjacentHTML('beforeend', meterHtml);
      }
    });
    
    // Add tooltips to service icons
    document.querySelectorAll('.service-icon').forEach(icon => {
      const serviceName = icon.closest('.service-card')?.querySelector('h3')?.textContent;
      if (serviceName && !icon.hasAttribute('data-tooltip')) {
        icon.setAttribute('data-tooltip', `Click to learn more about ${serviceName}`);
      }
    });
    
  }, 1000);
});