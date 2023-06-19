import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles/Stats.module.css";
import { NavBar, Main, Footer, Card } from "../../components/Layout";
import APIController from "../../utils/APIController";

/** @module Stats declaration.*/
const Stats = () => {

    const [stats, setStats] = useState();
    const api = new APIController(true);

    const getStats = () => {
        api.get("stats")
            .then(res => res.json())
            .then(res => setStats(res));
    };

    useEffect(() => getStats(), []);

    return (
        <React.Fragment>
            <NavBar />
            <Main>
                <Card className={ styles.card } >
                    <header className={ styles.header } >
                        <h2>View your stats</h2>
                    </header>
                    <ul>
                        {
                            stats?.map((item, index) =>
                                <li>
                                    <article>
                                        <header>
                                            <h3>
                                                Assessment { index }: { item.assessment_name }
                                            </h3>
                                        </header>
                                        <section>
                                            <p>Question: {item.question}</p>
                                            <p>Answer: {item.answer}</p>
                                            <p>Correct: { item.correct }</p>
                                        </section>
                                    </article>
                                </li>
                            )
                        }
                        {
                    user?.__tablename__ === "Lecturer" &&
                    <React.Fragment>
                        <Card className={ styles.card } >
                            <section>
                                <ul>
                                    {
                                     stats?.map((item, index) =>
                                     <li>
                                         <article>
                                             <header>
                                                 <h3>
                                                     Student { index }: { item.student_id }
                                                 </h3>
                                             </header>
                                             <section>
                                                 <p>Asessment: {item.assessment_name}</p>
                                                 <p>Correct: { item.correct }</p>
                                             </section>
                                         </article>
                                     </li>
                                 )       

                                    //    assessments?.map((item, index) => 
                                    //         <li className="pointer" onClick={ () => navigate(`/assessment/${ item?.id }`) } key={ index } >
                                    //             <p>{ index + 1 } - { item?.submission?.student_id}</p>
                                    //         </li>
                                    //     )
                                    }
                                </ul>


                            </section>
                        </Card>
                    </React.Fragment>
                }
                    </ul>
                </Card>
            </Main>
            <Footer />
        </React.Fragment>
    );

};

export default Stats;