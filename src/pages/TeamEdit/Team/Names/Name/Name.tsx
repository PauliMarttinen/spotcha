import { type Name as NameType } from "../../../../../data/types";

type NameProps = {
  name: NameType,
  onChange: (newName: NameType) => void,
  onDelete: (name: string) => void
};

const Name = (props: NameProps) => {
  const onChangeName = (newName: string) => {
    props.onChange({
      ...props.name,
      name: newName
    });
  };

  const onChangeFullName = (newFullName: string) => {
    props.onChange({
      ...props.name,
      fullName: newFullName
    });
  };

  const onChangeSince = (newSince: number) => {
    props.onChange({
      ...props.name,
      since: newSince
    });
  };

  const onChangeNote = (newNote: string) => {
    props.onChange({
      ...props.name,
      note: newNote
    });
  };

  const onDelete = () => {
    props.onDelete(props.name.id);
  };

  return (
    <li>
      <input
        type={"text"}
        value={props.name.name}
        onChange={(e) => onChangeName(e.target.value)}
        placeholder={"Short name"}
      />
      <input
        type={"text"}
        value={props.name.fullName}
        onChange={(e) => onChangeFullName(e.target.value)}
        placeholder={"Full name"}
      />
      <input
        type={"number"}
        value={props.name.since}
        onChange={(e) => onChangeSince(Number(e.target.value))}
        placeholder={"Since"}
      />
      <input
        type={"text"}
        value={props.name.note}
        onChange={(e) => onChangeNote(e.target.value)}
        placeholder={"Note"}
      />
      <dialog id={`confirm-delete-${props.name.name}`}>
        <p>Confirm deletion of name {props.name.name}</p>
        <button
          commandfor={`confirm-delete-${props.name.name}`}
          command={"close"}>
          Cancel
        </button>
        <button
          commandfor={`confirm-delete-${props.name.name}`}
          command={"close"}
          onClick={onDelete}>
          Delete
        </button>
      </dialog>
      <button
        commandfor={`confirm-delete-${props.name.name}`}
        command={"show-modal"}>
        delet
      </button>
    </li>
  );
};

export default Name;