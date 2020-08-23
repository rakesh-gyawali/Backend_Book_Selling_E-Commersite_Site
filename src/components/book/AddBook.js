import React, { Component } from 'react'
import defaultImg from './book-default.png'
import './AddBook.css'
import Axios from 'axios'
import Navigation from '../navigation/Navigation'
import { Redirect } from 'react-router-dom'

export default class AddBook extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			title: '',
			author: '',
			publication: '',
			image: defaultImg,
			condition: 'New',
			deliveryArea: 'Within city',
			cost: null,
			category: '',
			categories: [],
			config:{
				headers: {'Authorization': localStorage.getItem('token')}
			}, 
			submitted: false
		}
	}

	handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }
	
	handleImageChange = e => {
		this.setState({
			myFile: e.target.files[0],
			image: URL.createObjectURL(e.target.files[0]),
			isImageSelected: true
		});
	};
	
	uploadImg = () => {
        if (!this.state.isImageSelected)  return;
        const formData = new FormData();
        formData.append('myFile', this.state.myFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

		Axios.post('http://localhost:3001/api/uploads', formData, config)
		.then((res) => {
            this.setState({image: res.data.file.filename})
            console.log(res.data.file.filename);
        }).catch((err) => console.log(err));
	}

	handleSubmit = (e) => {
		e.preventDefault();
		if (this.state.category === '') {
			console.log("category is empty");
			this.setState({category: this.state.categories[1]._id});
		}
		this.uploadImg();
		setTimeout(() => {
			Axios.post('http://localhost:3001/api/books', this.state, this.state.config)
			.then(res => {
                this.setState({submitted: true});
                console.log(res.data);
			}).catch(err => console.log(err));
        }, 1500);
	}
	
	componentDidMount = () => {
		Axios.get('http://localhost:3001/api/categories')
		.then(res => {
			console.log(res)
			this.setState({categories: res.data});
		}).catch(error => console.log(error));
	}

	render() {
		if (this.state.submitted) {
			return <Redirect to='/book' />
		}
		return (
			<>
				<Navigation />
				<div className='flex-center'>
					<div className='container'>
						<h1 className='h1-center'>Post your book ad ...</h1>
						<h4 className='h4-center'>Enter book details below</h4>
						<form onSubmit={e => this.handleSubmit(e)}>
							<div id='addBook'>
								<label htmlFor='title'>Title of book</label>
								<input type='text' id='title' name='title'onChange={this.handleChange}/>
								<label htmlFor='lastName'>Author of book</label>
								<input type='text' id='author' name='author'onChange={this.handleChange}/>
								<label htmlFor='publication'>Publication</label>
								<input type='text' id='publication' name='publication' onChange={this.handleChange}/>
								<label htmlFor='cost'>Cost</label>
								<input type='text' id='cost' name='cost' onChange={this.handleChange} />
								<label htmlFor='category'>Category</label>
								<div className="select">
									<select name="category" id="category" onChange={this.handleChange}>
										<option defaultValue disabled>Choose an option</option>
										{
											this.state.categories.map(category => {
											return <option value={category._id}>{category.name}</option>
											})
										}
									</select>
								</div>
								
							<label htmlFor='deliveryArea'>Delivery Area</label>
							<div className="select">
								<select name="deliveryArea" id="slct" onChange={this.handleChange} >
									<option defaultValue disabled>Choose an option</option>
									<option value="Within city">Within city</option>
									<option value="Near my area">Near my area</option>
									<option value="All over Nepal">All over Nepal</option>
								</select>
							</div>
							<label htmlFor='condition'>Condition of book</label>
							<div className="select">
								<select name="condition" id="slct" onChange={this.handleChange} >
									<option defaultValue disabled>Choose an option</option>
									<option value="New">New</option>
									<option value="Old">Old</option>
								</select>
							</div>
							<div id='book-image-ab'>
									<label id='book-img-label' htmlFor='book-img'>Book Picture</label>
									<div>
										<img id='image' src={this.state.image} alt='Book'/>
										<div className='upload-btn-wrapper'>
											<button className='btnFile'>Upload a pic</button>
											<input type='file' name='myfile' onChange={this.handleImageChange}/>
										</div>
									</div>
								</div>
							</div>
							
							<div className='flex-center'>
								<button className='btnMain'>Post</button>
							</div>
						</form>
						
					</div>
				</div>
			</>
		)
	}
}
