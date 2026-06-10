import { resize } from "../../../utils/resize";

export const getWidthOfYear = (firstYear: number, lastYear: number, firstX: number, lastX: number) => {
  const firstYearX = resize(firstYear, lastYear, firstYear, firstX, lastX);
  const secondYearX = resize(firstYear, lastYear, firstYear+1, firstX, lastX);
  return Math.abs(firstYearX-secondYearX);
};