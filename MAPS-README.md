# Google Maps Integration for Property Listings

This document describes the Google Maps integration component for displaying property listings with interactive filters and markers.

## 🗺️ Features

### Interactive Map
- **Google Maps Integration** - Full-featured map with custom styling
- **Property Markers** - Color-coded markers based on listing status
- **Info Windows** - Click markers to view property details
- **Responsive Design** - Works on desktop and mobile devices

### Advanced Filtering
- **Status Filter** - Dropdown to filter by Active, Pending, or Sold
- **Price Range Slider** - Interactive range slider for price filtering
- **Search Functionality** - Search by address, MLS number, or description
- **Real-time Updates** - Filters update map markers instantly

### Data Management
- **Database Integration** - Fetches listings from Vercel Postgres via Prisma
- **Geocoding** - Automatically geocodes addresses using Google Maps API
- **Coordinate Storage** - Caches coordinates to avoid repeated geocoding
- **Error Handling** - Graceful handling of geocoding failures

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="your_vercel_postgres_url"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

### 2. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 3. Database Schema

The Prisma schema includes latitude and longitude fields:

```prisma
model Listing {
  id          String   @id @default(cuid())
  mlsNumber   String   @unique
  address     String
  price       Int
  status      ListingStatus
  description String?
  latitude    Float?    // New field for geocoding
  longitude   Float?    // New field for geocoding
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 4. Install Dependencies

```bash
npm install @react-google-maps/api react-slider
npm install --save-dev @types/react-slider
```

### 5. Usage

```tsx
import MapWithFilters from '../components/MapWithFilters';

export default function ListingsPage() {
  return (
    <div>
      <h1>Property Listings Map</h1>
      <MapWithFilters />
    </div>
  );
}
```

## 📁 File Structure

```
components/
├── MapWithFilters.tsx          # Main map component
pages/
├── listings-map.tsx            # Map page wrapper
app/api/
├── listings/
│   └── route.ts                # GET endpoint for listings
prisma/
├── schema.prisma               # Database schema with coordinates
```

## 🔧 API Endpoints

### GET /api/listings

Fetches listings with optional filtering.

**Query Parameters:**
- `status` - Filter by listing status (Active, Pending, Sold)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search term for address, MLS number, or description
- `limit` - Maximum number of results

**Example:**
```
GET /api/listings?status=Active&minPrice=200000&maxPrice=500000&search=watertown
```

**Response:**
```json
[
  {
    "id": "clx123...",
    "mlsNumber": "1929100",
    "address": "305 Theresa St, Watertown, WI 53094",
    "price": 324900,
    "status": "Active",
    "description": "Beautiful 3BR/2BA home",
    "latitude": 43.1945,
    "longitude": -88.7289,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🎨 Customization

### Map Styling

The map uses custom styling to hide POI labels:

```tsx
const mapOptions = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};
```

### Marker Colors

Markers are color-coded by status:

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return '#28a745';    // Green
    case 'Pending': return '#ffc107';   // Yellow
    case 'Sold': return '#6c757d';      // Gray
    default: return '#007bff';          // Blue
  }
};
```

### Filter UI

The component uses Bootstrap for responsive filter controls:

- **Search Input** - Text input for keyword search
- **Status Dropdown** - Select box for status filtering
- **Price Range Slider** - React Slider component for price range
- **Action Buttons** - Clear filters and fit to markers

## 🔄 Geocoding Process

1. **Check Existing Coordinates** - First checks if latitude/longitude exist
2. **Geocode Address** - Uses Google Maps Geocoding API if coordinates missing
3. **Store Coordinates** - Saves coordinates to database for future use
4. **Error Handling** - Gracefully handles geocoding failures

## 📱 Responsive Design

The component is fully responsive:

- **Desktop** - Full-width map with sidebar filters
- **Tablet** - Stacked layout with collapsible filters
- **Mobile** - Optimized touch interface with simplified controls

## 🚨 Error Handling

### API Errors
- Database connection failures
- Invalid query parameters
- Geocoding API errors

### User Experience
- Loading states during data fetch
- Error messages for failed operations
- Graceful degradation when geocoding fails

## 🔒 Security Considerations

### API Key Security
- Restrict API key to specific domains
- Enable only required APIs (Maps JavaScript, Geocoding)
- Monitor API usage and set quotas

### Data Validation
- Server-side validation of all inputs
- SQL injection prevention via Prisma
- Rate limiting for geocoding requests

## 🧪 Testing

### Unit Tests
```bash
npm test MapWithFilters.test.tsx
```

### Integration Tests
```bash
npm test api/listings.test.ts
```

### Manual Testing
1. Load the map page
2. Test all filter combinations
3. Verify marker interactions
4. Test geocoding with new addresses

## 📊 Performance Optimization

### Database
- Indexed columns for filtering (status, price)
- Efficient queries with proper WHERE clauses
- Connection pooling for serverless

### Frontend
- Lazy loading of Google Maps API
- Debounced search input
- Memoized filter functions
- Efficient re-rendering with React hooks

### Geocoding
- Coordinate caching to avoid repeated API calls
- Batch processing for multiple addresses
- Error handling to prevent blocking

## 🚀 Deployment

### Vercel
1. Set environment variables in Vercel dashboard
2. Deploy with `vercel --prod`
3. Verify Google Maps API key restrictions

### Environment Variables
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

## 📈 Monitoring

### Analytics
- Track map interactions
- Monitor geocoding success rates
- Measure filter usage patterns

### Error Tracking
- Log geocoding failures
- Monitor API response times
- Track database query performance

## 🔄 Future Enhancements

### Planned Features
- **Clustering** - Group nearby markers for better performance
- **Heat Maps** - Show property density by area
- **Street View** - Integrate Street View for property previews
- **Directions** - Add directions to selected properties
- **Favorites** - Allow users to save favorite properties
- **Sharing** - Share filtered map views via URL

### Technical Improvements
- **WebSocket Updates** - Real-time listing updates
- **Offline Support** - Cache map data for offline viewing
- **Advanced Filters** - Property type, bedrooms, bathrooms
- **Export Functionality** - Export filtered results to CSV

## 📞 Support

For technical support or questions about the Google Maps integration:

1. Check the console for error messages
2. Verify API key configuration
3. Test database connectivity
4. Review Google Maps API quotas

## 📄 License

This component is part of the Kathy Polensky Real Estate website and follows the same licensing terms.
