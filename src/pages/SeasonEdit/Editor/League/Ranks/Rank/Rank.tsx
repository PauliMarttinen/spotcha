type RankProps = {
  rank: string[],
  onChange: (newRank: string[]) => void
};

const Rank = (props: RankProps) => {
  const onChangeWithinRank = (index: number, newTeam: string) => {
    const newRank = [...props.rank];
    newRank[index] = newTeam;
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
        props.rank.map((team: string, index: number) => {
          return (
            <input
              key={`withinrank-${index}`}
              type={"text"}
              value={team}
              onChange={(e) => onChangeWithinRank(index, e.target.value)}
              placeholder={"Team alias"}
              list={"aliases"}
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