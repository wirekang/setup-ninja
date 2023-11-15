import {start} from "./src/start.js";
import * as process from "node:process"

process.env["GITHUB_PATH"] = "temp_github_path"
start("win", "v1.11.1")
