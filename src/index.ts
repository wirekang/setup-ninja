import * as fs from "node:fs";
import {exec} from "node:child_process"
import fetch from "node-fetch"
import * as process from "node:process"
import * as core from "@actions/core"

const DOWNLOAD = "https://github.com/ninja-build/ninja/releases/download/";
const ZIP_NAME = "temp-setup-ninja.zip"
const BIN_DIR = "ninja-setup-bin"

async function go(platform: string, tag: string) {
    const url = DOWNLOAD + tag + "/ninja-" + platform + ".zip"
    console.log("Url: " + url)
    const res = await fetch(url, {method: "GET"})
    const body = await res.arrayBuffer()
    console.log("Size: " + body.byteLength)
    console.log("Write " + ZIP_NAME)
    await new Promise((resolve, reject) => {
        fs.writeFile(ZIP_NAME, Buffer.from(body), {encoding: "binary"}, (err) => {
            if (err) {
                reject(err)
            }
            resolve(1)
        })
    })
    console.log("Unzip " + BIN_DIR)
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

(
    async () => {
        const platform = core.getInput("platform")
        const tag = core.getInput("tag")
        await go(platform, tag)
    }
)()
