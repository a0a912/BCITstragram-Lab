/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Feb 13th, 2024
 * Author: Ahmed Ali
 *
 */
/*
const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

  */
  const yauzl = require('yauzl-promise'),
  fs = require('fs'),
  PNG = require("pngjs").PNG,
  path = require("path"),
  {pipeline} = require('stream/promises');
 
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip =  async (pathIn, pathOut) => {

  const zip = await yauzl.open(pathIn);
try {
  for await (const entry of zip) {
    if (entry.filename.endsWith('/')) {
     // test_path_out = path.join(pathOut, entry.fileName)
      //console.log(`test_path_out is ${test_path_out}`)
      //console.log(`type of pathout is ${typeof(pathOut)} and type of entry.fileName is ${typeof(entry.fileName)} and entry.filename is ${entry.fileName.toString()}`)

      await fs.promises.mkdir(path.join(pathOut,entry.filename), {recursive: true});
      //await fs.promises.mkdir(path.join(pathOut, entry.fileName), {recursive: true});
    } else {
      const readStream = await entry.openReadStream();
      console.log(`just pathout is ${pathOut}`)
      console.log(`pathout + entry.filename is ${pathOut}${entry.filename}`)
      const writeStream = fs.createWriteStream(
        (path.join(pathOut,entry.filename))

      );
      await pipeline(readStream, writeStream);
    }
  }
} finally {
  await zip.close();
}
};
//USE Yauzl-promise HERE



/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  console.log("Testing");
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const pngFiles = files.filter((file) => file.endsWith(".png"));
        resolve(pngFiles);
      }
    });
  });
};





/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
   fs.createReadStream(pathIn)
    .pipe(
        new PNG({
          filterType: 4,
        })
    )
    .on("parsed", function () {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          const avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
          this.data[idx] = avg;
          this.data[idx + 1] = avg;
          this.data[idx + 2] = avg;
        }
      }

      this.pack().pipe(fs.createWriteStream(pathOut));
    });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
