// Show only services that have icons in the service listing
const servicesWithIcons = [
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
    'trusted-advisor', 'support', 'well-architected', 'cost-explorer', 'budgets'
];

// Override service rendering to show only services with icons
document.addEventListener('DOMContentLoaded', () => {
    const originalRenderServices = window.renderServiceGrid;
    if (originalRenderServices) {
        window.renderServiceGrid = function(services) {
            const filteredServices = services.filter(service => 
                servicesWithIcons.includes(service.id)
            );
            return originalRenderServices(filteredServices);
        };
    }
});