type TextProps = {
  text: string,
  x: number,
  y: number,
  fontSize: number,
  rotate?: number,
  stroke?: string,
  strokeWidth?: number,
  fill?: string
};

const Text = (props: TextProps) => {
  return (
    <g transform={`translate(${props.x},${props.y})`}>
      <text
        stroke={props.stroke}
        fontSize={props.fontSize}
        textAnchor={"middle"}
        transform={`${props.rotate ? `rotate(${props.rotate})` : ""}`}
        strokeWidth={props.strokeWidth}
        fill={props.fill}>
        {props.text}
      </text>
    </g>
  );
};

export default Text;