const fileInput = document.querySelector(".fileInput");
const uploadPercentAge = document.querySelector(".uploadPercentAge");
const progress = document.querySelector(".progress");
const saveDataBtn = document.querySelector("#save-data");
const textPreviewElem = document.querySelector("#text-preview");
const imgPreviewElem = document.querySelector("#img-ct");
const imgPreviewBox = document.querySelector("#img-preview");

const code = document.getElementById("code");
const fullname = document.getElementById("fullname");
const note = document.getElementById("note");

let fileItem;
let fileName;
let storageRef;
let statusLogin;

const firebaseConfig = {
  apiKey: "AIzaSyCNZUtfRqQtNvjPSi25g6t-qOa640YVLJ4",
  authDomain: "upload-images-42481.firebaseapp.com",
  projectId: "upload-images-42481",
  storageBucket: "upload-images-42481.appspot.com",
  messagingSenderId: "1061703387667",
  appId: "1:1061703387667:web:bcc8b0efde5dabac46cde6",
  measurementId: "G-ZX1EG4NKXJ",
};

const app = firebase.initializeApp(firebaseConfig);

fileInput.addEventListener("change", (e) => {
  fileItem = e.target.files[0];
  fileName = fileItem.name || "";
  imgPreviewBox.style.border = "2px dotted green";
});

const showPreview = (url) => {
  textPreviewElem.classList.add("title-hidden");
  imgPreviewElem.classList.remove("img-hidden");
  imgPreviewElem.src = url || "";
};

const checkBtn = document.querySelector("#check");

const check = async (e) => {
  e.preventDefault();
  // const address = "http://localhost:8080/api/check";
  const address = "https://upload-img-be-2.vercel.app/api/check";

  const data = {
    code: code.value,
  };

  statusLogin = localStorage.getItem("status");
  if (statusLogin) {
    try {
      const response = await fetch(address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (
        responseData.message &&
        responseData.message === "Thông tin user bị trùng!"
      ) {
        alert("Thông tin người dùng bị trùng!");
        window.location.reload();
      } else {
        if (
          typeof fileName === "undefined" ||
          code.value == "" ||
          fullname.value == ""
        )
          alert("Vui lòng chọn ảnh và nhập đủ thông tin!");
        else {
          fileName = `${code.value}_${fullname.value}_${fileName}`;
          storageRef = firebase.storage().ref("images/" + fileName);

          if (fileItem) {
            let uploadTask = storageRef.put(fileItem);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // let progressValue =
                //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              },
              (error) => {
                alert("Lỗi:63: ", error);
                console.log("Lỗi: ", error);
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                  console.log("URL: ", url);
                  sendDataToServer(url);
                  showPreview(url);
                });
              }
            );
          }
        }
      }
    } catch (error) {
      alert(error);
    }
  } else {
    alert("Hãy đăng nhập trước khi thực hiện thao tác này!");
    return;
  }
};

saveDataBtn.addEventListener("click", check);

async function sendDataToServer(url) {
  statusLogin = localStorage.getItem("status");

  if (statusLogin) {
    try {
      const address = "https://upload-img-be-2.vercel.app/api/send";
      // const address = "http://localhost:8080/api/send";

      const data = {
        code: code.value,
        fullname: fullname.value,
        note: note.value,
        url,
      };

      const response = await fetch(address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        deleteImageFromStorage(data.url);
        throw new Error("Network response was not ok.");
      }
      fileItem = "";
      alert("Lưu thành công!");
      imgPreviewBox.style.border = "2px dotted red";
    } catch (error) {
      alert(error);
      // console.error(error);
    }
  } else {
    alert("Hãy đăng nhập trước khi thực hiện thao tác này!");
    return;
  }
}

function deleteImageFromStorage(imageURL) {
  // Chuyển đổi URL thành tham chiếu đến tệp tin trên Firebase Storage
  const imageRef = storageRef.storage.refFromURL(imageURL);

  imageRef
    .delete()
    .then(() => {
      console.log("Đã xóa ảnh thành công từ Firebase Storage.");
    })
    .catch((error) => {
      console.error("Lỗi khi xóa ảnh từ Firebase Storage:", error);
    });
}
