import * as fs from "node:fs";
import {exec} from "node:child_process"
import * as process from "node:process"
import fetch from "node-fetch"

const DOWNLOAD = "https://github.com/ninja-build/ninja/releases/download/";
const ZIP_NAME = "setup-ninja.zip"
const BIN_DIR = "setup-ninja-bin"

export async function start(platform, tag) {
    const url = DOWNLOAD + tag + "/ninja-" + platform + ".zip"
    console.log("Platform: " + platform)
    console.log("Tag: " + tag)
    console.log("Url: " + url)

    console.log("Download to " + ZIP_NAME)
    await download(url, ZIP_NAME)
    console.log("Unzip to " + BIN_DIR)
    await new Promise((resolve, reject) => {
        exec("unzip -o -d " + BIN_DIR + " " + ZIP_NAME, (err, stdout, stderr) => {
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

async function download(url, path) {
    const file = fs.createWriteStream(path)
    const res = await fetch(url)
    res.body.pipe(file)
    return new Promise((resolve, reject) => {
        file.on("finish", () => {
            file.close((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(undefined)
                }
            })
        })
        file.on("error", reject)
    })
}
