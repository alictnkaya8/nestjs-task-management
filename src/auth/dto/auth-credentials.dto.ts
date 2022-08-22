import { IsString, Length } from "class-validator";

export class AuthCredentialsDto{

    @IsString()
    @Length(4, 20)
    username: string;

    @IsString()
    @Length(8, 32)
    password: string;
}