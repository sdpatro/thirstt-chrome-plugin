var xhr = new XMLHttpRequest();
var xhr_login = new XMLHttpRequest();
var URL;


xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {	        
    console.log(xhr.responseText);
    try {
    	var titleData = JSON.parse(xhr.responseText)[0].title;
    	console.log(JSON.parse(xhr.responseText)[0].title);

    	var contentData = JSON.parse(xhr.responseText)[0].content;
    	console.log(JSON.parse(xhr.responseText)[0].content);
    	if(contentData == null)
    		contentData = "No content available for this webpage"

      chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{"reqLogin": false, "title": titleData, "content": contentData},
					function(response) {}
				);
			});
    }
    catch (e){
    	chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{"reqLogin": true },
					function(response) {}
				);
			});
    }
	}
}



xhr_login.onreadystatechange = function() {
  if (xhr_login.readyState == 4 && xhr_login.status == 200) {	        
    console.log(xhr_login.responseText);
    chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{"reqLogin": false, "title": titleData, "content": contentData},
					function(response) {}
				);
		});
		
		xhr.open('GET', 'https://staging.thirstt.com/mediaservice/fetchExtract?url=' + URL, true);
		xhr.send(null);	

		console.log("reached");
	}

	else if(xhr_login.readyState == 4 && xhr_login.status != 200)
	{
		alert("Wrong username or password");
	}
}

// Getting the form data
chrome.runtime.onMessage.addListener(
  function(contentResponse, sender, sendResponse) {
  	if(!contentResponse.text)
    {
    	console.log(contentResponse);
	    xhr_login.open('POST','https://staging.thirstt.com/login',true);
			xhr_login.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr_login.send(JSON.stringify({
	    	"email": contentResponse.email,
	    	"password": contentResponse.password,
	    	"isJson": 1
	    }));
	  }
	  else
	  {
	  	console.log(contentResponse.text);
	  }
});

//// Action starts
chrome.browserAction.onClicked.addListener(function (tab) { 

	URL = tab.url;
	xhr.open('GET', 'https://staging.thirstt.com/mediaservice/fetchExtract?url=' + tab.url, true);
	xhr.send(null);

	chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tab.id,
			{"turnOn": true},
			function(response) {}
			);
	});

  
});