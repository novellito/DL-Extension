// Update the relevant fields with the new data
function setDOMInfo(info) {
    document.getElementById('total').textContent   = info.total;
    document.getElementById('inputs').textContent  = info.inputs;
    document.getElementById('buttons').textContent = info.buttons;
  }

//   $(".writer").val("Christian Trinidad");
//   $(".assign_to").val("Christian Trinidad");
  
  // Once the DOM is ready...
  window.addEventListener('DOMContentLoaded', function () {
  console.log("testomg");
      
    // ...query for the active tab...
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'DOMInfo'},
          // ...also specifying a callback to be called 
          //    from the receiving end (content script)
          setDOMInfo);
    });
    $(".test").on("click", function() {
        console.log("yoo");
        
        chrome.storage.local.set({'value': "test"}, function() {
            // Notify that we saved.
            alert("test")
            message('Settings saved');
        });
    })
        console.log("yoo");
     
});

