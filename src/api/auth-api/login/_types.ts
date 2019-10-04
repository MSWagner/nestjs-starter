import { IsString, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsString()
    @MinLength(3)
    @ApiModelProperty({ minLength: 3 })
    readonly username: string;

    @IsString()
    @MinLength(6)
    @ApiModelProperty({ minLength: 6 })
    readonly password: string;
}

export class LoginResponse {
    @ApiModelProperty()
    readonly tokenType: string;

    @ApiModelProperty()
    readonly expiresIn: number;

    @ApiModelProperty({ format: 'uuid' })
    refreshToken: string;

    @ApiModelProperty({ format: 'uuid' })
    accessToken: string;
}
