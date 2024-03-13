import React, {useState} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({}); 
  const API_KEY = "RGAPI-b7a5a49b-ec0c-409a-8d1d-378dd458454c";

  function searchForPlayer(event){
    //set up the api call
    var APICallString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;

    //handle the api call
    axios.get(APICallString).then(function(response){
      console.log(response.data);
      setPlayerData(response.data);
    }
    ).catch(function(error){
      console.log(error);
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h5>League Summoner Search</h5>
        <input type="text" onChange={e => setSearchText(e.target.value)}/>
        <button onClick={e => searchForPlayer(e)}>Search for Summoner</button>
        
    </div>
      {JSON.stringify(playerData) != '{}' ? <>
      <p>{playerData.name}</p> 
      <img width='100' height='100' src={'http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/' + playerData.profileIconId + '.png'}></img>
      <p>Summoner level {playerData.summonerLevel}</p>
      </> 
      : 
      <p>No player Data</p>
      
      }
    
  </div>
  );
}

export default App;
