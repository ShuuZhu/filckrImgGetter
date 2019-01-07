const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http');
const config = require('./f-config.js');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(config.url);
    let contentUrl = await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var loadImg = () => {
                window.scrollTo(0, document.body.offsetHeight)
                if (document.getElementsByClassName('overlay').length < 100) {
                    setTimeout(() => {
                        loadImg();
                    }, 2000)
                } else {
                    doNext()
                }
            }
            var doNext = () => {
                let result = [];
                let hrefArray = document.getElementsByClassName('overlay')
                for (let k = 0; k < hrefArray.length; k++) {
                    result.push(hrefArray[k].href)
                    if (k === hrefArray.length - 1) {
                        resolve(result)
                    }
                }
            }
            loadImg();
        })
    });
    for (j in contentUrl) {
        await page.goto(contentUrl[j])
        let urlResult = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                var i = 0;
                var x = window.setInterval(() => {
                    if (document.getElementsByClassName('download').length > 0) {
                            document.getElementsByClassName('download')[0].childNodes[1].click()
                        setTimeout(() => {
                            if (document.getElementsByClassName('原本大小').length > 0) {
                                window.open(document.getElementsByClassName('原本大小')[0].childNodes[1].href,"_blank")
                                resolve(true)
                            }else{
                                resolve(true)
                            }
                            window.clearInterval(x)
                        }, 600)
                    } else {
                        return true
                    }
                }, 1000)
            })
        })
        console.log(j)
        if(j == contentUrl.length - 1) {
            await browser.close();
        }
    }
})();
