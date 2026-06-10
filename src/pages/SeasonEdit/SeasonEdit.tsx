import { useRef, useState } from "react";
import { type DataFormat, type Season, type Team } from "../../data/types";
import styles from "./SeasonEdit.module.css";
import { v7 as uuid } from "uuid";
import Editor from "./Editor/Editor";

type SeasonEditProps = {
  data: DataFormat,
  onChange: (newData: DataFormat) => void
};

const SeasonEdit = (props: SeasonEditProps) => {
  const [openSeason, setOpenSeason] = useState<string|null>(null);
  const [newSeasonYear, setNewSeasonYear] = useState<number>(new Date().getFullYear());
  const duplicateModal = useRef<HTMLDialogElement|null>(null);

  const addSeason = () => {
    if (props.data.seasons.findIndex((season: Season) => season.year === newSeasonYear) >= 0)
    {
      duplicateModal.current?.showModal();
      return;
    }

    const newSeason: Season = {
      id: uuid(),
      year: newSeasonYear,
      cancelled: false,
      cancelReason: "",
      leagues: []
    };

    const newData: DataFormat = {
      ...props.data,
      seasons: [
        ...props.data.seasons,
        newSeason
      ]
    };

    props.onChange(newData);
  };

  const onChange = (newSeason: Season) => {
    const newSeasons: Season[] = props.data.seasons.map((oldSeason: Season) => {
      return newSeason.id === oldSeason.id ? newSeason : oldSeason;
    });

    const newData = {
      ...props.data,
      seasons: newSeasons
    };

    props.onChange(newData);
  };

  return (
    <>
      <dialog ref={duplicateModal}>
        <p>That season already exists.</p>
        <button onClick={() => duplicateModal.current?.close()}>close</button>
      </dialog>
      <div>
        <header><h1>Season Edit</h1></header>
        <div className={styles.wrapper}>
          <div id={"seasonAddAndSelect"}>
            <input
              type={"number"}
              value={newSeasonYear}
              onChange={(e) => setNewSeasonYear(Number(e.target.value))}
            />
            <button onClick={addSeason}>
              Add season
            </button>
            {
              props.data.seasons.map((season: Season) => (
                <li key={`season-${season.year}`}>
                  <button onClick={() => setOpenSeason(season.id)}>
                    {season.year}
                  </button>
                </li>
              ))
            }
          </div>
          <div id={"seasonEdit"}>
            {
              openSeason !== null &&
              <Editor
                season={props.data.seasons.find((season: Season) => season.id === openSeason)!}
                onChange={onChange}
              />
            }
          </div>
        </div>
      </div>
      <datalist id={"aliases"}>
        {
          props.data.teams.map((team: Team, index: number) => {
            return (
              <option
                key={`alias-${team.alias}-${index}`}
                value={team.alias}
              />
            )
          })
        }
      </datalist>
    </>
  );
};

export default SeasonEdit;