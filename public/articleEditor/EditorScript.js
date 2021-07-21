let myEditor
if (document.querySelector("#editor")) {
  ClassicEditor.create(document.querySelector("#editor"), {
    //   extraPlugins: [MyCustomUploadAdapterPlugin],
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: "/article/changePicApi",
      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: true,
      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        "X-CSRF-TOKEN": "CSRF-Token",
        Authorization: "Bearer <JSON Web Token>",
      },
    },
  })
    .then((editor) => {
      console.log("Editor success")
      myEditor = editor
    })
    .catch((e) => {
      console.log(e)
    })
  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter(loader)
    }
  }
}

// 選取圖片後馬上可瀏覽縮圖
const mainPicInput = document.querySelector("#mainPic")
const showImg = document.querySelector("#showImg")
const dragFinished = ["dragleave", "dragend"]

if (mainPicInput) {
  $("#mainPic").change(function () {
    var file = $("#mainPic")[0].files[0]
    var reader = new FileReader()
    reader.onload = function (e) {
      $("#showImg").attr("src", e.target.result)
    }
    reader.readAsDataURL(file)
  })

  showImg.addEventListener("dragover", (e) => {
    e.preventDefault()
    showImg.classList.add("drag-over")
  })

  dragFinished.forEach((evt) => {
    showImg.addEventListener(evt, () => {
      showImg.classList.remove("drag-over")
    })
  })

  showImg.addEventListener("drop", (e) => {
    e.preventDefault()
    mainPicInput.files = e.dataTransfer.files
    showImg.classList.remove("drag-over")
    updateThumbnail(showImg, e.dataTransfer.files[0])
  })

  function updateThumbnail(dropEl, file) {
    // console.log(dropEl)
    // console.log(file)
    const reader = new FileReader()
    dropEl.src = URL.createObjectURL(file)
  }
}
