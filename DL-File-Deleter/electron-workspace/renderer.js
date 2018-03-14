const { remote, ipcRenderer } = require('electron');
const { handleForm } = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

require('chromedriver');

let chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {'args':['--disable-infobars']}); // disable popup

const submitFormButton = document.querySelector("#ipcForm2");
const responseParagraph = document.getElementById('response')

submitFormButton.addEventListener("submit", function(event) {
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
            responseParagraph.innerHTML = "<b>Please fill in either # files or # folders</b>"
        }

});

ipcRenderer.on('send-err', function(event, args){
    responseParagraph.innerHTML = args
});

ipcRenderer.on('send-files', function(event, args){
    console.log(args);
    // let driver = new webdriver.Builder()
    //     .forBrowser('chrome').withCapabilities(chromeCapabilities)
    //     .build();

    // driver.get(args.courseURL); 
    runDriver(args);
});

ipcRenderer.on('send-folders', function(event, args){
    runDriver(args);
});

function runDriver(args) {
    console.log(args.courseURL);
    let driver = new webdriver.Builder()
        .forBrowser('chrome').withCapabilities(chromeCapabilities)
        .build();

    driver.get(args.courseURL); 
    
    
    //Log into the website
    driver.findElement(By.linkText('Log in')).click();
    driver.sleep(2000);     
    driver.findElement(By.name('username')).sendKeys(args.username);
    driver.findElement(By.name('password')).sendKeys(args.password);
    driver.findElement(By.name('submit')).click();
    
    driver.get(args.courseURL); //redirect back to the website (moodle)
    
    driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.linkText('Legacy course files'))); // scroll to link
    driver.findElement(By.linkText('Legacy course files')).click();
    
    driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css('input[value="Edit legacy course files"]'))); // scroll to bottom of page
    driver.findElement(By.css('input[value="Edit legacy course files"]')).click();
    
    driver.sleep(8000); //wait for widget to load

    // if(args.files) {
    //     for(let i = 0; i < args.files; i++){
    //         driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child')).click(); 
    //         driver.findElement(By.css('.fp-file-delete')).click();
    //         driver.findElement(By.css('.fp-dlg-butconfirm.btn-primary.btn')).click(); //confirm delete button
    //         driver.sleep(5000); //wait for widget to load
    //     }
    //     driver.quit();
    // } else {
    //     for(let i = 0; i < args.folders; i++){ 
    //         driver.findElement(By.css('div.fp-file.fp-hascontextmenu:first-child a.fp-contextmenu')).click(); //for folders
    //         driver.findElement(By.css('.fp-file-delete')).click();
    //         driver.findElement(By.css('.fp-dlg-butconfirm.btn-primary.btn')).click(); //confirm delete button
    //         driver.sleep(5000); //wait for widget to load
    //      }
    //     driver.quit();
    // }

}





