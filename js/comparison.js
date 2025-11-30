// Comparison functionality for alternative stacks
class ComparisonModule {
    constructor() {
        this.comparisonData = {
            'Cost Level': ['Low', 'Medium', 'High'],
            'Scaling Model': ['Manual', 'Auto', 'Serverless'],
            'Management Overhead': ['Low', 'Medium', 'High'],
            'Complexity': ['Beginner', 'Intermediate', 'Advanced']
        };
    }

    // Check if pattern has alternative stack
    getComparison(pattern) {
        if (!pattern.alternativeStack || pattern.alternativeStack.length === 0) {
            return null;
        }

        return {
            primary: pattern,
            alternative: {
                stack: pattern.alternativeStack,
                title: pattern.alternativeTitle || 'Alternative Approach',
                costLevel: pattern.alternativeCostLevel || pattern.costLevel,
                difficultyLevel: pattern.alternativeDifficultyLevel || pattern.difficultyLevel
            }
        };
    }

    // Generate comparison table
    generateComparisonTable(comparison) {
        const { primary, alternative } = comparison;
        
        const table = document.createElement('div');
        table.className = 'comparison-table';
        table.innerHTML = `
            <div class="comparison-header">
                <h3>Stack Comparison</h3>
                <p>Compare different approaches for this solution</p>
            </div>
            <div class="comparison-grid">
                <div class="comparison-row header-row">
                    <div class="comparison-cell">Aspect</div>
                    <div class="comparison-cell recommended">
                        ${primary.title} (Recommended)
                    </div>
                    <div class="comparison-cell">
                        ${alternative.title}
                    </div>
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Cost Level</div>
                    <div class="comparison-cell ${primary.costLevel === 'Low' ? 'highlight' : ''}">
                        ${primary.costLevel}
                    </div>
                    <div class="comparison-cell ${alternative.costLevel === 'Low' ? 'highlight' : ''}">
                        ${alternative.costLevel}
                    </div>
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Scaling Model</div>
                    <div class="comparison-cell">
                        ${this.getScalingModel(primary.stack)}
                    </div>
                    <div class="comparison-cell">
                        ${this.getScalingModel(alternative.stack)}
                    </div>
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Management Overhead</div>
                    <div class="comparison-cell">
                        ${this.getManagementOverhead(primary.stack)}
                    </div>
                    <div class="comparison-cell">
                        ${this.getManagementOverhead(alternative.stack)}
                    </div>
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Complexity</div>
                    <div class="comparison-cell ${primary.difficultyLevel === 'Beginner' ? 'highlight' : ''}">
                        ${primary.difficultyLevel}
                    </div>
                    <div class="comparison-cell ${alternative.difficultyLevel === 'Beginner' ? 'highlight' : ''}">
                        ${alternative.difficultyLevel}
                    </div>
                </div>
            </div>
        `;

        return table;
    }

    // Determine scaling model based on stack services
    getScalingModel(stack) {
        const serverlessServices = ['lambda', 'api-gateway', 'dynamodb', 's3', 'cloudfront'];
        const autoScalingServices = ['ecs', 'eks', 'auto-scaling', 'application-load-balancer'];
        
        const hasServerless = stack.some(service => 
            serverlessServices.includes(service.toLowerCase())
        );
        const hasAutoScaling = stack.some(service => 
            autoScalingServices.includes(service.toLowerCase())
        );

        if (hasServerless) return 'Serverless';
        if (hasAutoScaling) return 'Auto';
        return 'Manual';
    }

    // Determine management overhead based on stack services
    getManagementOverhead(stack) {
        const lowOverheadServices = ['lambda', 's3', 'dynamodb', 'cloudfront', 'api-gateway'];
        const highOverheadServices = ['ec2', 'rds', 'eks', 'emr'];
        
        const lowCount = stack.filter(service => 
            lowOverheadServices.includes(service.toLowerCase())
        ).length;
        const highCount = stack.filter(service => 
            highOverheadServices.includes(service.toLowerCase())
        ).length;

        if (lowCount > highCount) return 'Low';
        if (highCount > lowCount) return 'High';
        return 'Medium';
    }
}

// Global comparison instance
window.comparisonModule = new ComparisonModule();