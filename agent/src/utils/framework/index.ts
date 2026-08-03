import { lessPrefixName } from "config/static-constant";

export const joinLessPrefix = (suffix: string) => `${lessPrefixName}-${suffix}`;
