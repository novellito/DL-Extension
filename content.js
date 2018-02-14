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
  
  chrome.storage.local.get('value', function(obj) {


  $('#first_name').bind('typeahead:select', function(ev, suggestion) {

     
      replaceField();
      
  });

  $('#first_name').bind('typeahead:autocomplete', function(ev, suggestion) {
    replaceField();
  });
  
      
  $('#first_name').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'professorsList',
    source: substringMatcher(obj.value)
  });

  $('#first_name').bind('typeahead:change', function(ev, suggestion) {
    
    replaceField();
    let first_name = $('#first_name').val().split(" ")[0]; //get first name
    $("#first_name").val(first_name);
    
  });
  
  function replaceField() {
    let last_name = $('#first_name').val().split(" ")[1]; //get last name
    $("#last_name").val(last_name);

    let regex = /[^0-9](?=[0-9])/g; //for putting space in between course number
    let courseNum = $('#first_name').val().split(" ")[4];

    $(".client_type").val("Faculty");
    $("#academic_program").val($('#first_name').val().split(" ")[2]);
    $("#cohort_number").val($('#first_name').val().split(" ")[3]);
    $("#course_number").val($('#first_name').val().split(" ")[4]);

    $("#course_number").val(courseNum.replace(regex, '$& '));
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "reload" ) {
      console.log("hey");
      location.reload();
         }
  }
);
