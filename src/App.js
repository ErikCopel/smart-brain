import React, { Component } from "react";
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      particlesInit: false,
      input: '',
      imageURL: '',
      box: {},
      route: 'signout',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      },
      imageURL: '',
      box: {},
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    const { id } = this.state.user;
    this.setState({ imageURL: this.state.input }, () => {
      // Faz a chamada ao backend em vez de diretamente para a API da Clarifai
      fetch("http://localhost:3003/clarifai", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: this.state.imageURL })
      })
        .then(response => response.json())
        .then(result => {
          if (result) {
            fetch("http://localhost:3003/image", {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userId: id})
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }));
              });
          }
          this.displayFaceBox(this.calculateFaceLocation(result));
        })
        .catch(error => console.log('error', error));
    });
  }

  displayFaceBox = (box) => {
    this.setState({ box: box }, () => {
      console.log(this.state.box);
    });
  }

  componentDidMount() {
    if (!this.state.particlesInit) {
      initParticlesEngine(async (engine) => {
        await loadFull(engine);
        this.setState({ particlesInit: true });
      });
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });

    } else if (route === 'home') {
      this.setState({ isSignedIn: true });

    } else if (route === 'register') {
      this.setState({ isSignedIn: false });

    } else if (route === 'signin') {
      this.setState({ isSignedIn: false });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        {this.state.particlesInit && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: -1,
              top: 0,
              left: 0
            }}
          >
            <Particles options={particlesOptions} />
          </div>
        )}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageURL={imageURL} />
          </div>
          : (
            route === 'signout'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
