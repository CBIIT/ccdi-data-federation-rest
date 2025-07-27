# CCDI Data Federation REST API

A robust GraphQL to REST adapter for the CCDI (Childhood Cancer Data Initiative) biomedical data federation system.

## 🎯 Overview

This service converts GraphQL API calls into RESTful endpoints, making biomedical data accessible to clients that don't support GraphQL. It provides caching, validation, rate limiting, and comprehensive logging.

## 🚀 Features

- **GraphQL to REST Translation**: Seamlessly converts REST calls to GraphQL queries
- **Caching**: Redis-based caching for improved performance
- **Input Validation**: Joi-based request validation
- **Rate Limiting**: Configurable API rate limiting
- **Comprehensive Logging**: Winston-based structured logging
- **API Documentation**: Swagger/OpenAPI documentation
- **Health Checks**: Kubernetes-ready health endpoints
- **Security**: Helmet.js security headers and CORS support

## 🏗️ Architecture

```
[Client REST] → [Express.js Server] → [GraphQL Client] → [GraphQL API] → [Database]
                      ↓
                [Redis Cache (optional)]
```

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **GraphQL Client**: node-fetch
- **Validation**: Joi
- **Caching**: Redis
- **Logging**: Winston
- **Documentation**: Swagger UI
- **Security**: Helmet, CORS

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ccdi-data-federation-rest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```bash
   GRAPHQL_URL=https://your-graphql-api.com/graphql
   PORT=3000
   REDIS_URL=redis://localhost:6379  # Optional
   ```

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### With Docker
```bash
docker build -t ccdi-rest-adapter .
docker run -p 3000:3000 --env-file .env ccdi-rest-adapter
```

## 📚 API Endpoints

### Sample Data Endpoints

#### Get Sample Counts by Field
```http
GET /api/v1/sample/by/{field}/count
```

**Supported fields:**
- `tumor_status`
- `anatomic_site`
- `tumor_classification`
- `tissue_type`
- `primary_diagnosis`

**Parameters:**
- `limit` (optional): Maximum results (1-1000, default: 100)
- `offset` (optional): Results to skip (default: 0)

**Example:**
```bash
curl "http://localhost:3000/api/v1/sample/by/tumor_status/count?limit=50"
```

**Response:**
```json
[
  { "field": "Metastatic", "count": 12 },
  { "field": "Primary", "count": 8 }
]
```

#### Get Sample Details
```http
GET /api/v1/sample
```

**Parameters:**
- `tumorStatus` (optional): Filter by tumor status
- `anatomicSite` (optional): Filter by anatomic site
- `limit` (optional): Maximum results (1-1000, default: 100)
- `offset` (optional): Results to skip (default: 0)

#### Get Supported Fields
```http
GET /api/v1/sample/fields
```

### Health Endpoints

#### Health Check
```http
GET /health
```

#### Readiness Probe
```http
GET /health/readiness
```

#### Liveness Probe
```http
GET /health/liveness
```

## 📖 API Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GRAPHQL_URL` | GraphQL API endpoint | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `REDIS_URL` | Redis connection URL | Optional |
| `REDIS_TTL` | Cache TTL in seconds | 300 |
| `CORS_ORIGIN` | CORS allowed origins | * |
| `API_RATE_LIMIT` | Requests per 15 minutes | 100 |
| `LOG_LEVEL` | Logging level | info |

### Field Mappings

The service maps REST endpoint fields to GraphQL queries:

| REST Field | GraphQL Query |
|------------|---------------|
| `tumor_status` | `samplesByTumorStatus` |
| `anatomic_site` | `samplesByAnatomicSite` |
| `tumor_classification` | `samplesByTumorClassification` |
| `tissue_type` | `samplesByTissueType` |
| `primary_diagnosis` | `samplesByPrimaryDiagnosis` |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

Log format includes:
- Timestamp
- Log level
- Message
- Service metadata
- Request context

## 🔒 Security

- Rate limiting (100 requests/15 minutes by default)
- CORS protection
- Security headers via Helmet.js
- Input validation
- Error message sanitization

## 🚢 Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes

Health check endpoints support Kubernetes probes:
- Liveness: `/health/liveness`
- Readiness: `/health/readiness`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
