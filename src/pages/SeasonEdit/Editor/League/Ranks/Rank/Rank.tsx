import { useMemo } from "react";
import { type Teams } from "../../../../../../data/types";
import styles from "./Rank.module.css";

type RankProps = {
  rank: string[],
  teams: Teams,
  onChange: (newRank: string[]) => void
};

type AliasToId = Record<string, string>;

const Rank = (props: RankProps) => {
  const aliasToId: AliasToId = useMemo(() => {
    return Object.keys(props.teams).reduce((carry: AliasToId, id: string) => {
      const alias = props.teams[id].alias;
      return {
        ...carry,
        [alias]: id
      };
    }, {});
  }, []);

  const onChangeWithinRank = (index: number, newAlias: string) => {
    const newRank = [...props.rank];
    newRank[index] = aliasToId[newAlias] ? aliasToId[newAlias] : newAlias;
    props.onChange(newRank);
  };

  const addTeam = () => {
    const newRank = [...props.rank, ""];
    props.onChange(newRank);
  };
  
  const removeTeam = () => {
    const newRank = props.rank.filter((_: string, index: number) => {
      return index < props.rank.length-1;
    });
    props.onChange(newRank);
  };

  return (
    <>
      {
        props.rank.map((id: string, index: number) => {
          const displayValue = props.teams[id] ? props.teams[id].alias : id;

          return (
            <input
              key={`withinrank-${index}`}
              type={"text"}
              value={displayValue}
              onChange={(e) => onChangeWithinRank(index, e.target.value)}
              placeholder={"Team alias"}
              list={"aliases"}
              className={displayValue === id ? styles.idNotFound : ""}
            />
          )
        })
      }
      <button onClick={addTeam}>+</button>
      <button
        onClick={removeTeam}
        disabled={props.rank.length < 2}>
        -
      </button>
    </>
  );
};

export default Rank;