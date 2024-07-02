import path from "node:path";

import { ensureDir } from "jsr:@std/fs/ensure-dir";

import { Builder, readJSON, Transpiler } from "jsr:@delu/tailor@1.0.12";
import { classmapVersions } from "./classmap-releases.ts";

export type ClassmapInfo = {
	classmap: any;
	version: string;
	timestamp: number;
};

async function build(classmapInfos: ClassmapInfo[], inputDirs: string[]) {
	for (const inputDir of inputDirs) {
		const metadata = await readJSON<any>(path.join(inputDir, "metadata.json"));
		console.log(classmapInfos);

		for (const { classmap, version: spVersion, timestamp } of classmapInfos) {
			const m = Object.assign({}, metadata);
			m.version += `+sp-${spVersion}-cm-${timestamp.toString(16)}`;

			const identifier = `/${m.authors[0]}/${m.name}`;
			const fingerprint = `${m.authors[0]}.${m.name}@v${m.version}`;
			const outputDir = path.join("dist", fingerprint);
			await ensureDir(outputDir);

			const transpiler = new Transpiler(classmap, false);
			const builder = new Builder(transpiler, { metadata, identifier, inputDir, outputDir });

			try {
				await builder.build({ js: true, css: true, unknown: true });
				await Deno.writeTextFile(path.join(outputDir, "metadata.json"), JSON.stringify(m));
			} catch (err) {
				await Deno.remove(outputDir, { recursive: true });
				console.warn(`Build for ${fingerprint} failed with error: ${err}`);
			}
		}
	}
}

await build(classmapVersions, Deno.args);
