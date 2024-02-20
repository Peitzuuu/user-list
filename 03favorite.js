const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";


const players = JSON.parse(localStorage.getItem("favoritePlayers")) || [];

const dataPanel = document.querySelector("#data-panel");
const likeBtn = document.querySelectorAll(".like-btn");


// 1.request data
renderPlayerList(players);

// 2.generate players
function renderPlayerList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="card text-center m-1 rounded-3" style="width:10rem; height:15rem; background-color: #f5cac3;">
        <div class="mt-2">
          <img src="${item.avatar}" class="card-img-top rounded-circle" id="player-avatar" alt="Player Avatar" data-id="${item.id}" style="cursor: pointer; background-color: #f7ede2; width:8rem;" data-bs-toggle="modal" data-bs-target="#player-modal">
        </div>
        <div class="card-body pb-0">
          <p class="card-text mb-0">${item.name} ${item.surname}</p>
        </div>
        <div class="card-bottom text-end">
          <button class="btn plus-btn m-0" data-id="${item.id}">
            <i class="fa-regular fa-thumbs-up" id=""></i>
          </button>
          <span class="like-num me-2 m-0" data-id="${item.id}">0</span>
          <button class="btn m-0">
            <i class="fa-solid fa-heart like-btn" data-id="${item.id}"></i>
          </button>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
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

// 4. add function removeFromFavorite
function removeFromFavorite(id) {
  if (!players || !players.length) return;
  const playerIndex = players.findIndex((player) => player.id === id);
  if (playerIndex === -1) return;
  players.splice(playerIndex, 1);
  localStorage.setItem("favoritePlayers", JSON.stringify(players));
  renderPlayerList(players);
}

// 5. add event listener to call modal and like button
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const id = Number(event.target.dataset.id);
  if (event.target.matches("#user-avatar")) {
    showPlayerModal(id);
  } else if (event.target.matches('.like-btn')) {
    removeFromFavorite(id);
  }
});