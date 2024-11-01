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
      input: '',
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    console.log('click');
    const imageUrl = this.state.input;

    // Faz a chamada ao backend em vez de diretamente para a API da Clarifai
    fetch("http://localhost:3003/clarifai", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrl: imageUrl })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      // Processar o resultado da API conforme necessário
      // Exemplo:
      // const regions = result.outputs[0].data.regions;
    })
    .catch(error => console.log('error', error));
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
          onButtonSubmit={this.onButtonSubmit}/>
        { /*<FaceRecognition/> */}
      </div>
    );
  }
}

export default App;
