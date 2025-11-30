// AWS Service Icons mapping - using local icons that match official AWS Architecture Icons
const AWS_ICONS = {
    // Compute
    'ec2': './assets/icons/ec2.svg',
    'lambda': './assets/icons/lambda.svg',
    'ecs': './assets/icons/ecs.svg',
    'eks': './assets/icons/eks.svg',
    'fargate': './assets/icons/fargate.svg',
    'batch': './assets/icons/batch.svg',
    'lightsail': './assets/icons/lightsail.svg',

    // Storage
    's3': './assets/icons/s3.svg',
    'ebs': './assets/icons/ebs.svg',
    'efs': './assets/icons/efs.svg',
    'fsx': './assets/icons/fsx.svg',
    'glacier': './assets/icons/glacier.svg',

    // Database
    'rds': './assets/icons/rds.svg',
    'dynamodb': './assets/icons/dynamodb.svg',
    'redshift': './assets/icons/redshift.svg',
    'aurora': './assets/icons/aurora.svg',
    'elasticache': './assets/icons/elasticache.svg',
    'documentdb': './assets/icons/documentdb.svg',

    // Networking
    'vpc': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-VPC_64.svg',
    'cloudfront': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-CloudFront_64.svg',
    'route53': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Route-53_64.svg',
    'api-gateway': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-API-Gateway_64.svg',
    'application-load-balancer': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Elastic-Load-Balancing_64.svg',
    'direct-connect': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-Direct-Connect_64.svg',

    // Security
    'iam': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-Identity-and-Access-Management_64.svg',
    'cognito': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Cognito_64.svg',
    'kms': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-Key-Management-Service_64.svg',
    'secrets-manager': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-Secrets-Manager_64.svg',
    'waf': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-WAF_64.svg',
    'shield': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-Shield_64.svg',

    // Analytics
    'athena': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Athena_64.svg',
    'emr': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-EMR_64.svg',
    'kinesis': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Kinesis_64.svg',
    'glue': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-Glue_64.svg',
    'quicksight': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-QuickSight_64.svg',

    // AI/ML
    'sagemaker': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-SageMaker_64.svg',
    'rekognition': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Rekognition_64.svg',
    'comprehend': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Comprehend_64.svg',
    'textract': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Textract_64.svg',
    'bedrock': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Bedrock_64.svg',

    // DevOps
    'codebuild': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-CodeBuild_64.svg',
    'codedeploy': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-CodeDeploy_64.svg',
    'codepipeline': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-CodePipeline_64.svg',
    'cloudformation': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_AWS-CloudFormation_64.svg',
    'cloudwatch': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-CloudWatch_64.svg',

    // Messaging
    'sns': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Simple-Notification-Service_64.svg',
    'sqs': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-Simple-Queue-Service_64.svg',
    'eventbridge': 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amazon-EventBridge_64.svg',

    // Default placeholder
    'default': './assets/icons/aws-cloud.svg'
};

// Function to get icon URL for a service
function getServiceIcon(serviceId) {
    const normalizedId = serviceId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return AWS_ICONS[normalizedId] || AWS_ICONS['default'];
}

// Export for use in other modules
window.getServiceIcon = getServiceIcon;
window.AWS_ICONS = AWS_ICONS;