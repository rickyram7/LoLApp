import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [matchIDs, setMatchIDs] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [winningTeam, setWinningTeam] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const[playerRank, setPlayerRank] = useState([]);
  


  const API_KEY = "RGAPI-7f12b03e-9d8a-4705-b834-c852d8f98e02";



  useEffect(() => {
    if (matchIDs.length > 0) {
      searchMatchInfo(matchIDs[currentMatchIndex]);
    }
  }, [matchIDs, currentMatchIndex]);

  function searchRank(summonerID) {
    // Set up the API call
    var APICallString = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerID + "?api_key=" + API_KEY;
    
    // Handle the API call
    axios.get(APICallString).then(function (response) {
      console.log(response.data);
      setPlayerRank(response.data[0]);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function searchForPlayer(event) {
    // Set up the API call
    var APICallString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;

    // Handle the API call
    axios.get(APICallString).then(function (response) {
      console.log(response.data);
      setPlayerData(response.data);
      searchMatchIDs(response.data.puuid);
      searchRank(response.data.id);
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
      setCurrentMatchIndex(0);
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
      setWinningTeam(response.data.info.teams);
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
  function handleNextMatch() {
    setCurrentMatchIndex(prevIndex => prevIndex + 1);
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className='white-color'>League of Legends Search</h1>
        <input type="text" onChange={e => setSearchText(e.target.value)} />
        <button onClick={e => searchForPlayer(e)}>Search for Summoner</button>
      </div>

      {JSON.stringify(playerData) !== '{}' ? <>
        <p className='white-color'>{playerData.name}</p>
        <img width='250' height='250' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/' + playerData.profileIconId + '.png'} alt="Summoner Icon Unavailable"></img>
        <h3 className='white-color'>Summoner level: {playerData.summonerLevel}</h3>
      </>
        :
        <p>No player Data</p>
      }
      
      {participantsData.length > 0 ? (
        <div>
          <h1 className='white-color'>Match History</h1>
          <h2 className='white-color'>Winning Team: {winningTeam[0].win === "Win" ? "Team 2" : "Team 1"}</h2>
          {Object.entries(groupParticipantsByTeam(participantsData)).map(([team, participants]) => (
            <div key={team}>
              <h1 className='white-color'>{team}</h1>
              {participants.map((participant, index) => (
                <div key={index}>
                  <h2 className='white-color'>Summoner Name: {participant.summonerName}</h2>
                  <img width='200' height='200' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/' + participant.profileIcon + '.png'} alt="Icon Unavailable"></img>
                  <h3 className='white-color'>{playerRank.tier} {playerRank.rank} {playerRank.leaguePoints} LP</h3>
                  <h3 className='white-color'>W/L: {playerRank.wins}-{playerRank.losses}</h3>
                  
                  <h3 className='white-color'> Position: {participant.individualPosition} </h3>
                  <h2 className='white-color'>Champion: {participant.championName} </h2>
                  <img width='150' height='150' src={'http://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/' + participant.championName + '.png'} alt="Champion Unavailable"></img>
                  <h3 className='white-color'> Level: {participant.champLevel} </h3>
                  <h3 className='white-color'>Kills: {participant.kills} </h3>
                  <h3 className='white-color'>Deaths: {participant.deaths} </h3>
                  <h3 className='white-color'>Assists: {participant.assists} </h3>
                  <h3 className='white-color'>Gold Earned: {participant.goldEarned} </h3>
                  <h3 className='white-color'> Creep Score: {participant.totalMinionsKilled} </h3>
                  <h3 className='white-color'> Vision Score: {participant.visionScore} </h3>
                  <h3 className='white-color'> Total Damage to Enemy Champions: {participant.totalDamageDealtToChampions} </h3>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item0 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item1 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item2 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item3 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item4 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item5 + '.png'} alt="Items"></img>
                  <img width='75' height='75' src={'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/' + participant.item6 + '.png'}></img>
                  <p>.</p>
                  <p> .   </p>
                </div>

              ))}
            </div>
          ))}
          {currentMatchIndex < matchIDs.length - 1 && (
            <button onClick={handleNextMatch}>Next Match</button>
          )}
        </div>
      ) : (
        <p>No participants data available</p>
      )}
    </div>
  );
}

export default App;