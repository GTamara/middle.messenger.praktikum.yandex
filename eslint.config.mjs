import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
// import jsdoc from 'eslint-plugin-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([{
	extends: compat.extends("google"),
	files: ["**/*.ts"],
	ignores: [
		"**/*d.ts"
	],
	languageOptions: {
		parser: tsParser,
		// parserOptions: {
		// 	project: './tsconfig.json' // Path to your tsconfig.json
		// }
	},
	plugins: {
		'@typescript-eslint': ts,
	},
	rules: {
		"indent": ["error", 4],
		"object-curly-spacing": ["error", "always", { "objectsInObjects": false }],
		"array-bracket-spacing": ["error", "never", {
			"singleValue": true,
			"objectsInArrays": true,
			"arraysInArrays": true,
		}],
		"require-jsdoc": "off",
		"valid-jsdoc": "off",
		// "eslint-plugin-jsdoc": "off",
		"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
		'max-len': ["error", { "code": 120 }],
	},
}]);
