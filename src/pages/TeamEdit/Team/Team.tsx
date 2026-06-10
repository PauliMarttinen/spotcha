import { type Name, type Team as TeamType} from "../../../data/types";
import styles from "./Team.module.css";
import Names from "./Names/Names";

type TeamProps = {
  team: TeamType,
  onChange: (newTeam: TeamType) => void
};

const Team = (props: TeamProps) => {
  const onChangeAlias = (newAlias: string) => {
    const newTeam = {
      ...props.team,
      alias: newAlias
    }
    props.onChange(newTeam);
  };

  const onChangeNames = (newNames: Name[]) => {
    const newTeam = {
      ...props.team,
      names: newNames
    };
    props.onChange(newTeam);
  };

  return (
    <section>
      <header>
        <input
          name={"aliasInput"}
          className={styles.teamAlias}
          type={"text"}
          value={props.team.alias}
          onChange={(e) => onChangeAlias(e.target.value)}
        />
      </header>
      <Names
        names={props.team.names}
        onChange={onChangeNames}
      />
    </section>
  );
};

export default Team;