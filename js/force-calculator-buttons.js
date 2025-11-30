// Force calculator buttons on all services
(function() {
    'use strict';
    
    function forceAddCalculators() {
        // Only add to service modal when it's open
        const modal = document.querySelector('.service-modal');
        if (modal && modal.style.display !== 'none' && !modal.classList.contains('calc-added')) {
            // Try multiple locations for the button
            const pricingSection = modal.querySelector('#service-pricing-info') ||
                                 modal.querySelector('.pricing-info') ||
                                 modal.querySelector('.service-card:first-child') ||
                                 modal.querySelector('.service-modal-body');
            
            if (pricingSection && !pricingSection.querySelector('.calc-btn')) {
                // Create a dedicated container for the calculator button
                const calcContainer = document.createElement('div');
                calcContainer.className = 'calc-button-container';
                calcContainer.innerHTML = `
                    <div class="calc-section-header">
                        <h4>💰 Cost Calculator</h4>
                        <p>Estimate pricing for this service</p>
                    </div>
                `;
                
                const calcBtn = document.createElement('button');
                calcBtn.className = 'calc-btn calc-btn-modal';
                calcBtn.innerHTML = '🧮 Calculate Costs';
                calcBtn.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const serviceId = extractServiceId(modal);
                    const serviceName = extractServiceName(modal);
                    showCalculatorModal(serviceId, serviceName);
                };
                
                calcContainer.appendChild(calcBtn);
                pricingSection.appendChild(calcContainer);
                modal.classList.add('calc-added');
            }
        }
        
        // Remove calc-added class when modal is closed
        if (modal && modal.style.display === 'none') {
            modal.classList.remove('calc-added');
        }
    }
    
    function addCalculatorButton(card, isModal = false) {
        // This function is now handled in forceAddCalculators for modals
        if (isModal) return;
        
        const serviceId = extractServiceId(card);
        const serviceName = extractServiceName(card);
        
        const btn = document.createElement('button');
        btn.className = 'calc-btn';
        btn.innerHTML = '💰 Cost';
        btn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            showCalculatorModal(serviceId, serviceName);
        };
        
        const container = card.querySelector('.card-actions') || 
                         card.querySelector('.service-actions') ||
                         card.querySelector('.service-card-header') ||
                         card;
        
        if (container) {
            container.appendChild(btn);
        }
    }
    
    function extractServiceId(card) {
        // Try multiple methods to get service ID
        const id = card.dataset.serviceId || 
                  card.querySelector('[data-service-id]')?.dataset.serviceId ||
                  card.id;
        
        if (id) return id;
        
        // Extract from title
        const title = extractServiceName(card);
        return getServiceIdFromName(title);
    }
    
    function extractServiceName(card) {
        const titleSelectors = ['h3', 'h4', '.service-title', '.card-title', '.service-name'];
        for (const selector of titleSelectors) {
            const element = card.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        return 'AWS Service';
    }
    
    function getServiceIdFromName(name) {
        if (!name) return 'general';
        const lower = name.toLowerCase();
        
        // Quick service mapping
        const services = {
            'lambda': 'lambda', 's3': 's3', 'ec2': 'ec2', 'rds': 'rds',
            'dynamodb': 'dynamodb', 'cloudfront': 'cloudfront', 'route53': 'route53',
            'api gateway': 'apigateway', 'cognito': 'cognito', 'sns': 'sns',
            'sqs': 'sqs', 'kinesis': 'kinesis', 'glue': 'glue', 'athena': 'athena',
            'sagemaker': 'sagemaker', 'rekognition': 'rekognition', 'ecs': 'ecs',
            'eks': 'eks', 'fargate': 'fargate', 'amplify': 'amplify'
        };
        
        for (const [key, value] of Object.entries(services)) {
            if (lower.includes(key)) return value;
        }
        return 'general';
    }
    
    function showCalculatorModal(serviceId, serviceName) {
        // Remove existing modal
        const existing = document.querySelector('.calc-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'calc-modal';
        modal.innerHTML = `
            <div class="calc-overlay" onclick="this.parentElement.remove()"></div>
            <div class="calc-content">
                <div class="calc-header">
                    <h3>💰 ${serviceName} Calculator</h3>
                    <button class="calc-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="calc-body">
                    <div class="calc-inputs">
                        <label>Usage Amount:</label>
                        <input type="number" id="calc-usage" placeholder="100" min="0">
                        <label>Usage Type:</label>
                        <select id="calc-type">
                            <option value="0.05">Compute Hours ($0.05/hour)</option>
                            <option value="0.023">Storage GB ($0.023/GB)</option>
                            <option value="0.0001">API Requests ($0.0001/1K)</option>
                            <option value="0.09">Data Transfer ($0.09/GB)</option>
                        </select>
                    </div>
                    <div class="calc-result" id="calc-result">
                        <div class="result-placeholder">Enter values to calculate cost</div>
                    </div>
                    <div class="calc-actions">
                        <button class="calc-btn-primary" onclick="calculateSimpleCost()">Calculate</button>
                        <button class="calc-btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                    </div>
                    <div class="calc-disclaimer">
                        <small>💡 Estimates only. Check AWS pricing for exact costs.</small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus first input
        const input = modal.querySelector('#calc-usage');
        if (input) input.focus();
    }
    
    // Simple calculator function
    window.calculateSimpleCost = function() {
        const usage = parseFloat(document.getElementById('calc-usage')?.value || 0);
        const rate = parseFloat(document.getElementById('calc-type')?.value || 0.05);
        const cost = usage * rate;
        
        const resultDiv = document.getElementById('calc-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="cost-summary">
                    <div class="total-cost">$${cost.toFixed(2)}/month</div>
                    <div class="cost-breakdown">
                        <div class="breakdown-item">${usage} units × $${rate.toFixed(4)} = $${cost.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }
    };
    
    // Run immediately and on intervals
    forceAddCalculators();
    
    // Run every 1 second to catch modal opens
    setInterval(forceAddCalculators, 1000);
    
    // Run on DOM changes
    const observer = new MutationObserver(() => {
        setTimeout(forceAddCalculators, 100);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceAddCalculators);
    }
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .calc-btn {
            background: #FF9900 !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            margin: 4px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            display: inline-block !important;
            z-index: 1000 !important;
            position: relative !important;
        }
        .calc-btn:hover {
            background: #e68900 !important;
            transform: translateY(-1px) !important;
        }
        .calc-btn-modal {
            width: 100% !important;
            padding: 12px 24px !important;
            font-size: 16px !important;
            margin: 10px 0 !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
        }
        .calc-button-container {
            background: #f8f9fa !important;
            border: 1px solid #e9ecef !important;
            border-radius: 8px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
        }
        .calc-section-header h4 {
            margin: 0 0 8px 0 !important;
            color: #333 !important;
            font-size: 18px !important;
            font-weight: 600 !important;
        }
        .calc-section-header p {
            margin: 0 0 15px 0 !important;
            color: #666 !important;
            font-size: 14px !important;
        }
        .calc-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        .calc-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.5) !important;
            cursor: pointer !important;
        }
        .calc-content {
            background: white !important;
            border-radius: 12px !important;
            max-width: 400px !important;
            width: 90% !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
            position: relative !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
        }
        .calc-header {
            padding: 20px !important;
            border-bottom: 1px solid #eee !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        .calc-header h3 {
            margin: 0 !important;
            color: #333 !important;
        }
        .calc-close {
            background: none !important;
            border: none !important;
            font-size: 24px !important;
            cursor: pointer !important;
            color: #999 !important;
            padding: 0 !important;
            width: 30px !important;
            height: 30px !important;
        }
        .calc-close:hover {
            color: #333 !important;
        }
        .calc-body {
            padding: 20px !important;
        }
        .calc-inputs label {
            display: block !important;
            margin: 15px 0 5px 0 !important;
            font-weight: 500 !important;
            color: #333 !important;
        }
        .calc-inputs input, .calc-inputs select {
            width: 100% !important;
            padding: 10px !important;
            border: 2px solid #ddd !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
        }
        .calc-inputs input:focus, .calc-inputs select:focus {
            border-color: #FF9900 !important;
            outline: none !important;
        }
        .calc-result {
            margin: 20px 0 !important;
            padding: 15px !important;
            background: #f8f9fa !important;
            border-radius: 8px !important;
            min-height: 60px !important;
            display: flex !important;
            align-items: center !important;
        }
        .result-placeholder {
            color: #666 !important;
            font-style: italic !important;
        }
        .cost-summary {
            width: 100% !important;
        }
        .total-cost {
            font-size: 24px !important;
            font-weight: bold !important;
            color: #FF9900 !important;
            margin-bottom: 10px !important;
        }
        .cost-breakdown {
            font-size: 14px !important;
            color: #666 !important;
        }
        .breakdown-item {
            margin: 3px 0 !important;
        }
        .calc-actions {
            display: flex !important;
            gap: 10px !important;
            margin: 20px 0 !important;
        }
        .calc-btn-primary {
            background: #FF9900 !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            flex: 1 !important;
        }
        .calc-btn-primary:hover {
            background: #e68900 !important;
        }
        .calc-btn-secondary {
            background: #6c757d !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
        }
        .calc-btn-secondary:hover {
            background: #5a6268 !important;
        }
        .calc-disclaimer {
            text-align: center !important;
            color: #666 !important;
            border-top: 1px solid #eee !important;
            padding-top: 15px !important;
        }
    `;
    document.head.appendChild(style);
    
})();