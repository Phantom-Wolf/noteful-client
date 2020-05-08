import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import NotefulContext from '../NotefulContext';
import NotefulError from '../NotefulError';
import config from '../config';
import './App.css';

class App extends Component {
	state = {
		notes: [],
		folders: [],
		error: null,
	};

	componentDidMount() {
		Promise.all([
			fetch(`${config.API_ENDPOINT}/api/notes`),
			fetch(`${config.API_ENDPOINT}/api/folders`),
		])
			.then(([notesRes, foldersRes]) => {
				if (!notesRes.ok)
					return notesRes.json().then((e) => Promise.reject(e));
				if (!foldersRes.ok)
					return foldersRes.json().then((e) => Promise.reject(e));

				return Promise.all([notesRes.json(), foldersRes.json()]);
			})
			.then(([notes, folders]) => {
				this.setState({ notes, folders });
				this.setState({ error: null });
			})
			.catch((error) => {
				this.setState({
					error: error.message,
				});
			});
	}

	handleDeleteNote = (noteId) => {
		console.log(noteId);
		this.setState({
			notes: this.state.notes.filter(
				(note) => note.id !== parseInt(noteId)
			),
		});
	};

	addFolder = (folder) => {
		this.setState({
			folders: [...this.state.folders, folder],
		});
	};

	addNote = (note) => {
		this.setState({
			notes: [...this.state.notes, note],
		});
	};

	renderNavRoutes() {
		return (
			<>
				{['/', '/folder/:folderId'].map((path) => (
					<Route
						exact
						key={path}
						path={path}
						component={NoteListNav}
					/>
				))}
				<Route path='/note/:noteId' component={NotePageNav} />
				<Route path='/add-folder' component={NotePageNav} />
				<Route path='/add-note' component={NotePageNav} />
			</>
		);
	}

	renderMainRoutes() {
		return (
			<>
				{['/', '/folder/:folderId'].map((path) => (
					<Route
						exact
						key={path}
						path={path}
						component={NoteListMain}
					/>
				))}
				<Route path='/note/:noteId' component={NotePageMain} />
				<Route path='/add-folder' component={AddFolder} />
				<Route path='/add-note' component={AddNote} />
			</>
		);
	}

	render() {
		const value = {
			notes: this.state.notes,
			folders: this.state.folders,
			deleteNote: this.handleDeleteNote,
			addFolder: this.addFolder,
			addNote: this.addNote,
		};
		return (
			<NotefulContext.Provider value={value}>
				<div className='App'>
					<NotefulError>
						<nav className='App__nav'>{this.renderNavRoutes()}</nav>
					</NotefulError>
					<header className='App__header'>
						<h1>
							<Link to='/'>Noteful</Link>{' '}
							<FontAwesomeIcon icon='check-double' />
						</h1>
					</header>
					<NotefulError>
						<main className='App__main'>
							{this.renderMainRoutes()}
						</main>
					</NotefulError>
				</div>
				{this.state.error && (
					<div>
						<p>{this.state.error}</p>
					</div>
				)}
			</NotefulContext.Provider>
		);
	}
}

export default App;
