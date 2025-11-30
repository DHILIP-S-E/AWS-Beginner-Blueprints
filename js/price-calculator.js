// AWS Service Price Calculator
class PriceCalculator {
    constructor() {
        this.pricing = {
            // Compute Services
            'ec2': {
                name: 'Amazon EC2',
                unit: 'per hour',
                tiers: {
                    't2.micro': { price: 0.0116, description: '1 vCPU, 1 GB RAM' },
                    't3.small': { price: 0.0208, description: '2 vCPU, 2 GB RAM' },
                    't3.medium': { price: 0.0416, description: '2 vCPU, 4 GB RAM' },
                    'm5.large': { price: 0.096, description: '2 vCPU, 8 GB RAM' }
                },
                freeTier: '750 hours/month of t2.micro'
            },
            'lambda': {
                name: 'AWS Lambda',
                unit: 'per 1M requests',
                tiers: {
                    'requests': { price: 0.20, description: 'First 1M requests/month' },
                    'duration': { price: 0.0000166667, description: 'Per GB-second' }
                },
                freeTier: '1M requests and 400,000 GB-seconds/month'
            },
            's3': {
                name: 'Amazon S3',
                unit: 'per GB/month',
                tiers: {
                    'standard': { price: 0.023, description: 'Standard storage' },
                    'ia': { price: 0.0125, description: 'Infrequent Access' },
                    'glacier': { price: 0.004, description: 'Glacier storage' }
                },
                freeTier: '5 GB Standard storage for 12 months'
            },
            'rds': {
                name: 'Amazon RDS',
                unit: 'per hour',
                tiers: {
                    'db.t3.micro': { price: 0.017, description: '1 vCPU, 1 GB RAM' },
                    'db.t3.small': { price: 0.034, description: '2 vCPU, 2 GB RAM' },
                    'db.m5.large': { price: 0.192, description: '2 vCPU, 8 GB RAM' }
                },
                freeTier: '750 hours/month of db.t2.micro'
            },
            'dynamodb': {
                name: 'Amazon DynamoDB',
                unit: 'per month',
                tiers: {
                    'ondemand': { price: 1.25, description: 'Per million read requests' },
                    'provisioned': { price: 0.65, description: 'Per RCU/month' }
                },
                freeTier: '25 GB storage and 25 RCU/WCU'
            },
            'api-gateway': {
                name: 'Amazon API Gateway',
                unit: 'per 1M requests',
                tiers: {
                    'rest': { price: 3.50, description: 'REST API calls' },
                    'http': { price: 1.00, description: 'HTTP API calls' }
                },
                freeTier: '1M API calls/month for 12 months'
            },
            'cloudfront': {
                name: 'Amazon CloudFront',
                unit: 'per GB',
                tiers: {
                    'data_transfer': { price: 0.085, description: 'Data transfer out' },
                    'requests': { price: 0.0075, description: 'Per 10,000 requests' }
                },
                freeTier: '1 TB data transfer and 10M requests/month'
            }
        };
    }

    // Get pricing info for a service
    getPricing(serviceId) {
        return this.pricing[serviceId] || null;
    }

    // Calculate monthly cost estimate
    calculateMonthlyCost(serviceId, tier, usage = 1) {
        const service = this.pricing[serviceId];
        if (!service || !service.tiers[tier]) return null;

        const tierInfo = service.tiers[tier];
        let monthlyCost = 0;

        switch (serviceId) {
            case 'ec2':
            case 'rds':
                // Hourly pricing * 24 hours * 30 days * usage
                monthlyCost = tierInfo.price * 24 * 30 * usage;
                break;
            case 'lambda':
                if (tier === 'requests') {
                    monthlyCost = tierInfo.price * usage; // usage in millions
                } else {
                    monthlyCost = tierInfo.price * usage; // usage in GB-seconds
                }
                break;
            case 's3':
                monthlyCost = tierInfo.price * usage; // usage in GB
                break;
            case 'dynamodb':
                monthlyCost = tierInfo.price * usage;
                break;
            case 'api-gateway':
                monthlyCost = tierInfo.price * usage; // usage in millions
                break;
            case 'cloudfront':
                monthlyCost = tierInfo.price * usage; // usage in GB or 10k requests
                break;
        }

        return {
            cost: monthlyCost,
            currency: 'USD',
            period: 'month'
        };
    }

    // Generate pricing HTML for service modal
    generatePricingHTML(serviceId) {
        const service = this.getPricing(serviceId);
        if (!service) {
            return '<p>Pricing information not available. Check <a href="https://aws.amazon.com/pricing/" target="_blank">AWS Pricing</a></p>';
        }

        let html = `
            <div class="pricing-section">
                <h4>💰 Pricing Calculator</h4>
                <div class="free-tier">
                    <span class="free-tier-badge">Free Tier</span>
                    <p>${service.freeTier}</p>
                </div>
                <div class="pricing-tiers">
        `;

        Object.entries(service.tiers).forEach(([tierKey, tierInfo]) => {
            html += `
                <div class="pricing-tier">
                    <div class="tier-info">
                        <strong>${tierKey}</strong>
                        <span class="tier-description">${tierInfo.description}</span>
                    </div>
                    <div class="tier-price">
                        $${tierInfo.price} ${service.unit}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="cost-calculator">
                    <h5>Monthly Cost Estimate</h5>
                    <div class="calculator-inputs">
                        <select id="tier-select-${serviceId}" class="tier-select">
                            ${Object.keys(service.tiers).map(tier => 
                                `<option value="${tier}">${tier}</option>`
                            ).join('')}
                        </select>
                        <input type="number" id="usage-input-${serviceId}" class="usage-input" 
                               value="1" min="0" step="0.1" placeholder="Usage">
                        <button onclick="calculateCost('${serviceId}')" class="calculate-btn">Calculate</button>
                    </div>
                    <div id="cost-result-${serviceId}" class="cost-result"></div>
                </div>
                <div class="pricing-disclaimer">
                    <small>* Prices are estimates in USD. Actual costs may vary. Check <a href="https://calculator.aws" target="_blank">AWS Pricing Calculator</a> for detailed estimates.</small>
                </div>
            </div>
        `;

        return html;
    }
}

// Global calculate cost function
function calculateCost(serviceId) {
    const calculator = window.priceCalculator;
    const tierSelect = document.getElementById(`tier-select-${serviceId}`);
    const usageInput = document.getElementById(`usage-input-${serviceId}`);
    const resultDiv = document.getElementById(`cost-result-${serviceId}`);

    if (!tierSelect || !usageInput || !resultDiv) return;

    const tier = tierSelect.value;
    const usage = parseFloat(usageInput.value) || 0;

    const result = calculator.calculateMonthlyCost(serviceId, tier, usage);
    
    if (result) {
        resultDiv.innerHTML = `
            <div class="cost-estimate">
                <span class="cost-amount">$${result.cost.toFixed(2)}</span>
                <span class="cost-period">/${result.period}</span>
            </div>
        `;
    } else {
        resultDiv.innerHTML = '<p class="error">Unable to calculate cost</p>';
    }
}

// Initialize global price calculator
window.priceCalculator = new PriceCalculator();