import { type Name, type Teams } from "../../../data/types";
import { type GraphColors } from "../Graph/Graph";
import styles from "./TeamSelect.module.css";

type TeamSelect = {
	selectedTeamIds: string[],
	selectedNameIds: string[],
	dashedIds: string[],
	graphColors: GraphColors,
	onChangeTeamIds: (updatedTeamIds: string[]) => void,
	onChangeNameIds: (updatedNameIds: string[]) => void,
	onChangeDashedIds: (updatedDashedIds: string[]) => void,
	onChangeColor: (updatedColors: GraphColors) => void
	teams: Teams
};

const TeamSelect = (props: TeamSelect) => {
	const teamIds = Object.keys(props.teams);

	const onChangeTeamIds = (value: string) => {
    if (props.selectedTeamIds.indexOf(value) >= 0)
    {
			const updatedTeamIds = props.selectedTeamIds.filter((selectedValue: string) => selectedValue !== value);
      props.onChangeTeamIds(updatedTeamIds);
      return;
    }

		const updatedTeamIds = [...props.selectedTeamIds, value];
    props.onChangeTeamIds(updatedTeamIds);
  };

  const onChangeNameIds = (value: string) => {
    if (props.selectedNameIds.indexOf(value) >= 0)
    {
			const updatedNameIds = props.selectedNameIds.filter((selectedValue: string) => selectedValue !== value);
      props.onChangeNameIds(updatedNameIds);
      return;
    }

		const updatedNameIds = [...props.selectedNameIds, value];
    props.onChangeNameIds(updatedNameIds);
  };

  const onChangeDashedIds = (value: string) => {
    if (props.dashedIds.indexOf(value) >= 0)
    {
			const updatedDashedIds = props.dashedIds.filter((selectedValue: string) => selectedValue !== value);
      props.onChangeDashedIds(updatedDashedIds);
      return;
    }

		const updatedDashedIds = [...props.dashedIds, value];
    props.onChangeDashedIds(updatedDashedIds);
  };

  const onChangeColor = (id: string, newColor: string) => {
    props.onChangeColor({
      ...props.graphColors,
      [id]: newColor
    });
  };

	return (
		<ul>
			{
				teamIds.map((id: string) => {
					const team = props.teams[id];
					return (
						<li key={`checkbox-${team.id}`}>
							<input
								type={"checkbox"}
								checked={props.selectedTeamIds.indexOf(team.id) >= 0}
								id={team.id}
								onChange={() => onChangeTeamIds(team.id)}
							/>
							<label htmlFor={team.id}>{team.alias}</label>
							<span className={styles.spacer}/>
							<input
								type={"checkbox"}
								checked={props.dashedIds.indexOf(team.id) >= 0}
								id={`dashed-${team.id}`}
								onChange={() => onChangeDashedIds(team.id)}
							/>
							<label htmlFor={`dashed-${team.id}`}>dashed</label>
							<span className={styles.spacer}/>
							<input
								type={"text"}
								value={props.graphColors[team.id]}
								onChange={(e) => onChangeColor(team.id, e.target.value)}
								placeholder={"Color"}
							/>
							{
								team.names.length > 1 &&
								<ul>
									{
										team.names.map((name: Name) => (
											<li key={name.id}>
												<input
													type={"checkbox"}
													checked={props.selectedNameIds.indexOf(name.id) >= 0}
													id={name.id}
													onChange={() => onChangeNameIds(name.id)}
												/>
												<label htmlFor={name.id}>{name.fullName}</label>
												<span className={styles.spacer}/>
												<input
													type={"checkbox"}
													checked={props.dashedIds.indexOf(name.id) >= 0}
													id={`dashed-${name.id}`}
													onChange={() => onChangeDashedIds(name.id)}
												/>
												<label htmlFor={`dashed-${name.id}`}>dashed</label>
												<span className={styles.spacer}/>
												<input
													type={"text"}
													value={props.graphColors[name.id]}
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
	);
};

export default TeamSelect;