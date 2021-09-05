let base_url = "https://api.football-data.org/v2/";
const API_TOKEN = 'eaa18b26c5be48aa99247514080fa207'
const bodyContent = document.querySelector(".body-content");

let teams

const status = (response) => {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

const json = (response) => {
  return response.json();
}

const error = (error) => {
  console.log("Error : " + error);
}

const fetcher = url => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'X-Auth-Token': API_TOKEN
    }
  })
}

const getStandings = () => {
  if ('caches' in window) {
    caches.match(`${base_url}competitions/2001/standings?standingType=TOTAL`)
      .then((response) => {
        if (response) {
          renderStandings(response);
        }
      })
  }

  fetcher(`${base_url}competitions/2001/standings?standingType=TOTAL`)
    .then(status)
    .then(json)
    .then((data) => {
      renderStandings(data);
    })
    .catch(error);
}

const renderStandings = (data) => {
  let body = ''

  data.standings.forEach((standing) => {
    body += `
      <tr>
        <td colspan="8">${standing.group.replace(/_/i, ' ')}</td>
      </tr>`;
    standing.table.forEach(team => {
      body += `
        <tr>
          <td>${team.position}</td>
          <td>
            <a href="./team.html?id=${team.team.id}">
              <img alt="${team.team.name}" width="24" src="${team.team.crestUrl.replace(/^http:\/\//i, 'https://') || 'img/empty_badge.svg'}">
            </a>
          </td>
          <td>
            <a href="./team.html?id=${team.team.id}">
              ${team.team.name}
            </a>
          </td>
          <td>${team.playedGames}</td>
          <td>${team.won}</td>
          <td>${team.draw}</td>
          <td>${team.lost}</td>
          <td>${team.points}</td>
        </tr>`;
    })
  });

  const table = `
    <div class="card center">
      <div class="card-content"> 
        <h5 class="header">Standings</h5>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Logo</th>
              <th>Team</th>
              <th>Play</th>
              <th>Won</th>
              <th>Draw</th>
              <th>Lost</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${body}
          </tbody>
        </table>
      </div>
    </div>
    `

  bodyContent.innerHTML = table;
}

const getTeamById = () => {
  // Get query parameter (?id=)
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id") ? urlParams.get("id") : 1;

  if ('caches' in window) {
    caches.match(`${base_url}teams/${idParam}`)
      .then((response) => {
        if (response) {
          renderTeam(response);
        }
      })
  }

  fetcher(`${base_url}teams/${idParam}`)
    .then(status)
    .then(json)
    .then((data) => {
      renderTeam(data);
    })
    .catch(error);
}

const renderTeam = (data) => {
  teams = data;
  let team = `
    <div class="card">
      <div class="card-content">
        <div class="center">
          <img alt="${data.name}" width="120" height="120" src="${data.crestUrl}">
        </div>
        <a class="btn-floating btn-large halfway-fab waves-effect waves-light red" onclick="favTeam()">
          <i style="background-color: #B37646;" class="material-icons">add</i>
        </a>
        <a href="${data.website}" target="_blank" rel="noopener noreferrer">
          <span class="card-title">${data.name} (${data.tla})</span>
        </a>
        <span>Est. ${data.founded}</span>
        <p>
          ${data.address}, ${data.area && data.area.name}
        </p>
      </div>
    </div>`;

  bodyContent.innerHTML = team;
}

const favTeam = () => {
  insertTeam(teams)
}

const getFavTeams = () => {
  selectFavTeams()
    .then(data => {
      teams = data
      let innerHTML = ''
      if (data.length === 0) {
        innerHTML = '<p>Tidak ada data</p>'
      } else {
        data.forEach(team => {
          innerHTML += `
            <div class="card">
              <div class="card-content">
                <div class="center">
                  <img alt="${team.name}" width="120" height="120" src="${team.crestUrl}">
                </div>
                <a href="${team.website}" target="_blank" rel="noopener noreferrer">
                  <span class="card-title">${team.name} (${team.tla})</span>
                </a>
                <span>Est. ${team.founded}</span>
                <p>
                  ${team.address}, ${team.area?.name}
                </p>
              </div>
              <div class="card-action">
                <a href="#" onclick="deleteTeam(${team.id})" class="blue-text">
                  Delete
                </a>
              </div>
            </div>`;
        })
      }

      bodyContent.innerHTML = innerHTML;
    })
}