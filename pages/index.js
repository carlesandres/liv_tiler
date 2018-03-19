import TargetCanvas from '../components/TargetCanvas';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { image: null };
    this.targetCanvases = [];
    this.onChange = this.onChange.bind(this);
    this.afterLoad = this.afterLoad.bind(this);
    this.addTargetCanvasRef = this.addTargetCanvasRef.bind(this);
    this.download = this.download.bind(this);
  }

  async componentDidMount() {
    const image = new Image();
    image.onload = this.afterLoad;
    this.setState({ image });

    this.jszip = await import('jszip');
  }

  onChange(event) {
    var file = event.target.files[0];
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

    const sizes = [32, 64, 128];

    const canvases = sizes.map( size =>
      <TargetCanvas
        ref={ this.addTargetCanvasRef }
        size={size}
        key={`${size}`}
        image={image}
      />
    );

    return canvases;
  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  // TO-DO: Make async-await
  download(){
    const zipFile = new this.jszip();

    const promises = this.targetCanvases.filter( x => x )
      .map( (canvas, index) => {
        const dataURL = canvas.target.toDataURL('image/png', 1.0);
        const blob = this.dataURLtoBlob(dataURL);
        const reader = new FileReader();
        const promise = new Promise( (resolve, reject) => {
          reader.addEventListener("loadend", function() {
            return resolve(reader.result);
          });
        });
        reader.readAsArrayBuffer(blob);
        return promise;
      });

    Promise.all(promises).then( results => {
      results.forEach( (file, index) => {
        zipFile.file( `aaa${index}.png`,file);
      });

      zipFile.generateAsync({type:"base64"}).then(function (base64) {
        window.location = "data:application/zip;base64," + base64;
      });
    });
  }

  renderDownloadButton() {
    const { image } = this.state;
    if (!image || !image.src) {
      return null;
    }

    return (
      <button onClick={this.download}>Download</button>
    );
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
            max-width: 200px;
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
        `}
      </style>
      <h1>IconFist</h1>
      <h2>Create favicons quickly</h2>
      <input
        type="file"
        onChange={this.onChange}
        accept="image/*" />
      {this.renderDownloadButton()}
      {this.getTargetCanvases()}

    </div>
    );
  }
};

export default App;
