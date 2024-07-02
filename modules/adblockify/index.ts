import type { Module } from "/hooks/index.js";

export async function load(mod: Module) {
	return await (await import("./mod.js")).default(mod);
}
