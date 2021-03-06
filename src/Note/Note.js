import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotefulContext from "../NotefulContext";
import config from "../config";
import "./Note.css";

export default class Note extends React.Component {
	state = {
		error: null,
	};

	static defaultProps = {
		onDeleteNote: () => {},
	};
	static contextType = NotefulContext;

	handleClickDelete = (e) => {
		e.preventDefault();
		const noteId = this.props.id;

		fetch(`${config.API_ENDPOINT}/api/notes/${noteId}`, {
			method: "DELETE",
			headers: {
				"content-type": "application/json",
			},
		})
			.then((res) => {
				console.log(res);
				if (!res.ok) return res.json().then((e) => Promise.reject(e));
				// return res.json();
			})
			.then(() => {
				console.log(noteId);
				this.setState({ error: null });
				this.context.deleteNote(noteId);
				// allow parent to perform extra behaviour
				this.props.onDeleteNote(noteId);
			})
			.catch((error) => {
				this.setState({
					error: error.message,
				});
			});
	};

	render() {
		const { name, id, modified } = this.props;

		return (
			<div className="Note">
				<h2 className="Note__title">
					<Link to={`/note/${id}`}>{name}</Link>
				</h2>
				<button className="Note__delete" type="button" onClick={this.handleClickDelete}>
					<FontAwesomeIcon icon="trash-alt" /> remove
				</button>
				<div className="Note__dates">
					<div className="Note__dates-modified">
						Modified <span className="Date">{format(modified, "Do MMM YYYY")}</span>
					</div>
				</div>
				{this.state.error && (
					<div>
						<p>{this.state.error}</p>
					</div>
				)}
			</div>
		);
	}
}

// Note.propTypes = {
// 	notes_name: PropTypes.string.isRequired,
// 	id: PropTypes.number.isRequired,
// 	modified: PropTypes.string.isRequired,
// 	handleClickDelete: PropTypes.func,
// };
