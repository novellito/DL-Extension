// Inform the background page that 
// this tab should have a page-action
chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
  });
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
      // Collect the necessary data 
      // (For your specific requirements `document.querySelectorAll(...)`
      //  should be equivalent to jquery's `$(...)`)
      var domInfo = {
        total:   document.querySelectorAll('*').length,
        inputs:  document.querySelectorAll('input').length,
        buttons: document.querySelectorAll('button').length
      };
  
      // Directly respond to the sender (popup), 
      // through the specified callback */
      response(domInfo);
    }
  });
  
  $(".writer").val("Christian Trinidad");
  $(".assign_to").val("Christian Trinidad");


  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
  
      // an array that will be populated with substring matches
      matches = [];
  
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
  
      cb(matches);
    };
  };
  

  var professors = ['Philip Nufrio'
  ];
  
  $('#first_name').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'professors',
    source: substringMatcher(professors)
  });
  
//   $('#first_name').bind('typeahead:select', function(ev, suggestion) {

//     // $("#last_name").val("Nufrio"); // set last name
      
//   });

//   $('#first_name').bind('typeahead:autocomplete', function(ev, suggestion) {

//     // $("#last_name").val("Nufrio"); // set last name
    
//   });

  $('#first_name').bind('typeahead:change', function(ev, suggestion) {

    $("#last_name").val("Nufrio"); // set last name
    
    let first_name = $('#first_name').val().split(" ")[0]; //get first name
    $("#first_name").val(first_name);
    
    let last_name = $('#first_name').val().split(" ")[1]; //get last name
    $("#first_name").val(first_name);

  });
  
  $("#course_number").focus(function() {

      chrome.storage.local.get('value', function(obj) {
          //Notify that we get the value.
        //   message('Value is ' + obj.value);
          console.log(obj);
          professors.push(obj.value);
          console.log(professors);
        });
    })
console.log("hello");