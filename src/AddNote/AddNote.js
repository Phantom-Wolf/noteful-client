import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import NotefulContext from '../NotefulContext';
import ValidateForm from '../ValidateForm/ValidateForm';

export class AddNote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: {
				value: '',
				touched: false,
			},
			content: {
				value: '',
				touched: false,
			},
			option: {
				id: '',
				touched: false,
			},
			error: null,
		};
	}

	static contextType = NotefulContext;
	static defaultProps = {
		folders: [],
	};

	// Pass user input into state

	updateName(name) {
		this.setState({ name: { value: name, touched: true } });
	}

	updateContent(content) {
		this.setState({ content: { value: content, touched: true } });
	}

	updateOption(option) {
		this.setState({ option: { id: option, touched: true } });
	}

	// validate user input

	validateName() {
		const name = this.state.name.value.trim();
		if (name.length === 0) {
			return 'Name is required';
		} else if (name.length < 2) {
			return 'Name must be atleast 2 characters long';
		}
	}

	validateContent() {
		const content = this.state.content.value.trim();
		if (content.length === 0) {
			return 'Content is required';
		} else if (content.length < 5) {
			return 'Content must be atleast 5 characters long';
		}
	}

	validateOption() {
		const option = this.state.option.id.trim();
		if (option.length === 0 || option.length === null || option === '...') {
			return 'You must choose a valid folder location';
		}
	}

	// add note API call

	handleSubmit = (event) => {
		event.preventDefault();

		const note = {
			note_name: this.state.name.value,
			date_modified: new Date(),
			folder_id: this.state.option.id,
			content: this.state.content.value,
		};
		this.setState({ error: null });
		fetch('http://localhost:8000/api/notes', {
			method: 'POST',
			body: JSON.stringify(note),
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
				this.context.addNote(data);
				this.props.history.push('/');
			})
			.catch((err) => {
				this.setState({
					error: err.message,
				});
			});
	};

	render() {
		const { folders = [] } = this.context;
		return (
			<section>
				<h2>Add a Note</h2>
				<NotefulForm onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor='name'> Name</label>
						<input
							type='text'
							className='note__name'
							id='name'
							onChange={(e) => this.updateName(e.target.value)}
						/>
						{this.state.name.touched && (
							<ValidateForm message={this.validateName()} />
						)}
					</div>
					<div>
						<label htmlFor='content'> Content</label>
						<textarea
							name='content'
							id='content'
							rows='5'
							cols='33'
							onChange={(e) => this.updateContent(e.target.value)}
						/>
						{this.state.content.touched && (
							<ValidateForm message={this.validateContent()} />
						)}
					</div>
					<div>
						<label htmlFor='note-folder-select'>Folder</label>
						<select
							id='note-folder-select'
							name='note-folder-id'
							onChange={(e) => this.updateOption(e.target.value)}
						>
							<option value={null}>...</option>
							{folders.map((folder) => (
								<option key={folder.id} value={folder.id}>
									{folder.folder_name}
								</option>
							))}
						</select>
						{this.state.option.touched && (
							<ValidateForm message={this.validateOption()} />
						)}
					</div>
					<div>
						<button
							type='submit'
							disabled={
								this.validateName() ||
								this.validateContent() ||
								this.validateOption()
							}
						>
							Add Note
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

export default AddNote;
