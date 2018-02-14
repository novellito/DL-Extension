// Update the relevant fields with the new data
function setDOMInfo(info) {
  // document.getElementById('total').textContent   = info.total;
  // document.getElementById('inputs').textContent  = info.inputs;
  // document.getElementById('buttons').textContent = info.buttons;
}


// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {

  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
      tabs[0].id, {
        from: 'popup',
        subject: 'DOMInfo'
      },
      // ...also specifying a callback to be called 
      //    from the receiving end (content script)
      setDOMInfo);
  });

  chrome.storage.local.get('value', function (obj) {
    console.log(obj.value);
    obj.value.map((professor, index) => //Load initial info
      $("#professors-list").append(`<li class=${index}>${professor} <button class="delete">Delete</button></li> `)
    );

    $(".delete").on("click", function () {

      let listElem = $(this).parent()[0];
      let index = listElem.className;
      obj.value.splice(index, 1);
      $(this).parent()[0].remove();

      chrome.storage.local.set({ // update list after deletion
        'value': obj.value
      }, function () {
        // location.reload();
      });


    });

  });

  $(".add").on("click", function () {
    
    let firstName = $("[name=fname]").val();
    let lastName = $("[name=lname]").val();
    let program = $("[name=program]").val().toUpperCase();
    let cohort = $("[name=cohort]").val();
    let courseNum = $("[name=courseNum]").val();

    let data = firstName + " " + lastName + " " + program + " " + cohort + " " + courseNum;

    chrome.storage.local.get('value', function (obj) {

      obj.value.push(data);

      chrome.storage.local.set({
        'value': obj.value
      }, function () {

        $("#professors-list").append(`<li>${firstName} ${lastName}`);

        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function (tabs) {
          // ...and send a request for the DOM info...
          chrome.tabs.sendMessage(
            tabs[0].id,{"message": "reload"}
            // ...also specifying a callback to be called 
            //    from the receiving end (content script)
            );
        });
        
        // chrome.tabs.sendMessage(tabs[0].id, {"message": "reload"});
        location.reload();

      });

    });

  });


});