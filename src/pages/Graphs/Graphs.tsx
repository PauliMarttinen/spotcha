import { useState } from "react";
import { type DataFormat, type League, type Name, type Season, type Team } from "../../data/types";
import Graph from "./Graph/Graph";
import Tiers from "./Tiers/Tiers";
import Guides from "./Guides/Guides";
import Cancellations from "./Cancellations/Cancellations";
import Box from "./primitives/Box/Box";
import Legend from "./Legend/Legend";
import styles from "./Graphs.module.css";
import { type GraphColor } from "./Graph/Graph";

type GraphsProps = {
  data: DataFormat
};

export type RankRecord = {
  year: number,
  rank: number
};

export const GRAPH_HEIGHT = 450;
export const GRAPH_WIDTH = 750;
export const GRAPH_MARGIN = 50;

const Graphs = (props: GraphsProps) => {
  if (props.data.seasons.length === 0) return <>No seasons in data.</>;

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedNameIds, setSelectedNameIds] = useState<string[]>([]);
  const [dashedIds, setDashedIds] = useState<string[]>([]);
  const [graphColors, setGraphColors] = useState<GraphColor>({});

  const teamIds = Object.keys(props.data.teams);

  const onChangeTeamIds = (value: string) => {
    if (selectedTeamIds.indexOf(value) >= 0)
    {
      setSelectedTeamIds(selectedTeamIds.filter((selectedValue: string) => selectedValue !== value));
      return;
    }

    setSelectedTeamIds([...selectedTeamIds, value]);
  };

  const onChangeNameIds = (value: string) => {
    if (selectedNameIds.indexOf(value) >= 0)
    {
      setSelectedNameIds(selectedNameIds.filter((selectedValue: string) => selectedValue !== value));
      return;
    }

    setSelectedNameIds([...selectedNameIds, value]);
  };

  const onChangeDashedIds = (value: string) => {
    if (dashedIds.indexOf(value) >= 0)
    {
      setDashedIds(dashedIds.filter((selectedValue: string) => selectedValue !== value));
      return;
    }

    setDashedIds([...dashedIds, value]);
  };

  const onChangeColor = (id: string, newColor: string) => {
    setGraphColors({
      ...graphColors,
      [id]: newColor
    });
  };

  const getAliasFromId = (id: string) => {
    const alias = props.data.teams[id].alias;
    if (!alias) throw new Error(`No team has id '${id}`);
    return alias;
  };

  const getTeamFromNameId = (nameId: string) => {
    const teamId = teamIds.find((teamId: string) => {
      return props.data.teams[teamId].names.some((name: Name) => name.id === nameId);
    });

    if (!teamId) throw new Error(`No team with name id '${nameId}`);

    return teamId;
  };

  const getRanksForTeam = (id: string): RankRecord[] => {
    return props.data.seasons.map((season: Season) => {
      if (season.cancelled) return {
        year: season.year,
        rank: 0
      };

      const leagueOfTeam = season.leagues.find((league: League) => {
        return league.teams.flat().indexOf(id) !== -1;
      });

      if (!leagueOfTeam) return {
        year: season.year,
        rank: 0
      };

      const tierOfTeam = leagueOfTeam.tier;

      const higherTierTotalTeamCount = Array(tierOfTeam-1).fill(0).map((_: number, index: number) => {
        const tier = index+1;
        const leaguesOfThisTier = season.leagues.filter((league: League) => league.tier === tier);
        const biggestLeagueOfThisTier = leaguesOfThisTier.reduce((teamCount: number, currentLeague: League) => {
          const numberOfTeams = currentLeague.teams.flat().length;
          return numberOfTeams > teamCount ? numberOfTeams : teamCount;
        }, 0);
        return biggestLeagueOfThisTier;
      }).reduce((subTotal: number, current: number) => subTotal+current, 0);

      const rankInLeague = leagueOfTeam.teams.reduce((carry: number, rank: string[]) => {
        const teamOnRank = rank.indexOf(id) !== -1;
        if (teamOnRank) return -carry+1;
        if (carry > 0) return carry;
        return carry-rank.length;
      }, 0);

      const overallRank = higherTierTotalTeamCount + rankInLeague;

      return {
        year: season.year,
        rank: overallRank
      };
    });
  };

  const getRanksForName = (id: string): RankRecord[] => {
    const teamId = getTeamFromNameId(id);
    const namesSorted = props.data.teams[teamId].names.sort((nameA: Name, nameB: Name) => nameA.since - nameB.since);
    const nameIndex = namesSorted.findIndex((name: Name) => name.id === id);
    if (nameIndex === -1) throw new Error(`No name exists with id '${id}'`);

    const ranksForTeam = getRanksForTeam(teamId);
    const nameSince = namesSorted[nameIndex].since;
    const nameUntil = nameIndex === namesSorted.length-1 ? Infinity : namesSorted[nameIndex+1].since-1;

    return ranksForTeam.map((record: RankRecord) => {
      if (record.year < nameSince || nameUntil < record.year) return {
        year: record.year,
        rank: 0
      };

      return record;
    });
  };

  const teamCount = props.data.seasons.reduce((subSeason: number, season: Season) => {
    const tierCountThisSeason = season.leagues.reduce((subTiers: number, league: League) => {
      if (league.tier > subTiers) return league.tier;
      return subTiers;
    }, 0);

    const teamCountThisSeason = Array(tierCountThisSeason).fill(0).reduce((subLeague: number, league: League, index: number) => {
      const tier = index+1;
      const leaguesOfThisTier = season.leagues.filter((filterLeague: League) => filterLeague.tier === tier);
      const biggestLeagueOfThisTier = leaguesOfThisTier.reduce((subTier: number, currentLeague: League) => {
        const numberOfTeams = currentLeague.teams.flat().length;
        return numberOfTeams > subTier ? numberOfTeams : subTier;
      }, 0);

      return subLeague + biggestLeagueOfThisTier;
    }, 0);

    return teamCountThisSeason > subSeason ? teamCountThisSeason : subSeason;
  }, 0);

  return (
    <div>
      <header><h1>Graphs</h1></header>
      <ul>
        {
          teamIds.map((id: string) => {
            const team = props.data.teams[id];
            return (
              <li key={`checkbox-${team.id}`}>
                <input
                  type={"checkbox"}
                  checked={selectedTeamIds.indexOf(team.id) >= 0}
                  id={team.id}
                  onChange={() => onChangeTeamIds(team.id)}
                />
                <label htmlFor={team.id}>{team.alias}</label>
                <span className={styles.spacer}/>
                <input
                  type={"checkbox"}
                  checked={dashedIds.indexOf(team.id) >= 0}
                  id={`dashed-${team.id}`}
                  onChange={() => onChangeDashedIds(team.id)}
                />
                <label htmlFor={`dashed-${team.id}`}>dashed</label>
                <span className={styles.spacer}/>
                <input
                  type={"text"}
                  value={graphColors[team.id]}
                  onChange={(e) => onChangeColor(team.id, e.target.value)}
                  placeholder={"Color"}
                />
                {
                  team.names.length > 1 &&
                  <ul>
                    {
                      team.names.map((name: Name) => (
                        <li>
                          <input
                            type={"checkbox"}
                            checked={selectedNameIds.indexOf(name.id) >= 0}
                            id={name.id}
                            onChange={() => onChangeNameIds(name.id)}
                          />
                          <label htmlFor={name.id}>{name.fullName}</label>
                          <span className={styles.spacer}/>
                          <input
                            type={"checkbox"}
                            checked={dashedIds.indexOf(name.id) >= 0}
                            id={`dashed-${name.id}`}
                            onChange={() => onChangeDashedIds(name.id)}
                          />
                          <label htmlFor={`dashed-${name.id}`}>dashed</label>
                          <span className={styles.spacer}/>
                          <input
                            type={"text"}
                            value={graphColors[name.id]}
                            onChange={(e) => onChangeColor(name.id, e.target.value)}
                            placeholder={"Color"}
                          />
                        </li>
                      ))
                    }
                  </ul>
                }
              </li>
            )
          })
        }
      </ul>
      <Box
        top={GRAPH_MARGIN}
        right={GRAPH_MARGIN}
        bottom={GRAPH_MARGIN}
        left={GRAPH_MARGIN}
        fill={"white"}
      />
      <div>
        <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} xmlns={"http://www.w3.org/2000/svg"} stroke={"red"} fill={"grey"}>
          <style>
            text {"{"}
              font-family: "Arial";
              font-weight: bold;
            {"}"}
          </style>
          <Tiers
            seasons={props.data.seasons}
            teamCount={teamCount}
          />
          <Guides
            seasons={props.data.seasons}
            teamCount={teamCount}
          />
          <Cancellations
            seasons={props.data.seasons}
            teamCount={teamCount}
          />
          {
            selectedTeamIds.map((id: string) => (
              <Graph
                key={`graph-${id}`}
                displayName={getAliasFromId(id)}
                teamCount={teamCount}
                record={getRanksForTeam(id)}
                dashed={dashedIds.indexOf(id) >= 0}
                color={graphColors[id] ?? "blue"}
              />
            ))
          }
          {
            selectedNameIds.map((id: string) => (
              <Graph
                key={`graph-${id}`}
                displayName={"prööt"}
                teamCount={teamCount}
                record={getRanksForName(id)}
                dashed={dashedIds.indexOf(id) >= 0}
                color={graphColors[id] ?? "blue"}
              />
            ))
          }
          <path
            fill={"none"}
            stroke={"black"}
            d={`M ${GRAPH_MARGIN},${GRAPH_MARGIN} L ${GRAPH_MARGIN},${GRAPH_HEIGHT-GRAPH_MARGIN} L ${GRAPH_WIDTH-GRAPH_MARGIN},${GRAPH_HEIGHT-GRAPH_MARGIN}`}
          />
          <Legend
            data={props.data}
            selectedTeamIds={selectedTeamIds}
            selectedNameIds={selectedNameIds}
            dashedIds={dashedIds}
            graphColors={graphColors}
          />
        </svg>
      </div>
    </div>
  )
};

export default Graphs;