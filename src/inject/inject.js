var selection;
var selectionNodeArray;

// Main frame attributes
var iframe_thirstt = document.createElement("div");
iframe_thirstt.setAttribute("id","thirsttFrame")
//iframe_thirstt.setAttribute("scrolling", "no");
iframe_thirstt.setAttribute("frameborder", "0");
iframe_thirstt.className = "off";
document.body.appendChild(iframe_thirstt);   // Adding the frame to the body

  // Logo
  var logo = document.createElement("img");
  logo.setAttribute("id","logo");
  logo.setAttribute("src","https://www.thirstt.com/images/logos/logoLanding.png");

  // Summary article
  var article = document.createElement("div");
  article.setAttribute("id","article")

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
clipper.innerHTML = "Clip Text";

// Clip Para 
var paraClipper = document.createElement("div");
paraClipper.setAttribute("id","paraClipper");
paraClipper.innerHTML = "Clip Para";



iframe_thirstt.appendChild(logo);         // Adding the logo
iframe_thirstt.appendChild(loading);      // Adding the loading text
iframe_thirstt.appendChild(closeBtn);     // Adding the close button to frame
iframe_thirstt.appendChild(article);      // Adding the article
document.body.appendChild(clipper);      // Adding the clipper
document.body.appendChild(paraClipper);  // Adding the para clipper

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
  
  setTimeout(function(){loading.className = "active";},200);
  
} 

// Show clipper
function showClipper(posX,posY)
{
  clipper.style.left= posX + "px";
  clipper.style.top= posY + "px";
  clipper.className = "active";
}


// All click events
document.getElementById("thirsttFrame").onclick = function(e){

  if(e.toElement.id == "closeBtn_thirstt")
    turnOff();

  if(e.toElement.id == "registerLink")
    registerWindow();

}

// Mouse move events
document.getElementById("articleContent").onmousemove = function(e){

  var hoverElement = e.toElement;

  paraClipper.className = "active";

  if(hoverElement.tagName == "P")
  {
    paraClipper.style.left = e.clientX + "px";
    paraClipper.style.top = e.clientY + "px";
  }
}

// Clipper functionality
document.getElementById("clipper").onclick = function(e){
  console.log(range);
}


document.getElementById("thirsttFrame").onmouseup = function(e){

  selection =  window.getSelection();

  if(window.getSelection().type == "Range")
  {
    showClipper(e.clientX,e.clientY);
    
  }

  else
    clipper.className = "inactive";
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

    console.log(request);

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
        loading.innerText = "Please login to continue..."
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
      articleTitle.innerHTML = request.title;
      articleContent.innerHTML = request.content;
      
      article.className = "active";
      login.className = "inactive";
      loading.className = "inactive";
    }

});

console.log("Inject.js injected..."); 

