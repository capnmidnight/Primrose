import { Build } from "@juniper-lib/esbuild";

const args = process.argv.slice(2);

await new Build(args, false)
    .outDir("./bundle")
    .bundle("./src")
    .run();