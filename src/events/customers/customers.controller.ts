import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from '../../@core/events/application/customer.service';

@Controller('customers')
export class CustomersController {
  constructor(private customerService: CustomerService) {}

  @Get()
  async list() {
    return this.customerService.list();
  }

  @Post()
  create(@Body() body: { name: string; cpf: string }) {
    return this.customerService.register(body);
  }
}
