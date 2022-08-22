import { IsString, Length, Matches } from "class-validator";

export class AuthCredentialsDto{

    @IsString()
    @Length(4, 20)
    username: string;

    @IsString()
    @Length(8, 32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    { message: 'password is too weak' })
    password: string;
}