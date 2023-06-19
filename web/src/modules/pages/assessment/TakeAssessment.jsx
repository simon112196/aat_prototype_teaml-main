import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavBar, Main, Footer, Card } from "../../components/Layout";
import { Checkbox, Fieldset, Radio, Submit } from "../../components/Inputs";
import APIController from "../../utils/APIController";


/** @module TakeAssessment declaration.*/
const TakeAssessment = () => {

    const assessmentId = useParams().id;
    const [assessment, setAssessment] = useState();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();
    const api = new APIController(true);

    /** @description Get the assessment questions */
    const getAssessment = () => {
        if (!assessmentId) return;
        api.get(`assessment/${ assessmentId }`)
            .then(res => res.json())
            .then(res => setAssessment(res));
    };

    const submit = event => {
        event.preventDefault();

        if (!assessmentId) return;

        const formData = new FormData();
        answers.forEach(item => formData.append("answers", JSON.stringify(item)));

        api.post(`assessment/submissions/${ assessmentId }`, formData)
            .then(res => res.json())
            .then(res => {
                navigate(`/assessment/${ res.id }`);
            });
    };

    useEffect(() => {
        if (!assessment) return;
        const arr = assessment.multiple_choice_questions.concat(assessment.true_false_questions);
        setQuestions(arr);
    }, [assessment]);

    useEffect(() => {
        if (questions.length < 1) return;
        setAnswers(questions.map(item => {
            if (item.__tablename__ === "MultiChoiceQuestion") {
                return ({
                    "id": item.id,
                    "answer": ""
                });
            };
            return ({
                "id": item.id,
                "answer": false
            });
        }));
    }, [questions]);
    useEffect(() => getAssessment(), []);

    return (
        <React.Fragment>
            <NavBar />
            <Main>
                <Card>
                    <header>
                        <h2>Take an assessment</h2>
                    </header>
                    <ul>
                        {
                            questions?.map((item, index) => 
                                item.__tablename__ === "MultiChoiceQuestion" ?
                                    <MultiChoice
                                        key={ index }
                                        setValue={ setAnswers }
                                        question={ item }
                                        answers={ answers }
                                    />
                                :
                                    <TrueFalse
                                        key={ index }
                                        setValue={ setAnswers }
                                        question={ item }
                                        answers={ answers }
                                    />
                            )
                        }
                    </ul>
                    <form id="assessment-form" onSubmit={ submit } >
                        <Fieldset form="assessment-form">
                            <Submit form="assessment-form" />
                        </Fieldset>
                    </form>
                </Card>
            </Main>
            <Footer />
        </React.Fragment>
    );

};


const MultiChoice = props => {
    
    const [index, setIndex] = useState(0);

    const handleChange = event => {
        const values = [...props.answers];
        values[index].answer = event.target.value;
        props.setValue(values);
    };

    useEffect(() => {
        if (!props.answers);
        setIndex(props.answers.findIndex(item => item.id === props.question.id));
    }, [props.answers]);

    return (
        <li>
            <header>
                <h3>{ props.question.title }</h3>
            </header>
            <Fieldset form="assessment-form" >
                <p>{ props.question.label }</p>
                <ul>
                    {
                        props.question.options.map((item, index) => 
                            <li key={ index }>
                                <Radio
                                    id={ `radio-${item.id}-${index}` }
                                    handleChange={ handleChange }
                                    form="assessment-form"
                                    label={ item.label }
                                    value={ item.id } 
                                    name={ props.question.id }
                                />
                            </li>
                        )
                    }
                </ul>
            </Fieldset>
        </li>
    );

};


const TrueFalse = props => {

    const [index, setIndex] = useState(0);

    const handleChange = event => {
        const values = [...props.answers];
        values[index].answer = event.target.checked;
        props.setValue(values);
    };

    useEffect(() => {
        if (!props.answers);
        setIndex(props.answers.findIndex(item => item.id === props.question.id));
    }, [props.answers]);

    return (
        <li>
            <header>
                <h3>{ props.question.title }</h3>
            </header>
            <Fieldset form="assessment-form" >
                <p>{ props.question.label }</p>
                <Checkbox
                    handleChange={ handleChange }
                    form="assessment-form"
                    value={ props.answers[index]?.answer }
                    label="True / False"
                    id={`checkbox-${props.question.id}`}
                />
            </Fieldset>
        </li>
    );

};


export default TakeAssessment;
