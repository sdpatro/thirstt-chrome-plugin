var selection;
var selectionNodeArray;
var element;

// Main frame attributes
var iframe_thirstt = document.createElement("div");
iframe_thirstt.setAttribute("id","thirsttFrame")
iframe_thirstt.setAttribute("frameborder", "0");
iframe_thirstt.className = "off";
document.body.appendChild(iframe_thirstt);   // Adding the frame to the body

  // Logo
  var logo = document.createElement("img");
  logo.setAttribute("id","logoThirstt");
  logo.setAttribute("src","https://www.thirstt.com/images/logos/logoLanding.png");

  // Summary article
  var article = document.createElement("div");
  article.setAttribute("id","article_t")

  //Article Content
  var articleContent = document.createElement("div");
  articleContent.setAttribute("id","articleContent");

  //Article title
  var articleTitle = document.createElement("div");
  articleTitle.setAttribute("id","articleTitle");

      //Close Button
      var closeBtn = document.createElement("div");
      closeBtn.setAttribute("id","closeBtn_thirstt");
      closeBtn.innerHTML = "x";

  //Loading
  var loading = document.createElement("div");
  loading.setAttribute("id","loading");
  loading.innerHTML = "Loading...."
  
  // Login
  var login = document.createElement("div");
  login.setAttribute("id","login");

    // Username
      var inputUsername = document.createElement("input");
      inputUsername.setAttribute("id","inputUsername");
      inputUsername.setAttribute("placeholder","Username");
      login.appendChild(inputUsername);

    // Password
      var inputPassword = document.createElement("input");
      inputPassword.setAttribute("id","inputPassword");
      inputPassword.setAttribute("placeholder","Password");
      inputPassword.setAttribute("type","password");
      login.appendChild(inputPassword);

    // Login Button
      var loginBtn = document.createElement("div");
      loginBtn.setAttribute("id","loginBtn");
      loginBtn.innerText = "Login";
      login.appendChild(loginBtn);

    // Register here
      var register = document.createElement("div");
      register.setAttribute("id","register");
      register.innerHTML  = "Don't have a Thristt account?"
      login.appendChild(register);

    // Regist Link
      var registerLink = document.createElement("div");
      registerLink.setAttribute("id","registerLink");
      registerLink.setAttribute("onclick","registerWindow();");
      registerLink.innerText = "Register here.";
      login.appendChild(registerLink);      

// Clipper tool
var clipper = document.createElement("div");
clipper.setAttribute("id","clipper");
clipper.className = "inactive";

// Clip send status
var clipStatus = document.createElement("div");
clipStatus.setAttribute("id","clipStatus");
clipStatus.innerText = "";

// Clip send status_context
var clipStatus_context = document.createElement("div");
clipStatus_context.setAttribute("id","clipStatus_context");

  // Context status logo
  var logoContext = document.createElement("img");
  logoContext.setAttribute("id","logoThirsttContext");
  logoContext.setAttribute("src","https://www.thirstt.com/images/logos/logoLanding.png");
  clipStatus_context.appendChild(logoContext);

  // Context status text
  var contextText = document.createElement("div");
  contextText.setAttribute("id","contextText");
  contextText.innerText = "Template";
  clipStatus_context.appendChild(contextText);

  // Context content 
  var contextContent = document.createElement("div");
  contextContent.setAttribute("id","contextContent");
  contextContent.innerText = "Template";
  clipStatus_context.appendChild(contextContent);

iframe_thirstt.appendChild(logo);         // Adding the logo
iframe_thirstt.appendChild(loading);      // Adding the loading text
iframe_thirstt.appendChild(closeBtn);     // Adding the close button to frame
iframe_thirstt.appendChild(article);      // Adding the article
clipper.appendChild(clipStatus);          // Adding the clip status message to the clipper
document.body.appendChild(clipper);      // Adding the clipper
document.body.appendChild(clipStatus_context);  // Adding the context clipping status.


// Adding the article content                          
article.appendChild(articleTitle);
article.appendChild(articleContent); 

// Register window
function registerWindow()
{
  window.open("https://staging.thirstt.com/register");
}

// Turn off
function turnOff()
{
  iframe_thirstt.className = "off";
  article.className = "inactive";
  login.className = "inactive";
  clipper.className = "inactive";
  
  setTimeout(function(){loading.className = "active";},200);
  
} 

// Show clipper
function showClipper(posX,posY)
{
  if(thirsttFrame.className == "on")
  {   
    clipper.style.left= posX + "px";
    clipper.style.top= posY + "px";
    clipper.className = "active";
  }
}


// All click events
document.body.onclick = function(e){

  if(window.getSelection().type == "Range")
  {
    showClipper(e.clientX - 30, e.clientY - 40);    
    selection = window.getSelection().toString();
  }

  else 
  {
    if(e.toElement.id == "closeBtn_thirstt")
    turnOff();

    if(e.toElement.id == "registerLink")
      registerWindow();

    if(e.toElement.id == "clipper")
    {
      if(selection)
      {
        console.log(selection.toString());
        sendToBackground(selection.toString());
      }
        
      else
      {
        console.log(element);
        sendToBackground(element.outerHTML);
      }

      clipStatus.innerText = "Saving to your tClip.." ;
      clipStatus.className = "active";
    }    

    selection = undefined;
  }
  
}


function sendToBackground(clipContent)
{
  chrome.runtime.sendMessage({
    "content" : clipContent,
    "src" : document.URL
  },function(){});
}

// Mouse move events
document.getElementById("article_t").onmouseover = function(e) {
  
  var tag = e.toElement.tagName;

  if((tag == "P" || tag == "IMG" || tag == "A" || tag == "IFRAME") && (selection==undefined))
  {
    element = e.toElement;
    e.toElement.className = "";

    var rect = e.toElement.getBoundingClientRect();
    var halfHeight = Math.ceil(rect.top + e.toElement.offsetHeight/2);

    if(tag!="A")
    {if((e.clientY <= halfHeight) || (rect.bottom > window.innerHeight) )
        showClipper(rect.right - 45, rect.top + 5);
    
        else 
        showClipper(rect.right - 45, rect.bottom - 50);      }

    else
      showClipper(rect.right - 10, rect.top-10);
  }
}

document.getElementById("clipper").onmouseover = function(e) {

  if(selection==undefined)
    element.className = "highlighted";
}

document.getElementById("clipper").onmouseout = function(e) {
  element.className = "";
}

// Selection event
document.getElementById("thirsttFrame").onmouseup = function(e){

  
}

window.onscroll = function(e) {
  if(thirsttFrame.className == "on") {
    clipper.className ="scrolled";
    setTimeout(function(){
      clipper.className ="active";
    },1000);
  }
}


function scrollToTop()
{
  if(Math.floor(window.pageYOffset/5) != 0 )
  {
    scrollBy(0,-Math.floor(window.pageYOffset/5));
    setTimeout(function(){
      scrollToTop();
    },10);
  }
  return;
}

// All the action takes place here
// because the frame gets activated when inject.js receives a message from background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if(request.turnOn == true)      // Turn the overlay On or Off
    {
      if(iframe_thirstt.className == "off")
      {
        var body = document.body,
        html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

        document.getElementById("thirsttFrame").style.height = height + "px";
        scrollToTop();
        iframe_thirstt.className = "on";
      }

      else
      {
        turnOff();
      }
    }

    if(request.reqLogin == true)    // Login prompt
    {
      console.log("request login");

      loading.className = "inactive";
      setTimeout(function(){
        loading.innerText = "Please login to continue"
      },200);
      setTimeout(function(){
        loading.className = "active";
      },200);
      article.className = "inactive";
      login.className = "active";

      iframe_thirstt.appendChild(login);

      loginBtn.onclick = function() {
        
        chrome.runtime.sendMessage({
          "email": inputUsername.value,
          "password": inputPassword.value,
          "isJson": 1
          }, function() {
        });

      }
    }
    else if(request.reqLogin == false)    // Filling up the content, for logged in users only.
    {
      loading.innerText = "Loading..."
      articleTitle.innerHTML = request.title;
      articleContent.innerHTML = request.content;
      
      article.className = "active";
      login.className = "inactive";
      loading.className = "inactive";
    }

    if(request.clipSuccess)
    {

      if(clipStatus_context.className != "active")
      { 
        clipStatus.style.color = "#5c5c5c";

        if(request.clipSuccess == "success")
        {
          clipStatus.innertext = "Done";
        }

        else
          clipStatus.innerText = "Something went wrong...";

        setTimeout(function(){
          clipStatus.className = "inactive";
          clipStatus.style.color = "#8f8f8f";
        },3000);
      }

      else
      {
        if(request.clipSuccess == "success")
        {
          contextText.innertext = "Done";
        }

        else
          contextText.innerText = "Something went wrong...";

        setTimeout(function(){
          clipStatus_context.className = "inactive";
        },3000);

      }

    }

    if(request.contextClip)
    {
      clipStatus_context.className = "active";
      contextText.innerText = "Adding to tClip"
      contextContent.innerText = request.contextContent;

      var contextImg = document.createElement("img");
      contextImg.setAttribute("id","contextImg");

      if(request.contentImage)
        contextImg.style.display = "block";

      else
        contextImg.style.display = "none"; 


      contextImg.setAttribute("src",request.contextContent);
      contextContent.appendChild(contextImg);

      sendToBackground(request.contextContent);
    }

});

console.log("Inject.js injected..."); 




