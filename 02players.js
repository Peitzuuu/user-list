const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const PLAYERS_PER_PAGE = 16;

const players = [];
let filteredPlayers = [];

const dataPanel = document.querySelector("#data-panel");
const likeBtn = document.querySelectorAll(".like-btn");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector('#paginator')
const btnToolbar = document.querySelector('.btn-toolbar')

// 1.request data
axios
  .get(INDEX_URL)
  .then(function (response) {
    players.push(...response.data.results);
    renderPaginator(players.length);
    renderPlayerList(getPlayersByPage(1));
  })
  .catch(function (error) {
    console.log(error);
  });

// 2.render player cards
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
  dataPanel.innerHTML = rawHTML;
}

// 7. render paginator
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / PLAYERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}" style="background-color: #84a59d; color: #f7ede2;">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
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

// 9. add event listener to paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderPlayerList(getPlayersByPage(page))
})

// 6. add event listener to search form
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword.length) {
    return alert("請輸入有效字串！");
  }
  filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(keyword)
  );
  if (filteredPlayers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的選手`);
  }
  renderPlayerList(filteredPlayers);
});

// 10. add event listener to btnToolbar
btnToolbar.addEventListener('click', function onBtnToolbarClicked(event) {
  if (event.target.matches('#all-btn')) {
    renderPaginator(players.length);
    renderPlayerList(getPlayersByPage(1))
  } else if (event.target.matches('#male-btn')) {
    filteredPlayers = players.filter(player => player.gender === 'male')
    renderPaginator(filteredPlayers.length)
    renderPlayerList(getPlayersByPage(1))
  } else if (event.target.matches('#female-btn')) {
    filteredPlayers = players.filter(player => player.gender === 'female')
    renderPaginator(filteredPlayers.length)
    renderPlayerList(getPlayersByPage(1))
  }
})