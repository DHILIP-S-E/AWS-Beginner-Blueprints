// Fix calculator for all services
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initCalculatorSystem();
    }, 1000);
});

function initCalculatorSystem() {
    const addCalculatorToCards = () => {
        // Add to service cards
        const serviceCards = document.querySelectorAll('.service-card, .service-item, .service-grid .card, .recommendation-card, .trending-card');
        serviceCards.forEach(card => {
            if (!card.querySelector('.calc-btn')) {
                const serviceId = card.dataset.serviceId || 
                                card.querySelector('[data-service-id]')?.dataset.serviceId ||
                                extractServiceIdFromCard(card) || 'general';
                
                const calcBtn = document.createElement('button');
                calcBtn.textContent = '💰 Cost';
                calcBtn.className = 'calc-btn';
                calcBtn.onclick = (e) => {
                    e.stopPropagation();
                    showCalculator(serviceId, card);
                };
                
                const buttonContainer = card.querySelector('.card-actions') || 
                                      card.querySelector('.service-actions') ||
                                      card.querySelector('.service-card-header') ||
                                      card;
                buttonContainer.appendChild(calcBtn);
            }
        });
        
        // Add to service modal
        const serviceModal = document.querySelector('.service-modal');
        if (serviceModal && serviceModal.style.display !== 'none' && !serviceModal.querySelector('.calc-btn-modal')) {
            const modalTitle = serviceModal.querySelector('#service-modal-title')?.textContent;
            const serviceId = extractServiceIdFromText(modalTitle) || 'general';
            
            const calcBtn = document.createElement('button');
            calcBtn.textContent = '💰 Calculate Cost';
            calcBtn.className = 'calc-btn calc-btn-modal';
            calcBtn.onclick = (e) => {
                e.stopPropagation();
                showCalculator(serviceId, null, modalTitle);
            };
            
            const pricingSection = serviceModal.querySelector('#service-pricing-info');
            if (pricingSection) {
                pricingSection.appendChild(calcBtn);
            }
        }
    };

    function extractServiceIdFromCard(card) {
        const title = card.querySelector('h3, h4, .service-title, .card-title')?.textContent?.toLowerCase();
        return extractServiceIdFromText(title);
    }
    
    function extractServiceIdFromText(text) {
        if (!text) return 'general';
        const lower = text.toLowerCase();
        
        const serviceMap = {
            'lambda': 'lambda',
            's3': 's3', 'simple storage': 's3',
            'dynamodb': 'dynamodb',
            'api gateway': 'api-gateway',
            'cloudfront': 'cloudfront',
            'rds': 'rds', 'relational database': 'rds',
            'ec2': 'ec2', 'elastic compute': 'ec2',
            'cognito': 'cognito',
            'sns': 'sns', 'simple notification': 'sns',
            'sqs': 'sqs', 'simple queue': 'sqs',
            'ecs': 'ecs', 'container service': 'ecs',
            'eks': 'eks', 'kubernetes': 'eks',
            'amplify': 'amplify',
            'appsync': 'appsync',
            'kinesis': 'kinesis',
            'glue': 'glue',
            'athena': 'athena',
            'quicksight': 'quicksight',
            'sagemaker': 'sagemaker',
            'rekognition': 'rekognition',
            'comprehend': 'comprehend',
            'textract': 'textract',
            'polly': 'polly',
            'transcribe': 'transcribe',
            'translate': 'translate',
            'lex': 'lex',
            'bedrock': 'bedrock',
            'cloudwatch': 'cloudwatch',
            'cloudtrail': 'cloudtrail',
            'iam': 'iam',
            'vpc': 'vpc',
            'route53': 'route53',
            'elb': 'elb', 'load balancer': 'elb',
            'auto scaling': 'autoscaling',
            'elastic beanstalk': 'beanstalk',
            'cloudformation': 'cloudformation',
            'codepipeline': 'codepipeline',
            'codebuild': 'codebuild',
            'codecommit': 'codecommit',
            'codedeploy': 'codedeploy'
        };
        
        for (const [key, value] of Object.entries(serviceMap)) {
            if (lower.includes(key)) return value;
        }
        return 'general';
    }

    window.showCalculator = (serviceId, sourceCard, serviceName) => {
        const existingModal = document.querySelector('.calc-modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'calc-modal';
        
        const serviceDisplayName = serviceName || getServiceName(serviceId, sourceCard);
        const pricingInfo = getServicePricing(serviceId);
        
        modal.innerHTML = `
            <div class="calc-overlay" onclick="this.parentElement.remove()"></div>
            <div class="calc-content">
                <div class="calc-header">
                    <h3>💰 ${serviceDisplayName} Cost Calculator</h3>
                    <button class="calc-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="calc-body">
                    <div class="calc-inputs">
                        ${pricingInfo.inputs}
                    </div>
                    <div class="calc-result" id="calc-result">
                        <div class="result-placeholder">Enter values above to calculate costs</div>
                    </div>
                    <div class="calc-actions">
                        <button class="calc-btn-primary" onclick="calculateCost('${serviceId}')">Calculate Cost</button>
                        <button class="calc-btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                    </div>
                    <div class="calc-disclaimer">
                        <small>💡 Estimates based on AWS pricing. Actual costs may vary.</small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    };

    function getServiceName(serviceId, sourceCard) {
        if (sourceCard) {
            const title = sourceCard.querySelector('h3, h4, .service-title, .card-title')?.textContent;
            if (title) return title;
        }
        
        const serviceNames = {
            'lambda': 'AWS Lambda',
            's3': 'Amazon S3',
            'dynamodb': 'Amazon DynamoDB',
            'api-gateway': 'API Gateway',
            'cloudfront': 'CloudFront',
            'rds': 'Amazon RDS',
            'ec2': 'Amazon EC2',
            'cognito': 'Amazon Cognito',
            'sns': 'Amazon SNS',
            'sqs': 'Amazon SQS'
        };
        
        return serviceNames[serviceId] || 'AWS Service';
    }

    function getServicePricing(serviceId) {
        const pricingData = {
            'lambda': {
                inputs: `
                    <label>Monthly Requests (millions):</label>
                    <input type="number" id="lambda-requests" placeholder="1" step="0.1" min="0">
                    <label>Average Duration (ms):</label>
                    <input type="number" id="lambda-duration" placeholder="1000" step="100" min="100">
                    <label>Memory (MB):</label>
                    <select id="lambda-memory">
                        <option value="128">128 MB</option>
                        <option value="256" selected>256 MB</option>
                        <option value="512">512 MB</option>
                        <option value="1024">1024 MB</option>
                    </select>
                `
            },
            's3': {
                inputs: `
                    <label>Storage (GB):</label>
                    <input type="number" id="s3-storage" placeholder="100" step="10" min="0">
                    <label>Monthly Requests (thousands):</label>
                    <input type="number" id="s3-requests" placeholder="10" step="1" min="0">
                    <label>Data Transfer Out (GB):</label>
                    <input type="number" id="s3-transfer" placeholder="10" step="1" min="0">
                `
            },
            'ec2': {
                inputs: `
                    <label>Instance Type:</label>
                    <select id="ec2-type">
                        <option value="t3.micro">t3.micro ($0.0104/hour)</option>
                        <option value="t3.small" selected>t3.small ($0.0208/hour)</option>
                        <option value="t3.medium">t3.medium ($0.0416/hour)</option>
                        <option value="m5.large">m5.large ($0.096/hour)</option>
                        <option value="c5.large">c5.large ($0.085/hour)</option>
                    </select>
                    <label>Hours per Month:</label>
                    <input type="number" id="ec2-hours" placeholder="730" step="10" min="0">
                    <label>Storage (GB):</label>
                    <input type="number" id="ec2-storage" placeholder="20" step="5" min="8">
                `
            },
            'rds': {
                inputs: `
                    <label>Database Engine:</label>
                    <select id="rds-engine">
                        <option value="mysql">MySQL</option>
                        <option value="postgres" selected>PostgreSQL</option>
                        <option value="oracle">Oracle</option>
                        <option value="sqlserver">SQL Server</option>
                    </select>
                    <label>Instance Class:</label>
                    <select id="rds-class">
                        <option value="db.t3.micro">db.t3.micro</option>
                        <option value="db.t3.small" selected>db.t3.small</option>
                        <option value="db.m5.large">db.m5.large</option>
                    </select>
                    <label>Storage (GB):</label>
                    <input type="number" id="rds-storage" placeholder="100" step="10" min="20">
                `
            },
            'general': {
                inputs: `
                    <label>Usage Amount:</label>
                    <input type="number" id="general-usage" placeholder="100" step="10" min="0">
                    <label>Usage Type:</label>
                    <select id="general-type">
                        <option value="requests">Requests</option>
                        <option value="storage">Storage (GB)</option>
                        <option value="compute">Compute Hours</option>
                    </select>
                `
            }
        };
        
        return pricingData[serviceId] || pricingData['general'];
    }

    window.calculateCost = (serviceId) => {
        const resultDiv = document.getElementById('calc-result');
        let cost = 0;
        let breakdown = [];
        
        try {
            switch (serviceId) {
                case 'lambda':
                    const requests = parseFloat(document.getElementById('lambda-requests')?.value || 0);
                    const duration = parseFloat(document.getElementById('lambda-duration')?.value || 1000);
                    const memory = parseFloat(document.getElementById('lambda-memory')?.value || 256);
                    
                    const gbSeconds = (requests * 1000000 * duration / 1000) * (memory / 1024);
                    const requestCost = Math.max(0, (requests * 1000000 - 1000000) * 0.0000002);
                    const computeCost = Math.max(0, (gbSeconds - 400000) * 0.0000166667);
                    
                    cost = requestCost + computeCost;
                    breakdown = [
                        `Requests: $${requestCost.toFixed(2)}`,
                        `Compute: $${computeCost.toFixed(2)}`,
                        `Free tier: 1M requests + 400K GB-seconds`
                    ];
                    break;
                    
                case 's3':
                    const storage = parseFloat(document.getElementById('s3-storage')?.value || 0);
                    const requests = parseFloat(document.getElementById('s3-requests')?.value || 0);
                    const transfer = parseFloat(document.getElementById('s3-transfer')?.value || 0);
                    
                    const storageCost = Math.max(0, (storage - 5) * 0.023);
                    const requestCost = Math.max(0, (requests * 1000 - 20000) * 0.0004 / 1000);
                    const transferCost = Math.max(0, (transfer - 1) * 0.09);
                    
                    cost = storageCost + requestCost + transferCost;
                    breakdown = [
                        `Storage: $${storageCost.toFixed(2)}`,
                        `Requests: $${requestCost.toFixed(2)}`,
                        `Transfer: $${transferCost.toFixed(2)}`,
                        `Free tier: 5GB storage + 20K requests + 1GB transfer`
                    ];
                    break;
                    
                case 'ec2':
                    const instanceType = document.getElementById('ec2-type')?.value || 't3.small';
                    const hours = parseFloat(document.getElementById('ec2-hours')?.value || 730);
                    const storage = parseFloat(document.getElementById('ec2-storage')?.value || 20);
                    
                    const instancePricing = {
                        't3.micro': 0.0104,
                        't3.small': 0.0208,
                        't3.medium': 0.0416,
                        'm5.large': 0.096,
                        'c5.large': 0.085
                    };
                    
                    const instanceCost = (instancePricing[instanceType] || 0.0208) * hours;
                    const storageCost = storage * 0.10;
                    
                    cost = instanceCost + storageCost;
                    breakdown = [
                        `Instance (${instanceType}): $${instanceCost.toFixed(2)}`,
                        `Storage (${storage}GB): $${storageCost.toFixed(2)}`,
                        `Free tier: 750 hours t2.micro + 30GB storage`
                    ];
                    break;
                    
                case 'rds':
                    const engine = document.getElementById('rds-engine')?.value || 'postgres';
                    const instanceClass = document.getElementById('rds-class')?.value || 'db.t3.small';
                    const storage = parseFloat(document.getElementById('rds-storage')?.value || 100);
                    
                    const rdsPricing = {
                        'db.t3.micro': 0.017,
                        'db.t3.small': 0.034,
                        'db.m5.large': 0.192
                    };
                    
                    const instanceCost = (rdsPricing[instanceClass] || 0.034) * 730;
                    const storageCost = storage * 0.115;
                    
                    cost = instanceCost + storageCost;
                    breakdown = [
                        `Instance (${instanceClass}): $${instanceCost.toFixed(2)}`,
                        `Storage (${storage}GB): $${storageCost.toFixed(2)}`,
                        `Free tier: 750 hours db.t2.micro + 20GB storage`
                    ];
                    break;
                    
                default:
                    const usage = parseFloat(document.getElementById('general-usage')?.value || 0);
                    cost = usage * 0.01;
                    breakdown = [`Estimated cost based on ${usage} units`];
            }
            
            resultDiv.innerHTML = `
                <div class="cost-summary">
                    <div class="total-cost">$${cost.toFixed(2)}/month</div>
                    <div class="cost-breakdown">
                        ${breakdown.map(item => `<div class="breakdown-item">${item}</div>`).join('')}
                    </div>
                </div>
            `;
            
        } catch (error) {
            resultDiv.innerHTML = `<div class="error">Error calculating cost. Please check your inputs.</div>`;
        }
    };

    addCalculatorToCards();
    
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && 
                        (node.classList?.contains('service-card') || 
                         node.classList?.contains('service-item') ||
                         node.querySelector?.('.service-card, .service-item'))) {
                        shouldUpdate = true;
                    }
                });
            }
        });
        if (shouldUpdate) {
            setTimeout(addCalculatorToCards, 100);
        }
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: false
    });
}

// Enhanced CSS for calculator
const style = document.createElement('style');
style.textContent = `
.calc-btn {
    background: #FF9900; color: white; border: none; padding: 5px 10px; 
    border-radius: 4px; cursor: pointer; margin: 5px; font-size: 12px;
    transition: all 0.2s ease;
}
.calc-btn:hover { background: #e68900; transform: translateY(-1px); }
.calc-btn-modal {
    background: #FF9900; color: white; border: none; padding: 10px 20px;
    border-radius: 6px; cursor: pointer; margin: 10px 0; font-size: 14px;
    width: 100%; transition: all 0.2s ease;
}
.calc-btn-modal:hover { background: #e68900; }

.calc-modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;
    display: flex; align-items: center; justify-content: center;
}
.calc-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); cursor: pointer;
}
.calc-content {
    background: white; border-radius: 12px; max-width: 500px; width: 90%;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3); position: relative;
    max-height: 80vh; overflow-y: auto;
}
.calc-header {
    padding: 20px; border-bottom: 1px solid #eee; display: flex;
    justify-content: space-between; align-items: center;
}
.calc-header h3 { margin: 0; color: #333; }
.calc-close {
    background: none; border: none; font-size: 24px; cursor: pointer;
    color: #999; padding: 0; width: 30px; height: 30px;
}
.calc-close:hover { color: #333; }
.calc-body { padding: 20px; }
.calc-inputs label {
    display: block; margin: 15px 0 5px 0; font-weight: 500; color: #333;
}
.calc-inputs input, .calc-inputs select {
    width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px;
    font-size: 14px; box-sizing: border-box;
}
.calc-inputs input:focus, .calc-inputs select:focus {
    border-color: #FF9900; outline: none;
}
.calc-result {
    margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;
    min-height: 60px; display: flex; align-items: center;
}
.result-placeholder { color: #666; font-style: italic; }
.cost-summary { width: 100%; }
.total-cost {
    font-size: 24px; font-weight: bold; color: #FF9900; margin-bottom: 10px;
}
.cost-breakdown { font-size: 14px; color: #666; }
.breakdown-item { margin: 3px 0; }
.calc-actions {
    display: flex; gap: 10px; margin: 20px 0;
}
.calc-btn-primary {
    background: #FF9900; color: white; border: none; padding: 12px 24px;
    border-radius: 6px; cursor: pointer; font-weight: 500; flex: 1;
}
.calc-btn-primary:hover { background: #e68900; }
.calc-btn-secondary {
    background: #6c757d; color: white; border: none; padding: 12px 24px;
    border-radius: 6px; cursor: pointer; font-weight: 500;
}
.calc-btn-secondary:hover { background: #5a6268; }
.calc-disclaimer {
    text-align: center; color: #666; border-top: 1px solid #eee; padding-top: 15px;
}
.error { color: #dc3545; font-weight: 500; }
`;
document.head.appendChild(style);