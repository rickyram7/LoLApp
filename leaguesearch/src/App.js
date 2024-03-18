import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [matchIDs, setMatchIDs] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [winningTeam, setWinningTeam] = useState(null);

  const API_KEY = "RGAPI-4f4f79ac-8e2f-4401-8ee5-86f2a627cea4";

  useEffect(() => {
    if (matchIDs.length > 0) {
      const latestMatchID = matchIDs[0];
      searchMatchInfo(latestMatchID);
    }
  }, [matchIDs]);

  function searchForPlayer(event) {
    // Set up the API call
    var APICallString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;

    // Handle the API call
    axios.get(APICallString).then(function (response) {
      console.log(response.data);
      setPlayerData(response.data);
      searchMatchIDs(response.data.puuid);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function searchMatchIDs(puuid) {
    // Set up the API call
    var APICallString = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids" + "?api_key=" + API_KEY;

    // Handle the API call
    axios.get(APICallString).then(function (response) {
      console.log(response.data);
      setMatchIDs(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function searchMatchInfo(matchID) {
    // Set up the API call
    var APICallString = "https://americas.api.riotgames.com/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY;

    // Handle the API call
    axios.get(APICallString).then(function (response) {
      console.log(response.data);
      setParticipantsData(response.data.info.participants);
      setWinningTeam(response.data.info.teams.find(team => team.win === "Win").teamId);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function groupParticipantsByTeam(participants) {
    const teams = {
      "Team 1": [],
      "Team 2": []
    };

    participants.forEach(participant => {
      const team = participant.teamId === 100 ? "Team 1" : "Team 2";
      teams[team].push(participant);
      
    });

    return teams;
  }

  return (
    <div className="App">
      <div className="container">
        <h1>League Summoner Search</h1>
        <input type="text" onChange={e => setSearchText(e.target.value)} />
        <button onClick={e => searchForPlayer(e)}>Search for Summoner</button>
      </div>

      {JSON.stringify(playerData) !== '{}' ? <>
        <p>{playerData.name}</p>
        <img width='250' height='250' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/' + playerData.profileIconId + '.png'} alt="Summoner Icon Unavailable"></img>
        <p>Summoner level {playerData.summonerLevel}</p>
      </>
        :
        <p>No player Data</p>
      }
      {winningTeam !== null && (
        <div>
          <h1>{winningTeam === 100 ? 'Team 1 Victory' : 'Team 2 Victory'}</h1>
        </div>
      )}
      {participantsData.length > 0 ? (
        <div>
          <h1>Recent Match</h1>
          {Object.entries(groupParticipantsByTeam(participantsData)).map(([team, participants]) => (
            <div key={team}>
              <h1>{team}</h1>
              {participants.map((participant, index) => (
                <div key={index}>
                  <h1>Summoner Name: {participant.summonerName}</h1>
                  <img width='200' height='200' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/' + participant.profileIcon + '.png'} alt="Icon Unavailable"></img>
                  <h4>Champion: {participant.championName} </h4>
                  <img width='100' height='100' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/' + participant.championName + '.png'} alt="Champion Unavailable"></img>
                  <p>Level: {participant.champLevel} </p>
                  <p>Kills: {participant.kills} </p>
                  <p>Deaths: {participant.deaths} </p>
                  <p>Assists: {participant.assists} </p>
                  <p>Gold Earned: {participant.goldEarned} </p>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item0 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item1 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item2 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item3 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item4 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item5 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/' + participant.item6 + '.png'}></img>
                  <p> Rank: </p>
                  <img width='75' height='75' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/rank' + participant.rank + '.png'} alt="Rank"></img>
                  
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No participants data available</p>
      )}

    </div>
  );
}

export default App;
