import { type League as LeagueType } from "../../../../data/types";
import styles from "./League.module.css";
import Ranks from "./Ranks/Ranks";

type LeagueProps = {
  league: LeagueType
  onChange: (newLeague: LeagueType) => void
};

const League = (props: LeagueProps) => {
  const onChangeName = (newName: string) => {
    const newLeague: LeagueType = {
      ...props.league,
      name: newName
    };

    props.onChange(newLeague);
  };

  const onChangeTier = (newTier: number) => {
    const newLeague: LeagueType = {
      ...props.league,
      tier: newTier
    };

    props.onChange(newLeague);
  };

  const onChangeRanks = (newRanks: string[][]) => {
    const newLeague: LeagueType = {
      ...props.league,
      teams: newRanks
    };

    props.onChange(newLeague);
  };

  const addRank = () => {
    const newRanks: string[][] = [...props.league.teams, []];
    const newLeague: LeagueType = {
      ...props.league,
      teams: newRanks
    };
    props.onChange(newLeague);
  };

  const removeRank = () => {
    const newRanks: string[][] = props.league.teams.filter((_: string[], index: number) => {
      return index < props.league.teams.length-1;
    });
    const newLeague: LeagueType = {
      ...props.league,
      teams: newRanks
    };
    props.onChange(newLeague);
  };

  return (
    <div>
      <input
        type={"text"}
        placeholder={"League name"}
        value={props.league.name}
        onChange={(e) => onChangeName(e.target.value)}
        className={styles.leagueTitle}
      />
      <input
        type={"number"}
        placeholder={"League tier"}
        value={props.league.tier}
        onChange={(e) => onChangeTier(Number(e.target.value))}
        className={styles.leagueTier}
      />
      <Ranks
        ranks={props.league.teams}
        onChange={onChangeRanks}
      />
      <button onClick={addRank}>Add rank</button>
      <button
        onClick={removeRank}
        disabled={props.league.teams.length < 2}>
        Remove rank
      </button>
    </div>
  );
};

export default League;