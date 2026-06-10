import { Fragment, useState } from "react";
import { GRAPH_HEIGHT, GRAPH_MARGIN, GRAPH_WIDTH } from "../Graphs";
import { type League, type Season } from "../../../data/types"
import { resize } from "../../../utils/resize";
import Box from "../primitives/Box/Box";
import { getWidthOfYear } from "../utils/getWidthOfYear";

type TiersProps = {
  seasons: Season[],
  teamCount: number
};

type TierColumn = {
  top: number,
  bottom: number
};

type TierColumnStack = {
  year: number,
  tierColumns: TierColumn[]
};

const Tiers = (props: TiersProps) => {
  const [hoverYear, setHoverYear] = useState<number|null>(null);
  const firstYear = props.seasons[0].year;
  const lastYear = props.seasons[props.seasons.length-1].year+1;

  const firstX = GRAPH_MARGIN;
  const lastX = GRAPH_WIDTH-GRAPH_MARGIN;

  const firstY = GRAPH_MARGIN;
  const lastY = GRAPH_HEIGHT-GRAPH_MARGIN;
  const yearWidth = getWidthOfYear(firstYear, lastYear, firstX, lastX);

  const colors = ["#ddd", "#bbb"];

  const tierColumnStacks: TierColumnStack[] = props.seasons.map((season: Season) => {
    if (season.cancelled) return {
      year: season.year,
      tierColumns: []
    };

    const tierCount = season.leagues.reduce((lowest: number, league: League) => league.tier > lowest ? league.tier : lowest, 0);
    const columnsThisSeasonTopZero: TierColumn[] = Array(tierCount).fill(0).map((_: number, index: number) => {
      const tier = index+1;
      const leaguesOfThisTier = season.leagues.filter((league: League) => league.tier === tier);
      //Take teamcount to be the number of teams in the biggest league of this tier
      const teamCount = leaguesOfThisTier.reduce((biggestCount: number, league: League) => {
        const flatTeamCount = league.teams.flat().length;
        return flatTeamCount > biggestCount ? flatTeamCount : biggestCount;
      }, 0);

      return {
        top: 0,
        bottom: teamCount
      };
    });

    const columnsThisSeasonTopAdjusted = columnsThisSeasonTopZero.map((tierColumn: TierColumn, index: number) => {
      if (index === 0) return tierColumn;

      const tiersToAdjustBy = columnsThisSeasonTopZero.filter((_: TierColumn, adjustmentIndex: number) => adjustmentIndex < index);
      const adjustment = tiersToAdjustBy.reduce((carry: number, column: TierColumn) => {
        return carry + column.bottom;
      }, 0);

      return {
        top: tierColumn.top + adjustment,
        bottom: tierColumn.bottom + adjustment
      }
    });

    return {
      year: season.year,
      tierColumns: columnsThisSeasonTopAdjusted
    };
  }); 

  return (
    <g>
      {
        hoverYear !== null &&
        <text
          x={10}
          y={25}
          stroke={"none"}>
          {hoverYear}
        </text>
      }
      {
        tierColumnStacks.map((stack: TierColumnStack) => {
          const left = resize(firstYear, lastYear, stack.year, firstX, lastX);
          const right = left+yearWidth;

          return (
            <Fragment key={`tiercolumnstack-${stack.year}`}>
              {
                stack.tierColumns.map((column: TierColumn, index: number) => {
                  const top = resize(0, props.teamCount, column.top, firstY, lastY);
                  const bottom = resize(0, props.teamCount, column.bottom, firstY, lastY);

                  return (
                    <Box
                      key={`tiercolumnstack-${stack.year}-${index}`}
                      top={top}
                      right={right}
                      bottom={bottom}
                      left={left}
                      fill={colors[index%colors.length]}
                      onMouseOver={() => setHoverYear(stack.year)}
                      onMouseOut={() => setHoverYear(null)}
                    />
                  );
                })
              }
            </Fragment> 
          )
        })
      }
    </g>
  );
};

export default Tiers;