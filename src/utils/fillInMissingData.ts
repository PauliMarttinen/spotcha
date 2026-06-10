import { type DataFormat, type League, type Season, type Team } from "../data/types";

/**
 * This function exist for ephemeral needs; during development I might change the
 * data format around so this is a function to reaccommodate the data files I
 * already have with hundreds of entries.
 */
export const fillInMissingData = (data: DataFormat): DataFormat => {
/* 
  const updatedSeasons: Season[]  = data.seasons.map((season: Season) => {
    const updatedLeagues: League[] = season.leagues.map((league: League) => {
      const updatedRanks = league.teams.map((rank: string[]) => {
        const updatedRank = rank.map((alias: string) => {
          const team = data.teams.find((team: Team) => team.alias === alias);
          if (!team) throw new Error(`No team with alias '${alias}`);
          return team.id;
        });
        
        return updatedRank;
      });
      
      return {
        ...league,
        teams: updatedRanks
      };
    });

    return {
      ...season,
      leagues: updatedLeagues
    };
  });

  const updatedData: DataFormat = {
    ...data,
    seasons: updatedSeasons
  };

  console.log( updatedData); */

  return data;
};