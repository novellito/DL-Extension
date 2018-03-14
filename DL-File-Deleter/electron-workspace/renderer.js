const { remote, ipcRenderer } = require('electron');
const { handleForm} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const webdriver = require('selenium-webdriver');
require('chromedriver');

let chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {'args':['--disable-infobars']}); // disable popup

const submitFormButton = document.querySelector("#ipcForm2");
const responseParagraph = document.getElementById('response')

submitFormButton.addEventListener("submit", function(event){
        event.preventDefault();   // stop the form from submitting
        let firstname = document.getElementById("username").value;
        handleForm(currentWindow, firstname)

        let driver = new webdriver.Builder()
    .forBrowser('chrome').withCapabilities(chromeCapabilities)
    .build();

driver.get('https://www.google.com'); //put url here
// driver.quit();

});

ipcRenderer.on('form-received', function(event, args){
    responseParagraph.innerHTML = args
    console.log("event " +event);
   
});




