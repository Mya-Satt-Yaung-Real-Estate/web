# Website Wanting List API Documentation

## Overview
This document provides comprehensive API documentation for the Website Wanting List endpoints. These endpoints are designed for web applications and provide full CRUD operations for managing wanting lists.

## Base URL
```
{{base_url}}/api/v1/frontend
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data
  "pagination": {} // Only for paginated responses
}
```

---

## 🔐 Authenticated Endpoints

### 1. Get User's Wanting Lists
**GET** `/wanted-lists`

Retrieve a paginated list of the authenticated user's wanting lists.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `per_page` | integer | No | 15 | Number of items per page (1-100) |
| `page` | integer | No | 1 | Page number |
| `sort_by` | string | No | created_at | Sort field (created_at, updated_at, title, min_budget, max_budget) |
| `sort_direction` | string | No | desc | Sort direction (asc, desc) |
| `wanted_type` | string | No | - | Filter by type (buyer, renter) |
| `property_type_id` | integer | No | - | Filter by property type ID |
| `prefer_region_id` | integer | No | - | Filter by preferred region ID |
| `prefer_township_id` | integer | No | - | Filter by preferred township ID |
| `status` | string | No | - | Filter by status (draft, published) |
| `verification_status` | string | No | - | Filter by verification status (pending, approved, rejected) |
| `min_budget` | number | No | - | Minimum budget filter |
| `max_budget` | number | No | - | Maximum budget filter |
| `bedrooms` | integer | No | - | Number of bedrooms filter |
| `bathrooms` | integer | No | - | Number of bathrooms filter |
| `min_area` | number | No | - | Minimum area filter |
| `max_area` | number | No | - | Maximum area filter |
| `search` | string | No | - | Search in title, description, additional_requirement |

#### Example Request
```http
GET {{base_url}}/api/v1/frontend/wanted-lists?per_page=10&page=1&wanted_type=buyer&sort_by=created_at&sort_direction=desc
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Example Response
```json
{
  "success": true,
  "message": "Wanting lists retrieved successfully",
  "data": [
    {
      "id": 1,
      "slug": "looking-for-3br-house-in-yangon",
      "wanted_type": "buyer",
      "wanted_type_label": "Buyer",
      "title": "Looking for 3BR House in Yangon",
      "description": "Need a spacious house for family with good security...",
      "property_type": {
        "id": 1,
        "name_en": "House",
        "name_mm": "အိမ်"
      },
      "location": {
        "region": "Yangon",
        "township": "Bahan"
      },
      "budget": {
        "min_budget": 50000000,
        "max_budget": 80000000,
        "budget_range": "50M - 80M MMK"
      },
      "specifications": {
        "bedrooms": 3,
        "bathrooms": 2,
        "area_range": "1,200 - 2,000 sqft"
      },
      "contact": {
        "name": "John Doe",
        "phone": "09123456789",
        "email": "john@example.com"
      },
      "status": {
        "status": "published",
        "is_expired": false,
        "is_published": true,
        "expires_at": "2025-12-31T23:59:59Z"
      },
      "created_at": "Jan 28, 2025"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "last_page": 3,
    "from": 1,
    "to": 10,
    "has_more_pages": true
  }
}
```

---

### 2. Create Wanting List
**POST** `/wanted-lists`

Create a new wanting list for the authenticated user.

#### Request Body
```json
{
  "wanted_type": "buyer", // Required: "buyer" or "renter"
  "property_type_id": 1, // Required: Property type ID
  "title": "Looking for 3BR House in Yangon", // Required: Max 255 characters
  "prefer_region_id": 1, // Required: Region ID
  "prefer_township_id": 5, // Required: Township ID
  "name": "John Doe", // Required: Contact name
  "phone": "09123456789", // Required: Contact phone
  "description": "Need a spacious house for family", // Optional: Max 2000 characters
  "min_budget": 50000000, // Optional: Minimum budget
  "max_budget": 80000000, // Optional: Maximum budget
  "bedrooms": 3, // Optional: Number of bedrooms (0-20)
  "bathrooms": 2, // Optional: Number of bathrooms (0-20)
  "min_area": 1200, // Optional: Minimum area
  "max_area": 2000, // Optional: Maximum area
  "additional_requirement": "Near school and hospital", // Optional: Max 1000 characters
  "email": "john@example.com", // Optional: Contact email
  "status": "published", // Optional: "draft" or "published" (default: "published")
  "expires_at": "2025-12-31T23:59:59Z" // Optional: Expiration date
}
```

#### Example Request
```http
POST {{base_url}}/api/v1/frontend/wanted-lists
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "wanted_type": "buyer",
  "property_type_id": 1,
  "title": "Looking for 3BR House in Yangon",
  "description": "Need a spacious house for family with good security",
  "prefer_region_id": 1,
  "prefer_township_id": 5,
  "min_budget": 50000000,
  "max_budget": 80000000,
  "bedrooms": 3,
  "bathrooms": 2,
  "min_area": 1200,
  "max_area": 2000,
  "additional_requirement": "Near school and hospital",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

#### Example Response
```json
{
  "success": true,
  "message": "Wanting list created successfully",
  "data": {
    "id": 1,
    "slug": "looking-for-3br-house-in-yangon",
    "wanted_type": "buyer",
    "wanted_type_label": "Buyer",
    "title": "Looking for 3BR House in Yangon",
    "description": "Need a spacious house for family with good security",
    "additional_requirement": "Near school and hospital",
    "property_type": {
      "id": 1,
      "name_en": "House",
      "name_mm": "အိမ်"
    },
    "preferred_location": {
      "region": {
        "id": 1,
        "name_en": "Yangon",
        "name_mm": "ရန်ကုန်"
      },
      "township": {
        "id": 5,
        "name_en": "Bahan",
        "name_mm": "ဗဟန်း"
      }
    },
    "budget": {
      "min_budget": 50000000,
      "max_budget": 80000000,
      "budget_range": "50M - 80M MMK"
    },
    "specifications": {
      "bedrooms": 3,
      "bathrooms": 2,
      "min_area": 1200,
      "max_area": 2000,
      "area_range": "1,200 - 2,000 sqft"
    },
    "contact": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "09123456789"
    },
    "status": {
      "status": "published",
      "is_expired": false,
      "is_published": true,
      "expires_at": "2025-12-31T23:59:59Z"
    },
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "user_type": "individual",
      "member_level": "basic"
    },
    "created_at": "Jan 28, 2025"
  }
}
```

---

### 3. Get Single Wanting List
**GET** `/wanted-lists/{slug}`

Retrieve a specific wanting list by its slug.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The slug of the wanting list |

#### Example Request
```http
GET {{base_url}}/api/v1/frontend/wanted-lists/looking-for-3br-house-in-yangon
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Example Response
```json
{
  "success": true,
  "message": "Wanting list retrieved successfully",
  "data": {
    "id": 1,
    "slug": "looking-for-3br-house-in-yangon",
    "wanted_type": "buyer",
    "wanted_type_label": "Buyer",
    "title": "Looking for 3BR House in Yangon",
    "description": "Need a spacious house for family with good security",
    "additional_requirement": "Near school and hospital",
    "property_type": {
      "id": 1,
      "name_en": "House",
      "name_mm": "အိမ်"
    },
    "preferred_location": {
      "region": {
        "id": 1,
        "name_en": "Yangon",
        "name_mm": "ရန်ကုန်"
      },
      "township": {
        "id": 5,
        "name_en": "Bahan",
        "name_mm": "ဗဟန်း"
      }
    },
    "budget": {
      "min_budget": 50000000,
      "max_budget": 80000000,
      "budget_range": "50M - 80M MMK"
    },
    "specifications": {
      "bedrooms": 3,
      "bathrooms": 2,
      "min_area": 1200,
      "max_area": 2000,
      "area_range": "1,200 - 2,000 sqft"
    },
    "contact": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "09123456789"
    },
    "status": {
      "status": "published",
      "is_expired": false,
      "is_published": true,
      "expires_at": "2025-12-31T23:59:59Z"
    },
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "user_type": "individual",
      "member_level": "basic"
    },
    "created_at": "Jan 28, 2025"
  }
}
```

---

### 4. Update Wanting List
**PUT** `/wanted-lists/{slug}`

Update an existing wanting list.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The slug of the wanting list to update |

#### Request Body
Same structure as create request. All fields are optional for updates.

#### Example Request
```http
PUT {{base_url}}/api/v1/frontend/wanted-lists/looking-for-3br-house-in-yangon
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "wanted_type": "buyer",
  "property_type_id": 1,
  "title": "Looking for 3BR House in Yangon - Updated",
  "description": "Updated: Need a spacious house for family with garden",
  "prefer_region_id": 1,
  "prefer_township_id": 5,
  "min_budget": 60000000,
  "max_budget": 90000000,
  "bedrooms": 3,
  "bathrooms": 2,
  "min_area": 1500,
  "max_area": 2500,
  "additional_requirement": "Near school, hospital, and shopping mall. Must have garden space",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

#### Example Response
```json
{
  "success": true,
  "message": "Wanting list updated successfully",
  "data": {
    "id": 1,
    "slug": "looking-for-3br-house-in-yangon-updated",
    "wanted_type": "buyer",
    "title": "Looking for 3BR House in Yangon - Updated",
    // ... updated data
  }
}
```

---

### 5. Delete Wanting List
**DELETE** `/wanted-lists/{slug}`

Delete a wanting list.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The slug of the wanting list to delete |

#### Example Request
```http
DELETE {{base_url}}/api/v1/frontend/wanted-lists/looking-for-3br-house-in-yangon-updated
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Example Response
```json
{
  "success": true,
  "message": "Wanting list deleted successfully"
}
```

---

### 6. Toggle Wanting List Status
**PATCH** `/wanted-lists/{slug}/toggle-status`

Toggle the active status of a wanting list.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The slug of the wanting list |

#### Example Request
```http
PATCH {{base_url}}/api/v1/frontend/wanted-lists/looking-for-3br-house-in-yangon/toggle-status
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Example Response
```json
{
  "success": true,
  "message": "Wanting list status toggled successfully",
  "data": {
    "id": 1,
    "slug": "looking-for-3br-house-in-yangon",
    "is_active": false,
    "status": "inactive"
  }
}
```

---

### 7. Get User Statistics
**GET** `/wanted-lists/statistics`

Get statistics for the authenticated user's wanting lists.

#### Example Request
```http
GET {{base_url}}/api/v1/frontend/wanted-lists/statistics
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Example Response
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 25,
    "published": 20,
    "draft": 5,
    "pending": 15,
    "approved": 8,
    "rejected": 2,
    "by_type": {
      "buyer": 18,
      "renter": 7
    }
  }
}
```

---

## 🌐 Public Endpoints

### 1. Get Public Wanting Lists
**GET** `/public/wanted-lists`

Retrieve a paginated list of all public wanting lists (published and approved).

#### Query Parameters
Same as authenticated list endpoint, except:
- No `status` or `verification_status` filters (only shows published/approved)

#### Example Request
```http
GET {{base_url}}/api/v1/frontend/public/wanted-lists?per_page=15&page=1&wanted_type=buyer
```

#### Example Response
Same structure as authenticated list endpoint.

---

### 2. Get Public Wanting List Detail
**GET** `/public/wanted-lists/{slug}`

Retrieve a specific public wanting list by its slug.

#### Example Request
```http
GET {{base_url}}/api/v1/frontend/public/wanted-lists/looking-for-3br-house-in-yangon
```

#### Example Response
Same structure as authenticated detail endpoint.

---

### 3. Get Public Statistics
**GET** `/public/wanted-lists/statistics`

Get statistics for all public wanting lists.

#### Example Request
```http
GET {{base_url}}/api/v1/frontend/public/wanted-lists/statistics
```

#### Example Response
```json
{
  "success": true,
  "message": "Public wanting list statistics retrieved successfully",
  "data": {
    "total": 150,
    "by_type": {
      "buyer": 120,
      "renter": 30
    },
    "by_property_type": [
      {
        "property_type": "House",
        "count": 90
      },
      {
        "property_type": "Apartment",
        "count": 60
      }
    ],
    "by_region": [
      {
        "region": "Yangon",
        "count": 100
      },
      {
        "region": "Mandalay",
        "count": 50
      }
    ]
  }
}
```

---

## ❌ Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "wanted_type": ["The wanted type field is required."],
    "property_type_id": ["The selected property type is invalid."]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Wanting list not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to retrieve wanting lists"
}
```

---

## 🔧 React.js Integration Examples

### Using Fetch API
```javascript
// Get user's wanting lists
const fetchWantingLists = async (token, filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/api/v1/frontend/wanted-lists?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Create wanting list
const createWantingList = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/frontend/wanted-lists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Get public wanting lists
const fetchPublicWantingLists = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/api/v1/frontend/public/wanted-lists?${queryParams}`);
  return response.json();
};
```

### Using Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/frontend`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const wantingListAPI = {
  // Get user's lists
  getUserLists: (filters) => api.get('/wanted-lists', { params: filters }),
  
  // Create list
  createList: (data) => api.post('/wanted-lists', data),
  
  // Get single list
  getList: (slug) => api.get(`/wanted-lists/${slug}`),
  
  // Update list
  updateList: (slug, data) => api.put(`/wanted-lists/${slug}`, data),
  
  // Delete list
  deleteList: (slug) => api.delete(`/wanted-lists/${slug}`),
  
  // Toggle status
  toggleStatus: (slug) => api.patch(`/wanted-lists/${slug}/toggle-status`),
  
  // Get statistics
  getStatistics: () => api.get('/wanted-lists/statistics'),
  
  // Public endpoints
  getPublicLists: (filters) => api.get('/public/wanted-lists', { params: filters }),
  getPublicList: (slug) => api.get(`/public/wanted-lists/${slug}`),
  getPublicStatistics: () => api.get('/public/wanted-lists/statistics')
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';
import { wantingListAPI } from './api';

export const useWantingLists = (filters = {}) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wantingListAPI.getUserLists(filters);
      setLists(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [JSON.stringify(filters)]);

  return { lists, loading, error, pagination, refetch: fetchLists };
};
```

---

## 📝 Notes for Frontend Developers

1. **Authentication**: All authenticated endpoints require a valid Bearer token
2. **Slug Usage**: Use slugs instead of IDs for detail, update, and delete operations
3. **Pagination**: All list endpoints support pagination with `per_page` and `page` parameters
4. **Filtering**: Comprehensive filtering options are available for list endpoints
5. **Search**: Full-text search across title, description, and additional requirements
6. **Sorting**: Multiple sort options available (created_at, updated_at, title, budget)
7. **Error Handling**: Always check the `success` field in responses
8. **Rate Limiting**: API has rate limiting (30 requests per minute for authenticated endpoints)
9. **CORS**: Ensure CORS is properly configured for your domain
10. **Content Type**: Always send `Content-Type: application/json` for POST/PUT requests

---

## 🔗 Related Endpoints

- **Property Types**: `GET /api/v1/frontend/property-types`
- **Regions**: `GET /api/v1/frontend/locations/regions`
- **Townships**: `GET /api/v1/frontend/locations/townships`
- **User Profile**: `GET /api/v1/frontend/profile`

---

*Last updated: January 28, 2025*
