const puppeteer = require('puppeteer')

const getUrl = ()=>{
    input = "data science".replace(" ","%20")
    temp = `https://www.udemy.com/courses/search/?q=${input}`
    return temp
}

(async () => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 

    //blocking site's css, images and fonts
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.goto(getUrl(), {waitUntil: 'networkidle2', timeout:300000}).then(()=>{
        console.log("redirected successfully!")
    }).catch(err=>{
        console.log("Error occured! Error:",err)
    });
    // await page.reload({waitUntil:['networkidle2', 'domcontentloaded']})
    // await page.screenshot({path: 'example.png'});
    let courses = await page.evaluate(()=>{
        location.reload(true)
        // let res = document.querySelector('.course-list--container--3zXPS')
        // let wrapperDivs = res.querySelectorAll("div [class='popover--popover--t3rNO popover--popover-hover--14ngr'] a")
        // let data = []
        // wrapperDivs.forEach(item=>{
        //     let temp = {
        //        // info: item.textContent,
        //         link: item.getAttribute("href")
        //     }
        //     data.push( temp )
        // })

        let title = Array.from(document.querySelectorAll('div[class="udlite-heading-sm udlite-focus-visible-target course-card--course-title--2f7tE"]')).map((title) => title.innerText);
        let photoUrl = Array.from(document.querySelectorAll('div[class="course-card--image-wrapper--Sxd90"]>img')).map((title) => title.src);
        let description = Array.from(document.querySelectorAll('p[class="course-card--course-headline--yIrRk"]')).map((title) => title.innerText);
       
        return {title, photoUrl, description}
    })
    console.log("Courses:",courses)
  
    await browser.close();
  })();
  