import { useState, useEffect, useRef } from "react";
import { type DataFormat, type Name } from "../../../data/types";
import { GRAPH_HEIGHT, GRAPH_MARGIN } from "../Graphs";
import Box from "../primitives/Box/Box";
import { type GraphColor } from "../Graph/Graph";

type LegendProps = {
  data: DataFormat,
  selectedTeamIds: string[],
  selectedNameIds: string[],
  dashedIds: string[]
  graphColors: GraphColor
};

type LegendItem = {
  dashed: boolean,
  color: string,
  label: string
};

const ITEM_HEIGHT = 15;

const Legend = (props: LegendProps) => {
  const contentRef = useRef<SVGGElement|null>(null);
  const [contentBox, setContentBox] = useState<DOMRect|null>(null);

  const teamIds = Object.keys(props.data.teams);

  const teamItems: LegendItem[] = props.selectedTeamIds.map((id: string) => {
    const team = props.data.teams[id];
    if (!team) throw new Error(`No team with id '${id}'`);

    return {
      color: props.graphColors[id],
      label: team.alias,
      dashed: props.dashedIds.indexOf(id) >= 0
    };
  });

  const nameItems: LegendItem[] = props.selectedNameIds.map((id: string) => {

    const teamId = teamIds.find((findId: string) => {
      return props.data.teams[findId].names.some((name: Name) => name.id === id);
    });
    if (!teamId) throw new Error(`No team with name id '${id}`);

    const team = props.data.teams[teamId];
    const name = team.names.find((name: Name) => name.id === id);
    if (!name) throw new Error(`Team '${team.alias}' has no name with id '${id}`);

    return {
      color: props.graphColors[id],
      dashed: props.dashedIds.indexOf(id) >= 0,
      label: name.fullName
    };
  });

  const items = [...teamItems, ...nameItems];

  useEffect(() => {
    if (contentRef.current)
    {
      const box = contentRef.current.getBBox()
      setContentBox(box);
    }
  }, [contentRef, items]);

  const boxPadding = 10;
  const boxMargin = 10;

  return (
    <g>
      {
        contentBox &&
        <Box
          stroke={"black"}
          fill={"white"}
          bottom={GRAPH_HEIGHT-GRAPH_MARGIN-boxMargin}
          left={GRAPH_MARGIN+boxMargin}
          right={GRAPH_MARGIN+contentBox.width+boxMargin+15}
          top={GRAPH_HEIGHT-GRAPH_MARGIN-contentBox.height-boxMargin-12.5}
        />
      }
      <g ref={contentRef}>
        {
          items.map((item: LegendItem, index: number) => (
            <g
              key={`legenditem-${index}`}
              transform={`translate(${GRAPH_MARGIN+boxMargin+boxPadding}, ${GRAPH_HEIGHT-GRAPH_MARGIN-(contentBox ? contentBox.height : 0)-boxMargin-boxPadding})`}>
              <circle
                cx={0}
                cy={10+index*ITEM_HEIGHT}
                r={1}
                fill={item.color}
                stroke={item.color}
              />
              <path
                fill={"none"}
                stroke={item.color}
                d={`M 0,${10+index*ITEM_HEIGHT} L 20,${10+index*ITEM_HEIGHT}`}
                strokeDasharray={item.dashed ? "2" : "0"}
              />
              <circle
                cx={20}
                cy={10+index*ITEM_HEIGHT}
                r={1}
                fill={item.color}
                stroke={item.color}
              />
              <text
                x={30}
                y={10+index*ITEM_HEIGHT+2.5}
                fontSize={10}
                stroke={"none"}
                fill={item.color}>
                {item.label}
                </text>
            </g>
          ))
        }
      </g>
    </g>
  );
};

export default Legend;