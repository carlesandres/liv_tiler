import TargetCanvas from '../components/TargetCanvas';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      filename: '',
      repeatX: 6,
      repeatY: 8
    };

    this.targetCanvases = [];
    this.onChange = this.onChange.bind(this);
    this.afterLoad = this.afterLoad.bind(this);
    this.addTargetCanvasRef = this.addTargetCanvasRef.bind(this);
    this.download = this.download.bind(this);
    this.onChangeRepeatVal = this.onChangeRepeatVal.bind(this);
  }

  componentDidMount() {
    const image = new Image();
    image.onload = this.afterLoad;
    this.setState({ image });
  }

  onChange(event) {
    var file = event.target.files[0];
    this.setState({
      filename: file.name
    });
    this.state.image.src = URL.createObjectURL(file);
  }

  afterLoad() {
    if (this.state.image.src) {
      window.URL.revokeObjectURL(this.state.image.src);
    }
    this.forceUpdate();
  }

  addTargetCanvasRef(ref) {
    if (!this.targetCanvases.includes(ref)) {
      this.targetCanvases.push(ref);
    }
  }

  getTargetCanvases() {
    const { image } = this.state;
    if (!image || !image.src) {
      return null;
    }

    const sizes = [400];

    const canvases = sizes.map( size =>
      <TargetCanvas
        ref={ this.addTargetCanvasRef }
        size={size}
        repeatX={this.state.repeatX}
        repeatY={this.state.repeatY}
        key={`${size}`}
        image={image}
      />
    );

    return canvases;
  }

  download(){
    const canvas = this.targetCanvases[0];

    const strData = canvas.target.toDataURL('image/png', 1.0);
    const strDownloadMime = 'image/octet-stream';
    const uri = (strData.replace('image/png', strDownloadMime));
    const link = document.createElement('a');
    const { repeatX, repeatY } = this.state;

    link.download = `${repeatX} by ${repeatY} tiles of ${this.state.filename}`;
    link.href = uri;
    link.click();
  }

  renderDownloadButton() {
    const { image, filename } = this.state;
    if (!image || !image.src) {
      return null;
    }

    return (
      <div className="button" onClick={this.download}>Download tiles file</div>
    );
  }

  onChangeRepeatVal(event) {
    this.setState({
      [event.target.name]: parseInt(event.target.value, 10)
    });
  }

  render() {
    return (
      <div className="container">
        <style jsx global>{`
          .container {
            max-width: 800px;
            text-align: center;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
          }

          input, button {
            margin: 10px;
            padding: 10px;
            max-width: 200px;
          }

          .button {
            background: lightblue;
            border-radius: 5px;
            padding: 10px;
            border: 1px solid blue;
            display: inline-block;
          }

          .button:hover {
            background: lightgrey;
            cursor: pointer;
          }

          canvas {
            background: white;
          }

          .preview {
            margin-top: 20px;
          }

          .preview > div {
            font-size: 12px;
            margin-bottom: 5px;
          }

          .repeatVal {
            display: inline-block;
          }

          .flex-row {
            display: flex;
          }
        `}
      </style>
      <h1>Liv Tiler: Leggings pattern generator</h1>
      <div className="flex-row">
        <input
          className="button"
          type="file"
          onChange={this.onChange}
          accept="image/*" />
        <div className="repeatVal">
          <label>cols</label>
          <input type="number"
            name="repeatX"
            onChange={this.onChangeRepeatVal}
            value={this.state.repeatX} />
        </div>
        <div className="repeatVal">
          <label>rows</label>
          <input type="number"
            name="repeatY"
            onChange={this.onChangeRepeatVal}
            value={this.state.repeatY} />
        </div>
      </div>
      {this.renderDownloadButton()}
      {this.getTargetCanvases()}

    </div>
    );
  }
};

export default App;
