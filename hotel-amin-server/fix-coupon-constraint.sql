-- SQL script to drop the unique constraint on coupon_code in CouponUsage table
-- Run this in your PostgreSQL database

-- Drop the unique constraint
ALTER TABLE "CouponUsage" DROP CONSTRAINT IF EXISTS "UQ_dc055213cea683c09aea5da56c5";

-- Verify the constraint is dropped
\d "CouponUsage"
