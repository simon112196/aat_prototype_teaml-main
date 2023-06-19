import React, { useEffect, useState } from "react";
import { NavBar, Main, Footer } from "../../components/Layout";
import styles from "./styles/CommentEdit.module.css"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TextArea, Fieldset, Submit } from "../../components/Inputs";
import APIController from "../../utils/APIController";


/** @module CommentEdit declaration.*/
const CommentEdit = () => {

	const commentId = useParams().id;
	const [content, setContent] = useState("");
	const navigate = useNavigate();
	const api = new APIController(true);

	const getComment = () => {
		api.get(`comment/${ commentId }`)
			.then(res => res.json())
			.then(res => setContent(res.content));
	};

	const submit = event => {
		event.preventDefault();
		if (!content) return;
	
		const formData = new FormData();
		formData.append("content", content);
		
		api.put(`comment/${ commentId }`, formData)
			.then(res => navigate('/comments'));
	};

	useEffect(() => getComment(), []);

	return (
		<React.Fragment>
			<NavBar />
			<Main>
				<div>
					<span onClick={ event => navigate(`/comments`) } >&lt;&lt;Go back</span>
				</div>
				<form id="comment-form" className={styles.container} onSubmit={ submit } >
					<Fieldset form="comment-form" className={styles.textareaDiv}>
						<TextArea
							value={ content }
							setValue={ setContent }
							form="comment-form"
							rows="3"
						/>
					</Fieldset>
					<Fieldset form="comment-form" className={styles.submitDiv}>
						<Submit
							form="comment-form"
						>
							Update 
						</Submit>
					</Fieldset>
				</form>
			</Main>
			<Footer />
		</React.Fragment>
	);
};


export default CommentEdit;
