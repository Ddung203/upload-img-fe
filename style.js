// Open/Close Popup
const openPopupBtn = document.getElementById("open-popup");
const popupOverlay = document.getElementById("popup-overlay");

openPopupBtn.addEventListener("click", function () {
  if (popupOverlay.style.display != "flex") popupOverlay.style.display = "flex";
  else popupOverlay.style.display = "none";
});

popupOverlay.addEventListener("click", function (event) {
  if (event.target === popupOverlay) {
    popupOverlay.style.display = "none";
  }
});
