import { type Name as NameType} from "../../../../data/types";
import Name from "./Name/Name";
import { v7 as uuid } from "uuid";

type NameProps = {
  names: NameType[],
  onChange: (newNames: NameType[]) => void
};

const Names = (props: NameProps) => {
  const onChange = (newName: NameType) => {
    const newNames = props.names.map((oldName: NameType) => {
      if (newName.id === oldName.id) return newName;

      return oldName;
    })
    props.onChange(newNames);
  };

  const addName = () => {
    const newNames: NameType[] = [
      ...props.names,
      {
        id: uuid(),
        name: "",
        fullName: "",
        since: 0,
        note: ""
      }
    ];

    props.onChange(newNames);
  };

  const deleteName = (deletedId: string) => {
    const newNames = props.names.filter((name: NameType) => name.id !== deletedId);
    props.onChange(newNames);
  };

  return (
    <ul>
      {
        props.names.map((name: NameType, index: number) => (
          <Name
            key={index}
            name={name}
            onChange={onChange}
            onDelete={deleteName}
          />
        ))
      }
      <li>
        <button
          onClick={addName}>
          Add name
        </button>
      </li>
    </ul>
  );
};

export default Names;