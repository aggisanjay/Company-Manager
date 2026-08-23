import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';
import { SortByField, SortOrder } from './dto/query-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: PrismaService;

  const mockCompany = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    companyName: 'Acme Corp',
    website: 'https://acme.com',
    industry: 'Software & SaaS',
    employeeCount: 150,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  };

  const mockPrismaService = {
    company: {
      create: jest.fn().mockResolvedValue(mockCompany),
      findMany: jest.fn().mockResolvedValue([mockCompany]),
      count: jest.fn().mockResolvedValue(1),
      findUnique: jest.fn().mockResolvedValue(mockCompany),
      update: jest.fn().mockResolvedValue(mockCompany),
      delete: jest.fn().mockResolvedValue(mockCompany),
      aggregate: jest.fn().mockResolvedValue({
        _sum: { employeeCount: 150 },
        _avg: { employeeCount: 150 },
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a company record', async () => {
      const dto = {
        companyName: 'Acme Corp',
        website: 'https://acme.com',
        industry: 'Software & SaaS',
        employeeCount: 150,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockCompany);
      expect(mockPrismaService.company.create).toHaveBeenCalledWith({
        data: {
          companyName: dto.companyName,
          website: dto.website,
          industry: dto.industry,
          employeeCount: dto.employeeCount,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated company data with correct pagination metadata', async () => {
      const query = {
        search: 'acme',
        page: 1,
        limit: 10,
        sortBy: SortByField.COMPANY_NAME,
        order: SortOrder.ASC,
      };

      const result = await service.findAll(query);
      expect(result.data).toEqual([mockCompany]);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      expect(mockPrismaService.company.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { companyName: { contains: 'acme', mode: 'insensitive' } },
            { industry: { contains: 'acme', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: {
          companyName: 'asc',
        },
      });
    });

    it('should calculate skip correctly for subsequent pages', async () => {
      const query = {
        page: 3,
        limit: 10,
        sortBy: SortByField.CREATED_AT,
        order: SortOrder.DESC,
      };

      await service.findAll(query);
      expect(mockPrismaService.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the company if found', async () => {
      const result = await service.findOne(mockCompany.id);
      expect(result).toEqual(mockCompany);
      expect(mockPrismaService.company.findUnique).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
    });

    it('should throw NotFoundException if company is not found', async () => {
      mockPrismaService.company.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete company if it exists', async () => {
      const result = await service.remove(mockCompany.id);
      expect(result).toEqual({
        success: true,
        message: `Company with ID "${mockCompany.id}" successfully deleted`,
      });
      expect(mockPrismaService.company.delete).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
    });

    it('should throw NotFoundException when deleting non-existent company', async () => {
      mockPrismaService.company.findUnique.mockResolvedValueOnce(null);
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
