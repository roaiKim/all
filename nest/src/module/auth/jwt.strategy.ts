import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "./constants";
import { JwtUserToken } from "./auth.type";
import { Request } from "express";

const cookieExtractor = function (request: Request) {
    if (request && request.cookies) {
        return request.cookies["token"];
    }
    return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // cookieExtractor, // ExtractJwt.fromHeader('token'),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    validate(user: JwtUserToken): JwtUserToken {
        return user;
    }
}
