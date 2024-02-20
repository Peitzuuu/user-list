const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const PLAYERS_PER_PAGE = 5;

const players = [];
let filteredPlayers = [];

const dataPanel = document.querySelector("#data-panel");
const maleDataPanel = document.querySelector("#male-data-panel");
const femaleDataPanel = document.querySelector("#female-data-panel");
const likeBtn = document.querySelectorAll(".like-btn");

// 1.request data
axios
  .get(INDEX_URL)
  .then(function (response) {
    players.push(...response.data.results);
    filteredPlayers = players.filter(player => player.gender === "male");
    maleDataPanel.innerHTML = renderPlayerList(getPlayersByPage(1));

    filteredPlayers = players.filter(player => player.gender === "female");
    femaleDataPanel.innerHTML = renderPlayerList(getPlayersByPage(1));

  })
  .catch(function (error) {
    console.log(error);
  });

// 2.render player cards
function renderPlayerList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="card text-center me-1 mt-1 rounded-3" style="width:10rem; height:15rem; background-color: #f5cac3;">
        <div class="mt-2">
          <img src="${item.avatar}" class="card-img-top rounded-circle" id="player-avatar" alt="Player Avatar" data-id="${item.id}" style="cursor: pointer; background-color: #f7ede2; width:8rem;" data-bs-toggle="modal" data-bs-target="#player-modal">
        </div>
        <div class="card-body pb-0">
          <p class="card-text mb-0">${item.name} ${item.surname}</p>
        </div>
        <div class="card-bottom text-end">
          <button class="btn m-0">
            <i class="fa-regular fa-thumbs-up plus-btn" data-id="${item.id}"></i>
          </button>
          <span class="like-num me-2 m-0" data-id="${item.id}">0</span>
          <button class="btn m-0">
            <i class="fa-regular fa-heart like-btn" data-id="${item.id}"></i>
          </button>
        </div>
      </div>
    `;
  });
  return rawHTML;
}

// 3. create modal
function showPlayerModal(id) {
  const playerAvatar = document.querySelector("#player-modal-avatar");
  const playerName = document.querySelector("#player-modal-name");
  const playerRegion = document.querySelector("#player-modal-region");
  const playerGender = document.querySelector("#player-modal-gender");
  const playerAge = document.querySelector("#player-modal-age");
  const playerEmail = document.querySelector("#player-modal-email");

  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      const data = response.data;
      playerAvatar.innerHTML = `<img src="${data.avatar}" alt="player avatar">`;
      playerName.innerText = data.name + " " + data.surname;
      playerRegion.innerText = "Region: " + data.region;
      playerGender.innerText = "Gender: " + data.gender;
      playerAge.innerText = "Age: " + data.age;
      playerEmail.innerText = data.email;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 4. add function addToFavorite
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoritePlayers")) || [];
  const player = players.find((player) => player.id === id);
  if (list.some((player) => player.id === id)) {
    return alert("此用戶已在收藏清單中！");
  }
  list.push(player);
  localStorage.setItem("favoritePlayers", JSON.stringify(list));
}

// 8. add function getPlayersByPage
function getPlayersByPage(page) {
  const data = filteredPlayers.length ? filteredPlayers : players
  const startIndex = (page - 1) * PLAYERS_PER_PAGE
  return data.slice(startIndex, startIndex + PLAYERS_PER_PAGE)
}

// 5. add event listener to call modal and like button
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const id = Number(event.target.dataset.id);
  if (event.target.matches("#player-avatar")) {
    showPlayerModal(id);
  } else if (event.target.matches('.like-btn')) {
    addToFavorite(id);
    console.log(event.target)
    event.target.parentElement.innerHTML = '<i class="fa-solid fa-heart like-btn" data-id="${item.id}"></i>';
  } else if (event.target.matches('.plus-btn')) {
    const likeBox = event.target.parentElement.parentElement.querySelector('.like-num')
    let like = Number(likeBox.innerText)
    like += 1
    likeBox.innerText = like
  }
});

// 6. add event listener to link more player cards
dataPanel.addEventListener('click', function onMoreClicked(event) {
  const gender = event.target.gender
  if (event.target.matches('.btn-to-male')) {

  }
})