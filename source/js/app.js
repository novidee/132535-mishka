var toggler = document.querySelector(".main-nav__toggler");
var nav = document.querySelector(".main-nav");

nav.classList.remove("main-nav--nojs");

toggler.addEventListener("click", onMenuToggle);

function onMenuToggle() {
  nav.classList.toggle("main-nav--opened");
}

ymaps.ready(injectMap);

function injectMap() {
  var latitude = 59.938631;
  var longitude = 30.323055;

  var mapWrapper = document.querySelector(".contacts__map-wrapper");
  var mapContainer = "<div id='map' style='width: 100%; height: 457px'></div>";
  mapWrapper.innerHTML = mapContainer;

  var map = new ymaps.Map("map", {
    center: [latitude, longitude],
    zoom: 16,
    controls: []
  });

  var placemark = new ymaps.Placemark([latitude, longitude], {
    hintContent: "Магазин «Мишка»"
  }, {
    iconLayout: 'default#image',
    iconImageHref: 'img/map-pin.svg',
    iconImageSize: [66, 101],
    iconImageOffset: [-30, -101]
  });

  map.geoObjects.add(placemark);
}
