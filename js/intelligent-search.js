// Intelligent Search System
// Smart suggestions for services, concepts, and questions

const IntelligentSearch = {
  // Question patterns and their corresponding workflows
  questionPatterns: [
    {
      patterns: ['deploy website', 'host website', 'static site', 'web hosting'],
      title: 'Deploy a Static Website',
      workflow: ['S3', 'CloudFront', 'Route53'],
      steps: [
        'Create an S3 bucket and enable static website hosting',
        'Upload your website files (HTML, CSS, JS)',
        'Configure CloudFront for CDN and HTTPS',
        'Set up Route53 for custom domain (optional)'
      ],
      services: ['s3', 'cloudfront', 'route53'],
      complexity: 'beginner',
      estimatedTime: '30 minutes'
    },
    {
      patterns: ['build api', 'rest api', 'backend api', 'serverless api'],
      title: 'Build a Serverless REST API',
      workflow: ['API Gateway', 'Lambda', 'DynamoDB'],
      steps: [
        'Create Lambda functions for your API logic',
        'Set up API Gateway to expose HTTP endpoints',
        'Configure DynamoDB for data storage',
        'Add authentication with Cognito (optional)'
      ],
      services: ['lambda', 'api-gateway', 'dynamodb', 'cognito'],
      complexity: 'intermediate',
      estimatedTime: '2 hours'
    },
    {
      patterns: ['process images', 'image analysis', 'ai image', 'computer vision'],
      title: 'AI-Powered Image Processing',
      workflow: ['S3', 'Lambda', 'Rekognition'],
      steps: [
        'Upload images to S3 bucket',
        'Trigger Lambda function on image upload',
        'Use Rekognition to analyze image content',
        'Store results in DynamoDB or S3'
      ],
      services: ['s3', 'lambda', 'rekognition', 'dynamodb'],
      complexity: 'intermediate',
      estimatedTime: '1.5 hours'
    },
    {
      patterns: ['real-time', 'notifications', 'push notifications', 'websocket'],
      title: 'Real-time Notifications System',
      workflow: ['API Gateway', 'Lambda', 'SNS', 'SQS'],
      steps: [
        'Set up API Gateway with WebSocket support',
        'Create Lambda functions for connection management',
        'Use SNS for pub/sub messaging',
        'Implement SQS for message queuing'
      ],
      services: ['api-gateway', 'lambda', 'sns', 'sqs'],
      complexity: 'advanced',
      estimatedTime: '3 hours'
    },
    {
      patterns: ['data pipeline', 'etl', 'data processing', 'analytics'],
      title: 'Data Processing Pipeline',
      workflow: ['S3', 'Glue', 'Athena', 'QuickSight'],
      steps: [
        'Store raw data in S3',
        'Use Glue for ETL transformations',
        'Query data with Athena',
        'Visualize insights in QuickSight'
      ],
      services: ['s3', 'glue', 'athena', 'quicksight'],
      complexity: 'advanced',
      estimatedTime: '4 hours'
    },
    {
      patterns: ['machine learning', 'ml model', 'ai model', 'train model'],
      title: 'Train and Deploy ML Models',
      workflow: ['SageMaker', 'S3', 'Lambda'],
      steps: [
        'Prepare training data in S3',
        'Train model using SageMaker',
        'Deploy model endpoint',
        'Invoke predictions via Lambda'
      ],
      services: ['sagemaker', 's3', 'lambda'],
      complexity: 'advanced',
      estimatedTime: '5 hours'
    },
    {
      patterns: ['database', 'sql database', 'relational database', 'postgres', 'mysql'],
      title: 'Set Up Managed Database',
      workflow: ['RDS', 'VPC', 'Secrets Manager'],
      steps: [
        'Create RDS instance (PostgreSQL/MySQL)',
        'Configure VPC and security groups',
        'Store credentials in Secrets Manager',
        'Connect from your application'
      ],
      services: ['rds', 'vpc', 'secrets-manager'],
      complexity: 'intermediate',
      estimatedTime: '1 hour'
    },
    {
      patterns: ['authentication', 'user login', 'sign up', 'auth'],
      title: 'User Authentication System',
      workflow: ['Cognito', 'API Gateway', 'Lambda'],
      steps: [
        'Create Cognito User Pool',
        'Configure sign-up and sign-in flows',
        'Integrate with API Gateway for authorization',
        'Add MFA for enhanced security (optional)'
      ],
      services: ['cognito', 'api-gateway', 'lambda'],
      complexity: 'intermediate',
      estimatedTime: '2 hours'
    },
    {
      patterns: ['container', 'docker', 'kubernetes', 'microservices'],
      title: 'Deploy Containerized Applications',
      workflow: ['ECR', 'ECS/EKS', 'ALB'],
      steps: [
        'Push Docker images to ECR',
        'Create ECS cluster or EKS cluster',
        'Define task definitions and services',
        'Configure Application Load Balancer'
      ],
      services: ['ecr', 'ecs', 'eks', 'elb'],
      complexity: 'advanced',
      estimatedTime: '3 hours'
    },
    {
      patterns: ['cdn', 'content delivery', 'fast loading', 'global distribution'],
      title: 'Global Content Delivery',
      workflow: ['CloudFront', 'S3', 'Route53'],
      steps: [
        'Store content in S3',
        'Create CloudFront distribution',
        'Configure caching and compression',
        'Set up custom domain with Route53'
      ],
      services: ['cloudfront', 's3', 'route53'],
      complexity: 'beginner',
      estimatedTime: '45 minutes'
    }
  ],
  
  // Concept explanations
  concepts: {
    'serverless': {
      title: 'Serverless Computing',
      description: 'Run code without managing servers. Pay only for compute time used.',
      services: ['lambda', 'api-gateway', 'dynamodb', 's3'],
      icon: 'cloud',
      learnMore: 'https://aws.amazon.com/serverless/'
    },
    'ai': {
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Build intelligent applications with pre-trained models or custom ML.',
      services: ['sagemaker', 'rekognition', 'comprehend', 'lex'],
      icon: 'cpu',
      learnMore: 'https://aws.amazon.com/machine-learning/'
    },
    'ml': {
      title: 'Machine Learning',
      description: 'Train and deploy machine learning models at scale.',
      services: ['sagemaker', 'forecast', 'personalize'],
      icon: 'trending',
      learnMore: 'https://aws.amazon.com/machine-learning/'
    },
    'storage': {
      title: 'Cloud Storage',
      description: 'Store and retrieve any amount of data at any time.',
      services: ['s3', 'ebs', 'efs', 'glacier'],
      icon: 'storage',
      learnMore: 'https://aws.amazon.com/products/storage/'
    },
    'database': {
      title: 'Databases',
      description: 'Managed database services for any workload.',
      services: ['rds', 'dynamodb', 'aurora', 'redshift'],
      icon: 'database',
      learnMore: 'https://aws.amazon.com/products/databases/'
    },
    'compute': {
      title: 'Compute Services',
      description: 'Virtual servers, containers, and serverless compute.',
      services: ['ec2', 'lambda', 'ecs', 'eks'],
      icon: 'compute',
      learnMore: 'https://aws.amazon.com/products/compute/'
    }
  },
  
  // Search and generate suggestions
  search(query) {
    if (!query || query.length < 2) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const suggestions = [];
    
    // 1. Check for question patterns
    const matchedWorkflow = this.findMatchingWorkflow(lowerQuery);
    if (matchedWorkflow) {
      suggestions.push({
        type: 'workflow',
        ...matchedWorkflow,
        relevance: 100
      });
    }
    
    // 2. Check for concepts
    for (const [key, concept] of Object.entries(this.concepts)) {
      if (lowerQuery.includes(key) || concept.title.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'concept',
          ...concept,
          relevance: 90
        });
      }
    }
    
    // 3. Search services (will be populated from knowledge base)
    // This will be integrated with existing SearchModule
    
    // Sort by relevance
    suggestions.sort((a, b) => b.relevance - a.relevance);
    
    return suggestions.slice(0, 5); // Top 5 suggestions
  },
  
  // Find matching workflow for question
  findMatchingWorkflow(query) {
    for (const workflow of this.questionPatterns) {
      for (const pattern of workflow.patterns) {
        if (query.includes(pattern)) {
          return workflow;
        }
      }
    }
    return null;
  },
  
  // Render suggestion item
  renderSuggestion(suggestion) {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.setAttribute('role', 'option');
    
    if (suggestion.type === 'workflow') {
      item.innerHTML = `
        <div class="suggestion-icon">
          <i data-lucide="workflow" data-lucide-size="24"></i>
        </div>
        <div class="suggestion-content">
          <div class="suggestion-title">${suggestion.title}</div>
          <div class="suggestion-meta">
            <span class="complexity-badge complexity-${suggestion.complexity}">
              ${suggestion.complexity}
            </span>
            <span class="time-estimate">
              <i data-lucide="clock" data-lucide-size="14"></i>
              ${suggestion.estimatedTime}
            </span>
          </div>
          <div class="suggestion-workflow">
            ${suggestion.workflow.map(service => `
              <span class="workflow-service">${service}</span>
            `).join('<i data-lucide="arrow-right" data-lucide-size="12"></i>')}
          </div>
        </div>
      `;
    } else if (suggestion.type === 'concept') {
      item.innerHTML = `
        <div class="suggestion-icon">
          <i data-lucide="${suggestion.icon}" data-lucide-size="24"></i>
        </div>
        <div class="suggestion-content">
          <div class="suggestion-title">${suggestion.title}</div>
          <div class="suggestion-description">${suggestion.description}</div>
          <div class="suggestion-services">
            ${suggestion.services.slice(0, 4).map(s => `
              <span class="service-tag">${s}</span>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ nameAttr: 'data-lucide' });
    }
    
    return item;
  },
  
  // Show workflow details
  showWorkflowDetails(workflow) {
    const container = document.createElement('div');
    container.className = 'workflow-details';
    
    container.innerHTML = `
      <div class="workflow-header">
        <h3>${workflow.title}</h3>
        <div class="workflow-meta">
          <span class="complexity-badge complexity-${workflow.complexity}">
            <i data-lucide="${this.getComplexityIcon(workflow.complexity)}" data-lucide-size="16"></i>
            ${workflow.complexity}
          </span>
          <span class="time-badge">
            <i data-lucide="clock" data-lucide-size="16"></i>
            ${workflow.estimatedTime}
          </span>
        </div>
      </div>
      
      <div class="workflow-diagram">
        <h4><i data-lucide="git-branch" data-lucide-size="18"></i> Architecture Flow</h4>
        <div class="workflow-flow">
          ${workflow.workflow.map((service, index) => {
            // Map service names to icon file names
            const serviceIconMap = {
              'S3': 's3',
              'CloudFront': 'cloudfront',
              'Route53': 'route53',
              'API Gateway': 'api-gateway',
              'Lambda': 'lambda',
              'DynamoDB': 'dynamodb',
              'Rekognition': 'rekognition',
              'SNS': 'sns',
              'SQS': 'sqs',
              'Glue': 'glue',
              'Athena': 'athena',
              'QuickSight': 'quicksight',
              'SageMaker': 'sagemaker',
              'RDS': 'rds',
              'VPC': 'vpc',
              'Secrets Manager': 'secrets-manager',
              'Cognito': 'cognito',
              'ECR': 'ecr',
              'ECS': 'ecs',
              'EKS': 'eks',
              'ALB': 'elb'
            };
            const iconName = serviceIconMap[service] || 'aws-cloud';
            return `
            <div class="workflow-node">
              <div class="node-icon">
                <img src="assets/icons/${iconName}.svg" alt="${service}" width="48" height="48">
              </div>
              <div class="node-label">${service}</div>
            </div>
            ${index < workflow.workflow.length - 1 ? '<i data-lucide="arrow-right" data-lucide-size="24" class="workflow-arrow"></i>' : ''}
          `}).join('')}
        </div>
      </div>
      
      <div class="workflow-steps">
        <h4><i data-lucide="list-checks" data-lucide-size="18"></i> Implementation Steps</h4>
        <ol class="steps-list">
          ${workflow.steps.map(step => `
            <li class="step-item">
              <i data-lucide="check-circle" data-lucide-size="18"></i>
              <span>${step}</span>
            </li>
          `).join('')}
        </ol>
      </div>
      
      <div class="workflow-services">
        <h4><i data-lucide="layers" data-lucide-size="18"></i> Required AWS Services</h4>
        <div class="services-grid">
          ${workflow.services.map(serviceId => `
            <div class="service-card-mini" data-service="${serviceId}">
              <i data-lucide="box" data-lucide-size="24"></i>
              <span>${this.formatServiceName(serviceId)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ nameAttr: 'data-lucide' });
    }
    
    return container;
  },
  
  // Helper functions
  getComplexityIcon(complexity) {
    const icons = {
      'beginner': 'smile',
      'intermediate': 'meh',
      'advanced': 'frown'
    };
    return icons[complexity] || 'help-circle';
  },
  
  formatServiceName(serviceId) {
    return serviceId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
};

// Export for use in other modules
window.IntelligentSearch = IntelligentSearch;
