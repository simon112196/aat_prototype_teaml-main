import * as React from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom";
import { useSelector } from 'react-redux';
import CreateAssessment from "./modules/pages/assessment/CreateAssessment";
import TakeAssessment from './modules/pages/assessment/TakeAssessment';
import ViewAssessment from './modules/pages/assessment/ViewAssessment';
import Home from "./modules/pages/home/Home";
import Comment from "./modules/pages/comments/Comment";
import Stats from "./modules/pages/stats/Stats";
import CommentEdit from "./modules/pages/comments/CommentEdit";
import { Login, Register, Logout } from "./modules/pages/auth"


/** @module Routes declaration.*/
const Routes = () => {

	const auth = useSelector(state => state.token);
	const user = useSelector(state => state.user.value);

	return (
		<Router>
			<Switch>
				{ !auth.value.access || !user ?
					<React.Fragment>
						<Route path="/register" element={ <Register /> } />
						<Route path="*" element={ <Login /> } />
					</React.Fragment>
				:
					<React.Fragment>
						<Route path="/assessment/new" element={ <CreateAssessment /> } />
						<Route path="/assessment/take/:id" element={ <TakeAssessment /> } />
						<Route path="/assessment/:id" element={ <ViewAssessment /> } />
						<Route path="/logout" element={ <Logout /> } />
						<Route path="/comments" element={ <Comment /> } />
						<Route path="/stats" element={ <Stats /> } />
						<Route path="/comment/:id" element={ <CommentEdit /> } />
						<Route path="*" element={ <Home /> } />
					</React.Fragment>
					}
			</Switch>
		</Router>
	);
}

export default Routes;