import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class ProductCreateDto {
    @IsString({message: 'Name must be a string.'})
    @IsNotEmpty({message: 'Name is required.'})
    name: string;

    @Min(1, {message: 'Quantity must be at least 1.'})
    @IsInt({message: 'Quantity must be an integer.'})
    quantity: number;

    @IsString({message: 'Description must be a string.'})
    @IsOptional()
    description?: string;
    
    @Min(0.1, {message: 'Price must be at least 0.1.'})
    price: number;
}