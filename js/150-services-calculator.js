// 150+ AWS Services Calculator Support
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        init150ServicesCalculator();
    }, 1500);
});

function init150ServicesCalculator() {
    // Extend service detection for 150+ services
    window.extractServiceIdFromText = function(text) {
        if (!text) return 'general';
        const lower = text.toLowerCase();
        
        const serviceMap = {
            // Compute (15 services)
            'lambda': 'lambda', 'ec2': 'ec2', 'ecs': 'ecs', 'eks': 'eks', 'fargate': 'fargate',
            'batch': 'batch', 'lightsail': 'lightsail', 'outposts': 'outposts', 'wavelength': 'wavelength',
            'local zones': 'localzones', 'app runner': 'apprunner', 'copilot': 'copilot',
            'elastic beanstalk': 'beanstalk', 'sam': 'sam', 'proton': 'proton',
            
            // Storage (12 services)
            's3': 's3', 'ebs': 'ebs', 'efs': 'efs', 'fsx': 'fsx', 'storage gateway': 'storagegateway',
            'backup': 'backup', 'datasync': 'datasync', 'snow': 'snow', 'snowball': 'snow',
            'snowmobile': 'snow', 'snowcone': 'snow', 'file cache': 'filecache',
            
            // Database (15 services)
            'rds': 'rds', 'dynamodb': 'dynamodb', 'elasticache': 'elasticache', 'redshift': 'redshift',
            'aurora': 'aurora', 'documentdb': 'documentdb', 'neptune': 'neptune', 'timestream': 'timestream',
            'keyspaces': 'keyspaces', 'qldb': 'qldb', 'memorydb': 'memorydb', 'database migration': 'dms',
            'redshift serverless': 'redshiftserverless', 'aurora serverless': 'auroraserverless',
            'rds proxy': 'rdsproxy',
            
            // Networking (18 services)
            'vpc': 'vpc', 'cloudfront': 'cloudfront', 'route53': 'route53', 'elb': 'elb',
            'api gateway': 'apigateway', 'direct connect': 'directconnect', 'transit gateway': 'transitgateway',
            'vpn': 'vpn', 'global accelerator': 'globalaccelerator', 'app mesh': 'appmesh',
            'cloud map': 'cloudmap', 'private link': 'privatelink', 'client vpn': 'clientvpn',
            'site-to-site vpn': 'sitevpn', 'network firewall': 'networkfirewall',
            'verified access': 'verifiedaccess', 'lattice': 'lattice', 'cloud wan': 'cloudwan',
            
            // Security (20 services)
            'iam': 'iam', 'cognito': 'cognito', 'secrets manager': 'secretsmanager', 'kms': 'kms',
            'certificate manager': 'acm', 'waf': 'waf', 'shield': 'shield', 'guardduty': 'guardduty',
            'inspector': 'inspector', 'macie': 'macie', 'security hub': 'securityhub',
            'detective': 'detective', 'access analyzer': 'accessanalyzer', 'cloudhsm': 'cloudhsm',
            'directory service': 'directoryservice', 'single sign-on': 'sso', 'resource access manager': 'ram',
            'firewall manager': 'firewallmanager', 'audit manager': 'auditmanager', 'artifact': 'artifact',
            
            // Analytics (18 services)
            'kinesis': 'kinesis', 'glue': 'glue', 'athena': 'athena', 'quicksight': 'quicksight',
            'emr': 'emr', 'opensearch': 'opensearch', 'msk': 'msk', 'data pipeline': 'datapipeline',
            'lake formation': 'lakeformation', 'data exchange': 'dataexchange', 'finspace': 'finspace',
            'kinesis video': 'kinesisvideo', 'kinesis analytics': 'kinesisanalytics',
            'redshift spectrum': 'redshiftspectrum', 'clean rooms': 'cleanrooms',
            'entity resolution': 'entityresolution', 'healthlake': 'healthlake', 'supply chain': 'supplychain',
            
            // Machine Learning (25 services)
            'sagemaker': 'sagemaker', 'rekognition': 'rekognition', 'comprehend': 'comprehend',
            'textract': 'textract', 'polly': 'polly', 'transcribe': 'transcribe', 'translate': 'translate',
            'lex': 'lex', 'bedrock': 'bedrock', 'personalize': 'personalize', 'forecast': 'forecast',
            'fraud detector': 'frauddetector', 'kendra': 'kendra', 'lookout': 'lookout',
            'monitron': 'monitron', 'panorama': 'panorama', 'deepracer': 'deepracer',
            'deeplens': 'deeplens', 'augmented ai': 'a2i', 'codewhisperer': 'codewhisperer',
            'devops guru': 'devopsguru', 'lookout for vision': 'lookoutvision',
            'lookout for equipment': 'lookoutequipment', 'lookout for metrics': 'lookoutmetrics',
            'comprehend medical': 'comprehendmedical',
            
            // Developer Tools (15 services)
            'codepipeline': 'codepipeline', 'codebuild': 'codebuild', 'codecommit': 'codecommit',
            'codedeploy': 'codedeploy', 'codestar': 'codestar', 'codeguru': 'codeguru',
            'codeartifact': 'codeartifact', 'cloud9': 'cloud9', 'x-ray': 'xray',
            'cloudshell': 'cloudshell', 'application composer': 'applicationcomposer',
            'fault injection simulator': 'fis', 'migration hub refactor spaces': 'refactorspaces',
            'application discovery service': 'ads', 'codestar connections': 'codestarconnections',
            
            // Management (25 services)
            'cloudwatch': 'cloudwatch', 'cloudtrail': 'cloudtrail', 'cloudformation': 'cloudformation',
            'config': 'config', 'systems manager': 'systemsmanager', 'trusted advisor': 'trustedadvisor',
            'well-architected': 'wellarchitected', 'service catalog': 'servicecatalog',
            'organizations': 'organizations', 'control tower': 'controltower',
            'license manager': 'licensemanager', 'resource groups': 'resourcegroups',
            'tag editor': 'tageditor', 'personal health': 'personalhealth', 'chatbot': 'chatbot',
            'launch wizard': 'launchwizard', 'auto scaling': 'autoscaling', 'opsworks': 'opsworks',
            'service quotas': 'servicequotas', 'compute optimizer': 'computeoptimizer',
            'resource explorer': 'resourceexplorer', 'application insights': 'applicationinsights',
            'resilience hub': 'resiliencehub', 'grafana': 'grafana', 'prometheus': 'prometheus'
        };
        
        for (const [key, value] of Object.entries(serviceMap)) {
            if (lower.includes(key)) return value;
        }
        return 'general';
    };

    // Add pricing for major services
    window.getServicePricing = function(serviceId) {
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
                    </select>
                    <label>Hours per Month:</label>
                    <input type="number" id="ec2-hours" placeholder="730" step="10" min="0">
                    <label>Storage (GB):</label>
                    <input type="number" id="ec2-storage" placeholder="20" step="5" min="8">
                `
            },
            'rds': {
                inputs: `
                    <label>Instance Class:</label>
                    <select id="rds-class">
                        <option value="db.t3.micro">db.t3.micro ($0.017/hour)</option>
                        <option value="db.t3.small" selected>db.t3.small ($0.034/hour)</option>
                        <option value="db.m5.large">db.m5.large ($0.192/hour)</option>
                    </select>
                    <label>Storage (GB):</label>
                    <input type="number" id="rds-storage" placeholder="100" step="10" min="20">
                `
            },
            'cloudfront': {
                inputs: `
                    <label>Data Transfer Out (GB):</label>
                    <input type="number" id="cloudfront-transfer" placeholder="100" step="10" min="0">
                    <label>HTTP Requests (millions):</label>
                    <input type="number" id="cloudfront-requests" placeholder="1" step="0.1" min="0">
                `
            },
            'general': {
                inputs: `
                    <label>Usage Amount:</label>
                    <input type="number" id="general-usage" placeholder="100" step="10" min="0">
                    <label>Service Type:</label>
                    <select id="general-type">
                        <option value="compute">Compute Hours ($0.05/hour)</option>
                        <option value="storage">Storage GB ($0.023/GB)</option>
                        <option value="requests">API Requests ($0.0001/1K)</option>
                        <option value="data">Data Transfer ($0.09/GB)</option>
                    </select>
                `
            }
        };
        
        return pricingData[serviceId] || pricingData['general'];
    };

    // Enhanced calculator with 150+ service support
    window.calculateCost = function(serviceId) {
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
                        `Free tier: 5GB + 20K requests + 1GB transfer`
                    ];
                    break;
                    
                case 'ec2':
                    const instanceType = document.getElementById('ec2-type')?.value || 't3.small';
                    const hours = parseFloat(document.getElementById('ec2-hours')?.value || 730);
                    const storage = parseFloat(document.getElementById('ec2-storage')?.value || 20);
                    
                    const instancePricing = {
                        't3.micro': 0.0104, 't3.small': 0.0208, 't3.medium': 0.0416, 'm5.large': 0.096
                    };
                    
                    const instanceCost = (instancePricing[instanceType] || 0.0208) * hours;
                    const storageCost = storage * 0.10;
                    
                    cost = instanceCost + storageCost;
                    breakdown = [
                        `Instance: $${instanceCost.toFixed(2)}`,
                        `Storage: $${storageCost.toFixed(2)}`,
                        `Free tier: 750 hours t2.micro`
                    ];
                    break;
                    
                case 'rds':
                    const instanceClass = document.getElementById('rds-class')?.value || 'db.t3.small';
                    const storage = parseFloat(document.getElementById('rds-storage')?.value || 100);
                    
                    const rdsPricing = {
                        'db.t3.micro': 0.017, 'db.t3.small': 0.034, 'db.m5.large': 0.192
                    };
                    
                    const instanceCost = (rdsPricing[instanceClass] || 0.034) * 730;
                    const storageCost = storage * 0.115;
                    
                    cost = instanceCost + storageCost;
                    breakdown = [
                        `Instance: $${instanceCost.toFixed(2)}`,
                        `Storage: $${storageCost.toFixed(2)}`,
                        `Free tier: 750 hours db.t2.micro`
                    ];
                    break;
                    
                case 'cloudfront':
                    const transfer = parseFloat(document.getElementById('cloudfront-transfer')?.value || 0);
                    const requests = parseFloat(document.getElementById('cloudfront-requests')?.value || 0);
                    
                    const transferCost = Math.max(0, (transfer - 1) * 0.085);
                    const requestCost = Math.max(0, (requests * 1000000 - 10000000) * 0.0075 / 1000000);
                    
                    cost = transferCost + requestCost;
                    breakdown = [
                        `Data Transfer: $${transferCost.toFixed(2)}`,
                        `Requests: $${requestCost.toFixed(2)}`,
                        `Free tier: 1TB + 10M requests`
                    ];
                    break;
                    
                default:
                    const usage = parseFloat(document.getElementById('general-usage')?.value || 0);
                    const type = document.getElementById('general-type')?.value || 'compute';
                    
                    const rates = {
                        'compute': 0.05, 'storage': 0.023, 'requests': 0.0001, 'data': 0.09
                    };
                    
                    cost = usage * (rates[type] || 0.01);
                    breakdown = [`${usage} units × $${(rates[type] || 0.01).toFixed(4)} = $${cost.toFixed(2)}`];
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
            resultDiv.innerHTML = `<div class="error">Error calculating cost. Please check inputs.</div>`;
        }
    };
}