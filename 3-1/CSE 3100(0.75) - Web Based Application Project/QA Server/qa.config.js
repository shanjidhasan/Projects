module.exports = {
	apps: [
		{
			name: "qa-server",
			script: "index.js",
			watch: true,
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
