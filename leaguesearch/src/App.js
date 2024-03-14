import React, {useState} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({}); 
  const [searchText2, setSearchText2] = useState("");
  const [playerData2, setPlayerData2] = useState({});
  const [searchText3, setSearchText3] = useState("");
  const [playerData3, setPlayerData3] = useState({});

  const API_KEY = "RGAPI-382d100f-6df7-48f3-9834-c940cf46450e";

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
  function searchMatchIDs(event){
    //set up the api call
    var APICallString = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + searchText2 +"/ids" + "?api_key=" + API_KEY;

    //handle the api call
    axios.get(APICallString).then(function(response){
      console.log(response.data);
      setPlayerData2(response.data);
    }
    ).catch(function(error){
      console.log(error);
    });
  }
  function searchMatchInfo(event){
    //set up the api call
    var APICallString = "https://americas.api.riotgames.com/lol/match/v5/matches/" + searchText3 + "?api_key=" + API_KEY;

    //handle the api call
    axios.get(APICallString).then(function(response){
      console.log(response.data);
      setPlayerData3(response.data);
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
        <input type="text" onChange={e => setSearchText2(e.target.value)}/>
        <button onClick={e => searchMatchIDs(e)}>Search match IDS by PUUID: </button>
        <input type="text" onChange={e => setSearchText3(e.target.value)}/>
        <button onClick={e => searchMatchInfo(e)}>Search for Match Information by Match ID</button>
        
    </div>
    
      {JSON.stringify(playerData) != '{}' ? <>
      <p>{playerData.name}</p> 
      <img width='250' height='250' src={'http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/' + playerData.profileIconId + '.png'}></img>
      <p>Summoner level {playerData.summonerLevel}</p>
      <p>PUUID:{playerData.puuid}</p>
      
      </> 
      : 
      <p>No player Data</p>
      }
        
        {JSON.stringify(playerData2) != '{}' ? <>
        <p>Match IDS: {playerData2}</p>
      </> 
      : 
      <p> Match IDS</p>
      
      }
        {JSON.stringify(playerData3) != '{}' ? <>
        <p>Game Duration: {playerData3.info.gameDuration} </p>
      </>
      :
      <p> Match Info</p>
      
      
      }

  </div>
    
  );
}

export default App;
