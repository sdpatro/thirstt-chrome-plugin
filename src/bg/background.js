var xhr = new XMLHttpRequest();
var xhr_login = new XMLHttpRequest();
var xhr_sendClip = new XMLHttpRequest();
var URL;

function sendClip(content,url)
{
	xhr_sendClip.open('POST','https://staging.thirstt.com/api/v1/tclips',true);
	xhr_sendClip.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr_sendClip.send(JSON.stringify({
	"content": content,
	"src": url
	}));	
}

function openSimple(url)
{
	xhr.open('GET', 'https://staging.thirstt.com/mediaservice/fetchExtract?url=' + url, true);
	xhr.send(null);

	chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{"turnOn": true},
			function(response) {}
			);
	});
}

// Extract XHR
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {	        
    try {
    	var titleData = JSON.parse(xhr.responseText)[0].title;
		var contentData = JSON.parse(xhr.responseText)[0].content;

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


// Login XHR
xhr_login.onreadystatechange = function() {
  if (xhr_login.readyState == 4 && xhr_login.status == 200) {	        
    chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{"reqLogin": false, "title": titleData, "content": contentData},
					function(response) {}
				);
		});
		
		xhr.open('GET', 'https://staging.thirstt.com/mediaservice/fetchExtract?url=' + URL, true);
		xhr.send(null);	
	}

	else if(xhr_login.readyState == 4 && xhr_login.status != 200)
	{
		alert("Wrong username or password");
	}
}

// Clip sending XHR
xhr_sendClip.onreadystatechange = function() {

  var status;	

  if (xhr_sendClip.readyState == 4 && xhr_sendClip.status == 200)
  	status = "success";
  else if (xhr_sendClip.readyState == 4 && xhr_sendClip.status == 404)
  	status = "failure";

  chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(
		tabs[0].id,
		{"clipSuccess": status},
		function(response) {}
	);
  });

}

// Getting the form data
chrome.runtime.onMessage.addListener(
  function(contentResponse, sender, sendResponse) {
  	if(contentResponse.email)
    {
	    xhr_login.open('POST','https://staging.thirstt.com/login',true);
		xhr_login.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr_login.send(JSON.stringify({
    	"email": contentResponse.email,
    	"password": contentResponse.password,
    	"isJson": 1
	    }));
	}

	if(contentResponse.content)
	{
    	sendClip(contentResponse.content,contentResponse.src);
	}

});

//// Action starts
chrome.browserAction.onClicked.addListener(function (tab) { 

	URL = tab.url;
	
	openSimple(tab.url);

});

// Context menu
var clipHandler = function(e) {
    var url = e.pageUrl;
    var content;
    var contentImage = false;

    if (e.selectionText) {
        content = e.selectionText;
        console.log("Selection", content);
		/*sendClip(e.selectionText,e.pageUrl);*/
    }

    if (e.mediaType === "image") {
        content = encodeURI(e.srcUrl);
        console.log("Selection", content);
        contentImage = true;
        console.log("image");
        // sendClip(encodeURI(e.srcUrl),e.pageUrl);
    }

    if (e.linkUrl) {
        content = e.linkUrl;
        console.log("Selection", content);
        // sendClip(e.linkUrl,e.pageUrl);
    }

    chrome.tabs.query ({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {"contextClip": true, "contextContent": content,  "contentImage": contentImage },
            function(response) {}
        );
    });    

};

var main = chrome.contextMenus.create({ "title" : "Thristt Clipper", "contexts": ["page", "selection", "image", "link","frame","video"]});
var subSimple = chrome.contextMenus.create({"title": "Open in simple mode", "parentId": main, "onclick" : function(e){ openSimple(e.pageUrl);},"contexts": ["page", "selection", "image", "link"] });
var subAdd = chrome.contextMenus.create({"title": "Add to your TClips", "parentId": main, "onclick" : clipHandler, "contexts": ["page", "selection", "image", "link"]});