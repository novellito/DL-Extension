const webdriver = require('selenium-webdriver');
require('chromedriver');

let chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {'args':['--disable-infobars']}); // disable popup

let driver = new webdriver.Builder()
    .forBrowser('chrome').withCapabilities(chromeCapabilities)
    .build();

driver.get('https://www.google.com'); //put url here

// //Log into the website
// driver.findElement(By.linkText('Log in')).click();
// driver.findElement(By.name('username')).sendKeys('username123');
// driver.findElement(By.name('password')).sendKeys('notMyPassword');
// driver.findElement(By.name('submit')).click();

// driver.get('moodleSiteToDelete'); //redirect back to the website (moodle)
// driver.executeScript("scroll(0,1500)");
// driver.findElement(By.linkText('Legacy course files')).click();
// driver.executeScript("scroll(0,8000)"); //scroll to bottom of page
// driver.findElement(By.css('input[value="Edit legacy course files"]')).click();
// driver.sleep(8000); //wait for widget to load


// for(let i = 0; i < 23; i++){ //delete 21 folders

//    driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child a.fp-contextmenu')).click(); //for folders
//    deleteContent();
// }

// for(let i = 0; i < 24; i++){ //delete 10 files

//    driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child')).click(); //for files
//    deleteContent();
// }

// function deleteContent(){
//     driver.findElement(By.css('.fp-file-delete')).click();
//     driver.findElement(By.css('.fp-dlg-butconfirm.btn-primary.btn')).click(); //confirm delete button
//     driver.sleep(5000); //wait for widget to load
// }
// driver.quit();