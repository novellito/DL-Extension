// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {

  chrome.storage.local.get('value', function (obj) {
    if (typeof (obj.value) == 'string') {
      $("#professors-list").append(`<li class=0>${obj.value} <button class="delete">Delete</button></li> `)
    } else {
      try {
        obj.value.map((professor, index) => //Load initial info
          $("#professors-list").append(`<li class=${index}>${professor} <button class="delete">Delete</button></li> `)
        );

      } catch (err) {
        console.log("No current professors");
      }
    }

    $(".delete").on("click", function () {

      let listElem = $(this).parent()[0];
      let index = listElem.className;

      if (typeof (obj.value) == 'string') {

        $(this).parent()[0].remove();

        chrome.storage.local.set({ // update list after deletion
          'value': []
        }, function () {
          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id, {
                "message": "reload"
              }
            );
          });
          location.reload();
        });


      } else {
        obj.value.splice(index, 1);
        $(this).parent()[0].remove();

        chrome.storage.local.set({ // update list after deletion
          'value': obj.value
        }, function () {
          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id, {
                "message": "reload"
              }
            );
          });
          location.reload();
        });

      }
    });
  });

  $(".yname").on("click", function () {
    let name = $("[name=yname]").val();
    chrome.storage.local.set({
      'name': name
    }, function () {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id, {
            "message": "reload"
          }
        );
      });
      location.reload();

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
      console.log(obj);

      if (obj.value == undefined) {
        chrome.storage.local.set({
          'value': [data]
        }, function () {

          $("#professors-list").append(`<li>${firstName} ${lastName}`);

          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id, {
                "message": "reload"
              }
            );
          });

          location.reload();

        });
      } else {


        obj.value.push(data);

        chrome.storage.local.set({
          'value': obj.value
        }, function () {

          $("#professors-list").append(`<li>${firstName} ${lastName}`);

          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id, {
                "message": "reload"
              }
            );
          });

          location.reload();

        });
      }

    });

  });

  let acc = document.getElementsByClassName("accordion");

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

});