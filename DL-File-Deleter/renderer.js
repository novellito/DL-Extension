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

        if(!document.getElementById("courseURL").value) {
            responseParagraph.innerHTML = "<b>Please enter a URL</b>";
        } else if (!document.getElementById("username").value) {
            responseParagraph.innerHTML = "<b>Please enter a username</b>";
        } else if(!document.getElementById("password").value) {
            responseParagraph.innerHTML = "<b>Please enter a password</b>";
        } else if (document.getElementById("folders").value && document.getElementById("files").value) {
            responseParagraph.innerHTML = "<b>Please enter one or the other (not both)</b>";
        } else if (document.getElementById("folders").value && document.getElementById("folders").value <= 0 || 
            document.getElementById("files").value && document.getElementById("files").value <= 0) {
            responseParagraph.innerHTML = "<b>Please enter a value over 0";
        }
        else if (document.getElementById("files").value) { // do files
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

ipcRenderer.on('send-err', (event,args) => responseParagraph.innerHTML = args);
ipcRenderer.on('send-files', (event,args) => runDriver(args));
ipcRenderer.on('send-folders', (event,args) => runDriver(args));

async function runDriver(args) {

    let driver = new webdriver.Builder()
        .forBrowser('chrome').withCapabilities(chromeCapabilities)
        .build();

    try {

        await driver.get('https://auth.csun.edu/cas/login?service=https%3A%2F%2Fmoodle.csun.edu%2Flogin%2Findex.php'); // log into CSUN
        await driver.findElement(By.xpath('//*[@id="username"]')).sendKeys(`${args.username}`);
        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys(`${args.password}`);
        await driver.findElement(By.xpath('//*[@id="fm1"]/fieldset/ol/li[3]/input[4]')).click();
        await driver.get(args.courseURL); // redirect to moodle page
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
            responseParagraph.innerHTML = "<b>Files have been deleted! Please make sure to save!</b>";
            await driver.sleep(120000); // wait 2 minutes before closing browser
            await driver.quit();

        } else {
            
            for(let i = 0; i < args.folders; i++) { 
                await driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child a.fp-contextmenu')).click();
                await driver.findElement(By.css('.fp-file-delete')).click();
                await driver.findElement(By.css('.fp-dlg-butconfirm.btn-primary.btn')).click();
                await driver.sleep(5000); //wait for widget to load
            }
            responseParagraph.innerHTML = "<b>Folders have been deleted! Please make sure to save!</b>";
            await driver.sleep(120000); // wait 2 minutes before closing browser
            await driver.quit();
        }
    } catch(err) {
        responseParagraph.innerHTML = "<b>Broswer window has been closed!</b>";
        await driver.quit();
    }
    
}