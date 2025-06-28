import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { Discover } from './discover.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get()
  findAll(): Promise<Discover[]> {
    return this.discoverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Discover> {
    return this.discoverService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Discover>): Promise<Discover> {
    return this.discoverService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Discover>,
  ): Promise<Discover> {
    return this.discoverService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.discoverService.remove(id);
  }
}
