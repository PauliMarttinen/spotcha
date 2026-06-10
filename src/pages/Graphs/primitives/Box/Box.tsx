type BoxProps = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  fill: string,
  stroke?: string,
  onMouseOver?: () => void,
  onMouseOut?: () => void
};

const Box = (props: BoxProps) => {
  return (
    <path
      fill={props.fill}
      stroke={props.stroke ?? "none"}
      d={`M ${props.left},${props.top} L ${props.left},${props.bottom} L ${props.right},${props.bottom} L ${props.right},${props.top} Z`}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
    />
  );
};

export default Box;