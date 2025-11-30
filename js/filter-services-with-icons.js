// Filter to show only services that have icons
function filterServicesWithIcons() {
    const iconPath = './assets/icons/';
    const existingIcons = [
        'lambda', 'ec2', 's3', 'dynamodb', 'api-gateway', 'cloudfront', 'rds', 'cognito',
        'sqs', 'sns', 'eventbridge', 'kinesis', 'athena', 'rekognition', 'bedrock', 'sagemaker',
        'ecs', 'fargate', 'ecr', 'eks', 'elb', 'route53', 'vpc', 'iam', 'kms', 'waf',
        'secrets-manager', 'cloudwatch', 'codepipeline', 'codebuild', 'cloudformation',
        'step-functions', 'glue', 'redshift', 'quicksight', 'ebs', 'efs', 'glacier',
        'amplify', 'appsync', 'iot-core', 'connect', 'lex', 'polly', 'transcribe',
        'comprehend', 'translate', 'textract', 'personalize', 'forecast', 'auto-scaling',
        'elasticache', 'documentdb', 'neptune', 'timestream', 'msk', 'opensearch',
        'dms', 'snowball', 'workspaces', 'chime', 'elemental', 'blockchain', 'braket',
        'batch', 'lightsail', 'ses', 'workmail', 'workdocs', 'appstream', 'gamelift',
        'detective', 'guardduty', 'macie', 'inspector', 'certificate-manager',
        'directory-service', 'organizations', 'config', 'systems-manager', 'cloudtrail',
        'trusted-advisor'
    ];

    // Filter services to show only those with icons
    window.filterServicesByIcons = function(allServices) {
        return allServices.filter(service => existingIcons.includes(service.id));
    };

    // Update service rendering to use filtered list
    const originalRenderServices = window.renderServices;
    if (originalRenderServices) {
        window.renderServices = function(services) {
            const filteredServices = filterServicesByIcons(services);
            return originalRenderServices(filteredServices);
        };
    }
}

// Initialize filter
document.addEventListener('DOMContentLoaded', filterServicesWithIcons);