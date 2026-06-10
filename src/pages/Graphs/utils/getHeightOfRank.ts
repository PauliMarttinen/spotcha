import { resize } from "../../../utils/resize";

export const getHeightOfRank = (teamCount: number, firstY: number, lastY: number) => {
  const firstRankY = resize(0, teamCount, 0, firstY, lastY);
  const secondRankY = resize(0, teamCount, 1, firstY, lastY);
  return Math.abs(firstRankY-secondRankY);
};