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
    intro:
      "日本最熱鬧的城市-東京。古時又稱江戶，亦是經濟文化重鎮，而在日本圍棋發展的數百年洪流中，深厚的文化底蘊佐以大量的圍棋故事，自然不會放過這城市。日本棋院、小野照崎神社、巢鴨本妙寺...眾多故事等你發掘。",
    area: "tokyo",
  },
  {
    cata: "關東",
    src: "/pic/TravelPage/Catagory_kanto_background.jpg",
    alt: "日光楓葉",
    intro:
      "東京的一日生活圈，北至日光楓葉，南邊連富士山都能沾上點邊，進了郊區但也遠離了東京的喧囂，景色也更加讓人印象深刻。沒想到明信片上的風景也有圍棋故事吧！在美如畫的風景中，一個人踏上尋找故事的征途，浪漫！",
    area: "kanto",
  },
  {
    cata: "關西",
    src: "/pic/TravelPage/Catagory_kansai_background.jpg",
    alt: "京都二条城",
    intro:
      "B級美食天堂！古蹟之都！1869年遷都東京前。歷經千年的發展，為日本最具代表性的文化櫥窗。在這千年的文化洪流，圍棋故事雖然被漸漸沖淡，但當地的人們還是努力守護，讓熙來攘往的旅客能一同見證千年前的圍棋盛世。",
    area: "kansai",
  },
  {
    cata: "山陽",
    src: "/pic/TravelPage/Catagory_tyuukokutihou_background.jpg",
    alt: "尾道櫻花",
    intro:
      "悲喜交加的城市，但也是我的最愛，也是圍棋人不能錯過的地方。阿光尋找佐為的樣子歷歷在目，跟著阿光走訪虎次郎之墓、秀策紀念館。800年前遣唐使的恩惠，日本圍棋的發源地-吉備真備公園，沒有他們就沒有現在五彩繽紛的圍棋故事，抱著感恩的心徜徉圍棋世界吧。",
    area: "chugoku",
  },
  {
    cata: "其他",
    src: "/pic/TravelPage/Catagory_other_background.jpg",
    alt: "立山黑部雪壁",
    intro:
      "在日本的各處鄉下流浪時，意外的發現即便是鄉下也有圍棋的影子。你知道第一世本因坊-算砂有出差到金澤過嗎？你知道日本東北除了小海女外，還有圍棋海岸、神社甚至圍棋列車嗎？你知道最古老的伊勢神宮，旁邊也有似乎是最古老的棋會所嗎？不知道的地方還很多，但意外的發現也著實讓人興奮！不是嗎？",
    area: "other",
  },
  // {
  //   cata: "還沒去",
  //   src: "/pic/TravelPage/Catagory_Notyet_background.jpg",
  //   alt: "後樂館地獄谷溫泉",
  //   intro:
  //     "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, corrupti. Sunt mollitia nisi nobis ipsam tenetur accusantium cum itaque atque!",
  //   area: "notyet",
  // },
]
let itemNum = 0

function drawCata() {
  let cataHTML = ""
  itemImgs.forEach((itemImg, index) => {
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
