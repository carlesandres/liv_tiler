import TargetCanvas from '../components/TargetCanvas';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { image: null };
    this.targetCanvases = [];
    this.onChange = this.onChange.bind(this);
    this.afterLoad = this.afterLoad.bind(this);
  }

  componentDidMount() {
    const image = new Image();
    image.onload = this.afterLoad;
    this.setState({ image });
  }

  onChange(event) {
    var file = event.target.files[0];
    this.state.image.src = URL.createObjectURL(file);
  }

  afterLoad() {
    console.log('after load');
    if (this.state.image.src) {
      window.URL.revokeObjectURL(this.state.image.src);
    }
    this.forceUpdate();
  }

  getTargetCanvases() {
    const { image } = this.state;
    if (!image || !image.src) {
      return null;
    }

    const sizes = [32, 64, 128];

    const canvases = sizes.map( size =>
        <TargetCanvas size={size} key={`${size}`} image={image} />
    );

    return canvases;
  }

  render() {
    return (
      <div>
        <style jsx>{`
          input {
            display: block;
          }

          canvas {
            background: white;
          }
        `}
      </style>
      <h1>IconFist</h1>
      <h2>Create favicons quickly</h2>
      <input
        type="file"
        onChange={this.onChange}
        accept="image/*" />
      {/* <canvas */}
        {/*   className="origin" */}
        {/*   ref={ (ref) => { this.canvas = ref;} } */}
        {/*   width="300" */}
        {/*   height="300"></canvas> */}
      {this.getTargetCanvases()}

    </div>
    );
  }
};

export default App;
