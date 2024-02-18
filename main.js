const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

async function main() {
    await IOhandler.unzip(zipFilePath, pathUnzipped)
    test_png = await IOhandler.readDir(pathUnzipped)
    console.log(test_png)
    for (const file of test_png) {
        await IOhandler.grayScale(path.join(pathUnzipped, file), path.join(pathProcessed, file));
    }
}

main()
/*


*/