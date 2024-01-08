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

let isLogin = localStorage.getItem("status") || false;

let accessToken;

const popupUsername = document.getElementById("popup-username");
const popupPassword = document.getElementById("popup-password");
const popupBtnSubmit = document.getElementById("popup-btn-submit");

popupBtnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = popupUsername.value.trim();
  const password = popupPassword.value;

  if (username && password) {
    const address = "https://upload-img-be-2.vercel.app/api/login";

    const data = {
      username,
      password,
    };

    try {
      const response = await fetch(address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.error) {
        alert(responseData.error);
      } else {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("username", responseData.username);
        isLogin = true;
        localStorage.setItem("status", isLogin);
        accessToken = responseData.token;
        alert("Đăng nhập thành công!");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: app.js:56 ~ popupBtnSubmit.addEventListener ~ error:",
        error
      );
    }
  } else {
    alert("Các trường username và password không được để trống!");
  }
});
