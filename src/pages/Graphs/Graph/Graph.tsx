import { Fragment, useState } from "react";
import { type RankRecord, GRAPH_HEIGHT, GRAPH_WIDTH, GRAPH_MARGIN } from "../Graphs"
import { resize } from "../../../utils/resize";
import { getWidthOfYear } from "../utils/getWidthOfYear";
import { getHeightOfRank } from "../utils/getHeightOfRank";

type GraphProps = {
  displayName: string,
  record: RankRecord[],
  teamCount: number,
  dashed: boolean,
  color: string
};

type HoverContent = {
  displayName: string,
  year: number,
  rank: number
};

export type GraphColor = Record<string, string>;

const Graph = (props: GraphProps) => {
  const [hoverContent, setHoverContent] = useState<HoverContent|null>(null);

  const firstYear = props.record[0].year;
  const lastYear = props.record[props.record.length-1].year+1;

  const firstX = GRAPH_MARGIN;
  const lastX = GRAPH_WIDTH-GRAPH_MARGIN;

  const firstY = GRAPH_MARGIN;
  const lastY = GRAPH_HEIGHT-GRAPH_MARGIN;

  const rankHeight = getHeightOfRank(props.teamCount, firstY, lastY);
  const offsetY = rankHeight/2;
  const yearWidth = getWidthOfYear(firstYear, lastYear, firstX, lastX);
  const offsetX = yearWidth/2;
  
  //const color = props.displayName === "Finland" ? "blue" : (props.displayName === "Sweden" ? "green" : "red");
  //const color = "prööt";
  //const color = props.alias === "South Korea" ? "blue" : "#e00";

  return (
    <g>
      {
        hoverContent !== null &&
        <text
          x={10}
          y={25}
          stroke={"none"}>
          {hoverContent.rank}: {hoverContent.displayName} ({hoverContent.year})
        </text>
      }
      {
        props.record.map((record: RankRecord, index: number) => {
          const thisX = resize(firstYear, lastYear, record.year, firstX, lastX) + offsetX;
          const thisY = resize(0, props.teamCount, record.rank, firstY, lastY) - offsetY;

          const participated = record.rank >= 1;
          const participatedNextYear = !!props.record[index+1] && props.record[index+1].rank >= 1;

          const nextX = (participatedNextYear ? resize(firstYear, lastYear, props.record[index+1].year, firstX, lastX) : 0) + offsetX;
          //const nextX = participatedNextYear ? thisX+yearWidth : 0;
          const nextY = (participatedNextYear ? resize(0, props.teamCount, props.record[index+1].rank, firstY, lastY) : 0) - offsetY;

          return (
            <Fragment key={`graph-${props.displayName}-fragment-${index}`}>
              {
                participated && participatedNextYear &&
                <path
                  key={`line-${props.displayName}-${record.year}`}
                  fill={"none"}
                  stroke={props.color}
                  d={`M ${thisX},${thisY} L ${nextX},${nextY}`}
                  strokeDasharray={props.dashed ? "2" : "0"}
                />
              }
              {
                participated &&
                <circle
                  key={`circle-${props.displayName}-${record.year}`}
                  cx={thisX}
                  cy={thisY}
                  r={1}
                  fill={props.color}
                  stroke={props.color}
                  onMouseOver={() => setHoverContent({displayName: props.displayName, year: record.year, rank: record.rank})}
                  onMouseOut={() => setHoverContent(null)}
                />
              }
            </Fragment>
          )
        })
      }
    </g>
  );
};

export default Graph;