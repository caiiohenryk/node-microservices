import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class RequestProductDTO {
    @IsInt()
    id: number;

    @IsInt()
    quantity: number;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}