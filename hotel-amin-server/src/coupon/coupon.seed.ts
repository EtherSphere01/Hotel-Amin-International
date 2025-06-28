import { Coupon } from './entities/coupon.entity';

export const couponSeeds: Partial<Coupon>[] = [
  {
    coupon_code: 'WELCOME10',
    coupon_percent: 10,
    is_active: true,
    quantity: 100,
    expire_at: new Date('2025-12-31'),
  },
  {
    coupon_code: 'Save20',
    coupon_percent: 20,
    is_active: true,
    quantity: 50,
    expire_at: new Date('2025-12-31'),
  },
  {
    coupon_code: 'vip30',
    coupon_percent: 30,
    is_active: true,
    quantity: 25,
    expire_at: new Date('2025-12-31'),
  },
  {
    coupon_code: 'NewYear50',
    coupon_percent: 50,
    is_active: true,
    quantity: 10,
    expire_at: new Date('2025-12-31'),
  },
  {
    coupon_code: 'EXPIRED',
    coupon_percent: 15,
    is_active: false,
    quantity: 0,
    expire_at: new Date('2024-01-01'),
  },
];
