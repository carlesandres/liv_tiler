import { flatten } from 'lodash';

class TargetCanvas extends React.Component {
  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate(nextProps){
    this.redraw();
  }

  redraw() {
    const { image, size, repeatX, repeatY } = this.props;
    if (!image) {
      return;
    }

    const ctx = this.target.getContext('2d');
    ctx.clearRect(0, 0, this.target.width, this.target.height);

    const widths = Array(repeatX).fill(1).map((content, index) => index*size);
    const heights = Array(repeatY).fill(1).map((content, index) => index*size);
    const combinations = widths.map( width => {
      const row = heights.map( height => ({width, height}));
      return row;
    });

    const flatCombinations = flatten(combinations);
    flatCombinations.forEach( ({width, height}) => {
      requestAnimationFrame( () => {
        ctx.drawImage(image, width, height, size, size);
      });
    });
  }

  render() {
    const { size, repeatX, repeatY } = this.props;
    const width = repeatX * size;
    const height = repeatY * size;

    return (
      <div className="preview">
        <div>Size: {width}px x {height}px</div>

        <canvas
          className="target"
          width={width}
          height={height}
          ref={ ref => { this.target = ref; } }
        />
      </div>
    );
  }
};

export default TargetCanvas;
