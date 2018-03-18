class App extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.state = { image : null };
  }

  componentDidMount() {
    this.setState({ image: (new Image()) },
      () => { this.state.image.onload = this.drawOnCanvas; });
  }

  onChange(event) {
    var file = event.target.files[0];
    this.state.image.src = URL.createObjectURL(file);
  }

  drawOnCanvas() {
    window.URL.revokeObjectURL(this.state.image);
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.state.image, 0, 0);
  }

  render() {
    return (
      <div>
        <style jsx>{`
          input {
            display: block;
          }
        `}
        </style>
        <h1>IconFist</h1>
        <h2>Create favicons quickly</h2>
        <input
          type="file"
          onChange={this.onChange}
          accept="image/*" />
        <canvas
          ref={ (ref) => { this.canvas = ref;} }
          width="300"
          height="300"></canvas>

      </div>
    );
  }
};

export default App;
