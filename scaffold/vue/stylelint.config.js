/** @type {import('stylelint').Config} */
export default {
	extends: ["stylelint-config-recommended", "stylelint-config-recommended-vue", "@stylistic/stylelint-config"],
	rules: {
		"@stylistic/number-leading-zero": null,
		"@stylistic/number-no-trailing-zeros": null,
	},
};
