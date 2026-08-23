import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'The official name of the company',
    example: 'Acme Corporation',
  })
  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required and cannot be empty' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  companyName: string;

  @ApiPropertyOptional({
    description: 'Company official website URL',
    example: 'https://acme.example.com',
  })
  @IsOptional()
  @ValidateIf((o) => o.website !== null && o.website !== '')
  @IsUrl(
    { require_protocol: true },
    { message: 'Website must be a valid URL with protocol (e.g. https://example.com)' },
  )
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? null : value?.trim()))
  website?: string | null;

  @ApiPropertyOptional({
    description: 'Industry or business vertical',
    example: 'Software & Technology',
  })
  @IsOptional()
  @IsString({ message: 'Industry must be a string' })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? null : value?.trim()))
  industry?: string | null;

  @ApiPropertyOptional({
    description: 'Estimated number of employees',
    example: 120,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @ValidateIf((o) => o.employeeCount !== null && o.employeeCount !== undefined)
  @IsInt({ message: 'Employee count must be a whole number' })
  @Min(1, { message: 'Employee count must be at least 1' })
  employeeCount?: number | null;
}
