/**
 * Data whose key matches any of the @maskedKeywords RegExp, will be serialized as mask.
 * Useful to serialize sensitive data, e.g. password.
 * Function & Symbol are also discarded in the serialization.
 */
// export function stringifyWithMask(maskedKeywords: RegExp[], maskedOutput: string, ...args: any[]): string | undefined {
//     const seen = new WeakSet();
//     const replacer = (key: string, value: any) => {
//         if (typeof value === "object" && value !== null) {
//             if (seen.has(value)) {
//                 return undefined;
//             }
//             seen.add(value);
//         }

//         if (typeof value === "function" || typeof value === "symbol") {
//             return undefined;
//         }
//         if (maskedKeywords.some((_) => _.test(key))) {
//             return maskedOutput;
//         }
//         return value;
//     };

//     const isEvent = (e: any) => Boolean(e && e.target && e.currentTarget);
//     const serializableArgs = args.filter((_) => typeof _ !== "function" && typeof _ !== "symbol" && !isEvent(_));
//     switch (serializableArgs.length) {
//         case 0:
//             return undefined;
//         case 1:
//             return JSON.stringify(serializableArgs[0], replacer);
//         default:
//             return JSON.stringify(serializableArgs, replacer);
//     }
// }

// /**
//  * If an ISO format date (2018-05-24T12:00:00.123Z) appears in the JSON, it will be transformed to JS Date type.
//  */
// export function parseWithDate(data: string) {
//     const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;
//     return JSON.parse(data, (key: any, value: any) => {
//         if (typeof value === "string" && ISO_DATE_FORMAT.test(value)) {
//             return new Date(value);
//         }
//         return value;
//     });
// }

// {
//     "compilerOptions": {
//         "rootDir": "src",
//         "outDir": "lib",
//         "composite": true,
//         "declarationMap": true,
//         "moduleResolution": "Bundler",
//         "jsx": "react",
//         "lib": ["DOM", "ES2020"],
//         "types": ["node"],
//         "target": "es5",
//         "module": "esnext",
//         "sourceMap": true,
//         "inlineSources": true,
//         "declaration": true,
//         "strict": true,
//         "exactOptionalPropertyTypes": true,
//         "allowSyntheticDefaultImports": true,
//         "verbatimModuleSyntax": true,
//         "esModuleInterop": true,
//         "importHelpers": true,
//         "forceConsistentCasingInFileNames": true,
//         "skipLibCheck": true,
//         "noImplicitOverride": true,
//         "downlevelIteration": true
//     },
//     "include": ["src"]
// }

// "@typescript-eslint/eslint-plugin": "^6.15.0",
//     "@typescript-eslint/parser": "^6.15.0",
//     "eslint": "^8.56.0",
//     "eslint-config-prettier": "9.0.0",
//     "eslint-plugin-prettier": "^5.0.0",
//     "eslint-plugin-react": "^7.30.0",

// "@typescript-eslint/eslint-plugin": "5.1.0",
// "@typescript-eslint/parser": "5.1.0",
// "eslint-plugin-simple-import-sort": "^10.0.0",
// "eslint": "8.0.1",
// "eslint-config-prettier": "^8.3.0",
// "eslint-plugin-prettier": "^4.0.0",
// "eslint-plugin-react": "^7.30.0",
