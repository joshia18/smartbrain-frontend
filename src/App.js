import './App.css';
import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import 'tachyons';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

//options for partices effect
const optionsvar = {
  "fullScreen": {
      "enable": true,
      "zIndex": -1
  },
  "particles": {
      "number": {
          "value": 80,
          "density": {
              "enable": true,
              "value_area": 800
          }
      },
      "color": {
          "value": "#ff0000"
      },
      "shape": {
          "type": "circle"
      },
      "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
              "enable": true,
              "speed": 3,
              "opacity_min": 0.1,
              "sync": false
          }
      },
      "size": {
          "value": 5,
          "random": true,
          "anim": {
              "enable": true,
              "speed": 20,
              "size_min": 0.1,
              "sync": false
          }
      },
      "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
      },
      "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
          }
      },
      "twinkle": {
          "particles": {
              "enable": true,
              "color": "#ffff00",
              "frequency": 0.05,
              "opacity": 1
          },
          "lines": {
              "enable": true,
              "color": "#ff0000",
              "frequency": 0.005,
              "opacity": 1
          }
      }
  },
  "interactivity": {
      "events": {
          "onhover": {
              "enable": true,
              "mode": "repulse"
          },
          "onclick": {
              "enable": true,
              "mode": "push"
          },
          "resize": true
      },
      "modes": {
          "grab": {
              "distance": 400,
              "line_linked": {
                  "opacity": 1
              }
          },
          "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 0.8,
              "speed": 3
          },
          "repulse": {
              "distance": 200
          },
          "push": {
              "particles_nb": 4
          },
          "remove": {
              "particles_nb": 2
          }
      }
  },
  "retina_detect": true
}



const particlesInit = async (main) => {
	await loadFull(main);
};
  
const particlesLoaded = (container) => {
};

const initialstate = {input : '',
		imageUrl: '',
		boxes: [],
		route: 'signin',
		isSignedIn: false,
		user: {
			name:'',
			email:'',
			id:'',
			entries:0
		}    
};

class App extends Component{
  constructor(){
      super();
      this.state = initialstate;
  }

	loadUser = (data) => {
		this.setState({user: {
			name: data.name,
			email: data.email,
			id: data.id,
			entries: data.entries
		}})
	}

	calculateFaceLocation = (response) => {
		//bounding  box gives the percentages of right, left, bottom and top 
		const clarifaifaces = response.outputs[0].data.regions;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);

		const clarifaiarray = clarifaifaces.map(clarifaiface => {
			return{
				leftCol: clarifaiface.region_info.bounding_box.left_col * width,
				topRow: clarifaiface.region_info.bounding_box.top_row * height,
				rightCol: width - (clarifaiface.region_info.bounding_box.right_col * width),
				bottomRow: height - (clarifaiface.region_info.bounding_box.bottom_row * height)
			}
		});

		return clarifaiarray;
		
	}

	displayFaceBox = (boxes) => {
		this.setState({boxes: boxes});
	}
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});

		fetch('https://nameless-taiga-08363.herokuapp.com/image', {
			method: 'post',
			headers: {'Content-Type' : 'application/json'},
			body: JSON.stringify({
				imageUrl: this.state.input
			})
		})
		.then(response => response.json())
		.then((response => {
			if(response){
				fetch('https://nameless-taiga-08363.herokuapp.com/image', {
					method: 'put',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
				}).then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, {entries:count}));
				})
				.catch(console.log);
			}

			this.displayFaceBox(this.calculateFaceLocation(response))
		}))
		.catch(err => console.log(err));
		// console.log('imageurl',this.state.imageUrl,'input', this.state.input);
  }

	onRouteChange = (route) => {
		if(route === 'signout'){
			this.setState(initialstate);
		}
		else if(route === 'home'){
			this.setState({isSignedIn: true});
		}
		this.setState({route: route});
	}

  render(){

		const {isSignedIn, imageUrl, route, boxes, user} = this.state;

		return (

    <div className="App">
      <Particles className='particles' id="tsparticles" 
      init={particlesInit} 
      loaded={particlesLoaded}
      options = {optionsvar} />
			<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
			{route === 'home' ? 
			 <div>
					<Logo />
					<Rank name={user.name} entries={user.entries} />
					<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
					<FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
				</div>
				:
				(
					route === 'signin' ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
					:
					<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
				)
				
			}
    </div>

  	)
	};
}

export default App;
