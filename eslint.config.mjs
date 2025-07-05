import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
// @ts-check
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
// import pkg from '@typescript-eslint/eslint-plugin';
// const { ts, tsPlugin } = pkg;
import tsPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([
	{
		ignores: [
            "**/dist/**",          // Игнорируем всю папку dist
            "**/*.d.ts",           // Игнорируем файлы деклараций TypeScript
            "**/assets/**",        // Игнорируем папку assets
            "/dist/assets/*.js"    // Конкретно для вашего случая
        ]
	},
	eslint.configs.recommended,
	{
		extends: [
			compat.extends("google"),
		],
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			globals: {
				...globals.browser, // Добавляем браузерные глобальные переменные
				...globals.es2021,  // Если нужно, можно добавить другие глобалы
			}
			// parserOptions: {
			// 	project: './tsconfig.json' // Path to your tsconfig.json
			// }
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			import: importPlugin,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				"error",
				{
					"argsIgnorePattern": "^_",  // Игнорировать неиспользуемые аргументы, начинающиеся с _
					"varsIgnorePattern": "^_",  // Игнорировать неиспользуемые переменные, начинающиеся с _
					"caughtErrorsIgnorePattern": "^_"  // Игнорировать неиспользуемые ошибки в catch
				}
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			"indent": ["error", 4],
			"no-unused-vars": "off",
			"no-tabs": "off",
			"object-curly-spacing": ["error", "always", { "objectsInObjects": false }],
			"array-bracket-spacing": ["error", "never", {
				"singleValue": true,
				"objectsInArrays": true,
				"arraysInArrays": true,
			}],
			"require-jsdoc": "off",
			"valid-jsdoc": "off",
			"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
			'max-len': ["error", { "code": 140 }],
		},
	}]);
