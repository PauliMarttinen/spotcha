import Rank from "./Rank/Rank";

type RanksProps = {
  ranks: string[][]
  onChange: (newRanks: string[][]) => void
};

const Ranks = (props: RanksProps) => {
  const onChange = (index: number, newRank: string[]) => {
    const newRanks = props.ranks.map((oldRank: string[], mapIndex: number) => {
      if (mapIndex === index) return newRank;
      return oldRank;
    });
    props.onChange(newRanks);
  };

  return (
    <ol>
      {
        props.ranks.map((rank: string[], index: number) => {
          return (
            <li key={`rank-${index}`}>
              <Rank
                rank={rank}
                onChange={(newRank: string[]) => onChange(index, newRank)}
              />
            </li>
          )
        })
      }
    </ol>
  );
};

export default Ranks;