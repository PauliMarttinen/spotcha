import { type Season, type League as LeagueType, type Teams } from "../../../data/types"
import League from "./League/League";
import { v7 as uuid } from "uuid";

type EditorProps = {
  season: Season,
  teams: Teams,
  onChange: (newSeason: Season) => void
};

const Editor = (props: EditorProps) => {
  const addLeague = () => {
    const newLeague: LeagueType = {
      id: uuid(),
      name: "",
      tier: 1,
      teams: []
    };

    const newLeagues: LeagueType[] = [
      ...props.season.leagues,
      newLeague
    ];

    const newSeason: Season = {
      ...props.season,
      leagues: newLeagues
    };

    props.onChange(newSeason);
  };

  const onChange = (newLeague: LeagueType) => {
    const newLeagues: LeagueType[] = props.season.leagues.map((oldLeague: LeagueType) => {
      return newLeague.id === oldLeague.id ? newLeague : oldLeague;
    });

    const newSeason: Season = {
      ...props.season,
      leagues: newLeagues
    }

    props.onChange(newSeason);
  };

  const onChangeCancelled = () => {
    const newCancelled = !props.season.cancelled;

    const newSeason: Season = {
      ...props.season,
      cancelled: newCancelled
    };

    props.onChange(newSeason);
  };

  const onChangeCancelReason = (newReason: string) => {
    const newSeason: Season = {
      ...props.season,
      cancelReason: newReason
    };

    props.onChange(newSeason);
  };

  return (
    <div>
      <header><h2>{props.season.year}</h2></header>
      <div>
        <button onClick={addLeague}>
          Add league
        </button>
      </div>
      <div>
        <input
          id={"cancelled"}
          type={"checkbox"}
          onChange={onChangeCancelled}
          checked={props.season.cancelled}
        />
        <label htmlFor={"cancelled"}>
          Cancelled
        </label>
        <input
          type={"text"}
          disabled={!props.season.cancelled}
          onChange={(e) => onChangeCancelReason(e.target.value)}
          value={props.season.cancelReason}
        />
      </div>
      {
        props.season.leagues.map((league: LeagueType, index: number) => (
          <League
            teams={props.teams}
            key={`league-${index}`}
            league={league}
            onChange={onChange}
          />
        ))
      }
    </div>
  );
};

export default Editor;