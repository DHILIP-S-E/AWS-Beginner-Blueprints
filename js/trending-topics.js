const TrendingTopics = {
    topics: [
        // Current Tech Trends 2024
        { q: "mcp model context protocol", answer: "Model Context Protocol Integration", services: ["lambda", "api-gateway", "bedrock"], pattern: "genai-chatbot", trend: "🔥 Hot" },
        { q: "n8n workflow automation", answer: "Workflow Automation with n8n", services: ["lambda", "step-functions", "eventbridge"], pattern: "serverless-api", trend: "🚀 Rising" },
        { q: "claude ai integration", answer: "Claude AI Integration", services: ["bedrock", "lambda", "api-gateway"], pattern: "genai-chatbot", trend: "🔥 Hot" },
        { q: "openai gpt integration", answer: "OpenAI GPT Integration", services: ["lambda", "api-gateway", "secrets-manager"], pattern: "genai-chatbot", trend: "🔥 Hot" },
        { q: "langchain deployment", answer: "LangChain Application Deployment", services: ["lambda", "bedrock", "dynamodb"], pattern: "genai-chatbot", trend: "🚀 Rising" },
        { q: "vector database", answer: "Vector Database Setup", services: ["opensearch", "rds", "lambda"], pattern: "ai-image-analysis", trend: "🔥 Hot" },
        { q: "rag retrieval augmented generation", answer: "RAG Implementation", services: ["bedrock", "opensearch", "lambda"], pattern: "genai-chatbot", trend: "🔥 Hot" },
        { q: "fine tuning llm", answer: "LLM Fine-tuning", services: ["sagemaker", "bedrock"], pattern: "ai-image-analysis", trend: "🚀 Rising" },
        
        // DevOps & Infrastructure Trends
        { q: "terraform aws", answer: "Infrastructure as Code with Terraform", services: ["cloudformation", "ec2", "s3"], pattern: "container-app", trend: "📈 Popular" },
        { q: "kubernetes eks", answer: "Kubernetes on AWS EKS", services: ["eks", "ecr", "vpc"], pattern: "container-app", trend: "📈 Popular" },
        { q: "docker containerization", answer: "Docker Container Deployment", services: ["ecs", "fargate", "ecr"], pattern: "container-app", trend: "📈 Popular" },
        { q: "github actions ci cd", answer: "GitHub Actions CI/CD", services: ["codepipeline", "codebuild", "s3"], pattern: "container-app", trend: "📈 Popular" },
        { q: "serverless framework", answer: "Serverless Framework Deployment", services: ["lambda", "api-gateway", "dynamodb"], pattern: "serverless-api", trend: "📈 Popular" },
        { q: "microservices architecture", answer: "Microservices on AWS", services: ["lambda", "api-gateway", "ecs"], pattern: "serverless-api", trend: "📈 Popular" },
        
        // Data & Analytics Trends
        { q: "real time streaming", answer: "Real-time Data Streaming", services: ["kinesis", "lambda", "opensearch"], pattern: "data-pipeline", trend: "📈 Popular" },
        { q: "data lakehouse", answer: "Data Lakehouse Architecture", services: ["s3", "glue", "redshift"], pattern: "data-pipeline", trend: "🚀 Rising" },
        { q: "apache airflow", answer: "Workflow Orchestration with Airflow", services: ["mwaa", "s3", "rds"], pattern: "data-pipeline", trend: "📈 Popular" },
        { q: "dbt data transformation", answer: "dbt Data Transformation", services: ["redshift", "glue", "s3"], pattern: "data-pipeline", trend: "🚀 Rising" },
        { q: "snowflake integration", answer: "Snowflake Data Warehouse", services: ["redshift", "glue", "s3"], pattern: "data-pipeline", trend: "📈 Popular" },
        { q: "apache kafka", answer: "Event Streaming with Kafka", services: ["msk", "kinesis", "lambda"], pattern: "data-pipeline", trend: "📈 Popular" },
        
        // Security & Compliance Trends
        { q: "zero trust architecture", answer: "Zero Trust Security Model", services: ["iam", "vpc", "waf"], pattern: "user-auth", trend: "🔒 Secure" },
        { q: "oauth2 authentication", answer: "OAuth2 Implementation", services: ["cognito", "api-gateway", "lambda"], pattern: "user-auth", trend: "📈 Popular" },
        { q: "jwt token authentication", answer: "JWT Authentication", services: ["cognito", "lambda", "api-gateway"], pattern: "user-auth", trend: "📈 Popular" },
        { q: "multi factor authentication", answer: "MFA Implementation", services: ["cognito", "iam"], pattern: "user-auth", trend: "🔒 Secure" },
        { q: "secrets rotation", answer: "Automated Secrets Rotation", services: ["secrets-manager", "lambda"], pattern: "serverless-api", trend: "🔒 Secure" },
        
        // Frontend & Mobile Trends
        { q: "react deployment", answer: "React App Deployment", services: ["amplify", "s3", "cloudfront"], pattern: "static-website", trend: "📈 Popular" },
        { q: "nextjs deployment", answer: "Next.js Application Hosting", services: ["amplify", "lambda", "cloudfront"], pattern: "static-website", trend: "🚀 Rising" },
        { q: "vue js deployment", answer: "Vue.js App Deployment", services: ["amplify", "s3", "cloudfront"], pattern: "static-website", trend: "📈 Popular" },
        { q: "flutter backend", answer: "Flutter Mobile Backend", services: ["amplify", "cognito", "dynamodb"], pattern: "user-auth", trend: "📱 Mobile" },
        { q: "react native backend", answer: "React Native Backend", services: ["amplify", "cognito", "lambda"], pattern: "user-auth", trend: "📱 Mobile" },
        { q: "progressive web app", answer: "PWA Development", services: ["amplify", "cloudfront", "s3"], pattern: "static-website", trend: "📱 Mobile" },
        
        // Emerging Technologies
        { q: "web3 blockchain", answer: "Web3 Blockchain Applications", services: ["managed-blockchain", "lambda"], pattern: "serverless-api", trend: "⚡ New" },
        { q: "nft marketplace", answer: "NFT Marketplace Backend", services: ["lambda", "dynamodb", "s3"], pattern: "serverless-api", trend: "⚡ New" },
        { q: "iot edge computing", answer: "IoT Edge Computing", services: ["iot-greengrass", "lambda", "kinesis"], pattern: "realtime-notifications", trend: "🌐 IoT" },
        { q: "quantum computing", answer: "Quantum Computing Services", services: ["braket"], pattern: "batch-processing", trend: "⚡ New" },
        { q: "augmented reality", answer: "AR Application Backend", services: ["sumerian", "lambda", "s3"], pattern: "static-website", trend: "🥽 AR/VR" },
        { q: "virtual reality", answer: "VR Application Infrastructure", services: ["sumerian", "ec2", "s3"], pattern: "static-website", trend: "🥽 AR/VR" },
        
        // Database Trends
        { q: "mongodb atlas", answer: "MongoDB on AWS", services: ["documentdb", "lambda"], pattern: "serverless-api", trend: "📊 Database" },
        { q: "postgresql deployment", answer: "PostgreSQL Database", services: ["rds", "lambda"], pattern: "serverless-api", trend: "📊 Database" },
        { q: "redis caching", answer: "Redis Cache Implementation", services: ["elasticache", "lambda"], pattern: "serverless-api", trend: "📊 Database" },
        { q: "graph database neo4j", answer: "Graph Database Solutions", services: ["neptune", "lambda"], pattern: "serverless-api", trend: "📊 Database" },
        { q: "time series database", answer: "Time Series Data Storage", services: ["timestream", "kinesis"], pattern: "data-pipeline", trend: "📊 Database" },
        
        // API & Integration Trends
        { q: "graphql api", answer: "GraphQL API Development", services: ["appsync", "lambda", "dynamodb"], pattern: "serverless-api", trend: "🔗 API" },
        { q: "rest api design", answer: "RESTful API Best Practices", services: ["api-gateway", "lambda"], pattern: "serverless-api", trend: "🔗 API" },
        { q: "webhook integration", answer: "Webhook Processing", services: ["lambda", "api-gateway", "sqs"], pattern: "realtime-notifications", trend: "🔗 API" },
        { q: "api rate limiting", answer: "API Rate Limiting", services: ["api-gateway", "lambda"], pattern: "serverless-api", trend: "🔗 API" },
        { q: "api versioning", answer: "API Version Management", services: ["api-gateway", "lambda"], pattern: "serverless-api", trend: "🔗 API" },
        
        // Monitoring & Observability
        { q: "prometheus monitoring", answer: "Prometheus Monitoring Setup", services: ["cloudwatch", "ec2"], pattern: "container-app", trend: "📊 Monitoring" },
        { q: "grafana dashboards", answer: "Grafana Dashboard Integration", services: ["cloudwatch", "ec2"], pattern: "container-app", trend: "📊 Monitoring" },
        { q: "elk stack logging", answer: "ELK Stack for Logging", services: ["opensearch", "lambda"], pattern: "data-pipeline", trend: "📊 Monitoring" },
        { q: "distributed tracing", answer: "Application Tracing", services: ["x-ray", "lambda"], pattern: "serverless-api", trend: "📊 Monitoring" },
        { q: "application performance monitoring", answer: "APM Implementation", services: ["cloudwatch", "x-ray"], pattern: "serverless-api", trend: "📊 Monitoring" },
        
        // Cost Optimization Trends
        { q: "cost optimization", answer: "AWS Cost Optimization", services: ["cost-explorer", "trusted-advisor"], pattern: "static-website", trend: "💰 Cost" },
        { q: "spot instances", answer: "EC2 Spot Instance Usage", services: ["ec2", "autoscaling"], pattern: "container-app", trend: "💰 Cost" },
        { q: "reserved instances", answer: "Reserved Instance Planning", services: ["ec2", "rds"], pattern: "container-app", trend: "💰 Cost" },
        { q: "serverless cost optimization", answer: "Serverless Cost Management", services: ["lambda", "dynamodb"], pattern: "serverless-api", trend: "💰 Cost" },
        
        // Compliance & Governance
        { q: "gdpr compliance", answer: "GDPR Compliance Setup", services: ["config", "cloudtrail", "kms"], pattern: "user-auth", trend: "⚖️ Compliance" },
        { q: "hipaa compliance", answer: "HIPAA Compliant Architecture", services: ["config", "cloudtrail", "kms"], pattern: "user-auth", trend: "⚖️ Compliance" },
        { q: "sox compliance", answer: "SOX Compliance Monitoring", services: ["config", "cloudtrail"], pattern: "user-auth", trend: "⚖️ Compliance" },
        { q: "aws well architected", answer: "Well-Architected Framework", services: ["trusted-advisor", "config"], pattern: "container-app", trend: "🏗️ Architecture" }
    ],

    search(query) {
        const lowerQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const queryWords = lowerQuery.split(' ').filter(w => w.length > 2);
        
        return this.topics
            .filter(t => {
                const tText = t.q.toLowerCase();
                return queryWords.some(word => tText.includes(word)) || 
                       tText.includes(lowerQuery) ||
                       lowerQuery.includes(tText);
            })
            .slice(0, 2)
            .map(t => ({
                type: 'trending',
                title: `${t.trend} ${t.answer}`,
                subtitle: `Trending solution with ${t.services.length} AWS services`,
                icon: 'aws-cloud.svg',
                data: t
            }));
    }
};