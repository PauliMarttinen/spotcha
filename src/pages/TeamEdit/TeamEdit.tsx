import { useState } from "react";
import { type DataFormat, type League, type Season, type Team as TeamType, type Name } from "../../data/types";
import Team from "./Team/Team";
import { v7 as uuid } from "uuid";

type TeamEditProps = {
  data: DataFormat,
  onChange: (newData: DataFormat) => void
};

const TeamEdit = (props: TeamEditProps) => {
  const [filter, setFilter] = useState<string>("");

  const onChange = (newTeam: TeamType) => {
    //Prevent typing a duplicate alias
    if (props.data.teams.some((team: TeamType) => team.alias === newTeam.alias && team.id !== newTeam.id))
      return;

    const oldAlias = props.data.teams.find((team: TeamType) => team.id === newTeam.id)!.alias;

    const newSeasons = (() => {
      if (oldAlias === newTeam.alias) return [...props.data.seasons];

      return props.data.seasons.map((season: Season): Season => {
        return {
          ...season,
          leagues: season.leagues.map((league: League): League => {
            return {
              ...league,
              teams: league.teams.map((rank: string[]): string[] => (
                rank.map((alias: string): string => alias === oldAlias ? newTeam.alias : alias)
              ))
            };
          })
        };
      });
    })();

    const newTeams = props.data.teams.map((oldTeam: TeamType) => {
      return newTeam.id === oldTeam.id ? newTeam : oldTeam;
    });

    const newData: DataFormat = {
      seasons: newSeasons,
      teams: newTeams
    };
    props.onChange(newData);
  };

  const addTeam = () => {
    const newTeam: TeamType = {
      alias: "New Team",
      id: uuid(),
      names: [
        {
          id: uuid(),
          name: "",
          fullName: "",
          since: 1,
          note: ""
        }
      ]
    };

    const newTeams = [newTeam, ...props.data.teams];

    const newData = {
      ...props.data,
      teams: newTeams
    };

    props.onChange(newData);
  };

  return (
    <main>
      <header><h1>Team Edit</h1></header>
      <button onClick={addTeam}>
        Add Team
      </button>
      <input
        type={"text"}
        value={filter}
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
        placeholder={"Filter"}
      />
      {
        props.data.teams
          .filter((team: TeamType) => {
            if (filter.trim() === "") return true;

            const lowerCaseAlias = team.alias.toLowerCase();

            if (lowerCaseAlias.indexOf(filter) >= 0) return true;

            return team.names.some((name: Name) => {
              const lowerCaseName = name.name.toLowerCase();
              const lowerCaseFullName = name.fullName.toLowerCase();
              return lowerCaseName.indexOf(filter) >= 0 || lowerCaseFullName.indexOf(filter) >= 0;
            });
          })
          .map((team: TeamType, index: number) => (
          <Team
            key={index}
            team={team}
            onChange={onChange}
          />
        ))
      }
    </main>
  );
};

export default TeamEdit;