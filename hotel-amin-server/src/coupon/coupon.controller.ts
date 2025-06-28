import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './DTOs/create-coupon.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Auth(AuthType.None)
  @Get('all')
  public getCoupons() {
    return this.couponService.getAllCoupons();
  }
  @Roles('admin')
  @Get('couponUsage')
  public getCouponUsage() {
    return this.couponService.getCouponUsage();
  }
  @Roles('admin')
  @Get('couponUsage/:coupon_code')
  public getCouponUsageByCode(@Param('coupon_code') coupon_code: string) {
    return this.couponService.getCouponUsageByCode(coupon_code);
  }

  @Roles('admin')
  @Post('create')
  public async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.createCoupon(createCouponDto);
  }

  @Auth(AuthType.None)
  @Get('search/:coupon_code')
  public async getCouponByCode(@Param('coupon_code') coupon_code: string) {
    return await this.couponService.getCouponByCode(coupon_code);
  }

  @Auth(AuthType.None)
  @Put('update/:coupon_id')
  public async updateCoupon(
    @Param('coupon_id') coupon_id: number,
    @Body() updateCouponDto: CreateCouponDto,
  ) {
    return await this.couponService.updateCouponData(
      coupon_id,
      updateCouponDto,
    );
  }

  @Auth(AuthType.None)
  @Delete('delete/:coupon_code')
  public async deleteCoupon(@Param('coupon_code') coupon_code: string) {
    return await this.couponService.deleteCoupon(coupon_code);
  }
}
