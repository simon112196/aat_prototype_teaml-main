import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Home.module.css";
import { NavBar, Main, Footer, Card } from "../../components/Layout";
import APIController from "../../utils/APIController";


/** @module Home declaration.*/
const Home = () => {

    const user = useSelector(state => state.user.value);
    const [assessments, setAssessments] = useState([]);
    const [comments, setComments] = useState([]);
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();
    const api = new APIController(true);

    const getAssessments = () => {
        api.get('assessments')
            .then(res => res.json())
            .then(res => setAssessments(res))
    };
    
    const getComments = () => {
        api.get('comments')
            .then(res => res.json())
            .then(res => setComments(res.data));
    };

    const getStats = () => {
        //Null until it returns something
        api.get('stats')
            .then(res => res.json())
            .then(res => setStats(res));
    };

    useEffect(() => {
        getAssessments();
        getComments();
        getStats();
    }, []);
 
    return (
        <React.Fragment>
            <NavBar />
            <Main className={ styles.main } >
                {
                    user?.__tablename__ === "Student" &&
                    <React.Fragment>
                        <Card className={ styles.card } >
                            <section>
                                <header>
                                    <h2>My Assessments</h2>
                                </header>
                                <ul>
                                    {
                                        user?.assessment_submissions?.map((item, index) => 
                                            <li onClick={ () => navigate(`/assessment/view/${ item?.id }`) } key={ index } >
                                                <p>{ item?.id }</p>
                                            </li>
                                        )
                                    }
                                </ul>
                            </section>
                        </Card>
                        <Card className={ styles.card } >
                            <section>
                                <header>
                                    <h2>Take Assessment</h2>
                                </header>
                                <ul>
                                    {
                                        assessments?.map((item, index) => 
                                            <li key={ index } onClick={ () => navigate(`/assessment/take/${ item?.id }`) } >
                                                <p>{ item?.id }</p>
                                            </li>
                                        )
                                    }
                                </ul>
                            </section>
                        </Card>
                        <Card className={ styles.card } >
                            <section>
                                <header className="pointer" onClick={ event => navigate(`/comments`)} >
                                    <h2>Comments</h2>
                                </header>
                                    {
                                        comments?.map((item, index) => 
                                        <li key={ index } className="pointer" onClick={ () => navigate(`/comment/${ item?.id }`) } >
                                            <h5>{ item?.lecturer?.username || item?.student?.username }: </h5>
                                            <p>{ item?.content }</p>
                                        </li>
                                        )
                                    }
                            </section>
                        </Card>
                        <Card className={ styles.card } >
                            <section>
                                <header className="pointer" onClick={ event => navigate(`/stats`)} >
                                    <h2>Stats</h2>
                                </header>
                                    {/*{*/}
                                    {/*    comments?.map((item, index) =>*/}
                                    {/*    <li key={ index } className="pointer" onClick={ () => navigate(`/stats/${ item?.id }`) } >*/}
                                    {/*        <h5>{ item?.lecturer?.username || item?.student?.username }: </h5>*/}
                                    {/*        <p>{ item?.content }</p>*/}
                                    {/*    </li>*/}
                                    {/*    )*/}
                                    {/*}*/}
                            </section>
                        </Card>
                    </React.Fragment>
                }
                {
                    user?.__tablename__ === "Lecturer" &&
                    <React.Fragment>
                        <Card className={ styles.card } >
                            <section>
                                <header>
                                    <h2>My Assessments</h2>
                                </header>
                                <ul>
                                    {
                                        user?.assessments?.map((item, index) => 
                                            <li key={ index } >
                                                <p>{ item?.id }</p>
                                            </li>
                                        )
                                    }
                                </ul>
                            </section>
                        </Card>
                        <Card className={ styles.card } >
                            <section>
                                <header className="pointer" onClick={ event => navigate(`/comments`)} >
                                    <h2>Comments</h2>
                                </header>
                                {console.log(comments)}
                                    {
                                        comments?.map((item, index) => 
                                        <li key={ index } className="pointer" onClick={ () => navigate(`/comment/${ item?.id }`) } >
                                            <h5>{ item?.lecturer?.username || item?.student?.username }: </h5>
                                            <p>{ item?.content }</p>
                                        </li>
                                        )
                                    }
                            </section>
                        </Card>
                    </React.Fragment>
                }
                {
                    user?.__tablename__ === "Lecturer" &&
                    <React.Fragment>
                        <Card className={ styles.card } >
                            <section>
                                <header className="pointer" onClick={ event => navigate(`/stats`)} >
                                    <h2>My Stats</h2>
                                </header>

                                {/* <ul>
                                    {
                                        stats?.map((item, index) => 
                                            <li key={ index } >
                                                <p>{ index + 1 } - { item.toString() }</p>
                                            </li>
                                        )
                                    }
                                </ul> */}

                                <ul>
                                    {
                                       assessments?.map((item, index) => 
                                            <li className="pointer" onClick={ () => navigate(`/assessment/${ item?.id }`) } key={ index } >
                                                <p>{ index + 1 } - { item?.assessment_name}</p>
                                            </li>
                                        )
                                    }
                                </ul>

                                {/*<ul>*/}
                                {/*    {*/}
                                {/*        stats?.map((item, index) => */}
                                {/*            <li key={ index } >*/}
                                {/*                <p>{ item.toString() }</p>*/}
                                {/*            </li>*/}
                                {/*        )*/}
                                {/*    }*/}
                                {/*</ul>*/}

                            </section>
                        </Card>
                    </React.Fragment>
                }
            </Main>
            <Footer />
        </React.Fragment>
    );

};


export default Home;
