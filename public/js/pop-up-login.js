function openForm() {
  document.getElementById("login-Form").style.display = "block";
}

function closeForm() {
  document.getElementById("login-Form").style.display = "none";
}

function login() {
  window.alert("Deze functie is momenteel nog niet beschikbaar.")
}
function noAcces() {
  document.getElementById("no-acces").style.display = "block";
  document.getElementById("no-acces-text").innerHTML = "U hebt geen toegang tot deze pagina."; 
  setTimeout(() => {
    document.getElementById("no-acces").style.display = "none";
  }, 1400);
}

function acces() {
  window.location.href = "views/home.ejs"
}


