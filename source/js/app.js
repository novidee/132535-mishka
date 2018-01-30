var toggler = document.querySelector(".main-nav__toggler");
var nav = document.querySelector(".main-nav");

nav.classList.remove('main-nav--nojs');

toggler.addEventListener("click", onMenuToggle);

function onMenuToggle() {
  nav.classList.toggle("main-nav--opened");
}
