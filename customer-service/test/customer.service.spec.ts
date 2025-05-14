import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../src/customer/customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../src/customer/customer.entity';
import { Repository } from 'typeorm';

describe('CustomerService', () => {
  let service: CustomerService;
  let repo: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<CustomerService>(CustomerService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a customer', async () => {
    const dto = { name: 'Test', email: 'test@example.com', address: '123' };
    (repo.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(dto));
  });
});
