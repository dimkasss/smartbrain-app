import React, { Component } from 'react';
import Clarifai from 'clarifai';import './App.css';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particle from './components/Particles/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
    apiKey: "94fcec7fc44d4da5b7c0450d8d1bb734",
});  

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageURL: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''

			}
		}
	}

	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
	}


	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height),
		}
	}

	displayFaceBox = (box) => {
		console.log(box);
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value})
	}

	onPictureSubmit = () => {
		this.setState({imageURL: this.state.input})
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL,
			this.state.input,
			)
			.then(response => {
				if( response) {
					fetch('http://localhost:3000/image', {
						method: 'put',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({
							id: this.state.user.id
						})
					})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user, { entries: count}))
						console.log(this.state.entries)
					})
				}
				this.displayFaceBox(this.calculateFaceLocation(response))
			})
		  .catch((err) => console.log(err));
	}

	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState({isSignedIn: false})
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route: route});
	}

	render() {
		return (
		<div className="App">
			<Particle className='particle-settings'/>
			<Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
			{ this.state.route === 'home' 
				? <div>
					<Logo />
					<Rank name={this.state.user.name} entries={this.state.user.entries}/>
					<ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
					<FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
				</div>
			
				: (
					this.state.route === 'signin' 
						? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
						: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
				)
			}
		</div>
		);
	}
}

export default App;
