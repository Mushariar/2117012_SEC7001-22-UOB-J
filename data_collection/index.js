const https = require("https");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const readline = require("readline");
const moment = require("moment");
const util = require("util");
const urlExists = require("url-exists");
const { json } = require("body-parser");
//const promisifiedUrlExists = util.promisify(urlExists);

//const promisifiedProcess = util.promisify(processdataFile);
//const deleteFile = util.promisify(fs.unlinkSync);

//wget https://data.gharchive.org/2015-01-01-15.json.gz

function processdataFile(jFilename) {
  try {
    const gunzip = zlib.createGunzip();
    const fileStream = fs.createReadStream(jFilename);
    const lineReader = readline.createInterface({
      input: gunzip,
    });

    lineReader.on("line", async (line) => {
      const event = JSON.parse(line);
      task = 0;
      bug = 0;
      documentation = 0;
      duplicate = 0;
      enhancement = 0;
      good_first_issue = 0;
      help_wanted = 0;
      invalid = 0;
      question = 0;
      wontfix = 0;
      gitalk = 0;
      priority_medium = 0;
      priority_high = 0;
      feature_request = 0;
      feature = 0;

      isWritable = 0;

      allTags = "";

      if (event.type === "IssuesEvent") {
        const issueData = event.payload.issue;
        // Process the issue data as needed
        if (issueData.labels.length > 1) {
          issueData.labels.forEach(async function (element) {
            if (element.name.indexOf("task") > -1) {
              task = 1;
              isWritable = 1;
              allTags = "task";
            }
            if (element.name.indexOf("bug") > -1) {
              bug = 1;
              isWritable = 1;
              allTags = allTags + ", bug";
            }
            if (element.name.indexOf("documentation") > -1) {
              documentation = 1;
              isWritable = 1;
              allTags = allTags + ", documentation";
            }
            if (element.name.indexOf("duplicate") > -1) {
              duplicate = 1;
              isWritable = 1;
              allTags = allTags + ", duplicate";
            }
            if (element.name.indexOf("enhancement") > -1) {
              enhancement = 1;
              isWritable = 1;
              allTags = allTags + ", enhancement";
            }
            if (element.name.indexOf("good first issue") > -1) {
              good_first_issue = 1;
              isWritable = 1;
              allTags = allTags + ", good first issue";
            }
            if (element.name.indexOf("help wanted") > -1) {
              help_wanted = 1;
              isWritable = 1;
              allTags = allTags + ", help wanted";
            }
            if (element.name.indexOf("invalid") > -1) {
              invalid = 1;
              isWritable = 1;
              allTags = allTags + ", invalid";
            }
            if (element.name.indexOf("question") > -1) {
              question = 1;
              isWritable = 1;
              allTags = allTags + ", question";
            }
            if (element.name.indexOf("wontfix") > -1) {
              wontfix = 1;
              isWritable = 1;
              allTags = allTags + ", wontfix";
            }
            if (element.name.indexOf("gitalk") > -1) {
              gitalk = 1;
              isWritable = 1;
              allTags = allTags + ", gitalk";
            }
            if (element.name.indexOf("priority medium") > -1) {
              priority_medium = 1;
              isWritable = 1;
              allTags = allTags + ", priority medium";
            }
            if (element.name.indexOf("priority high") > -1) {
              priority_high = 1;
              isWritable = 1;
              allTags = allTags + ", priority high";
            }
            if (element.name.indexOf("feature request") > -1) {
              feature_request = 1;
              isWritable = 1;
              allTags = allTags + ", feature request";
            }
            if (
              element.name.indexOf("feature") > -1 &&
              element.name.indexOf("feature request") == -1
            ) {
              feature = 1;
              isWritable = 1;
              allTags = allTags + ", feature";
            }
          });

          if (isWritable == 1 && issueData.title && issueData.body) {
            //console.log(issueData.body.replace(/(\r\n|\n|\r)/gm, ""));
            //.replace(/[^a-zA-Z0-9]/g, "")
            //console.log(issueData.id);
            //console.log(issueData.title);
            //console.log(allTags);
            //.replace(/(\r\n|\n|\r)/gm, "");

            output =
              '"' +
              issueData.title
                .replace(/(\r\n|\n|\r)/gm, "")
                .replace(/[^a-zA-Z0-9" .:;/]/g, "")
                .replace(/['"]+/g, "") +
              '","' +
              issueData.body
                .replace(/(\r\n|\n|\r)/gm, "")
                .replace(/[^a-zA-Z0-9" .:;/]/g, "")
                .replace(/['"]+/g, "") +
              '",' +
              task +
              "," +
              bug +
              "," +
              documentation +
              "," +
              duplicate +
              "," +
              enhancement +
              "," +
              good_first_issue +
              "," +
              help_wanted +
              "," +
              invalid +
              "," +
              question +
              "," +
              wontfix +
              "," +
              gitalk +
              "," +
              priority_medium +
              "," +
              priority_high +
              "," +
              feature_request +
              "," +
              feature +
              "\n";

            fs.appendFileSync(
              jFilename.replace("rawdata", "csvdata").replace("json.gz", "csv"),
              output
            );

            fs.appendFileSync("datafile/githubissuedata.csv", output);

            //console.log("--------------");
          }
        }
      }
    });

    fileStream.pipe(gunzip);
    return true;
  } catch (error) {
    console.log("Error: " + jFilename);
    console.log(error);
    return false;
  }
}

/*
async function getDataFileList() {
  fs.readdirSync("rawdata/").forEach(async (file) => {
    if (file.indexOf("json.gz") > -1) {
      try {
        console.log("Start Processing: " + file);
        var ret = await processdataFile("rawdata/" + file);
        console.log("Processing Completed: " + file);
      } catch (error) {
        console.log("An Error : " + file);
        console.error(error);
      }

      //await deleteFile("rawdata/" + file);
      //console.log("File Deleted: " + file);
    }
  });
}
*/

async function getDataFileList() {
  const file = process.argv[2];

  if (file.indexOf("json.gz") > -1) {
    try {
      //console.log("Start Processing: " + file);
      processdataFile(file);
      //console.log("Processing Completed: " + file);
    } catch (error) {
      console.log("An Error : " + file);
      console.error(error);
    }

    //await deleteFile("rawdata/" + file);
    //console.log("File Deleted: " + file);
  }
}

getDataFileList();

//processdataFile("rawdata/2022-01-26-1.json.gz");
