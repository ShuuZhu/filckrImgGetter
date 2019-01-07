const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http');
const config = require('./config.js');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(config.url);
    let imageUrl = await page.evaluate(() => {
        let result = [];
        let hrefArray = document.getElementsByTagName('a')
        for(let k = 0; k < hrefArray.length; k++){
            if(hrefArray[k].href.indexOf(config.charater) > -1){
                result.push(hrefArray[k].href)
            }
            if(k === hrefArray.length-1){
                return result
            }
        }
      });
    for(j in imageUrl){
        let fileName = imageUrl[j].split('/');
        fileName = fileName[fileName.length-1];
        await getFile(`downloaded/${fileName}`,imageUrl[j]);
    }

  await browser.close();
})();

var getFile = function(fileName,fileUrl){
    var file = fs.createWriteStream(fileName);
    var request = http.get(fileUrl, function(response) {
        response.pipe(file);
        return true;
    });
}