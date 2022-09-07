import { Build } from "@juniper-lib/esbuild";

await new Build(process.argv.slice(2), false)
    .outDir("./dist")
    .bundle(".")
    .run();