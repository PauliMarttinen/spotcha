import {useState} from "react";
import styles from "./App.module.css";
import isDataFine from "./utils/isDataFine";
import type {DataFormat} from "./data/types";
import SeasonEdit from "./pages/SeasonEdit/SeasonEdit";
import TeamEdit from "./pages/TeamEdit/TeamEdit";
import Graphs from "./pages/Graphs/Graphs";
import { fillInMissingData } from "./utils/fillInMissingData";

const App = () => {
  const [page, setPage] = useState<number>(0);
  const [data, setData] = useState<DataFormat>({
    teams: [],
    seasons: []
  });
  const [hideJsonField, setHideJsonField] = useState<boolean>(false);

  const pages = ["Team Edit", "Season Edit", "Graphs"];
  
  const readJson = (input: string) => {
    try {
      const preliminaryData = JSON.parse(input);
      if (isDataFine(preliminaryData)) setData(fillInMissingData(preliminaryData));
    } catch (e) {
      throw e;
    };
  };

  return (
    <div className={styles.app}>
      <menu>
        {
          pages.map((menuPage: string, index: number) => (
            <li key={menuPage}>
              <button onClick={() => setPage(index)}>
                {menuPage}
              </button>
            </li>
          ))
        }
      </menu>
      <div className={styles.jsonField}>
        <button onClick={() => setHideJsonField(!hideJsonField)}>
          Toggle JSON field
        </button><br/>
        <textarea
          className={hideJsonField ? styles.hidden: ""}
          onChange={(e) => readJson(e.target.value)}
          value={JSON.stringify(data)}
        />
      </div>
      {
        page === 0 &&
        <TeamEdit
          key={"teamEdit"}
          data={data}
          onChange={(newData: DataFormat) => setData(newData)}
        />
      }
      {
        page === 1 &&
        <SeasonEdit
          data={data}
          onChange={(newData: DataFormat) => setData(newData)}
        />
      }
      {
        page === 2 &&
        <Graphs
          data={data}
        />
      }
    </div>
  );
};

export default App;