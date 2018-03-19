import pica from 'pica';

class TargetCanvas extends React.Component {
  componentDidMount() {
    this.redraw();
  }

  componentWillReceiveProps(nextProps){
    this.redraw();
  }

  redraw() {
    const { image, size } = this.props;
    if (!image) {
      return;
    }

    const ctx = this.target.getContext('2d');
    ctx.drawImage(image, 0, 0, size, size);
  }

  render() {
    const { size } = this.props;

    return (
      <div className="preview">
        <div>Size: {size}px x {size}px</div>

        <canvas
          className="target"
          width={size}
          height={size}
          ref={ ref => { this.target = ref; } }
        />
      </div>
    );
  }
};

export default TargetCanvas;
