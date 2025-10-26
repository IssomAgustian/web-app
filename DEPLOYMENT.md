# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker & Docker Compose (optional)

## Local Development

1. Clone repository
2. Install dependencies: \`npm install\`
3. Setup .env file
4. Run database migrations: \`npm run seed\`
5. Start server: \`npm run dev\`

## Docker Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

## Production Deployment

### Using PM2
\`\`\`bash
npm install -g pm2
pm2 start server.js --name "pakar-padi-backend"
pm2 save
pm2 startup
\`\`\`

### Using Nginx Reverse Proxy
\`\`\`nginx
server {
    listen 80;
    server_name api.pakar-padi.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### Environment Variables for Production
- Set \`NODE_ENV=production\`
- Use strong JWT_SECRET
- Configure OPENAI_API_KEY
- Use managed PostgreSQL service
- Enable CORS for frontend domain only
