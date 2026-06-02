import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";
import { viteStaticCopy } from "vite-plugin-static-copy";
import postBuildPlugin from "./dev config/post-build";

export default defineConfig({
	build: {
		manifest: true,
		outDir: "../Dist Vite Theme",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: "src/main.js",
				frontpage: "src/front-page.js",
				single: "src/single.js",
			},
			output: {
				entryFileNames: "assets/[name].js",
				assetFileNames: "assets/[name].[ext]",
			},
		},
	},
	plugins: [
		fullReload(["**/*.php"]),
		viteStaticCopy({
			targets: [
				{
					src: ["**/*.php", "style.css", "!dev config", "!dist"],
					dest: "./",
				},
			],
		}),
		postBuildPlugin(),
	],
	server: {
		cors: {
			origin: "*",
			credentials: true,
		},
		hmr: {
			host: "localhost",
			port: 5173,
		},
	},
});
