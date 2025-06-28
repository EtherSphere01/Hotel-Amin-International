import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discover } from './discover.entity';

@Injectable()
export class DiscoverService {
  constructor(
    @InjectRepository(Discover)
    private readonly discoverRepository: Repository<Discover>,
  ) {}

  async findAll(): Promise<Discover[]> {
    return this.discoverRepository.find();
  }

  async findOne(id: number): Promise<Discover> {
    const result = await this.discoverRepository.findOneBy({ id });
    if (!result) throw new Error('Discover not found');
    return result;
  }

  async create(data: Partial<Discover>): Promise<Discover> {
    const discover = this.discoverRepository.create(data);
    return this.discoverRepository.save(discover);
  }

  async update(id: number, data: Partial<Discover>): Promise<Discover> {
    await this.discoverRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.discoverRepository.delete(id);
  }
}
