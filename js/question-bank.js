const QuestionBank = {
    questions: [
        // Compute Services
        { q: "how do i run code without servers", answer: "Serverless Computing Guide", services: ["lambda"], pattern: "serverless-api" },
        { q: "deploy virtual machine", answer: "Virtual Machine Setup", services: ["ec2"], pattern: "container-app" },
        { q: "auto scale my application", answer: "Auto Scaling Setup", services: ["autoscaling", "ec2"], pattern: "container-app" },
        { q: "run containers", answer: "Container Orchestration", services: ["ecs", "fargate"], pattern: "container-app" },
        { q: "kubernetes cluster", answer: "Kubernetes Management", services: ["eks"], pattern: "container-app" },
        { q: "batch job processing", answer: "Batch Processing", services: ["batch"], pattern: "batch-processing" },
        { q: "high performance computing", answer: "HPC Solutions", services: ["parallelcluster"], pattern: "batch-processing" },
        { q: "edge computing", answer: "Edge Computing", services: ["wavelength", "outposts"], pattern: "container-app" },
        
        // Storage Services
        { q: "how to store files", answer: "Object Storage Guide", services: ["s3"], pattern: "static-website" },
        { q: "backup my data", answer: "Data Backup Solutions", services: ["s3", "glacier"], pattern: "static-website" },
        { q: "file system for ec2", answer: "File System Setup", services: ["efs", "fsx"], pattern: "container-app" },
        { q: "block storage", answer: "Block Storage Options", services: ["ebs"], pattern: "container-app" },
        { q: "archive old data", answer: "Data Archiving", services: ["glacier", "deep-archive"], pattern: "static-website" },
        { q: "hybrid storage", answer: "Hybrid Storage Gateway", services: ["storage-gateway"], pattern: "static-website" },
        { q: "data transfer", answer: "Data Migration", services: ["datasync", "snowball"], pattern: "data-pipeline" },
        
        // Database Services
        { q: "create relational database", answer: "SQL Database Setup", services: ["rds"], pattern: "serverless-api" },
        { q: "nosql database", answer: "NoSQL Database Guide", services: ["dynamodb"], pattern: "serverless-api" },
        { q: "in memory database", answer: "Caching Solutions", services: ["elasticache"], pattern: "serverless-api" },
        { q: "document database", answer: "Document Store Setup", services: ["documentdb"], pattern: "serverless-api" },
        { q: "graph database", answer: "Graph Database Guide", services: ["neptune"], pattern: "serverless-api" },
        { q: "time series data", answer: "Time Series Database", services: ["timestream"], pattern: "data-pipeline" },
        { q: "ledger database", answer: "Blockchain Ledger", services: ["qldb"], pattern: "serverless-api" },
        { q: "database migration", answer: "Database Migration", services: ["dms"], pattern: "data-pipeline" },
        
        // Networking & Content Delivery
        { q: "setup custom domain", answer: "Domain Management", services: ["route53"], pattern: "static-website" },
        { q: "content delivery network", answer: "CDN Setup", services: ["cloudfront"], pattern: "static-website" },
        { q: "virtual private cloud", answer: "VPC Configuration", services: ["vpc"], pattern: "container-app" },
        { q: "load balancer", answer: "Load Balancing", services: ["elb", "alb"], pattern: "container-app" },
        { q: "api gateway", answer: "API Management", services: ["api-gateway"], pattern: "serverless-api" },
        { q: "private network", answer: "Private Connectivity", services: ["direct-connect", "vpn"], pattern: "container-app" },
        { q: "ddos protection", answer: "DDoS Protection", services: ["shield"], pattern: "static-website" },
        
        // Security & Identity
        { q: "user authentication", answer: "User Management", services: ["cognito"], pattern: "user-auth" },
        { q: "access control", answer: "Identity Management", services: ["iam"], pattern: "user-auth" },
        { q: "encrypt data", answer: "Encryption Services", services: ["kms"], pattern: "static-website" },
        { q: "web application firewall", answer: "WAF Setup", services: ["waf"], pattern: "static-website" },
        { q: "secrets management", answer: "Secrets Storage", services: ["secrets-manager"], pattern: "serverless-api" },
        { q: "certificate management", answer: "SSL Certificates", services: ["acm"], pattern: "static-website" },
        { q: "security compliance", answer: "Compliance Monitoring", services: ["config", "cloudtrail"], pattern: "user-auth" },
        
        // Analytics & Big Data
        { q: "data warehouse", answer: "Data Warehousing", services: ["redshift"], pattern: "data-pipeline" },
        { q: "real time analytics", answer: "Stream Analytics", services: ["kinesis"], pattern: "data-pipeline" },
        { q: "search engine", answer: "Search Service", services: ["opensearch"], pattern: "data-pipeline" },
        { q: "data lake", answer: "Data Lake Setup", services: ["s3", "glue"], pattern: "data-pipeline" },
        { q: "etl pipeline", answer: "ETL Processing", services: ["glue"], pattern: "data-pipeline" },
        { q: "business intelligence", answer: "BI Dashboard", services: ["quicksight"], pattern: "data-pipeline" },
        { q: "apache spark", answer: "Spark Processing", services: ["emr"], pattern: "batch-processing" },
        
        // Machine Learning & AI
        { q: "deploy ml model", answer: "ML Model Deployment", services: ["sagemaker"], pattern: "ai-image-analysis" },
        { q: "image recognition", answer: "Computer Vision", services: ["rekognition"], pattern: "ai-image-analysis" },
        { q: "text analysis", answer: "Natural Language Processing", services: ["comprehend"], pattern: "genai-chatbot" },
        { q: "speech to text", answer: "Speech Recognition", services: ["transcribe"], pattern: "genai-chatbot" },
        { q: "text to speech", answer: "Speech Synthesis", services: ["polly"], pattern: "genai-chatbot" },
        { q: "chatbot", answer: "Conversational AI", services: ["lex"], pattern: "genai-chatbot" },
        { q: "recommendation engine", answer: "Personalization", services: ["personalize"], pattern: "ai-image-analysis" },
        { q: "fraud detection", answer: "Fraud Prevention", services: ["fraud-detector"], pattern: "ai-image-analysis" },
        { q: "generative ai", answer: "GenAI Applications", services: ["bedrock"], pattern: "genai-chatbot" },
        
        // Application Integration
        { q: "message queue", answer: "Message Queuing", services: ["sqs"], pattern: "realtime-notifications" },
        { q: "pub sub messaging", answer: "Publish-Subscribe", services: ["sns"], pattern: "realtime-notifications" },
        { q: "workflow orchestration", answer: "Workflow Management", services: ["step-functions"], pattern: "serverless-api" },
        { q: "event driven architecture", answer: "Event Processing", services: ["eventbridge"], pattern: "realtime-notifications" },
        { q: "api integration", answer: "API Integration", services: ["api-gateway", "lambda"], pattern: "serverless-api" },
        
        // Developer Tools
        { q: "version control", answer: "Source Control", services: ["codecommit"], pattern: "container-app" },
        { q: "ci cd pipeline", answer: "CI/CD Setup", services: ["codepipeline", "codebuild"], pattern: "container-app" },
        { q: "code deployment", answer: "Application Deployment", services: ["codedeploy"], pattern: "container-app" },
        { q: "container registry", answer: "Container Images", services: ["ecr"], pattern: "container-app" },
        { q: "infrastructure as code", answer: "IaC Templates", services: ["cloudformation"], pattern: "container-app" },
        
        // Monitoring & Management
        { q: "monitor application", answer: "Application Monitoring", services: ["cloudwatch"], pattern: "serverless-api" },
        { q: "distributed tracing", answer: "Request Tracing", services: ["x-ray"], pattern: "serverless-api" },
        { q: "log management", answer: "Log Analysis", services: ["cloudwatch"], pattern: "serverless-api" },
        { q: "cost optimization", answer: "Cost Management", services: ["cost-explorer"], pattern: "static-website" },
        { q: "resource management", answer: "Resource Governance", services: ["systems-manager"], pattern: "container-app" },
        
        // Mobile & Web
        { q: "mobile app backend", answer: "Mobile Backend", services: ["amplify", "cognito"], pattern: "user-auth" },
        { q: "static website hosting", answer: "Static Site Hosting", services: ["s3", "cloudfront"], pattern: "static-website" },
        { q: "web application", answer: "Web App Deployment", services: ["amplify", "elastic-beanstalk"], pattern: "static-website" },
        { q: "progressive web app", answer: "PWA Development", services: ["amplify"], pattern: "static-website" },
        
        // IoT & Edge
        { q: "iot device management", answer: "IoT Platform", services: ["iot-core"], pattern: "realtime-notifications" },
        { q: "device data processing", answer: "IoT Analytics", services: ["iot-analytics"], pattern: "data-pipeline" },
        { q: "edge ai inference", answer: "Edge AI", services: ["iot-greengrass"], pattern: "ai-image-analysis" },
        
        // Media Services
        { q: "video streaming", answer: "Video Streaming", services: ["mediaconvert", "cloudfront"], pattern: "static-website" },
        { q: "live streaming", answer: "Live Video", services: ["medialive"], pattern: "realtime-notifications" },
        { q: "video processing", answer: "Media Processing", services: ["mediaconvert"], pattern: "batch-processing" },
        
        // Game Development
        { q: "game backend", answer: "Game Server Hosting", services: ["gamelift"], pattern: "realtime-notifications" },
        { q: "multiplayer game", answer: "Multiplayer Infrastructure", services: ["gamelift", "api-gateway"], pattern: "realtime-notifications" },
        
        // Blockchain
        { q: "blockchain network", answer: "Managed Blockchain", services: ["managed-blockchain"], pattern: "serverless-api" },
        { q: "ethereum node", answer: "Blockchain Node", services: ["managed-blockchain"], pattern: "serverless-api" },
        
        // Quantum Computing
        { q: "quantum computing", answer: "Quantum Algorithms", services: ["braket"], pattern: "batch-processing" },
        
        // Satellite
        { q: "satellite data", answer: "Ground Station", services: ["ground-station"], pattern: "data-pipeline" },
        
        // Robotics
        { q: "robot simulation", answer: "Robotics Development", services: ["robomaker"], pattern: "ai-image-analysis" },
        
        // AR/VR
        { q: "augmented reality", answer: "AR Applications", services: ["sumerian"], pattern: "static-website" },
        { q: "virtual reality", answer: "VR Development", services: ["sumerian"], pattern: "static-website" },
        
        // Additional Common Questions
        { q: "how do i deploy a website", answer: "Deploy Website Guide", services: ["s3", "cloudfront", "route53"], pattern: "static-website" },
        { q: "create rest api", answer: "REST API Creation", services: ["api-gateway", "lambda"], pattern: "serverless-api" },
        { q: "send emails", answer: "Email Service", services: ["ses"], pattern: "realtime-notifications" },
        { q: "process images", answer: "Image Processing", services: ["rekognition", "lambda"], pattern: "ai-image-analysis" },
        { q: "real time chat", answer: "Real-time Messaging", services: ["api-gateway", "lambda", "dynamodb"], pattern: "realtime-notifications" },
        { q: "schedule tasks", answer: "Task Scheduling", services: ["eventbridge", "lambda"], pattern: "serverless-api" },
        { q: "cdn setup", answer: "Content Distribution", services: ["cloudfront"], pattern: "static-website" },
        { q: "database backup", answer: "Database Backup", services: ["rds", "s3"], pattern: "serverless-api" },
        { q: "user registration", answer: "User Sign-up", services: ["cognito", "lambda"], pattern: "user-auth" },
        { q: "file upload", answer: "File Upload Service", services: ["s3", "lambda"], pattern: "static-website" }
    ],

    search(query) {
        const lowerQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const queryWords = lowerQuery.split(' ').filter(w => w.length > 2);
        
        return this.questions
            .filter(q => {
                const qText = q.q.toLowerCase();
                return queryWords.some(word => qText.includes(word)) || 
                       qText.includes(lowerQuery) ||
                       lowerQuery.includes(qText);
            })
            .map(q => ({
                type: 'question',
                title: q.answer,
                subtitle: `Step-by-step guide with ${q.services.length} AWS services`,
                icon: 'aws-cloud.svg',
                data: q
            }))
            .slice(0, 3);
    }
};