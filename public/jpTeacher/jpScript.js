const words = document.querySelectorAll(".word")
const wordBox = document.querySelector(".word_box")
const wordApiUrl = "http://localhost:80/jpteacher/getWord/"

let lastWord = words[0]

words.forEach((word) => {
  word.addEventListener("click", async (data) => {
    let searchWord = data.target.innerText
    refreshWordBox(searchWord, word)
    word.classList.add("active")
    lastWord.classList.remove("active")
    lastWord = word
  })
})

async function refreshWordBox(searchWord) {
  let res = await fetch(wordApiUrl + searchWord)
  let wordDetail = await res.json()
  console.log(wordDetail[0])
  wordBox.interHtml = ""
  wordBox.innerHTML = `
  <h3>單字框</h3>
  <div class="detail">
    <p class="word item">單字：${setWordHtml(
      searchWord,
      wordDetail[0].basic_form
    )}</p>
    <div class="pronounce item">發音：${wordDetail[0].reading}</div>
    <div class="properties item">
      ${setProperties(wordDetail[0])}
    </div>
    <a class="dict item" href="${getDict(
      wordDetail[0].basic_form
    )}" target="_blank">日日字典</a>
  </div>
  `
}

function setProperties(detail) {
  let properties = `<div class="property item">${detail.pos}</div>`
  if (detail.pos_detail_1 != "*") {
    properties += `<div class="property item">${detail.pos_detail_1}</div>`
  }
  if (detail.pos_detail_2 != "*") {
    properties += `<div class="property item">${detail.pos_detail_2}</div>`
  }
  if (detail.pos_detail_3 != "*") {
    properties += `<div class="property item">${detail.pos_detail_3}</div>`
  }
  return properties
}

function getDict(word) {
  return `https://dictionary.goo.ne.jp/srch/all/${word}/m0u/`
  // return `https://dictionary.goo.ne.jp/srch/${word}/m0u/`
}

function setWordHtml(oriWord, searchWord) {
  if (oriWord == searchWord) {
    return oriWord
  } else {
    return `${searchWord} → ${oriWord}`
  }
}

// function translate(sentence) {
//   const words = new Promise((resolve, reject) => {
//     kuromoji.builder({ dicPath: DIC_URL }).build((err, tokenizer) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(tokenizer.tokenize(sentence));
//     });
//   });
//   //   console.log(words) ;
//   return words;
// }
