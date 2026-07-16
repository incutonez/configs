import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import antfu from "eslint-plugin-antfu";
import pluginImport from "eslint-plugin-simple-import-sort";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/strongly-recommended"],
	{
		plugins: {
			"@stylistic": stylistic,
			"simple-import-sort": pluginImport,
			antfu,
		},
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".vue"],
				sourceType: "module",
			},
		},
		rules: {
			"antfu/consistent-list-newline": ["error", {
				TSTypeLiteral: false,
			}],
			"vue/attributes-order": "error",
			"vue/no-useless-v-bind": "error",
			"space-before-function-paren": ["error", {
				anonymous: "never",
				named: "never",
				asyncArrow: "always",
			}],
			"func-style": ["error", "declaration"],
			"no-else-return": "error",
			"function-call-argument-newline": ["error", "consistent"],
			"function-paren-newline": ["error", "consistent"],
			"no-var": "error",
			"@typescript-eslint/no-unused-vars": ["error", {
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			}],
			"@typescript-eslint/ban-ts-comment": ["error", {
				"ts-expect-error": "allow-with-description",
				"ts-nocheck": "allow-with-description",
			}],
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/no-mixed-spaces-and-tabs": "error",
			"@stylistic/space-infix-ops": "error",
			"@stylistic/space-before-blocks": "error",
			"@stylistic/space-in-parens": "error",
			"@stylistic/quote-props": ["error", "consistent-as-needed"],
			"@stylistic/indent": ["error", "tab", {
				SwitchCase: 1,
				ignoredNodes: ["PropertyDefinition"],
			}],
			"@stylistic/padding-line-between-statements": ["error", {
				blankLine: "always",
				prev: "export",
				next: "*",
			}, {
				blankLine: "any",
				prev: "export",
				next: "export",
			}, {
				blankLine: "always",
				prev: "*",
				next: "return",
			}, {
				blankLine: "always",
				prev: "import",
				next: "*",
			}, {
				blankLine: "any",
				prev: "import",
				next: "import",
			}, {
				blankLine: "always",
				prev: "function",
				next: "*",
			}, {
				blankLine: "always",
				prev: "*",
				next: "function",
			}],
			"@stylistic/object-property-newline": ["error", {
				allowAllPropertiesOnSameLine: true,
			}],
			"@stylistic/object-curly-newline": ["error", {
				ObjectExpression: {
					multiline: true,
					minProperties: 1,
				},
				ImportDeclaration: {
					multiline: true,
					minProperties: 5,
				},
			}],
			"eqeqeq": ["error", "always", {
				null: "ignore",
			}],
			"semi": [2, "always"],
			"quotes": ["error", "double"],
			"curly": "error",
			"multiline-ternary": ["error", "always-multiline"],
			"brace-style": ["error", "stroustrup"],
			"comma-dangle": ["error", "always-multiline"],
			"eol-last": ["error", "always"],
			"object-curly-spacing": ["error", "always"],
			"no-trailing-spaces": ["error"],
			"no-debugger": "error",
			"no-console": ["error", {
				allow: ["warn", "error", "info"],
			}],
			"arrow-spacing": "error",
			"no-duplicate-imports": "error",
			"arrow-parens": "error",
			"computed-property-spacing": ["error", "never"],
			"func-call-spacing": ["error", "never"],
			"new-parens": "error",
			"prefer-const": "error",
			"array-bracket-spacing": ["error", "never"],
			"comma-spacing": ["error", {
				before: false,
				after: true,
			}],
			"key-spacing": "error",
			"keyword-spacing": "error",
			"simple-import-sort/imports": ["error", {
				groups: [[
					"^\\u0000",
					"^vue",
					"^@?\\w",
					"^[^.]",
					"^\\.",
				]],
			}],
		},
	},
];
