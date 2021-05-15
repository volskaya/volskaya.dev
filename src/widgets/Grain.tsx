import React, {createRef} from "react";
import {GRAIN_ENABLED, MOBILE_DETECTION} from "../util/util";
import useMeasure from "react-use-measure";
import CSS from "../styles/App.module.scss";

type Props = {
  width: number;
  height: number;
  toggle?: boolean;
};

export default function Grain({toggle}: {toggle?: boolean}) {
  if (MOBILE_DETECTION.phone) return null;

  const [containerRef, {width, height}] = useMeasure();
  const buildGrain = !(width === 0 && height === 0);

  return (
    <div ref={containerRef} className={CSS.grainOverlay}>
      {buildGrain && <GrainPainter toggle={toggle} width={width} height={height} />}
    </div>
  );
}

class GrainPainter extends React.PureComponent<Props> {
  private readonly patternSize = 150;
  private readonly patternRefreshInterval = 2;
  private readonly patternAlpha = 10;
  private readonly patternSamples = 10;
  private readonly framerate = (1 / 25) * 1000;

  state = {
    canvas: createRef<HTMLCanvasElement>(),
    frame: 0,
    patternPixelDataLength: 0,
    looping: true,
    eventListenerSet: false,
    patternCache: new Array<CanvasPattern>(this.patternSamples),
    ctx: null as CanvasRenderingContext2D | null,
    lastFrameTime: undefined as number | undefined,
  };

  private loop = (time?: number) => {
    if (!GRAIN_ENABLED) {
      this.state.looping = false;
      this.draw();
      return;
    }

    if (!this.props.toggle) {
      this.state.looping = false;
      return;
    }

    window.requestAnimationFrame(this.loop);

    // Limit draw rate.
    if (time !== undefined) {
      const fps = this.state.lastFrameTime !== undefined ? time - this.state.lastFrameTime : undefined;
      if (fps !== undefined && fps < this.framerate) return;
      this.state.lastFrameTime = time;
    }

    this.state.frame = ++this.state.frame % this.patternSamples;
    if (this.state.frame % this.patternRefreshInterval === 0) this.draw();
  };

  private createPattern = (): CanvasImageSource => {
    const canvas = document.createElement("canvas");
    canvas.width = this.patternSize;
    canvas.height = this.patternSize;

    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    const pattern = context.createImageData(this.patternSize, this.patternSize);

    for (let i = 0; i < this.state.patternPixelDataLength; i += 4) {
      const value = Math.random() * 255;

      pattern.data[i] = value;
      pattern.data[i + 1] = value;
      pattern.data[i + 2] = value;
      pattern.data[i + 3] = this.patternAlpha;
    }

    context.putImageData(pattern, 0, 0);
    return canvas;
  };

  private draw = () => {
    const {width, height} = this.state.ctx?.canvas ?? {width: 0, height: 0};

    this.state.ctx!.clearRect(0, 0, width, height);
    this.state.ctx!.fillStyle;
    this.state.ctx!.fillStyle = this.state.patternCache[this.state.frame];
    this.state.ctx!.fillRect(0, 0, width, height);
  };

  // If `props.toggle`, remove resize listener and resume animation loop
  // else add resize listener for this.draw
  private adjustLooping = () => {
    if (this.props.toggle && !this.state.looping) {
      if (this.state.eventListenerSet) {
        window.removeEventListener("resize", this.draw);
        this.state.eventListenerSet = false;
      }

      this.state.looping = true;
      this.loop();
    } else if (!this.props.toggle && !this.state.eventListenerSet) {
      window.addEventListener("resize", this.draw);
      this.state.eventListenerSet = true;
    }
  };

  componentDidUpdate() {
    this.adjustLooping();
  }

  componentDidMount() {
    if (MOBILE_DETECTION.phone) return;

    this.state.ctx = this.state.canvas.current?.getContext("2d");

    if (this.state.ctx) {
      this.state.ctx.imageSmoothingEnabled = false;
      this.state.patternPixelDataLength = this.patternSize * this.patternSize * 4;

      for (let i = 0; i < this.patternSamples; i++) {
        this.state.patternCache[i] = this.state.ctx.createPattern(this.createPattern(), "repeat")!;
      }

      window.requestAnimationFrame(this.draw);
      window.requestAnimationFrame(this.loop);
      this.adjustLooping();
    }
  }

  render() {
    return <canvas ref={this.state.canvas} width={this.props.width} height={this.props.height} />;
  }
}
