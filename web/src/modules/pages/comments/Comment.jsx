import React, { useEffect, useState } from "react";
import { NavBar, Main, Footer, Card } from "../../components/Layout";
import { useSelector } from "react-redux";
import styles from "./styles/Comment.module.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { TextArea, Button, Fieldset, Submit } from "../../components/Inputs";


/** @module Comment declaration.*/
const Comment = () => {
	const user = useSelector(state => state.user.value);
	const token = useSelector(state => state.token.value.access);

	const [content, setContent] = useState("");
	const [ascending, setAscending] = useState(false);
	const [comments, setComments] = useState([]);
	const [total, setTotal] = useState(0);
	const [page,setPage] = useState(1);
	const navigate = useNavigate();

	const submit = event => {
		event.preventDefault();
		if (!content) return;
		let headers = new Headers();
		headers.append("Authorization", `Bearer ${ token }`);

		const formData = new FormData();
		formData.append("content", content);

		fetch(`${ process.env.SERVER_ADDRESS }/api/comments`, {
			method: "POST",
			headers: headers,
			body: formData
		}).then(res => {
			if (!res || res.status >= 400) {
				if (res.status === 401) helpers.logout();
				return;
			};
			setPage(1);
			getComments();
		})
		.catch(err => console.log({ error: err }));
	};

	const submitDelete = (itemId) => {
		let headers = new Headers();
		headers.append("Authorization", `Bearer ${ token }`);

		fetch(`${process.env.SERVER_ADDRESS}/api/comment/${ itemId }`, {
			method: "DELETE",
			headers: headers,
		}).then(res => {
			if (!res || res.status >= 400) {
				if (res.status === 401) helpers.logout();
				return;
			};
			getComments();
		});
	};

	const getComments = () => {
		let headers = new Headers();
		headers.append("Authorization", `Bearer ${ token }`);

		fetch(`${process.env.SERVER_ADDRESS}/api/comments?ascending=${ ascending }&page=${page}`, {
			method: "GET",
			headers: headers,
		}).then(res => {
			if (!res || res.status >= 400) {
				if (res.status === 401) helpers.logout();
				return;
			};
			return res.json();
		}).then(res => {setComments(res.data);setTotal(res.total)})
		.catch(err => console.log({ error: err }));
	};

	const sort = () => {
		setAscending(!ascending);
		getComments();
	};

	const goPage = (pageNum) =>{
		setPage(pageNum)
		getComments();
	}

	useEffect(() => getComments(), []);

	return (
		<React.Fragment>
			<NavBar />
			<Main>
				<Card  >
					<div className={styles.scrollContainer} style={{'overflow':'scroll','height':(document.body.offsetHeight - 120)+'px'}}>
					<form id="comment-form" onSubmit={ submit } >
						<header>
							<h2>Submit a Comment</h2>
						</header>
						<Fieldset form="comment-form" className={ styles.addCommentArea } >
							<TextArea
								value={ content }
								setValue={ setContent }
								rows="3"
								form="comment-form"
								placeholder="Comment content"
							/>
						</Fieldset>
						<Fieldset form="comment-form">
							<Submit
								form="comment-form"
							/>
						</Fieldset>
					</form>
					<div>
						<header>
							<h2>Current comments</h2>
						</header>
						<section className={ styles.CommentContentAreaOp }>
							<header>
								<span className={ styles.CommentContentAreaOpT  } >
									<h3>Ordering</h3>
									<p onClick={ sort }>{ ascending ? "ascending" : "descending" }</p>
								</span>
								<p>total { total }</p>
							</header>
						</section>
						<section className={ styles.CommentContentAreaItems }>
							<header>
								<h3>Comment list</h3>
							</header>
							{
								comments?.map((item, index) => (
									<article key={index} className={ styles.CommentContentAreaItem }>
										<section className={ styles.CommentContentAreaItemContent }>
											<header className={ styles.header }>
												<h5>{ item.student?.username || item.lecturer?.username }: </h5>
											</header>
											<p>{ item.content }</p>
										</section>
										<section className={ styles.CommentContentAreaItemContent }>
											<header style={{ display: "inline" }} >
												<h5>Timestamp: </h5>
											</header>
											<p>
												{ dayjs(item.create_time).format('YYYY.MM.DD') } at { dayjs(item.create_time).format('HH:mm') }
											</p>
										</section>
										<form id="change-form">
											<Fieldset form="change-form" className={ styles.fieldset }>
												{
													((user?.username === item.student?.username) || (user?.username === item.lecturer?.username)) &&
													<Button
														onClick={ event => navigate(`/comment/${ item.id }`)}
														form="change-form"
														className={ styles.button }
													>
														Edit
													</Button>
												}

												{
													((user?.username === item.student?.username) || user?.__tablename__ ==='Lecturer') &&
													<Button
														onClick={ event => submitDelete( item.id )}
														form="change-form"
														className={ styles.button }
													>
														Delete
													</Button>
												}

											</Fieldset>
										</form>
									</article>
								))
							}
						</section>
					</div>
					{
						total>10&&(
							<div className={styles.pagination}>
								{
									 page-2 >= 0&&page+1 > Math.ceil(total/10) && (
										 <span
										 onClick={()=>{
											 goPage(page-2)
										 }}
										 >{page-2}</span>
									 )
								}
								{
									 page-1 >= 1 && (
										 <span
										 onClick={()=>{
											 goPage(page-1)
										 }}
										 >{page-1}</span>
									 )
								}
								<span
								onClick={()=>{
									goPage(page)
								}}
								 className={styles.activeSpan}>{page}</span>
								{
									 page+1 <= Math.ceil(total/10) && (
										 <span
										 onClick={()=>{
		 									 goPage(page+1)
		 								 }}
										 >{page+1}</span>
									 )
								}
								{
									 page-1 <= 0&&page+2 <= Math.ceil(total/10) && (
										 <span
										 onClick={()=>{
		 									 goPage(page+2)
		 								 }}
										 >{page+2}</span>
									 )
								}
							</div>
						)
					}
					</div>
				</Card>
			</Main>
			<Footer />
		</React.Fragment>
	);

};


export default Comment;