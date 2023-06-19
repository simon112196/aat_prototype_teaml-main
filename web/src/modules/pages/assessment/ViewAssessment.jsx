import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles/ViewAssessment.module.css";
import { NavBar, Main, Footer, Card } from "../../components/Layout";
import APIController from "../../utils/APIController";

/** @module ViewAssessment declaration.*/
const ViewAssessment = () => {

    const assessmentId = useParams().id;
    const [assessment, setAssessment] = useState();
    const [questions, setQuestions] = useState([]);
    const api = new APIController(true);

    const getAssessment = () => {
        api.get(`assessment/submission/${assessmentId}`)
            .then(res => res.json())
            .then(res => {
                setAssessment(res);
                const multiChoiceQuestions = res.assessment.multiple_choice_questions;
                const trueFalseQuestions = res.assessment.true_false_questions;
                setQuestions(multiChoiceQuestions.concat(trueFalseQuestions));
            });
    };

    useEffect(() => getAssessment(), []);

    return (
        <React.Fragment>
            <NavBar />
            <Main>
                <Card className={styles.card} >
                    <header className={styles.header} >
                        <section className={styles.header_sub} >
                            <h2>View an assessment submission</h2>
                            <p>{assessment?.assessment?.title}</p>
                        </section>
                        <section className={`${styles.header_sub} ${styles.header_sub_right}`} >
                            <h2>Result</h2>
                            <p>{assessment?.correct} / {questions?.length}</p>
                        </section>
                    </header>
                    <ul className={ styles.question_list } >
                        {
                            assessment?.questions?.map((item, index) =>
                                <li key={index} >
                                    {
                                        item.multi_choice_question &&
                                        <MutliChoiceQuestion index={index} question={item} />
                                    }
                                    {
                                        item.true_false_question &&
                                        <TrueFalseQuestion index={index} question={item} />
                                    }
                                </li>
                            )
                        }
                    </ul>
                </Card>
            </Main>
            <Footer />
        </React.Fragment>
    );

};

const MutliChoiceQuestion = props => {
    
    console.log(props)
    return (
        <article>
            <header>
                <h3>
                    { props.question.multi_choice_question.title }
                </h3>
            </header>
            <section className={ styles.info_section } >
                <p><span className={ styles.bold } >Question:</span> { props.question.multi_choice_question.label }</p>
                <p><span className={ styles.bold } >Answer:</span> { props.question.multi_choice_question.answer.label }</p>
                <p><span className={ styles.bold } >You answered:</span> { props.question.answer }</p>
                <p><span className={ styles.bold } >Correct:</span> { props.question.result.toString() }</p>
            </section>
        </article>
    );

};

const TrueFalseQuestion = props => {

    return (
        <article>
            <header>
                <h3>
                    { props.question.true_false_question.title }
                </h3>
            </header>
            <section className={ styles.info_section } >
                <p><span className={ styles.bold } >Question:</span> { props.question.true_false_question.label }</p>
                <p><span className={ styles.bold } >Answer:</span> { props.question.true_false_question.answer.toString() }</p>
                <p><span className={ styles.bold } >You answered:</span> { props.question.answer }</p>
                <p><span className={ styles.bold } >Correct:</span> { props.question.result.toString() }</p>
            </section>
        </article>
    );

};


export default ViewAssessment;
