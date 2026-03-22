import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateOrderDTO {
    @IsInt({ message: 'productId must be an integer.' })
    @IsNotEmpty({ message: 'productId is required.' })
    productId: number;

    @IsInt({ message: 'quantity must be an integer.' })
    @Min(1, { message: 'quantity must be at least 1.' })
    @IsNotEmpty({ message: 'quantity is required.' })
    quantity: number;

    @IsString({ message: 'shippingAddress must be a string.' })
    @MinLength(5, {
        message: 'shippingAddress must be at least 5 characters long.',
    })
    @IsNotEmpty({ message: 'shippingAddress is required.' })
    shippingAddress: string;
}