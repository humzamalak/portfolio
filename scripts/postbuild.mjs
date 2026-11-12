// Runs after `next build` (npm "postbuild").
// A static export needs at least one /notes/<slug>/ path, so until a note is published the
// build makes a placeholder page. Remove it so it is never deployed.
import { rmSync } from "node:fs";

rmSync("out/notes/none-yet", { recursive: true, force: true });
