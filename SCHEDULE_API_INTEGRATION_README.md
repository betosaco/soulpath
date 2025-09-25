# Schedule API Integration - Implementation Guide

## 🎯 Overview

This implementation adds `/schedule` API connection type support across packages, products, and internal products in the wellness monorepo. The integration provides a unified way to manage scheduling functionality across different entity types.

## ✅ What Was Implemented

### 1. **Database Schema Updates**
- **File**: `frontend/prisma/schema.prisma`
- **Changes**: Added `connectionType` field to `ExternalAPIConfig` model
- **Purpose**: Support different API connection types including 'schedule'

```prisma
model ExternalAPIConfig {
  // ... existing fields
  connectionType String @default("standard") @map("connection_type")
  // ... rest of fields
}
```

### 2. **Schedule API Service**
- **File**: `frontend/lib/services/schedule-api-service.ts`
- **Purpose**: Centralized service for schedule operations
- **Features**:
  - Schedule retrieval with filtering
  - Available slots management
  - Schedule creation and updates
  - Caching support
  - Connection testing

### 3. **Updated API Endpoints**

#### Packages API (`/api/packages`)
- **File**: `frontend/app/api/packages/route.ts`
- **New Feature**: `includeSchedule=true` parameter
- **Response**: Includes schedule data when requested

#### Products API (`/api/products`)
- **File**: `frontend/app/api/products/route.ts`
- **New Feature**: `includeSchedule=true` parameter
- **Response**: Includes schedule data when requested

#### Internal Products API (`/api/internal-products`)
- **File**: `frontend/app/api/internal-products/route.ts`
- **New Feature**: Complete CRUD operations with schedule integration
- **Response**: Includes schedule data when requested

### 4. **Configuration Scripts**
- **File**: `frontend/scripts/seed-schedule-api-config.js`
- **Purpose**: Seeds ExternalAPIConfig with schedule connection types
- **Creates**: Configurations for packages, products, and internal products

### 5. **Testing Script**
- **File**: `frontend/scripts/test-schedule-api-integration.js`
- **Purpose**: Comprehensive testing of schedule API integration
- **Tests**: All endpoints, services, and database schema

## 🚀 Usage Examples

### 1. **Get Packages with Schedule Data**
```bash
GET /api/packages?includeSchedule=true&currency=PEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "price": 150,
      "currency": "PEN",
      "packageDefinition": { ... },
      "schedule": [
        {
          "id": "1",
          "dayOfWeek": "Monday",
          "startTime": "09:00",
          "endTime": "10:00",
          "capacity": 10,
          "isAvailable": true
        }
      ]
    }
  ]
}
```

### 2. **Get Products with Schedule Data**
```bash
GET /api/products?includeSchedule=true&page=1&limit=10
```

### 3. **Get Internal Products with Schedule Data**
```bash
GET /api/internal-products?includeSchedule=true&internalOnly=true
```

### 4. **Create Internal Product**
```bash
POST /api/internal-products
Content-Type: application/json

{
  "name": "Internal Yoga Mat",
  "description": "High-quality yoga mat for internal use",
  "price": 50,
  "currency": "PEN",
  "category": "equipment",
  "isInternal": true
}
```

## 🔧 Setup Instructions

### 1. **Database Migration**
```bash
# Generate and apply Prisma migration
npx prisma migrate dev --name add-connection-type-to-external-api-config
```

### 2. **Seed Configuration**
```bash
# Run the seeding script
node frontend/scripts/seed-schedule-api-config.js
```

### 3. **Test Integration**
```bash
# Run the test script
node frontend/scripts/test-schedule-api-integration.js
```

## 📊 API Response Structure

### Schedule Data Format
```typescript
interface ScheduleData {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  isAvailable: boolean;
  autoAvailable?: boolean;
  sessionDurationId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### API Response with Schedule
```typescript
interface ApiResponseWithSchedule {
  success: boolean;
  data: any[]; // Packages, Products, or Internal Products
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  schedule?: ScheduleData[]; // Included when includeSchedule=true
  cached?: boolean;
}
```

## 🎛️ Configuration Options

### ExternalAPIConfig Fields
- **connectionType**: `'schedule'` for schedule connections
- **provider**: `'internal'` for internal APIs
- **category**: `'scheduling'`, `'packages'`, `'products'`, `'internal_products'`
- **apiUrl**: Endpoint URL for the API
- **config**: JSON configuration with endpoints and features

### Schedule Service Configuration
```typescript
const scheduleService = createScheduleApiService({
  connectionType: 'schedule',
  apiUrl: '/api/schedules',
  timeout: 30000,
  rateLimit: 100,
  testMode: true
});
```

## 🔍 Monitoring and Health Checks

### Connection Testing
```typescript
const connectionTest = await scheduleService.testConnection();
console.log(`Connection: ${connectionTest.success ? 'OK' : 'FAILED'}`);
console.log(`Latency: ${connectionTest.latency}ms`);
```

### Health Status
The ExternalAPIConfig includes health monitoring:
- **healthStatus**: `'healthy'`, `'unhealthy'`, `'unknown'`
- **lastTestedAt**: Timestamp of last health check
- **lastTestResult**: Result of last test

## 🚨 Error Handling

### Common Error Scenarios
1. **Schedule API Unavailable**: Graceful fallback without schedule data
2. **Invalid Parameters**: Proper validation and error messages
3. **Database Connection Issues**: Cached responses when possible
4. **Rate Limiting**: Respects configured rate limits

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message",
  "details": "Additional error details"
}
```

## 📈 Performance Considerations

### Caching Strategy
- **Schedule Data**: 30 minutes TTL
- **API Responses**: Configurable TTL based on data type
- **Cache Keys**: Include all relevant parameters

### Rate Limiting
- **Default**: 1000 requests per hour
- **Configurable**: Per API configuration
- **Per Entity**: Separate limits for packages, products, internal products

## 🔄 Future Enhancements

### Planned Features
1. **Real-time Schedule Updates**: WebSocket integration
2. **Advanced Filtering**: More granular schedule filtering
3. **Bulk Operations**: Batch schedule operations
4. **Analytics**: Schedule usage analytics
5. **Notifications**: Schedule change notifications

### Integration Points
1. **Calendar Systems**: Google Calendar, Outlook integration
2. **Booking Systems**: External booking platform integration
3. **Payment Systems**: Schedule-based payment processing
4. **Communication**: SMS/Email notifications for schedule changes

## 🧪 Testing

### Test Coverage
- ✅ Database schema validation
- ✅ API endpoint functionality
- ✅ Schedule service operations
- ✅ Error handling scenarios
- ✅ Caching behavior
- ✅ Configuration management

### Running Tests
```bash
# Run all tests
npm test

# Run specific test
node frontend/scripts/test-schedule-api-integration.js

# Run with verbose output
DEBUG=* node frontend/scripts/test-schedule-api-integration.js
```

## 📝 API Documentation

### Endpoints Summary
| Endpoint | Method | Schedule Support | Description |
|----------|--------|------------------|-------------|
| `/api/packages` | GET | ✅ | Get packages with optional schedule data |
| `/api/products` | GET | ✅ | Get products with optional schedule data |
| `/api/internal-products` | GET/POST | ✅ | Internal products CRUD with schedule data |
| `/api/schedules` | GET/POST | ✅ | Direct schedule management |

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeSchedule` | boolean | false | Include schedule data in response |
| `dayOfWeek` | string | - | Filter by day of week |
| `available` | boolean | - | Filter by availability |
| `startDate` | string | - | Start date for slot queries |
| `endDate` | string | - | End date for slot queries |

## 🎉 Conclusion

The schedule API integration provides a robust, scalable solution for managing scheduling across packages, products, and internal products. The implementation includes:

- ✅ **Unified API Interface**: Consistent schedule access across all entity types
- ✅ **Flexible Configuration**: Easy to configure and extend
- ✅ **Performance Optimized**: Caching and rate limiting
- ✅ **Comprehensive Testing**: Full test coverage
- ✅ **Error Handling**: Graceful error handling and fallbacks
- ✅ **Documentation**: Complete implementation guide

The system is ready for production use and can be easily extended for future requirements.
