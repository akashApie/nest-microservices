import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, Logger, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UsePipes(new ValidationPipe({ 
  whitelist: true,
  exceptionFactory: (errors) => {
    const errorMessages = errors.map((error) => {
      return error.constraints ? Object.values(error.constraints).join(', ') : 'Validation error';
    });
    new Logger(CustomerController.name).error(`Validation failed: ${errorMessages.join(' | ')}`);
    return new Error(errorMessages.join('; '));
  }
}))
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    this.logger.debug('Received create customer payload:', JSON.stringify(createCustomerDto));
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.debug(`Looking up customer with ID: ${id}`);
    return this.customerService.findOne(id).catch(error => {
      this.logger.error(`Failed to find customer ${id}:`, error.stack);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    });
  }

  @Get(':id/verify')
  async verifyCustomer(@Param('id') id: string) {
    this.logger.debug(`Verifying customer with ID: ${id}`);
    try {
      const customer = await this.customerService.findOne(id);
      return { verified: true, customerId: id };
    } catch (error) {
      this.logger.error(`Customer verification failed for ${id}:`, error.stack);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
