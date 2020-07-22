import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @ApiProperty({ minLength: 3 })
    readonly username: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({ minLength: 6 })
    readonly password: string;
}

export class RegisterResponse {
    @ApiProperty()
    readonly tokenType: string;

    @ApiProperty()
    readonly expiresIn: number;

    @ApiProperty({ format: "uuid" })
    refreshToken: string;

    @ApiProperty({ format: "uuid" })
    accessToken: string;
}
