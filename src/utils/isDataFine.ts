import { type League, type Season, type Team, type Teams, type Name, type DataFormat } from "../data/types"

const countUnexplainedCancelledSeasons = (seasons: Season[]) => {
  const unexplainedCancelledSeasons: number[] = seasons.filter((season: Season) => (
    (season.cancelled && !season.cancelReason) || (season.cancelled && season.cancelReason.trim() === "")
  )).map((season: Season) => season.year);

  if (unexplainedCancelledSeasons.length > 0)
  {
    console.log("Unexplained cancelled seasons: ", unexplainedCancelledSeasons);
  }
  if (unexplainedCancelledSeasons.length === 0)
  {
    console.log("No unexplained cancelled seasons!")
  }

  return unexplainedCancelledSeasons.length;
};

const countDuplicateIds = (data: DataFormat) => {
  const ids: string[] = [];
  data.seasons.forEach((season: Season) => ids.push(season.id));
  
  Object.keys(data.teams).forEach((id: string) => {
    const team = data.teams[id];
    
    team.names.forEach((name: Name) => {
      ids.push(name.id);
    });

    ids.push(team.id);
  });

  const duplicates = ids.filter((alias: string, index: number) => ids.indexOf(alias) !== index);
  if (duplicates.length > 0)
  {
    console.error("Duplicate IDs: ", duplicates);
  }
  if (duplicates.length === 0)
  {
    console.log("No duplicate IDs!")
  }
  return duplicates.length;
};

const countDuplicateAliases = (teams: Teams) => {
  const aliases = Object.keys(teams).map((id: string) => teams[id].alias);
  const duplicates = aliases.filter((alias: string, index: number) => aliases.indexOf(alias) !== index);
  if (duplicates.length > 0)
  {
    console.error("Duplicate aliases: ", duplicates);
  }
  if (duplicates.length === 0)
  {
    console.log("No duplicate aliases!")
  }
  return duplicates.length;
};

const isDataFine = (data: DataFormat): boolean => {
  if (countDuplicateAliases(data.teams) > 0) return false;
  if (countDuplicateIds(data) > 0) return false;
  if (countUnexplainedCancelledSeasons(data.seasons) > 0) return false;
  console.log("Data entered is fine.")
  return true;
};

export default isDataFine;