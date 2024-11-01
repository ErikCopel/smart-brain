import React, { Component } from "react";
import Navigation from './components/Navigation/Navigation';
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
      input: "",
      imageURL: ""
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    console.log("click");
  }

  componentDidMount() {
    if (!this.state.particlesInit) {
      initParticlesEngine(async (engine) => {
        await loadFull(engine);
        this.setState({ particlesInit: true });
      });
    }
  }

  render() {
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
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
          />
        <FaceRecognition 
          imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
