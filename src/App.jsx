import { useEffect, useState } from "react";
import "./App.css";
import data from "./matches-data.json";
import remaingData from "./remaining-matches.json";
import { FaGithub } from "react-icons/fa6";

function App() {
  const [teamData, setTeamData] = useState([]);
  const [remaingingMatchesData, setRemainingMatchesData] = useState([]);
  const [selectedScenarios, setSelecetedScenarios] = useState([]);

  useEffect(() => {
    const sortedTeamData = [...data];
    sortedTeamData.sort((a, b) => {
      if (a.points === b.points) {
        return parseFloat(b.nrr) - parseFloat(a.nrr);
      }
      return b.points - a.points;
    });
    setTeamData(sortedTeamData);
  }, []);

  const sortTable = () => {
    const sortedTeamData = [...teamData];
    console.log(sortedTeamData);
    sortedTeamData.sort((a, b) => {
      if (a.points === b.points) {
        return parseFloat(b.nrr) - parseFloat(a.nrr);
      }
      return b.points - a.points;
    });
    setTeamData(sortedTeamData);
  };

  useEffect(() => {
    setRemainingMatchesData(remaingData);
  }, []);

  const onTeamSelected = (match, team) => {
    const matchIndex = remaingingMatchesData.indexOf(match);
    let selectedMatch;
    if (matchIndex !== -1) {
      selectedMatch = remaingingMatchesData[matchIndex];
    }

    const team1 = selectedMatch.team1;
    const team2 = selectedMatch.team2;
    const winningTeam = team === 1 ? team1 : team2;
    const loosingTeam = team === 1 ? team2 : team1;
    const winningTeamObj = teamData.find(
      (team) => team.team_name === winningTeam
    );
    const loosingTeamObj = teamData.find(
      (team) => team.team_name === loosingTeam
    );
    if (selectedMatch.win === "") {
      const winningTeamIndex = teamData.indexOf(winningTeamObj);
      winningTeamObj.played += 1;
      winningTeamObj.won += 1;
      winningTeamObj.points += 2;

      teamData[winningTeamIndex] = winningTeamObj;

      const loosingTeamIndex = teamData.indexOf(loosingTeamObj);
      loosingTeamObj.played += 1;
      loosingTeamObj.lost += 1;

      teamData[loosingTeamIndex] = loosingTeamObj;

      const updatedTeamData = [...teamData];
      setTeamData(updatedTeamData);
    } else if (selectedMatch.win !== winningTeam) {
      const winningTeamIndex = teamData.indexOf(winningTeamObj);
      winningTeamObj.won += 1;
      winningTeamObj.points += 2;
      winningTeamObj.lost -= 1;

      teamData[winningTeamIndex] = winningTeamObj;

      const loosingTeamIndex = teamData.indexOf(loosingTeamObj);
      loosingTeamObj.lost += 1;
      loosingTeamObj.won -= 1;
      loosingTeamObj.points -= 2;

      teamData[loosingTeamIndex] = loosingTeamObj;

      const updatedTeamData = [...teamData];

      setTeamData(updatedTeamData);
    }

    selectedMatch.win = winningTeam;
    remaingingMatchesData[matchIndex] = selectedMatch;
    const updatedRemainingMatch = [...remaingingMatchesData];
    setSelecetedScenarios([
      ...selectedScenarios,
      { match: match, team: winningTeam },
    ]);
    console.log(selectedScenarios, "hi");
    setRemainingMatchesData(updatedRemainingMatch);
    sortTable();
  };

  const checkStyle = (match, team1) => {
    const matchFound = selectedScenarios.find(
      (sc) => sc.match.number === match.number
    );
    console.log(matchFound);
    if (matchFound && matchFound.match.win === team1) {
      return true;
    } else {
      return false;
    }
    console.log(matchFound, "hi");
  };
  return (
    <div className="bg-gray-700">
      <div className="flex-col lg:px-60">
        <div className="text-center py-4 text-2xl text-white font-semibold">
          IPL Points Table Calculator
        </div>
        <div className="flex justify-between mb-[10px] px-[10px] py-[10px] text-white">
          <div className="w-full text-center">No.</div>
          <div className="w-full text-center">Team</div>
          <div className="w-full text-center">Played</div>
          <div className="w-full text-center">Won</div>
          <div className="w-full text-center">Lost</div>
          <div className="w-full text-center">Points</div>
          <div className="w-full text-center">NRR</div>
        </div>
        {teamData &&
          teamData.map((team, index) => {
            return (
              <div className="flex justify-between m-[10px] px-[10px] py-[10px] border-2 rounded-lg bg-slate-600 text-white">
                <div className="w-full text-center">{index + 1}</div>
                <div className="w-full text-center">{team.team_name}</div>
                <div className="w-full text-center">{team.played}</div>
                <div className="w-full text-center">{team.won}</div>
                <div className="w-full text-center">{team.lost}</div>
                <div className="w-full text-center">{team.points}</div>
                <div className="w-full text-center">{team.nrr}</div>
              </div>
            );
          })}
      </div>
      <div className="flex-col justify-center mt-10 pb-20">
        <div className="text-center text-white font-semibold text-2xl">
          Remaining Matches
        </div>
        <div className="text-center text-white font-semibold mt-2 ">
          Select the teams which should win
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mt-8">
          {remaingingMatchesData.map((match) => {
            return (
              <div
                className="flex-col items-center rounded-lg justify-center bg-slate-600 mx-10 lg:mx-24 px-14 py-4"
                key={match.number}
              >
                <div className="flex justify-center mb-3 text-white">
                  Match {match.number}
                </div>
                <div className="flex justify-center gap-4">
                  <span
                    className="bg-white py-2 px-6 rounded-md cursor-pointer"
                    style={{
                      backgroundColor: checkStyle(match, match.team1)
                        ? "blue"
                        : "white",
                      color: checkStyle(match, match.team1) ? "white" : "black",
                    }}
                    onClick={() => onTeamSelected(match, 1)}
                  >
                    {match.team1}
                  </span>

                  <span
                    className="bg-white py-2 px-6 rounded-md cursor-pointer"
                    style={{
                      backgroundColor: checkStyle(match, match.team2)
                        ? "blue"
                        : "white",
                      color: checkStyle(match, match.team2) ? "white" : "black",
                    }}
                    onClick={() => onTeamSelected(match, 2)}
                  >
                    {match.team2}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" justify-center w-full  bottom-0 text-white flex items-center">
        <span>Built by a RCB fan and a Software Developer with ❤️ and 😭 </span>
      </div>
      <div className="flex items-center justify-center text-white pb-4">
        <a href="https://github.com/dwijjoshi" className="ml-1 underline">
          Dwij Joshi
        </a>
        <a href="https://github.com/dwijjoshi" className="ml-2">
          <FaGithub className="text-xl" />
        </a>
      </div>
    </div>
  );
}

export default App;
