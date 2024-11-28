import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2024,
            parser: typescriptParser
        },
        rules: {
            "indent": [
                "error",
                4
            ],
            "linebreak-style": [
                "error",
                "unix"
            ],
            "quotes": [
                "error",
                "double"
            ],
            "semi": [
                "error",
                "always"
            ],
            "strict" :"error",
            "no-var":"error",
            "no-console":"warn",
            "array-callback-return":"error",
            "yoda":"error",
            "@typescript-eslint/no-unused-vars": ["error", {"varsIgnorePattern": "O_", "argsIgnorePattern": "O_"}],
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-non-null-assertion": "off"
        }
    }
];
