export type Name = {
  id: string,
  name: string,
  fullName: string,
  since: number,
  note: string
}

export type Team = {
  id: string,
  alias: string,
  names: Name[]
};

export type League = {
  id: string,
  name: string,
  tier: number,
  teams: string[][]
  cancelled?: string
};

export type Season = {
  id: string,
  year: number,
  leagues: League[],
  cancelled: boolean,
  cancelReason: string
};

export type DataFormat = {
  teams: Team[],
  seasons: Season[]
};