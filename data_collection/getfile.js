const https = require("https");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const readline = require("readline");
const moment = require("moment");
const util = require("util");
const urlExists = require("url-exists");
const promisifiedUrlExists = util.promisify(urlExists);

//const promisifiedProcess = util.promisify(processdataFile);

//wget https://data.gharchive.org/2015-01-01-15.json.gz

async function getDataFile() {
  //const downloadFunction = util.promisify(downloadFile);

  var fileParams = await readfileDates();

  var stDate = moment(fileParams.lastProcessed);
  var enDate = moment(fileParams.endDate);
  var fileSlNo = fileParams.seralNumber;

  // If you want an exclusive end date (half-open interval)
  for (var m = moment(stDate); m.isBefore(enDate); m.add(1, "days")) {
    let isContinue = 1;
    fileSlNo = fileSlNo;
    console.log("Date: " + m.format("YYYY-MM-DD"));
    fileDate = m.format("YYYY-MM-DD");

    while (isContinue > 0) {
      fileSlNo = fileSlNo + 1;
      //console.log("https://data.gharchive.org/" + fileDate + "-" + fileSlNo + ".json.gz");

      let toBeLoaded =
        "https://data.gharchive.org/" + fileDate + "-" + fileSlNo + ".json.gz";

      var fileExists = await promisifiedUrlExists(toBeLoaded);

      if (!fileExists) {
        console.log("Does not exists");
        console.log(fileSlNo);
        isContinue = 0;
        fileSlNo = -1;
        writefileDates(fileDate, fileParams.endDate, fileSlNo);
      } else {
        console.log("Downloading : " + toBeLoaded);
        //await downloadFunction(toBeLoaded);
        writefileDates(fileDate, fileParams.endDate, fileSlNo);

        const dataFile = "rawdata/" + path.basename(toBeLoaded);

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
  }
}

// usage
//(async () => await get_page())()

function XdownloadFile(url) {
  const dataFile = "rawdata/" + path.basename(url);

  https.get(url, (res) => {
    const fileStream = fs.createWriteStream(dataFile);
    res.pipe(fileStream);

    fileStream.on("finish", () => {
      fileStream.close();
      console.log("Download finished: ");
      return true;
    });
  });
}

function readfileDates() {
  var file_content = fs.readFileSync("fileDates.json");
  var content = JSON.parse(file_content);
  return content;
}
function writefileDates(lastProcessed, endDate, seralNumber) {
  var file_content = fs.readFileSync("fileDates.json");
  var content = JSON.parse(file_content);

  content.lastProcessed = lastProcessed;
  content.endDate = endDate;
  content.seralNumber = seralNumber;
  fs.writeFileSync("fileDates.json", JSON.stringify(content));
}

getDataFile();

//XdownloadFile("https://data.gharchive.org/2022-01-26-1.json.gz");

/*
task
bug
documentation
duplicate
enhancement
good first issue
help wanted
invalid
question
wontfix
gitalk
priority medium
priority high
feature request
feature
*/
