const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.export = [
    {
        files: ["**/*.ts"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.eslint.json",
                sourceType: "module",
                ecmaVersion: "latest"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint
        },
        rules: {
            "no-console": "off",
            "no-unused-vars": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],

            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-floating-promises": "error"
        }
    },
    {
        files: ["src/tests/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];