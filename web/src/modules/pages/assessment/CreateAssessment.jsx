import React, { useState } from "react";
import styles from "./styles/CreateAssessment.module.css";
import { useNavigate } from "react-router-dom";
import { Fieldset, BasicInput, Checkbox, Submit, Button } from "../../components/Inputs";
import { NavBar, Main, Footer, Card } from "../../components/Layout";
import APIController from "../../utils/APIController";

/** @module CreateAssessment declaration.*/
const CreateAssessment = () => {

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState(['']);

    const navigate = useNavigate();
    const api = new APIController(true);
    
    const submit = event => {
        event.preventDefault();
        if (questions?.length < 1) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("multi_choice", JSON.stringify( questions.filter(item => item[0].type === "Multi-Choice").map(item => formatMultiChoice(item)) ));
        formData.append("true_false", JSON.stringify( questions.filter(item => item[0].type === "True / False").map(item => formatTrueFalse(item)) ));

        api.post('assessments', formData)
            .then(res => navigate("/"));
    };

    /** 
     * @description
     * Format the object before sending.
     * each entry is for one input, match them to 
     * what you want to send to the backend for each
     * question.
     */
    const formatTrueFalse = inputs => ({
        "title": inputs[0].input,
        "label": inputs[1].input,
        "answer": inputs[2].input,
        "difficulty": inputs[3].input,
        "feedback": inputs[4].input,
        "feedforward": inputs[5].input,
    });

    const formatMultiChoice = inputs => ({
        "title": inputs[0].input,
        "label": inputs[1].input,
        "options": inputs[2].input,
        "answer": inputs[3].input,
        "difficulty": inputs[4].input,
        "feedback": inputs[5].input,
        "feedforward": inputs[6].input,
    });

    /** 
     * @description
     * The layout of a group of inputs (i.e: question) can be
     * configured in the "blank" variable. Each row stands for an input.
     * If the "input" field is defined as a string (i.e: ""), the input will be
     * a <BasicInput />
     * If the "input" field is defined as a boolean (i.e: false / true), the input
     * will be a <Checkbox />.
     */
    const addQuestion = () => {
        // Set the 'blank' variable to the structure of your component
        const blank = [
            { "input": "", "placeholder": "Title", "required": true, "type": "True / False" },
            { "input": "", "placeholder": "Label", "required": true, "type": "True / False" },
            { "input": false, "placeholder": "Answer (tick for true)", "required": false, "type": "True / False" },
            { "input": "", "placeholder": "Difficulty", "required": true, "type": "True / False" },
            { "input": "", "placeholder": "Feedback", "required": true, "type": "Multi-Choice" },
            { "input": "", "placeholder": "Feedforward", "required": true, "type": "Multi-Choice" },
        ];
        setQuestions(() => [...questions, blank]);
    };

    /** @description Same as addQuestion. */
    const addMutliChoice = () => {
        // Set the 'blank' variable to the structure of your component
        const blank = [
            { "input": "", "placeholder": "Title", "required": true, "type": "Multi-Choice" },
            { "input": "", "placeholder": "Label", "required": true, "type": "Multi-Choice" },
            { "input": ["", "", "", ""], "placeholder": ["Option(At least 2 options should be input)", "Option", "Option", "Option"], "required": [true, true, false, false], "type": "Multi-Choice" },
            { "input": "", "placeholder": "Answer(Should be same as one of the option)", "required": true, "type": "Multi-Choice" },
            { "input": "", "placeholder": "Difficulty(Number required)", "required": true, "type": "Multi-Choice" },
            { "input": "", "placeholder": "Feedback", "required": true, "type": "Multi-Choice" },
            { "input": "", "placeholder": "Feedforward", "required": true, "type": "Multi-Choice" },
        ];
        setQuestions(() => [...questions, blank]);
    };

    const handleChange = (event, type, i, j, k) => {
        if (!questions) return;
        let values = [...questions];
        if (type === "text") values[i][j].input = event.target.value;
        if (type === "checkbox") values[i][j].input = event.target.checked;
        if (type === "array") values[i][j].input[k] = event.target.value;
        setQuestions( values );
    };

    const removeElement = (event, index) => {
        let values = [...questions];
        values.splice(index, 1);
        setQuestions( values );
    };

    const getElement = (element, i, j) => {
        if (Array.isArray(element.input)) {
            return (
                <ul className={ styles.option_list }  >
                    {
                    element.input.map((item, k) => 
                        <li key={ `${i}-${j}-${k}` }>
                            <BasicInput 
                                value={ element.input[k] || "" }
                                required={ element.required[k] }
                                handleChange={ event => handleChange(event, "array", i, j, k) }
                                placeholder={ element.placeholder[k] }
                            />
                        </li>
                    )
                    }
                </ul>
            );
        };
        if (typeof element.input === "boolean") {
            return <Checkbox
                    key={ `${i}-${j}` }
                    value={ element.input || false }
                    required={ element.required }
                    handleChange={ event => handleChange(event, "checkbox", i, j, 0) }
                    label={ element.placeholder }
                    id={`checkbox-${i}-${j}`}
                />
        };
        if (typeof element.input === "string") {
            return <BasicInput
                    key={ `${i}-${j}` }
                    value={ element.input || '' }
                    required={ element.required }
                    placeholder={ element.placeholder }
                    handleChange={ event => handleChange(event, "text", i, j, 0) }
                >
                    <span onClick={ event => removeElement(event, i) }>
                        { j === 0 && <p>X</p> }
                    </span>
                </BasicInput>
        };
    };


    return (
        <React.Fragment>
            <NavBar />
            <Main>
                <Card className={ styles.card } >
                    <header>
                        <h2>Create an Assessment</h2>
                    </header>
                    <section className={ styles.scroll } >
                        <form id="create-assessment" className={ styles.form } onSubmit={ submit } >
                            <Fieldset form="create-assessment" className={ styles.questions_fieldset } >
                                <BasicInput
                                    value={ title }
                                    setValue={ setTitle }
                                    placeholder="Assessment title"
                                />
                            </Fieldset>
                            <Fieldset form="create-assessment" className={ styles.questions_fieldset } >
                                <ul className={ styles.questions } >
                                    {
                                        questions?.map((group, i) =>
                                            <li key={ i } className={ styles.question } >
                                                <label>
                                                    Question { i + 1 }: { group[0]?.type }
                                                </label>
                                                {
                                                    group.map((el, j) => getElement(el, i, j))
                                                }

                                            </li>
                                        )
                                    }
                                </ul>
                            </Fieldset>
                        </form>
                    </section>
                    <section>
                        <section className={ styles.button_row } >
                            <Button
                                text_color="var(--pink)"
                                onClick={ addQuestion.bind(this) }
                                ariaLabel={ "add-question" }
                            >
                                Add True/False Question
                            </Button>
                            <Button
                                text_color="var(--pink)"
                                onClick={ addMutliChoice.bind(this) }
                                ariaLabel={ "add-multichoice" }
                            >
                                Add MultiChoice
                            </Button>
                        </section>
                        <Fieldset form="create-assessment">
                            <Submit
                                form="create-assessment"
                            />
                        </Fieldset>
                    </section>
                </Card>
            </Main>
            <Footer />
        </React.Fragment>
    );
};


export default CreateAssessment;
