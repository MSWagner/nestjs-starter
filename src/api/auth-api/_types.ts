import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponse {
    @ApiProperty()
    readonly success: boolean;
}
