import { IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
    @IsUUID()
    @ApiModelProperty({ format: 'uuid' })
    refreshToken: string;
}

export class RefreshTokenResponse {
    @ApiModelProperty()
    readonly tokenType: string;

    @ApiModelProperty()
    readonly expiresIn: number;

    @ApiModelProperty({ format: 'uuid' })
    refreshToken: string;

    @ApiModelProperty({ format: 'uuid' })
    accessToken: string;
}
