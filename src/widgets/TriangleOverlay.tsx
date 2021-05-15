import {useEffect, useLayoutEffect, useState} from "react";
import {
  OverlayTriangleType,
  randomBetween,
  TRIANGLE_COUNT,
  TRIANGLE_OPACITY,
  TRIANGLE_PADDING,
  TRIANGLE_WIDTHS,
  TRIANGLE_ZINDEX,
} from "../util/util";
import CSS from "../styles/App.module.scss";
import Triangle from "../svg/Triangle";

type Dimensions = {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
  zIndex: number;
};

const makeTriangle = ({
  type,
  width = window.innerWidth,
  height = window.innerHeight,
}: Readonly<{
  type: OverlayTriangleType;
  width?: number;
  height?: number;
}>): Dimensions => ({
  left: randomBetween(TRIANGLE_PADDING, width - TRIANGLE_PADDING),
  top: randomBetween(0, height - TRIANGLE_PADDING),
  height: TRIANGLE_WIDTHS[type],
  width: TRIANGLE_WIDTHS[type],
  opacity: TRIANGLE_OPACITY[type],
  zIndex: TRIANGLE_ZINDEX[type],
});

export default function TriangleOverlay(): JSX.Element {
  const [triangles, setTriangles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const triangleArray: JSX.Element[][] = [];
    let id = -1;

    for (const key of Object.keys(TRIANGLE_COUNT)) {
      const count = TRIANGLE_COUNT[key];
      const items: JSX.Element[] = new Array(count);

      for (let i = 0; i < count; i++) {
        const dimensions = makeTriangle({type: parseInt(key, 0)});

        items[i] = (
          <div key={++id} className={CSS.triangle} style={dimensions}>
            <Triangle width={dimensions.width} />
          </div>
        );
      }

      triangleArray.push(items);
    }

    setTriangles(
      triangleArray.reduce((old, items) => {
        for (const item of items) {
          old.push(item);
        }

        return old;
      }, [] as JSX.Element[])
    );
  }, []);

  return <div className={CSS.triangleContainer}>{triangles.map((elem) => elem)}</div>;
}
