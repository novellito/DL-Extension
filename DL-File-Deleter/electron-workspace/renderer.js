const { remote, ipcRenderer } = require('electron');
const { handleForm } = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
require('chromedriver');

let chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {'args':['--disable-infobars']}); // disable popup

const submitFormButton = document.querySelector("#ipcForm2");
const responseParagraph = document.getElementById('response');

submitFormButton.addEventListener("submit",  function(event) {
        event.preventDefault();   // stop the form from submitting
        
        if (document.getElementById("folders").value && document.getElementById("files").value) {
            handleForm(currentWindow, {status:"err", msg:"<b>Please enter one or the other (not both)</b>"}); // let user know to enter only one
        } else if (document.getElementById("files").value) { // do files
            let data = {
                courseURL : document.getElementById("courseURL").value,
                username : document.getElementById("username").value,
                password : document.getElementById("password").value,
                files : document.getElementById("files").value
            }
            handleForm(currentWindow, data);
        } else if (document.getElementById("folders").value) { // do folders
            let data = {
                courseURL : document.getElementById("courseURL").value,
                username : document.getElementById("username").value,
                password : document.getElementById("password").value,
                folders : document.getElementById("folders").value
            }
            handleForm(currentWindow, data);            
        } else { //user didnt enter anything 
            responseParagraph.innerHTML = "<b>Please fill in either # files or # folders</b>";
        }

});

ipcRenderer.on('send-err', args => responseParagraph.innerHTML = args);
ipcRenderer.on('send-files', args => runDriver(args));
ipcRenderer.on('send-folders', args => runDriver(args));

async function runDriver(args) {
    let driver = new webdriver.Builder()
        .forBrowser('chrome').withCapabilities(chromeCapabilities)
        .build();

    await driver.get('https://auth.csun.edu/cas/login?service=https%3A%2F%2Fmoodle.csun.edu%2Flogin%2Findex.php');   
    await driver.findElement(By.xpath('//*[@id="username"]')).sendKeys(args.username);
    await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys(args.password);
    await driver.findElement(By.xpath('//*[@id="fm1"]/fieldset/ol/li[3]/input[4]')).click();
    await driver.get(args.courseURL);
    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.linkText('Legacy course files'))); // scroll to link
    await driver.findElement(By.linkText('Legacy course files')).click();
    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css('input[value="Edit legacy course files"]'))); // scroll to bottom of page
    await driver.findElement(By.css('input[value="Edit legacy course files"]')).click();
    await driver.sleep(8000);

    if(args.files) {
    
         for(let i = 0; i < args.files; i++) {
            await driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child')).click(); 
            await driver.findElement(By.css('.fp-file-delete')).click();
            await driver.findElement(By.css('.fp-dlg-butconfirm.btn-primary.btn')).click(); //confirm delete button
            await driver.sleep(5000); //wait for widget to load
        }
        await driver.sleep(120000); // wait 2 minutes before closing browser
        await driver.quit();
    } else {
        for(let i = 0; i < args.folders; i++) { 
            await driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child a.fp-contextmenu')).click()
            await driver.findElement(By.css('.fp-file-delete')).click();
            await driver.findElement(By.css('.fp-dlg-butconfirm.btn-primary.btn')).click();
            await driver.sleep(5000); //wait for widget to load
        }
        await driver.sleep(120000); // wait 2 minutes before closing browser
        await driver.quit();
    }

}