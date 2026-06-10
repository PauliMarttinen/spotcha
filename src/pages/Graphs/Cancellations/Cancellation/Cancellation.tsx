import Box from "../../primitives/Box/Box";
import Text from "../../primitives/Text/Text";

export type CancellationProps = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  text: string
};

const Cancellation = (props: CancellationProps) => {
  const textX = (props.left + props.right)/2;
  const textY = (props.top + props.bottom)/2;

  return (
    <g>
      <Box
        top={props.top}
        right={props.right}
        bottom={props.bottom}
        left={props.left}
        fill={"#125"}
      />
      <Text
        text={props.text}
        x={textX+1.5}
        y={textY}
        fontSize={6}
        stroke={"none"}
        fill={"white"}
        rotate={-90}
      />
    </g>
  );
};

export default Cancellation;