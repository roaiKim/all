import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserEntity } from "module/user/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "name",
            passwordField: "password",
        });
    }

    validate(name: string, password: string): boolean {
        // return this.authService.validateUser(name, password)
        console.log("name, password", name, password);
        return true;
    }
}
