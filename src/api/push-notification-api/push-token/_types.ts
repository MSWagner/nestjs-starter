import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PushTokenDto {
    @IsString()
    @MinLength(3)
    @ApiProperty({ minLength: 3 })
    readonly token: string;
}
