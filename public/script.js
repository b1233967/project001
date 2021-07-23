const Nav = document.querySelector("#nav")
window.addEventListener("scroll", check)
function check() {
  checkNav()
}

function checkNav() {
  if (window.scrollY > 100) {
    Nav.classList.add("active")
  } else {
    Nav.classList.remove("active")
  }
}

// 收藏數 Likes (Start)
const computeLikesApi = "http://localhost:80/api/computelikes" // 後面加 articleID
const checkLoggedinApi = "http://localhost:80/api/isLoggedin"
const addLikesDbApi = "http://localhost:80/api/addLikesToUser/" // 後面加 articleID
const rmLikesDbApi = "http://localhost:80/api/rmLikesFromUser/" // 後面加 articleID
const articleLikes = document.querySelectorAll(".article-items .item .likes") // 地區分類文章列表的愛心框

// 地區分類文章列表按讚收藏
if (articleLikes.length > 0) {
  articleLikes.forEach((articleItem) => {
    articleItem.addEventListener("click", async () => {
      // 先確認是否登入，登入才能收藏
      let res = await fetch(checkLoggedinApi, { method: "POST" })
      let { isLoggedin } = await res.json()
      // 登入才能按愛心
      if (isLoggedin) {
        articleItem.classList.toggle("red")
        let articleID = articleItem.getAttribute("data-id")
        let articleLikes = articleItem.getAttribute("data-likes")
        console.log(articleItem)
        if (articleItem.classList.contains("red")) {
          articleLikes++
          await fetch(addLikesDbApi + articleID, { method: "POST" })
          await computeLikes(articleID, articleLikes)
        } else {
          articleLikes--
          await fetch(rmLikesDbApi + articleID, { method: "POST" })
          await computeLikes(articleID, articleLikes)
        }
        articleItem.setAttribute("data-likes", articleLikes)
      } else {
        window.alert("登入後才能收藏歐~")
      }
    })
  })
}

// 文章內按讚收藏
const insideLikeEl = document.querySelector(".info-box .likes") // 文章內文頁面的愛心框
const insideLikeNum = document.querySelector(
  ".article-wrap .info-box .likes span"
)
if (insideLikeEl) {
  insideLikeEl.addEventListener("click", async () => {
    // 先確認是否登入，登入才能收藏
    let res = await fetch(checkLoggedinApi, { method: "POST" })
    let { isLoggedin } = await res.json()
    // 登入才能按愛心
    if (isLoggedin) {
      insideLikeEl.classList.toggle("red")

      let articleID = insideLikeEl.getAttribute("data-id")
      let insideLikes = insideLikeEl.getAttribute("data-likes")
      console.log(insideLikeEl)
      if (insideLikeEl.classList.contains("red")) {
        insideLikes++
        insideLikeNum.innerText = insideLikes
        await fetch(addLikesDbApi + articleID, { method: "POST" })
        await computeLikes(articleID, insideLikes)
      } else {
        insideLikes--
        insideLikeNum.innerText = insideLikes
        await fetch(rmLikesDbApi + articleID, { method: "POST" })
        await computeLikes(articleID, insideLikes)
      }
      insideLikeEl.setAttribute("data-likes", insideLikes)
    } else {
      window.alert("登入後才能收藏歐~")
    }
  })
}

// 幫計算收藏愛心，如果 red = true , API Likes+1
//               反之 red = false , API Likes-1
async function computeLikes(id, likesNum) {
  console.log("id = ", id)
  console.log("likes = " + likesNum)
  console.log(computeLikesApi + "/" + id + "/" + likesNum)
  let res = await fetch(computeLikesApi + "/" + id + "/" + likesNum)
}
// 收藏數 Likes (End)
