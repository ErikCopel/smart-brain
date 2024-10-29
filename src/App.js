import React, { Component } from "react";
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
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
    };
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
        <ImageLinkForm />
        <Rank />
        { /*<FaceRecognition/> */}
      </div>
    );
  }
}

export default App;
