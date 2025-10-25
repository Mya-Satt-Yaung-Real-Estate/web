# 🏗️ Jade Property - Clean Project Structure

## 📁 **Simple & Scalable Structure**

```
src/
├── services/                   # Services layer
│   ├── api/                   # API layer
│   │   ├── client.ts          # Base API client
│   │   ├── properties.ts      # Property API endpoints
│   │   ├── auth.ts            # Auth API endpoints
│   │   └── index.ts           # API exports
│   ├── queries/               # TanStack Query definitions
│   │   ├── properties.ts      # Property query keys & functions
│   │   ├── auth.ts            # Auth query keys & functions
│   │   └── index.ts           # Query exports
│   └── index.ts               # Services exports
├── hooks/                      # Custom hooks
│   ├── queries/               # TanStack Query hooks
│   │   ├── useProperties.ts   # Property query hooks
│   │   ├── useAuth.ts         # Auth query hooks
│   │   └── index.ts           # Query hook exports
│   ├── mutations/             # TanStack Mutation hooks
│   │   ├── usePropertyMutations.ts # Property mutations
│   │   ├── useAuthMutations.ts     # Auth mutations
│   │   └── index.ts               # Mutation exports
│   ├── useMediaQuery.ts       # Media query hook
│   └── index.ts               # All hooks exports
├── components/                  # UI components
│   ├── ui/                    # Base UI components (shadcn/ui)
│   ├── layout/                # Layout components
│   │   ├── Navigation.tsx     # Main navigation
│   │   ├── Footer.tsx         # Footer component
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   └── mobile/            # Mobile layout components
│   ├── features/              # Feature-based components
│   │   ├── home/              # Home page components
│   │   │   ├── PropertyCarousel.tsx
│   │   │   ├── AdvancedSearchFilter.tsx
│   │   │   ├── PropertyListingCard.tsx
│   │   │   ├── WantedListingCard.tsx
│   │   │   ├── AdvertisementCard.tsx
│   │   │   ├── AdvertisementCardSimple.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── PremiumPostCard.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── mobile/        # Mobile home components
│   │   │   │   ├── MobilePropertyCarousel.tsx
│   │   │   │   └── MobileAdvancedSearchFilter.tsx
│   │   │   └── index.ts         # Home components exports
│   │   ├── auth/              # Auth feature components
│   │   ├── properties/        # Property feature components
│   │   └── search/            # Search feature components
│   ├── common/                # Common components
│   │   └── NotificationDropdown.tsx
│   ├── seo/                   # SEO components
│   │   ├── SEOHead.tsx        # SEO head component
│   │   └── StructuredData.tsx # Structured data component
│   └── index.ts               # Component exports
├── pages/                      # Page components
│   ├── Home.tsx              # Home page
│   ├── About.tsx             # About page
│   ├── Companies.tsx          # Companies page
│   └── NotFound.tsx           # 404 page
├── providers/                  # React providers
│   ├── QueryProvider.tsx     # TanStack Query provider
│   └── index.ts               # Provider exports
├── contexts/                   # React contexts
│   ├── AuthContext.tsx       # Authentication context
│   ├── LanguageContext.tsx   # Language context
│   └── ThemeContext.tsx      # Theme context
├── lib/                        # Utility libraries
│   ├── config.ts             # App configuration
│   ├── constants.ts          # App constants
│   ├── utils.ts              # Utility functions
│   ├── theme.ts              # Theme configuration
│   └── seo.ts                # SEO utilities
├── types/                      # TypeScript types
│   └── index.ts              # Type definitions
├── utils/                      # Utility functions
├── styles/                     # Global styles
│   ├── globals.css           # Global CSS styles
│   ├── index.css             # Base CSS styles
│   └── index.ts              # Styles exports
├── routes/                     # Routing configuration
│   ├── AppRoutes.tsx         # Main app routes
│   ├── ProtectedRoute.tsx    # Protected route wrapper
│   └── index.ts              # Route exports
├── App.tsx
└── main.tsx
```

## 🎯 **Key Principles**

### **✅ Clean Separation**
- **Services layer** - API calls and TanStack Query definitions
- **Components layer** - UI components organized by feature
- **Pages layer** - Page components
- **Hooks layer** - Custom React hooks
- **Contexts layer** - Global state management

### **✅ Feature-Based Organization**
- **Home components** - All home page components in `features/home/`
- **Mobile components** - Mobile-specific components in `mobile/` subfolders
- **Feature isolation** - Each feature has its own folder
- **Clear boundaries** - Easy to find and maintain feature-specific code

### **✅ Modern Patterns**
- **TanStack Query** - Modern data fetching and caching
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI component library

## 🚀 **Usage Examples**

### **Services Layer**
```typescript
// services/api/properties.ts
export const propertyApi = {
  getProperties: (page, limit, filters) => api.get('/properties', { params: { page, limit, ...filters } }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
};

// services/queries/properties.ts
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters) => [...propertyKeys.lists(), filters] as const,
};
```

### **Query Hooks**
```typescript
// hooks/queries/useProperties.ts
export function useProperties(page = 1, limit = 12, filters) {
  return useQuery({
    queryKey: propertyKeys.list(filters || {}),
    queryFn: () => propertyQueries.getProperties(page, limit, filters),
    staleTime: 5 * 60 * 1000,
  });
}
```

### **Feature Components**
```typescript
// components/features/home/PropertyCarousel.tsx
import { useProperties } from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';

export function PropertyCarousel() {
  const { data: properties, isLoading } = useProperties();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties?.map(property => (
        <Card key={property.id} className="hover:shadow-lg transition-shadow">
          <CardContent>
            <PropertyCard property={property} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### **Page Components**
```typescript
// pages/Home.tsx
import { PropertyCarousel } from '@/components/features/home/PropertyCarousel';
import { AdvancedSearchFilter } from '@/components/features/home/AdvancedSearchFilter';

export function Home() {
  return (
    <div className="min-h-screen">
      <AdvancedSearchFilter />
      <PropertyCarousel />
    </div>
  );
}
```

## 🎨 **Styling Architecture**

### **Tailwind CSS (Primary)**
- **Utility-first approach** - Classes like `className="flex items-center justify-between"`
- **Responsive design** - Using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.)
- **Component styling** - Most components use Tailwind classes

### **CSS Files (Supporting)**
- **`styles/globals.css`** - Global CSS styles and Tailwind directives
- **`styles/index.css`** - Base CSS styles and Tailwind base layer
- **Custom CSS** - Some custom styles that complement Tailwind

### **When to Use What**
- **Use Tailwind** - For most styling needs (layout, spacing, colors, etc.)
- **Use CSS** - For complex animations, custom properties, or styles Tailwind can't handle

## 🎉 **Benefits**

### **✅ Clean Architecture**
- **Separation of concerns** - Each layer has a specific purpose
- **Feature-based organization** - Components grouped by feature
- **Easy to test** - Each layer can be tested independently
- **Easy to maintain** - Clear structure makes changes predictable

### **✅ Developer Experience**
- **Simple imports** - `import { useProperties } from '@/hooks'`
- **Type safety** - Full TypeScript support throughout
- **Intuitive structure** - Easy to find what you need
- **Modern tooling** - TanStack Query, Tailwind CSS, shadcn/ui

### **✅ Scalability**
- **Easy to add features** - Just add new API, queries, and hooks
- **Easy to extend** - Add new endpoints without affecting existing code
- **Team collaboration** - Clear structure for multiple developers
- **Mobile-first** - Responsive design built-in

## 🚀 **Getting Started**

### **Adding a New Feature**
1. **Create API endpoints** in `services/api/`
2. **Add query definitions** in `services/queries/`
3. **Create hooks** in `hooks/queries/` and `hooks/mutations/`
4. **Build components** in `components/features/[feature-name]/`
5. **Add pages** in `pages/`

### **Adding a New Component**
1. **Create component** in appropriate feature folder
2. **Use Tailwind classes** for styling
3. **Export from feature index** file
4. **Import in pages** using `@/components/features/[feature]/[component]`

This clean structure provides a solid foundation for the Jade Property application! 🚀