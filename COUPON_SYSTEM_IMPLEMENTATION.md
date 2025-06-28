# Coupon System Implementation

## Overview

Added comprehensive coupon functionality to the Hotel Amin booking system, allowing both authenticated users and guests to apply discount coupons during the booking process.

## Features Added

### Frontend (Client-side)

1. **Coupon Input Section** - Added after room/guest selection in accommodation details page

    - Input field for coupon code
    - Apply button with loading state
    - Validation and error handling
    - Real-time price calculation with discount

2. **Applied Coupon Display**

    - Shows applied coupon code and discount percentage
    - Option to remove applied coupon
    - Visual feedback with green styling

3. **Price Calculation Update**

    - Shows original price, discount amount, and final total
    - Dynamic calculation based on nights, rooms, and coupon discount
    - Updates in real-time when coupon is applied/removed

4. **Guest Registration Form Enhancement**
    - Displays coupon information in booking summary
    - Shows discount in guest booking flow

### Backend (Server-side)

1. **Coupon Validation Endpoint**

    - Modified `/coupon/search/:coupon_code` to allow guest access
    - Validates coupon status, expiry, and availability
    - Returns coupon details for discount calculation

2. **Booking Integration**

    - Updated `CreateAccommodationBookingDto` to include coupon fields
    - Updated `CreateGuestBookingDto` to include coupon fields
    - Booking service processes coupon data during booking creation

3. **Test Data**
    - Created coupon seed file with sample coupons:
        - WELCOME10 (10% discount)
        - SAVE20 (20% discount)
        - VIP30 (30% discount)
        - EXPIRED (for testing expired coupons)

## Usage Flow

### For Authenticated Users:

1. Select room and dates
2. Enter coupon code and click "Apply"
3. See updated price with discount
4. Click "Book Now" to complete booking with coupon

### For Guest Users:

1. Select room and dates
2. Enter coupon code and click "Apply"
3. See updated price with discount
4. Click "Book Now" to open guest registration form
5. Fill guest details and complete booking with coupon

## Technical Details

### State Management

-   `couponCode`: Current coupon code input
-   `appliedCoupon`: Full coupon object when validated
-   `couponDiscount`: Discount percentage for calculations
-   `couponLoading`: Loading state for coupon validation

### API Integration

-   GET `/coupon/search/:coupon_code` - Validate and retrieve coupon
-   POST `/booking/create-accommodation` - Create booking with coupon (authenticated)
-   POST `/booking/create-guest` - Create guest booking with coupon

### Price Calculation

```javascript
const baseTotal = price * nights * rooms;
const discount = appliedCoupon
    ? Math.round((baseTotal * appliedCoupon.coupon_percent) / 100)
    : 0;
const finalTotal = baseTotal - discount;
```

## Files Modified

### Frontend:

-   `src/app/(user)/accommodation/[id]/page.tsx` - Main coupon functionality
-   `src/component/GuestRegistrationForm.tsx` - Guest form coupon display

### Backend:

-   `src/coupon/coupon.controller.ts` - Allow guest access to coupon validation
-   `src/booking/DTOs/create-accommodation-booking.dto.ts` - Already had coupon fields
-   `src/booking/DTOs/create-guest-booking.dto.ts` - Already had coupon fields

### New Files:

-   `src/coupon/coupon.seed.ts` - Test coupon data

## Testing

Test with these sample coupon codes:

-   `WELCOME10` - 10% discount
-   `SAVE20` - 20% discount
-   `VIP30` - 30% discount
-   `EXPIRED` - Should show as expired/inactive

## Error Handling

-   Invalid coupon codes show "Invalid coupon code" message
-   Expired coupons show "This coupon has expired" message
-   Inactive coupons show "This coupon is no longer active" message
-   Out of stock coupons show "This coupon is no longer available" message
