import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto, SortByField, SortOrder } from './dto/query-company.dto';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          companyName: createCompanyDto.companyName,
          website: createCompanyDto.website || null,
          industry: createCompanyDto.industry || null,
          employeeCount: createCompanyDto.employeeCount ?? null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create company: ${(error as Error).message}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async findAll(query: QueryCompanyDto) {
    const {
      search,
      page = 1,
      limit = 7,
      sortBy = SortByField.CREATED_AT,
      order = SortOrder.DESC,
    } = query;

    const numericPage = Math.max(1, Number(page) || 1);
    const numericLimit = Math.max(1, Math.min(100, Number(limit) || 7));
    const skip = (numericPage - 1) * numericLimit;
    const take = numericLimit;

    // Prisma filter condition for case-insensitive search
    const where: Prisma.CompanyWhereInput = {};
    if (search && search.trim().length > 0) {
      const searchTerm = search.trim();
      where.OR = [
        {
          companyName: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          industry: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ];
    }

    try {
      const [items, total] = await Promise.all([
        this.prisma.company.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy]: order,
          },
        }),
        this.prisma.company.count({ where }),
      ]);

      const totalPages = Math.ceil(total / numericLimit) || 1;

      return {
        data: items,
        meta: {
          total,
          page: numericPage,
          limit: numericLimit,
          totalPages,
          hasNextPage: numericPage < totalPages,
          hasPrevPage: numericPage > 1,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve companies: ${(error as Error).message}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID "${id}" was not found`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id); // Throws 404 if not found

    try {
      return await this.prisma.company.update({
        where: { id },
        data: {
          ...(updateCompanyDto.companyName !== undefined && {
            companyName: updateCompanyDto.companyName,
          }),
          ...(updateCompanyDto.website !== undefined && {
            website: updateCompanyDto.website || null,
          }),
          ...(updateCompanyDto.industry !== undefined && {
            industry: updateCompanyDto.industry || null,
          }),
          ...(updateCompanyDto.employeeCount !== undefined && {
            employeeCount: updateCompanyDto.employeeCount ?? null,
          }),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update company "${id}": ${(error as Error).message}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(id: string) {
    await this.findOne(id); // Throws 404 if not found

    try {
      await this.prisma.company.delete({
        where: { id },
      });

      return {
        success: true,
        message: `Company with ID "${id}" successfully deleted`,
      };
    } catch (error) {
      this.logger.error(`Failed to delete company "${id}": ${(error as Error).message}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to delete company');
    }
  }

  async getMetrics() {
    try {
      const [totalCount, aggregateStats, allCompanies] = await Promise.all([
        this.prisma.company.count(),
        this.prisma.company.aggregate({
          _sum: {
            employeeCount: true,
          },
          _avg: {
            employeeCount: true,
          },
        }),
        this.prisma.company.findMany({
          select: { industry: true },
        }),
      ]);

      const industryMap: Record<string, number> = {};
      allCompanies.forEach((c) => {
        const ind = c.industry || 'Unspecified';
        industryMap[ind] = (industryMap[ind] || 0) + 1;
      });

      const topIndustries = Object.entries(industryMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalCompanies: totalCount,
        totalEmployees: aggregateStats._sum.employeeCount || 0,
        averageEmployees: Math.round(aggregateStats._avg.employeeCount || 0),
        topIndustries,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate metrics: ${(error as Error).message}`);
      return {
        totalCompanies: 0,
        totalEmployees: 0,
        averageEmployees: 0,
        topIndustries: [],
      };
    }
  }
}
