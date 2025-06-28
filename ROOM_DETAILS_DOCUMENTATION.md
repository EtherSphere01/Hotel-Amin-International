# Room Details and Cart Functionality

This implementation adds a comprehensive room details page and shopping cart functionality to the Hotel Amin International website.

## New Features

### 1. Room Details Page (`/accommodation/[id]`)

**Location**: `src/app/(user)/accommodation/[id]/page.tsx`

**Features**:

-   Full room information display with image gallery
-   Interactive booking form with date selection
-   Add to cart functionality
-   Direct booking with authentication check
-   Responsive design with mobile support

**Usage**:

-   Navigate to any room from the accommodation slider
-   Click "DETAILS" button on any room card
-   URL format: `/accommodation/{roomId}`

### 2. Shopping Cart System

**Cart Utilities**: `src/app/utilities/cart-utils.ts`
**Cart Page**: `src/app/(user)/cart/page.tsx`

**Features**:

-   Add rooms to cart with booking details
-   Persistent cart storage using localStorage
-   Cart item count display in header
-   Quantity management
-   Price calculation including multiple nights
-   Clear cart functionality

### 3. Updated Components

#### AccommodationSlider

-   Added navigation to room details page
-   "BOOK NOW" and "DETAILS" buttons now functional
-   Integrated with Next.js router

#### Header Component

-   Cart icon with item count badge
-   Real-time cart updates
-   Added cart page to navigation

### 4. Authentication Integration

**Sign-in Flow**:

-   Book Now button checks authentication status
-   Shows sign-in modal if user not authenticated
-   Proceeds with booking if authenticated
-   Integrates with existing auth system

## API Endpoints

### New Server Endpoints

1. **Get Single Accommodation**

    - `GET /accommodation/{id}`
    - Returns detailed information for a specific room

2. **Create Booking** (existing, now utilized)
    - `POST /booking/create`
    - Creates new booking with authentication

## Database Schema

### Accommodation Entity

```typescript
{
  id: number;
  category: string;
  description: string;
  title: string;
  price: number;
  max_adults: string;
  specs: string[];
  images: string[];
}
```

### Cart Item Interface

```typescript
{
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
}
```

## Setup Instructions

### 1. Server Setup

-   The new `findOne` method has been added to `AccommodationService`
-   The `/:id` endpoint has been added to `AccommodationController`
-   Seed data is available in `accommodation.seed.ts`

### 2. Client Dependencies

All required dependencies are already installed:

-   `react-toastify` - for notifications
-   `swiper` - for image galleries
-   `axios` - for API calls
-   `react-icons` - for UI icons

### 3. Toast Notifications

ToastContainer has been added to the root layout for global notifications.

## Usage Examples

### Adding a Room to Cart

```typescript
import { addToCart } from "@/app/utilities/cart-utils";

const cartItem = {
    id: roomId,
    title: roomTitle,
    price: roomPrice,
    image: roomImage,
    quantity: numberOfRooms,
    checkInDate: selectedCheckIn,
    checkOutDate: selectedCheckOut,
    guests: numberOfGuests,
};

addToCart(cartItem);
```

### Checking Authentication Status

```typescript
const token = localStorage.getItem("access_token");
const isAuthenticated = !!token;
```

## File Structure

```
src/
├── app/
│   ├── (user)/
│   │   ├── accommodation/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Room details page
│   │   │   └── page.tsx             # Rooms listing
│   │   ├── cart/
│   │   │   └── page.tsx             # Shopping cart page
│   │   └── auth/
│   │       └── SignInPage.tsx       # Sign-in modal
│   ├── utilities/
│   │   └── cart-utils.ts            # Cart management utilities
│   └── layout.tsx                   # Updated with ToastContainer
└── component/
    ├── AccommodationSlider.tsx      # Updated with navigation
    └── header-user.tsx              # Updated with cart icon
```

## Testing

1. **Room Details**: Navigate to `/accommodation/1` (or any valid room ID)
2. **Add to Cart**: Click "Add to Cart" button on room details page
3. **View Cart**: Click cart icon in header or navigate to `/cart`
4. **Book Now**: Try booking without authentication to test sign-in flow
5. **Cart Persistence**: Refresh page and verify cart items persist

## Future Enhancements

1. **Payment Integration**: Connect checkout process to payment gateway
2. **Room Availability**: Check room availability before booking
3. **User Profiles**: Store user preferences and booking history
4. **Email Notifications**: Send booking confirmations
5. **Advanced Filtering**: Filter rooms by price, amenities, etc.

## Notes

-   Cart data is stored in localStorage and persists across sessions
-   Authentication uses existing JWT token system
-   All prices are displayed in Bangladeshi Taka (৳)
-   Image galleries support multiple images per room
-   Responsive design works on mobile and desktop
-   Error handling included for API failures and edge cases
