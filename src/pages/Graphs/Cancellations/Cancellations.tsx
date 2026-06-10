import { type Season } from "../../../data/types"
import Cancellation, {type CancellationProps as CancellationType} from "./Cancellation/Cancellation";
import { GRAPH_HEIGHT, GRAPH_MARGIN, GRAPH_WIDTH } from "../Graphs";
import { getHeightOfRank } from "../utils/getHeightOfRank";
import { getWidthOfYear } from "../utils/getWidthOfYear";
import { resize } from "../../../utils/resize";

type CancellationsProps = {
  seasons: Season[],
  teamCount: number
};

const Cancellations = (props: CancellationsProps) => {
  const firstYear = props.seasons[0].year;
  const lastYear = props.seasons[props.seasons.length-1].year+1;

  const firstX = GRAPH_MARGIN;
  const lastX = GRAPH_WIDTH-GRAPH_MARGIN;

  const firstY = GRAPH_MARGIN;
  const lastY = GRAPH_HEIGHT-GRAPH_MARGIN;
  const yearWidth = getWidthOfYear(firstYear, lastYear, firstX, lastX);
  const rankHeight = getHeightOfRank(props.teamCount, firstY, lastY);

  const cancellations = props.seasons.reduce((carry: CancellationType[], season: Season, index: number) => {
    if (season.cancelled)
    {
      if (index >= 1 && season.cancelled === props.seasons[index-1].cancelled)
      {
        carry[carry.length - 1].right += yearWidth;
        return carry;
      }

      const top = firstY;
      const right = resize(firstYear, lastYear, season.year, firstX, lastX) + yearWidth;
      const bottom = lastY;
      const left = right - yearWidth;
      const text = season.cancelReason;

      const cancellation: CancellationType = {
        top, right, bottom, left, text
      };

      return [...carry, cancellation];
    }

    return carry;
  }, []);
  
  return (
    <g>
      {
        cancellations.map((box: CancellationType, index: number) => (
          <Cancellation
            key={`cancellation-${index}`}
            top={box.top}
            right={box.right}
            bottom={box.bottom}
            left={box.left}
            text={box.text}
          />
        ))
      }
    </g>
  );
};

export default Cancellations;