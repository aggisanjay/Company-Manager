import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SortByField {
  COMPANY_NAME = 'companyName',
  EMPLOYEE_COUNT = 'employeeCount',
  CREATED_AT = 'createdAt',
  INDUSTRY = 'industry',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryCompanyDto {
  @ApiPropertyOptional({
    description: 'Search string across company name and industry (case-insensitive)',
    example: 'tech',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 7,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 7;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: SortByField,
    default: SortByField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(SortByField, {
    message: 'sortBy must be one of: companyName, employeeCount, createdAt, industry',
  })
  sortBy: SortByField = SortByField.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort direction order',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, {
    message: 'order must be either asc or desc',
  })
  order: SortOrder = SortOrder.DESC;
}
