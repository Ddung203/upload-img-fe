const fileInput = document.querySelector(".fileInput");
const progress = document.querySelector(".progress");
const saveDataBtn = document.querySelector("#save-data");
const textPreviewElem = document.querySelector("#text-preview");
const imgPreviewElem = document.querySelector("#img-ct");
const imgPreviewBox = document.querySelector("#img-preview");
const labelForFileInput = document.querySelector('label[for="fileInput"]');

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
  labelForFileInput.style.backgroundColor = " green";
});

// const previewBeforeUpload = (id) => {
//   document.querySelector("#" + id).addEventListener("change", (e) => {
//     if (e.target.files.length === 0) return;

//     let file = e.target.files[0];
//     let url = URL.createObjectURL(file);
//     console.log(url);
//     imgPreviewElem.src = url;
//   });
// };

// previewBeforeUpload("fileInput");

const showPreview = (url) => {
  textPreviewElem.classList.add("title-hidden");
  imgPreviewElem.classList.remove("img-hidden");
  imgPreviewElem.src = url || "";
};

async function sendDataToServer(url) {
  statusLogin = localStorage.getItem("status");
  const accessToken = localStorage.getItem("token");
  if (!accessToken) {
    alert("No token!");
    return;
  }
  if (statusLogin) {
    try {
      const address = "https://upload-img-be-2.vercel.app/api/send";

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
        throw new Error("Xảy ra vấn đề trong lưu trữ!");
      }
      fileItem = "";
      alert("Lưu thành công!");
      imgPreviewBox.style.border = "2px dotted red";
      labelForFileInput.style.backgroundColor = "#1a54dc";
      setTimeout(() => {
        textPreviewElem.classList.remove("title-hidden");
        imgPreviewElem.classList.add("img-hidden");
        imgPreviewElem.src = "";
      }, 3000);
    } catch (error) {
      alert(error);
      console.log(error);
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

const handleFormSubmit = async (e) => {
  e.preventDefault();

  const isLoggedIn = localStorage.getItem("status");
  if (!isLoggedIn) {
    alert("Hãy đăng nhập trước khi thực hiện thao tác này!");
    return;
  }

  const accessToken = localStorage.getItem("token");
  if (!accessToken) {
    alert("No token!");
    return;
  }

  const address = "https://upload-img-be-2.vercel.app/api/check";

  const data = {
    code: code.value,
  };

  try {
    if (
      typeof fileName === "undefined" ||
      typeof fileItem === "undefined" ||
      code.value.trim().length === 0 ||
      fullname.value.trim().length === 0
    ) {
      alert("Vui lòng chọn ảnh và nhập đủ thông tin!");
      return;
    }
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
      typeof responseData.message === "string" &&
      responseData.message.length !== 0 &&
      responseData.message === "Thông tin user bị trùng!"
    ) {
      alert(responseData.message);
      // window.location.reload();
      return;
    }

    fileName = `${code.value}_${fullname.value}_${fileName}`;
    storageRef = firebase.storage().ref("images/" + fileName);

    let uploadTask = storageRef.put(fileItem);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        alert("uploadTask: ", error);
        console.log("Lỗi uploadTask: ", error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log("URL: ", url);
          sendDataToServer(url);
          showPreview(url);
        });
      }
    );
  } catch (error) {
    if (error.code_ === "storage/invalid-argument") {
      alert("Vui lòng chọn ảnh khác!");
    } else {
      alert(error);
      console.log(" ~ error:", error);
    }
  }
};

saveDataBtn.addEventListener("click", handleFormSubmit);
