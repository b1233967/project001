const primary_color = "#ffda77"
const secondary_color = "#ffa45b"
const word_dark_color = "#2f4858"

// Photo Carousel for Go Travel Page (Start)
const allImg = document.querySelectorAll(".photo_carousel img")
let idx = allImg.length - 1
let interval = setInterval(run, 3500)

function run() {
  if (idx > 1) {
    allImg[idx].style.opacity = 0
    idx--
    allImg[idx].style.opacity = 1
  } else {
    allImg[idx].style.opacity = 0
    idx = allImg.length - 1
    allImg[idx].style.opacity = 1
  }
}
// Photo Carousel for Go Travel Page (End)

// Catagory items for Go Travel Page (Start)
const catagory = document.querySelector("#catagory")
const itemImgs = [
  {
    cata: "東京",
    src: "/pic/TravelPage/Catagory_Tokyo_background.jpg",
    alt: "新宿夜景",
    intro: "I love you",
    area: "tokyo",
  },
  {
    cata: "關東",
    src: "/pic/TravelPage/Catagory_kanto_background.jpg",
    alt: "日光楓葉",
    intro:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, corrupti. Sunt mollitia nisi nobis ipsam tenetur accusantium cum itaque atque!",
    area: "kanto",
  },
  {
    cata: "關西",
    src: "/pic/TravelPage/Catagory_kansai_background.jpg",
    alt: "京都二条城",
    intro:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, corrupti. Sunt mollitia nisi nobis ipsam tenetur accusantium cum itaque atque!",
    area: "kansai",
  },
  {
    cata: "山陽",
    src: "/pic/TravelPage/Catagory_tyuukokutihou_background.jpg",
    alt: "尾道櫻花",
    intro:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, corrupti. Sunt mollitia nisi nobis ipsam tenetur accusantium cum itaque atque!",
    area: "chugoku",
  },
  {
    cata: "其他",
    src: "/pic/TravelPage/Catagory_other_background.jpg",
    alt: "立山黑部雪壁",
    intro:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, corrupti. Sunt mollitia nisi nobis ipsam tenetur accusantium cum itaque atque!",
    area: "other",
  },
  {
    cata: "還沒去",
    src: "/pic/TravelPage/Catagory_Notyet_background.jpg",
    alt: "後樂館地獄谷溫泉",
    intro:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, corrupti. Sunt mollitia nisi nobis ipsam tenetur accusantium cum itaque atque!",
    area: "notyet",
  },
]
let itemNum = 0

function getBackground(num, src) {
  if (num % 2 == 0) {
    return `linear-gradient(120deg,${primary_color} 30%,transparent 30%), url(${src}) center left / cover`
  } else {
    return `linear-gradient(60deg,transparent 70%,${primary_color} 70%), url(${src}) center right / cover`
  }
}

function drawCata() {
  let cataHTML = ""
  itemImgs.forEach((itemImg, index) => {
    // let bg = getBackground(index % 2, itemImg.src)
    let bg = `url(${itemImg.src}) center left / cover`
    let itemHtml = `
    <a href="/gotravel/${itemImg.area}" class='item ${
      index % 2 == 0 ? "left" : "right"
    }' style='background:${bg}'>
      <div class='cata_title'>
        <h2>${itemImg.cata}</h2>
      </div>
      <div class='intro'>
        <p>${itemImg.intro}</p>
      </div>
    </a>
    `
    cataHTML += itemHtml
  })
  catagory.innerHTML = cataHTML
}
drawCata()

const items = document.querySelectorAll("#catagory .item")
window.addEventListener("scroll", check)
function check() {
  checkItems()
}
function checkItems() {
  const triggerHeight = window.innerHeight * 0.9
  items.forEach((item) => {
    if (item.getBoundingClientRect().top < triggerHeight) {
      item.classList.add("show")
    } else {
      item.classList.remove("show")
    }
  })
}

// Catagory items for Go Travel Page (End)
