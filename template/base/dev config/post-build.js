import path from "path";
import fs from "fs";

export default function postBuildPlugin() {
	let outDir;

	return {
		name: "post-build",

		// Runs once Vite has fully resolved its config
		configResolved(config) {
			outDir = path.resolve(config.root, config.build.outDir);
		},

		// Runs after the bundle has been written to disk
		closeBundle() {
			console.log("Build output dir:", outDir);

			// Edit WP style.css file after build
			const target = path.join(outDir, "style.css");
			let wpStyleCss = fs.readFileSync(target, "utf-8");
			wpStyleCss = wpStyleCss.replace("##-DEV-##", "");
			fs.writeFileSync(target, wpStyleCss);

			// Removes the dist folder from git tree (Event if it's outside)
			const gitIgnore = path.join(outDir, ".gitignore");
			fs.writeFileSync(gitIgnore, "*");
		},
	};
}
