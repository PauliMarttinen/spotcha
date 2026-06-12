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
  
  const teamIds = Object.keys(props.data.teams);

  const onChange = (newTeam: TeamType) => {
    //Prevent typing a duplicate alias
    const isDuplicate = teamIds.some((id: string) => {
      const oldTeam = props.data.teams[id];
      return oldTeam.alias === newTeam.alias && oldTeam.id !== newTeam.id
    });

    if (isDuplicate) return;

    const updatedTeams = {
      ...props.data.teams,
      [newTeam.id]: newTeam
    };

    const newData: DataFormat = {
      ...props.data,
      teams: updatedTeams
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

    const updatedTeams = {
      ...props.data.teams,
      [newTeam.id]: newTeam
    };

    const newData = {
      ...props.data,
      teams: updatedTeams
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
        teamIds.filter((id: string) => {
          const team = props.data.teams[id];
          if (filter.trim() === "") return true;

          const lowerCaseAlias = team.alias.toLowerCase();

          if (lowerCaseAlias.indexOf(filter) >= 0) return true;

          return team.names.some((name: Name) => {
            const lowerCaseName = name.name.toLowerCase();
            const lowerCaseFullName = name.fullName.toLowerCase();
            return lowerCaseName.indexOf(filter) >= 0 || lowerCaseFullName.indexOf(filter) >= 0;
          });
        })
        .map((id: string) => {
          const team = props.data.teams[id];

          return (
            <Team
              key={id}
              team={team}
              onChange={onChange}
            />
          )
        })
      }
    </main>
  );
};

export default TeamEdit;