// Simple cost calculator for all AWS services
class SimpleCostCalculator {
    constructor() {
        this.servicePricing = {
            'lambda': { unit: 'requests', price: 0.0000002, freeTier: 1000000 },
            'ec2': { unit: 'hours', price: 0.0116, freeTier: 750 },
            's3': { unit: 'GB/month', price: 0.023, freeTier: 5 },
            'dynamodb': { unit: 'read units', price: 0.25, freeTier: 25 },
            'api-gateway': { unit: 'requests', price: 0.0000035, freeTier: 1000000 },
            'cloudfront': { unit: 'GB', price: 0.085, freeTier: 50 },
            'rds': { unit: 'hours', price: 0.017, freeTier: 750 },
            'cognito': { unit: 'MAU', price: 0.0055, freeTier: 50000 },
            'sqs': { unit: 'requests', price: 0.0000004, freeTier: 1000000 },
            'sns': { unit: 'requests', price: 0.0000005, freeTier: 1000000 }
        };
    }

    calculateCost(serviceId, usage) {
        const pricing = this.servicePricing[serviceId];
        if (!pricing) return { cost: 0, message: 'Pricing not available' };

        const billableUsage = Math.max(0, usage - pricing.freeTier);
        const cost = billableUsage * pricing.price;
        
        return {
            cost: cost.toFixed(2),
            freeTierUsed: Math.min(usage, pricing.freeTier),
            billableUsage,
            unit: pricing.unit
        };
    }

    showCalculator(serviceId) {
        const modal = document.createElement('div');
        modal.className = 'cost-calculator-modal';
        modal.innerHTML = `
            <div class="calculator-content">
                <h3>Cost Calculator - ${serviceId.toUpperCase()}</h3>
                <input type="number" id="usage-input" placeholder="Enter usage amount">
                <button onclick="this.calculate('${serviceId}')">Calculate</button>
                <div id="cost-result"></div>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    calculate(serviceId) {
        const usage = parseFloat(document.getElementById('usage-input').value) || 0;
        const result = this.calculateCost(serviceId, usage);
        document.getElementById('cost-result').innerHTML = `
            <p>Estimated monthly cost: $${result.cost}</p>
            <p>Free tier used: ${result.freeTierUsed} ${result.unit}</p>
        `;
    }
}

// Add calculator button to all service cards
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new SimpleCostCalculator();
    
    // Add calculator buttons to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const serviceId = card.dataset.serviceId;
        const calcBtn = document.createElement('button');
        calcBtn.textContent = '💰 Calculate Cost';
        calcBtn.className = 'calc-btn';
        calcBtn.onclick = () => calculator.showCalculator(serviceId);
        card.appendChild(calcBtn);
    });
});

// CSS for calculator
const style = document.createElement('style');
style.textContent = `
.cost-calculator-modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.calculator-content {
    background: white; padding: 20px; border-radius: 8px; max-width: 400px; width: 90%;
}
.calc-btn {
    background: #FF9900; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;
}
`;
document.head.appendChild(style);