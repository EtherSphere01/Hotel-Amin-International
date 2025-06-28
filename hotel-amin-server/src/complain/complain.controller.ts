import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ComplainService } from './complain.service';
import { CreateComplaintDto } from './DTOs/create-complaint.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@Controller('complain')
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @Auth(AuthType.None)
  @Post('report')
  async reportComplaint(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complainService.reportComplaint(createComplaintDto);
  }
}
