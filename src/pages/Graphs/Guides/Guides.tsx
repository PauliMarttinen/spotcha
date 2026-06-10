import { Fragment } from "react";
import type { Season } from "../../../data/types";
import { resize } from "../../../utils/resize";
import { GRAPH_HEIGHT, GRAPH_MARGIN, GRAPH_WIDTH } from "../Graphs";
import { getWidthOfYear } from "../utils/getWidthOfYear";
import { getHeightOfRank } from "../utils/getHeightOfRank";
import Box from "../primitives/Box/Box";
import Text from "../primitives/Text/Text";

type GuidesProps = {
  seasons: Season[],
  teamCount: number
};

const Guides = (props: GuidesProps) => {
  const firstYear = props.seasons[0].year;
  const lastYear = props.seasons[props.seasons.length-1].year+1;

  const firstX = GRAPH_MARGIN;
  const lastX = GRAPH_WIDTH-GRAPH_MARGIN;

  const firstY = GRAPH_MARGIN;
  const lastY = GRAPH_HEIGHT-GRAPH_MARGIN;
  const yearWidth = getWidthOfYear(firstYear, lastYear, firstX, lastX);
  const rankHeight = getHeightOfRank(props.teamCount, firstY, lastY);

  return (
    <g>
      <Box
        top={firstY}
        right={lastX}
        bottom={firstY+rankHeight}
        left={firstX}
        fill={"gold"}
      />
      <Box
        top={firstY+rankHeight}
        right={lastX}
        bottom={firstY+rankHeight*2}
        left={firstX}
        fill={"silver"}
      />
      <Box
        top={firstY+rankHeight*2}
        right={lastX}
        bottom={firstY+rankHeight*3}
        left={firstX}
        fill={"#CE8946"}
      />
      {
        props.seasons.map((season: Season, index: number) => {
          const x = yearWidth + resize(firstYear, lastYear, season.year, firstX, lastX);
          const everyFifth = (props.seasons.length-index-1) % 5 === 0;
          return (
            <Fragment key={`yearline-${index}`}>
              {
                everyFifth &&
                <Text
                  key={`yearlabel-${season.year}`}
                  x={x-yearWidth/2+5}
                  y={firstY-9}
                  fontSize={8}
                  text={String(season.year)}
                  stroke={"none"}
                  rotate={-50}
                />
              }
              <path
                key={`guideline-${season.year}`}
                fill={"none"}
                stroke={"#333"}
                strokeWidth={everyFifth ? 0.2 : 0.05}
                d={`M ${x},${firstY} ${x},${lastY}`}
              />
            </Fragment>
          )
        })
      }
      <path
        fill={"none"}
        stroke={"#333"}
        strokeWidth={0.2}
        d={`M ${firstX},${firstY} ${lastX},${firstY}`}
      />
    </g>
  );
};

export default Guides;