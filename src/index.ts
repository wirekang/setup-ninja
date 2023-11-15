import * as fs from "node:fs";
import {exec} from "node:child_process"
import * as process from "node:process"
import * as http from "node:http"

import * as core from "@actions/core"

const DOWNLOAD = "https://github.com/ninja-build/ninja/releases/download/";
const ZIP_NAME = "setup-ninja.zip"
const BIN_DIR = "setup-ninja-bin"

async function go(platform: string, tag: string) {
    const url = DOWNLOAD + tag + "/ninja-" + platform + ".zip"
    console.log("Platform: " + platform)
    console.log("Tag: " + tag)
    console.log("Url: " + url)

    console.log("Download to " + ZIP_NAME)
    await download(url, ZIP_NAME)
    console.log("Unzip to " + BIN_DIR)
    await new Promise((resolve, reject) => {
        exec("unzip -o -d" + BIN_DIR + " " + ZIP_NAME, (err, stdout, stderr) => {
            if (err) {
                return reject(err)
            }
            resolve(1)
        })
    })
    const realpath = fs.realpathSync(BIN_DIR)
    const githubPath = process.env["GITHUB_PATH"]
    console.log("Add path " + realpath)
    fs.appendFileSync(githubPath, realpath + "\n", {encoding: "utf-8"})
}

async function download(url: string, path: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path)
        const request = http.get(url, (res) => {
            res.pipe(file)
            file.on("finish", () => {
                file.close()
                resolve(undefined)
            })
            file.on("error", reject)
        })
        request.on("error", reject)
    })
}

(
    async () => {
        const platform = core.getInput("platform")
        const tag = core.getInput("tag")
        await go(platform, tag)
    }
)()
