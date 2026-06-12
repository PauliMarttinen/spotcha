type ItemProps = {
	x: number,
	y: number,
	color: string,
	dashed: boolean,
	label: string
};

const Item = (props: ItemProps) => {
	return (
		<g transform={`translate(${props.x}, ${props.y})`}>
			<circle
				cx={0}
				cy={2.5}
				r={1}
				fill={props.color}
				stroke={props.color}
			/>
			<path
				fill={"none"}
				stroke={props.color}
				d={`M 0,2.5 L 20,2.5`}
				strokeDasharray={props.dashed ? "2" : "0"}
			/>
			<circle
				cx={20}
				cy={2.5}
				r={1}
				fill={props.color}
				stroke={props.color}
			/>
			<text
				x={30}
				y={5}
				fontSize={10}
				stroke={"none"}
				fill={props.color}>
				{props.label}
				</text>
		</g>
	);
};

export default Item;