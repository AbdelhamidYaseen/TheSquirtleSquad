const loggedIn = true;
function openForm() {
  document.getElementById("login-Form").style.display = "block";
}

function closeForm() {
  document.getElementById("login-Form").style.display = "none";
}
/*makes it so the pop-up that shows that you have no acces, is visible for a couple of seconds*/
function noAcces() {
  document.getElementById("landing-page-button").style.display = "block";

  document.getElementById("no-acces").style.display = "block"; 
  setTimeout(() => {
    document.getElementById("no-acces").style.display = "none";
  }, 1400);
}

/*makes login form invisible*/
function isLoggedIn(){
  document.getElementById("landing-page-button").style.display = "none";
  // document.getElementsByClassName("landing-open-button").style.display = "none";

  // if (loggedIn = true){
  // }
}

/*checks if you got acces to visit a page or not*/
function accesOrNot(){
  if(loggedIn){
    acces()
  }
  else{
    noAcces()
  }
}

function acces() {  
  window.location.href = "../home"
}


