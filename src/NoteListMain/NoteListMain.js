import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Note from "../Note/Note";
import NoteFulContext from "../NotefulContext";
import CircleButton from "../CircleButton/CircleButton";
import "./NoteListMain.css";
import { getNotesForFolder } from "../notes-helpers";

export default class NoteListMain extends React.Component {
	static defaultProps = {
		match: {
			params: {},
		},
	};

	static contextType = NoteFulContext;
	render() {
		const { folderId } = this.props.match.params;
		const { notes = [] } = this.context;
		const notesForFolder = getNotesForFolder(notes, folderId);
		console.log(notesForFolder);

		return (
			<section className="NoteListMain">
				<ul>
					{notesForFolder.map((note) => (
						<li key={note.id}>
							<Note id={note.id} name={note.note_name} modified={note.date_modified} />
						</li>
					))}
				</ul>
				<div className="NoteListMain__button-container">
					<CircleButton
						tag={Link}
						to="/add-note"
						type="button"
						className="NoteListMain__add-note-button"
					>
						<FontAwesomeIcon icon="plus" />
						<br />
						Note
					</CircleButton>
				</div>
			</section>
		);
	}
}

NoteListMain.defaultProps = {
	notes: [],
};
NoteListMain.propTypes = {
	// folderId: PropTypes.number,
};
