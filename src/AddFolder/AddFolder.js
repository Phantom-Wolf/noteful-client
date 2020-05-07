import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ValidateForm from '../ValidateForm/ValidateForm';
import NotefulContext from '../NotefulContext';

export class AddFolder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			touched: false,
			error: null,
		};
	}

	static contextType = NotefulContext;

	updateName(name) {
		this.setState({ name, touched: true });
	}

	validateName() {
		const name = this.state.name.trim();
		if (name.length === 0) {
			return 'Name is required';
		} else if (name.length < 2) {
			return 'Name must be atleast 2 characters long';
		}
	}

	handleSubmit = (event) => {
		event.preventDefault();

		const { name } = event.target;
		console.log(name.value);
		const folder = {
			folder_name: name.value,
		};
		console.log(folder);
		this.setState({ error: null });
		fetch('http://localhost:8000/api/folders', {
			method: 'POST',
			body: JSON.stringify(folder),
			headers: {
				'content-type': 'application/json',
			},
		})
			.then((res) => {
				if (!res.ok) {
					// get the error message from the response,
					return res.json().then((error) => {
						// then throw it
						throw error;
					});
				}
				return res.json();
			})
			.then((data) => {
				this.context.addFolder(data);
				this.props.history.push('/');
			})
			.catch((err) => {
				this.setState({
					error: err.message,
				});
			});
	};

	render() {
		return (
			<section className='addfolder'>
				<h2>Create a Folder</h2>
				<NotefulForm onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							name='name'
							id='name'
							onChange={(e) => this.updateName(e.target.value)}
						/>
						{this.state.touched && (
							<ValidateForm message={this.validateName()} />
						)}
					</div>
					<div>
						<button type='submit' disabled={this.validateName()}>
							Add Folder
						</button>
					</div>
				</NotefulForm>
				{this.state.error && (
					<div>
						<p>{this.state.error}</p>
					</div>
				)}
			</section>
		);
	}
}

export default AddFolder;
