import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @IsUUID()
    @ApiProperty({ format: "uuid" })
    refreshToken: string;
}

export class RefreshTokenResponse {
    @ApiProperty()
    readonly tokenType: string;

    @ApiProperty()
    readonly expiresIn: number;

    @ApiProperty({ format: "uuid" })
    refreshToken: string;

    @ApiProperty({ format: "uuid" })
    accessToken: string;
}
