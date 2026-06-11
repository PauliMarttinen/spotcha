import { type DataFormat, type League, type Season, type Team } from "../data/types";

/**
 * This function exist for ephemeral needs; during development I might change the
 * data format around so this is a function to reaccommodate the data files I
 * already have with hundreds of entries.
 */
export const fillInMissingData = (data: DataFormat): DataFormat => {
  return data;
};