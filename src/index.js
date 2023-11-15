import * as core from "@actions/core"
import {start} from "./start.js";

(
    async () => {
        const platform = core.getInput("platform")
        const tag = core.getInput("tag")
        await start(platform, tag)
    }
)()
