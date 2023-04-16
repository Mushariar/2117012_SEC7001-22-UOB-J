const https = require("https");
const path = require("path");
const fs = require("fs");
const util = require("util");
const urlExists = require("url-exists");
const promisifiedUrlExists = util.promisify(urlExists);

//const promisifiedProcess = util.promisify(processdataFile);

//wget https://data.gharchive.org/2015-01-01-15.json.gz

async function SdownloadFile(toBeLoaded) {
  var fileExists = await promisifiedUrlExists(toBeLoaded);

  if (!fileExists) {
    console.log("Does not exists : " + toBeLoaded);
  } else {
    console.log("Downloading : " + toBeLoaded);

    //const dataFile = "rawdata/" + path.basename(toBeLoaded);
    const dataFile = "rawdata_download/" + path.basename(toBeLoaded);

    https.get(toBeLoaded, (res) => {
      const fileStream = fs.createWriteStream(dataFile);
      res.pipe(fileStream);

      fileStream.on("finish", async () => {
        fileStream.close();
        console.log("Download finished: " + toBeLoaded);
      });
    });
  }
}

(async () => {
  let gzFilename = path.basename(process.argv[2]);
  const toBeLoaded = "https://data.gharchive.org/" + gzFilename;
  await SdownloadFile(toBeLoaded);
})();
