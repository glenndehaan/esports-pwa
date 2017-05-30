import api from './api/api';
import {loadState, saveState} from './storage';

console.log('PWA working!');

const initialize = () => {
    const apiUri = "https://esports.glenndehaan.com";

    let teams = loadState('teams') || [];
    let matches = loadState('matches') || {};
    let network = navigator.onLine;

    const updateSWData = () => {
        for (let key in matches) {
            if (matches.hasOwnProperty(key)) {
                new api(apiUri + "/api/matches/csgo/" + key + "?extraData=true", processMatchData, key);
            }
        }
    };

    const showPreloader = () => {
        document.querySelector("#preloader").classList.remove("done");
    };

    const hidePreloader = () => {
        document.querySelector("#preloader").classList.add("done");
    };

    const showMatchDetails = (e) => {
        document.querySelector("#details").classList.add("opened");
        document.body.classList.add("no-scroll");
        document.querySelector("#close-match-details").style.display = "block";

        console.log('Match Key:', e.target.dataset.key);
        console.log('Team ID:', e.target.dataset.team);
        console.log('Match Details', matches[e.target.dataset.team][e.target.dataset.key]);

        const id = e.target.dataset.team;
        const gameData = matches[e.target.dataset.team][e.target.dataset.key];
        const container = document.querySelector("#details");
        const matchContainer = document.querySelector("#details #match-details");
        const gameContainer = document.querySelector("#details #game-details");
        let tempContainer = "";

        matchContainer.innerHTML = "";
        gameContainer.innerHTML = "";

        const date = new Date(gameData.start_date);

        matchContainer.innerHTML += `
            <h3>${gameData.competition_label} (${gameData.round_label})</h3>
            ${date.getDate() < 9 ? '0'+date.getDate() : date.getDate()}-${(date.getMonth() + 1) < 9 ? '0'+(date.getMonth() + 1) : date.getMonth()}-${date.getFullYear()}<br/>
            ${gameData.team1_url === "/csgo/teams/" + id ? "<b>" + gameData.team1_data.full_name + ":</b>" : gameData.team1_data.full_name + ":"} ${gameData.team1_score}<br/>
            ${gameData.team2_url === "/csgo/teams/" + id ? "<b>" + gameData.team2_data.full_name + ":</b>" : gameData.team2_data.full_name + ":"} ${gameData.team2_score}
            <hr/>
        `;

        for (let item = 0; item < gameData.game_data.length; item++) {
            console.log('gameData.game_data[item]', gameData.game_data[item]);
            tempContainer += `
                <div class="col s12 m6">
                    <div class="card">
                        <div class="card-image">
                            <img src="images/maps/de-${gameData.game_data[item].map_data.name.toLowerCase()}.png" height="200px">
                            <span class="card-title">Game: ${gameData.game_data[item].game_number}<br/><h6>Map: de_${gameData.game_data[item].map_data.name.toLowerCase()}</h6></span>
                        </div>
                        <div class="card-content">
                            <span>
                              ${gameData.team1_url === "/csgo/teams/" + id ? "<b>" + gameData.team1_data.full_name + "</b>" : gameData.team1_data.full_name} Wins: ${gameData.game_data[item].team1_map_round_wins}<br/>
                              ${gameData.team1_url === "/csgo/teams/" + id ? "<b>" + gameData.team1_data.full_name + "</b>" : gameData.team1_data.full_name} CT Wins: ${gameData.game_data[item].team1_counter_terrorist_map_round_wins}<br/>
                              ${gameData.team1_url === "/csgo/teams/" + id ? "<b>" + gameData.team1_data.full_name + "</b>" : gameData.team1_data.full_name} T Wins: ${gameData.game_data[item].team1_terrorist_map_round_wins}<br/>
                              <br/>
                              ${gameData.team2_url === "/csgo/teams/" + id ? "<b>" + gameData.team2_data.full_name + "</b>" : gameData.team2_data.full_name} Wins: ${gameData.game_data[item].team2_map_round_wins}<br/>
                              ${gameData.team2_url === "/csgo/teams/" + id ? "<b>" + gameData.team2_data.full_name + "</b>" : gameData.team2_data.full_name} CT Wins: ${gameData.game_data[item].team2_counter_terrorist_map_round_wins}<br/>
                              ${gameData.team2_url === "/csgo/teams/" + id ? "<b>" + gameData.team2_data.full_name + "</b>" : gameData.team2_data.full_name} T Wins: ${gameData.game_data[item].team2_terrorist_map_round_wins}<br/>
                            </span>
                            
                            <h5>Player stats:</h5>
                            <table>
                                <thead>
                                    <tr>
                                        <th>${gameData.team1_url === "/csgo/teams/" + id ? "<b>" + gameData.team1_data.full_name + "</b>" : gameData.team1_data.full_name} (K/A/D)</th>
                                        <th>${gameData.team2_url === "/csgo/teams/" + id ? "<b>" + gameData.team2_data.full_name + "</b>" : gameData.team2_data.full_name} (K/A/D)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${gameData.game_data[item].team1_game_player_records[0].player_data.in_game_name}: (${gameData.game_data[item].team1_game_player_records[0].kills}/${gameData.game_data[item].team1_game_player_records[0].assists}/${gameData.game_data[item].team1_game_player_records[0].deaths})</td>
                                        <td>${gameData.game_data[item].team2_game_player_records[0].player_data.in_game_name}: (${gameData.game_data[item].team2_game_player_records[0].kills}/${gameData.game_data[item].team2_game_player_records[0].assists}/${gameData.game_data[item].team2_game_player_records[0].deaths})</td>
                                    </tr>
                                    <tr>
                                        <td>${gameData.game_data[item].team1_game_player_records[1].player_data.in_game_name}: (${gameData.game_data[item].team1_game_player_records[1].kills}/${gameData.game_data[item].team1_game_player_records[1].assists}/${gameData.game_data[item].team1_game_player_records[1].deaths})</td>
                                        <td>${gameData.game_data[item].team2_game_player_records[1].player_data.in_game_name}: (${gameData.game_data[item].team2_game_player_records[1].kills}/${gameData.game_data[item].team2_game_player_records[1].assists}/${gameData.game_data[item].team2_game_player_records[1].deaths})</td>
                                    </tr>
                                    <tr>
                                        <td>${gameData.game_data[item].team1_game_player_records[2].player_data.in_game_name}: (${gameData.game_data[item].team1_game_player_records[2].kills}/${gameData.game_data[item].team1_game_player_records[2].assists}/${gameData.game_data[item].team1_game_player_records[2].deaths})</td>
                                        <td>${gameData.game_data[item].team2_game_player_records[2].player_data.in_game_name}: (${gameData.game_data[item].team2_game_player_records[2].kills}/${gameData.game_data[item].team2_game_player_records[2].assists}/${gameData.game_data[item].team2_game_player_records[2].deaths})</td>
                                    </tr>
                                    <tr>
                                        <td>${gameData.game_data[item].team1_game_player_records[3].player_data.in_game_name}: (${gameData.game_data[item].team1_game_player_records[3].kills}/${gameData.game_data[item].team1_game_player_records[3].assists}/${gameData.game_data[item].team1_game_player_records[3].deaths})</td>
                                        <td>${gameData.game_data[item].team2_game_player_records[3].player_data.in_game_name}: (${gameData.game_data[item].team2_game_player_records[3].kills}/${gameData.game_data[item].team2_game_player_records[3].assists}/${gameData.game_data[item].team2_game_player_records[3].deaths})</td>
                                    </tr>
                                    <tr>
                                        <td>${gameData.game_data[item].team1_game_player_records[4].player_data.in_game_name}: (${gameData.game_data[item].team1_game_player_records[4].kills}/${gameData.game_data[item].team1_game_player_records[4].assists}/${gameData.game_data[item].team1_game_player_records[4].deaths})</td>
                                        <td>${gameData.game_data[item].team2_game_player_records[4].player_data.in_game_name}: (${gameData.game_data[item].team2_game_player_records[4].kills}/${gameData.game_data[item].team2_game_player_records[4].assists}/${gameData.game_data[item].team2_game_player_records[4].deaths})</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            gameContainer.innerHTML = `<div class="row">${tempContainer}</div>`;
        }
    };

    const hideMatchDetails = () => {
        document.querySelector("#details").classList.remove("opened");
        document.body.classList.remove("no-scroll");
        document.querySelector("#close-match-details").style.display = "none";
    };

    const saveItem = (e) => {
        e.target.parentNode.removeEventListener("click", saveItem);

        e.target.innerHTML = "<i class='material-icons green accent-3'>done</i>";

        teams.push(e.target.dataset);
        saveState({teams, matches});

        new api(apiUri + "/api/matches/csgo/" + e.target.dataset.id + "?extraData=true", processMatchData, e.target.dataset.id);
    };

    const removeItem = (e) => {
        teams = teams.filter(function (obj) {
            return obj.id !== e.target.parentNode.parentNode.parentNode.dataset.id;
        });

        saveState({teams, matches});

        e.target.parentNode.removeEventListener("click", removeItem);
        e.target.parentNode.removeEventListener("click", infoItem);

        document.querySelector("#items").removeChild(e.target.parentNode.parentNode.parentNode);
    };

    const infoItem = (e) => {
        const id = e.target.parentNode.parentNode.parentNode.dataset.id;
        const dataset = matches[id];

        const search_btn = document.querySelector('#search-btn');
        const search_btn_hide = document.querySelector('#search-btn-hide');
        search_btn.classList.add("scale-out");
        search_btn_hide.classList.remove("scale-out");

        const container = document.querySelector('#items');
        container.innerHTML = '';

        for (let item = 0; item < dataset.length; item++) {
            if(dataset[item].status !== "pre-match") {
                const date = new Date(dataset[item].start_date);

                container.innerHTML += `
                    <li class="collection-item avatar">
                        <i id="match-details-btn" data-team="${id}" data-key="${item}" class="material-icons circle purple lighten-2">insert_chart</i>
                        <span class="title">${dataset[item].competition_label} (${dataset[item].round_label})</span>
                        <p>
                            ${date.getDate() < 9 ? '0'+date.getDate() : date.getDate()}-${(date.getMonth() + 1) < 9 ? '0'+(date.getMonth() + 1) : date.getMonth()}-${date.getFullYear()}<br/>
                            ${dataset[item].team1_url === "/csgo/teams/" + id ? "<b>" + dataset[item].team1_data.full_name + ":</b>" : dataset[item].team1_data.full_name + ":"} ${dataset[item].team1_score}<br/>
                            ${dataset[item].team2_url === "/csgo/teams/" + id ? "<b>" + dataset[item].team2_data.full_name + ":</b>" : dataset[item].team2_data.full_name + ":"} ${dataset[item].team2_score}
                        </p>
                        
                        ${dataset[item].game_streams.length > 0 && dataset[item].game_streams[0].streams.length > 0 ? 
                        `<a href="${dataset[item].game_streams[0].streams[0].link}" target="_blank" id="video-btn" class="secondary-content btn-floating btn-large waves-effect waves-light purple lighten-2">
                            <i class="material-icons">movie</i>
                        </a>` : '' }
                    </li>
                `
            }
        }

        const stats_buttons = document.querySelectorAll("#match-details-btn");

        for (let item = 0; item < stats_buttons.length; item++) {
            stats_buttons[item].addEventListener("click", showMatchDetails);
        }

        if(dataset.length === 0){
            container.innerHTML += "<li style='text-align: center' class='collection-item'><b>Whoops looks like we didn't find anything.........</b></li>";
        }
    };

    const processMatchData = (data, id) => {
        console.log('matchData', data.matches);
        matches[id] = data.matches;

        saveState({teams, matches});
    };

    const processSwData = (data) => {
        console.log('swData', data);

        const container = document.querySelector('#items');
        container.innerHTML = '';

        for (let row = 0; row < data.length; row++) {
            container.innerHTML += `
            <li data-id="${data[row].id}" class="collection-item avatar">${data[row].logo && data[row].logo !== "false" ?
                `<img src=${data[row].logo} alt="" class="circle">` :
                '<i class="material-icons circle">report_problem</i>'} 
                <span class="title">${data[row].name}</span>
                <p>${data[row].country !== "null" ? data[row].country : ""}</p>
                <div class="secondary-content">
                    <a id="info-btn" class="btn-floating btn-large waves-effect waves-light purple lighten-2">
                        <i class='material-icons purple lighten-2'>info</i>
                    </a>
                    <a id="add-btn" class="btn-floating btn-large waves-effect waves-light purple lighten-2">
                        <i class='material-icons red'>delete</i>
                    </a>
                </div>
             </li>`;
        }

        const add_buttons = document.querySelectorAll("#add-btn");

        for (let item = 0; item < add_buttons.length; item++) {
            add_buttons[item].addEventListener("click", removeItem);
        }

        const info_buttons = document.querySelectorAll("#info-btn");

        for (let item = 0; item < info_buttons.length; item++) {
            info_buttons[item].addEventListener("click", infoItem);
        }
    };

    const processApiData = (data) => {
        console.log('apiData', data);

        hidePreloader();

        const container = document.querySelector('#items');
        container.innerHTML = '';

        for (let row = 0; row < data.teams.length; row++) {
            const exists = teams.some(function (el) {
                return el.id === ''+data.teams[row].id;
            });

            const available = data.teams[row].alternate_logo && data.teams[row].alternate_logo !== null && data.teams[row].alternate_logo.w72xh72 !== null;
            container.innerHTML += `
            <li class="collection-item avatar">${available ?
                    `<img src=${data.teams[row].alternate_logo.w72xh72} alt="" class="circle">` :
                    '<i class="material-icons circle">report_problem</i>'} 
                <span class="title">${data.teams[row].full_name}</span>
                <p>${data.teams[row].country !== "null" && data.teams[row].country !== null && data.teams[row].country !== "" ? data.teams[row].country : ""}</p>
                ${!exists ? `
                <a id="add-btn" class="secondary-content btn-floating btn-large waves-effect waves-light purple lighten-2">
                    <i data-id="${data.teams[row].id}" data-name="${data.teams[row].full_name}" data-country="${data.teams[row].country}" data-logo="${available ? data.teams[row].alternate_logo.w72xh72 : false}" class="material-icons">add</i>
                </a>` : ''}
             </li>`;
        }

        const buttons = document.querySelectorAll("#add-btn");

        for (let item = 0; item < buttons.length; item++) {
            buttons[item].addEventListener("click", saveItem);
        }

        if(data.teams.length === 0){
            container.innerHTML += "<li style='text-align: center' class='collection-item'><b>Whoops looks like we didn't find anything.........</b></li>";
        }
    };

    const openSearch = () => {
        const searchDisplay = document.querySelector("#search-container");
        const container = document.querySelector('#items');
        const search_btn = document.querySelector('#search-btn');
        const search_btn_hide = document.querySelector('#search-btn-hide');

        container.innerHTML = '';
        searchDisplay.style.display = "block";
        search_btn.classList.add("scale-out");
        search_btn_hide.classList.remove("scale-out");
    };

    const closeSearch = () => {
        const searchDisplay = document.querySelector("#search-container");
        const container = document.querySelector('#items');
        const search_btn = document.querySelector('#search-btn');
        const search_btn_hide = document.querySelector('#search-btn-hide');

        container.innerHTML = '';
        if (teams.length > 0) {
            processSwData(teams);
        }
        searchDisplay.style.display = "none";

        if (network) {
            search_btn.classList.remove("scale-out");
        }
        search_btn_hide.classList.add("scale-out");
    };

    const networkStatus = () => {
        const search_btn = document.querySelector('#search-btn');
        network = navigator.onLine;

        if (navigator.onLine) {
            search_btn.classList.remove("scale-out");
        } else {
            search_btn.classList.add("scale-out");
        }
    };

    if (document.querySelector("#submit")) {
        document.querySelector("#submit").addEventListener("click", () => {
            showPreloader();
            new api(apiUri + "/api/teams/csgo/" + document.querySelector("#search").value, processApiData)
        });
    }
    if (document.querySelector("#search")) {
        document.querySelector("#search").addEventListener("keypress", (e) => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                showPreloader();
                new api(apiUri + "/api/teams/csgo/" + document.querySelector("#search").value, processApiData)
            }
        });
    }

    if (document.querySelector("#search-btn")) {
        document.querySelector("#search-btn").addEventListener("click", openSearch);
    }

    if (document.querySelector("#search-btn-hide")) {
        document.querySelector("#search-btn-hide").addEventListener("click", closeSearch);
    }

    if (document.querySelector("#close-match-details")) {
        document.querySelector("#close-match-details").addEventListener("click", hideMatchDetails);
    }

    window.addEventListener('online', networkStatus);
    window.addEventListener('offline', networkStatus);

    if (teams.length > 0) {
        processSwData(teams);
    }

    console.log('matches', matches);

    networkStatus();
    if(network !== false){
        updateSWData();
    }
};

window.addEventListener('load', initialize);
