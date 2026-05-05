import { useState, useEffect } from 'react';
import './Home.css';

const API_URL = "http://localhost:8000/";

// home page component
function Home() {
    // state to store levels
    const [levels, setLevels] = useState([]);
    // state to store dictionary entries
    const [dictionaryEntries, setDictionaryEntries] = useState([]);
    // state to track whether the dictionary panel is visible
    const [dictionaryOpen, setDictionaryOpen] = useState(false);
    // state to store user's current level
    const [userLevelId, setUserLevelId] = useState(2);
    // state to store selected level for quiz
    const [selectedLevel, setSelectedLevel] = useState(null);
    // state to store quiz questions
    const [questions, setQuestions] = useState([]);
    // state to track current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // state to track number of correct answers
    const [correctAnswers, setCorrectAnswers] = useState(0);
    // state to track user's score
    const [score, setScore] = useState(0);
    // state to track user's answer input
    const [userAnswer, setUserAnswer] = useState('');
    // state to track if quiz is finished
    const [quizFinished, setQuizFinished] = useState(false);
    // state to track any error messages
    const [error, setError] = useState('');

    // fetch levels and user's current level on component mount
    useEffect(() => {
        // check if user is logged in by checking for token in local storage
        const token = localStorage.getItem('access_token');
        if (!token) {
            return;
        }

        // fetch levels from database
        fetch(`${API_URL}levels/get`)
            .then(res => res.json())    //convert response to json
            .then(data => {             // ensure data is an array (in case only one level is returned)
                const levelsArray = Array.isArray(data) ? data : [data];
                setLevels(levelsArray);
            })
            .catch(err => setError("Failed to load levels."));

        // fetch user's current level from database
        fetch(`${API_URL}users/get`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json().then(data => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                if (!ok) {
                    throw new Error(data.detail || 'Failed to load user level.');
                }

                setUserLevelId(Number(data.Level_ID) || 0);
            })
            .catch(err => setError(err.message));
    }, [quizFinished]);

    // fetch dictionary entries on mount
    useEffect(() => {
        fetch(`${API_URL}dictionary/get`)
            .then(res => res.json())
            .then(data => {
                const dictionaryArray = Array.isArray(data) ? data : [data];
                setDictionaryEntries(dictionaryArray);
            })
            .catch(() => setError('Failed to load dictionary.'));
    }, []);

    // calculate score when quiz-finished view is shown
    useEffect(() => {
        const run = async () => {
            if (quizFinished && questions.length > 0) {
                const newScore = await calculateScore();
                await checkbadgeUnlock(newScore);
            }
        };

        run();
    }, [quizFinished]);

    // function to start quiz for selected level
    const startQuiz = async (levelId) => {
        // set selected level and reset quiz state
        setSelectedLevel(levelId);
        setError('');

        // fetch questions for selected level from database
        try {
            const response = await fetch(`${API_URL}Questions/get?Level_ID=${levelId}`);
            if (!response.ok) throw new Error("No questions found for this level.");
            
            // ensure response is an array (in case only one question is returned)
            const data = await response.json();
            const questionsArray = Array.isArray(data) ? data : [data];

            // set quiz state with fetched questions and reset other quiz state variables
            setQuestions(questionsArray);
            setCurrentQuestionIndex(0);
            setCorrectAnswers(0);
            setScore(0);
            setQuizFinished(false);
            setUserAnswer('');
        
        // handle any errors that occur during fetch
        } catch (err) {
            setError(err.message);
        }
    };

    // function to handle answer submission for current question
    const handleAnswerSubmit = (e) => {
        // prevent form submission from reloading page
        e.preventDefault();
        const currentQuestion = questions[currentQuestionIndex];

        // normalize user answer for comparison (trim whitespace and convert to lowercase)
        const answer = userAnswer.trim().toLowerCase();

        // answer input validation
        const answers = ['a', 'b', 'c', 'd'];
        // check if answer is valid (A, B, C, or D)
        if (!answers.includes(answer)) {
            setError('Invalid answer. Please enter A, B, C, or D.');
            return;
        }
        
        // simple string comparison (ignoring case/whitespace)
        if (answer === currentQuestion.Answer.trim().toLowerCase()) {
            // if answer is correct, increment score
            setCorrectAnswers((prev) => prev + 1);
            setError('');
        }

        // increment question index to move to next question
        const nextIndex = currentQuestionIndex + 1;
        // if there are more questions, move to next question
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setUserAnswer('');
        // if no more questions, finish quiz
        } else {
            setQuizFinished(true);
        }
    };

    // function to reset quiz state to allow user to take another quiz
    const resetQuiz = () => {
        // reset all quiz-related state variables to initial values
        setError('');
        setSelectedLevel(null);
        setQuestions([]);
        setQuizFinished(false);
    };

    // function to handle click on locked level button
    const handleLockedLevelClick = () => {
        setError('Level locked');
    };

    // function to toggle the dictionary panel
    const toggleDictionary = () => {
        setDictionaryOpen((previousValue) => !previousValue);
    };

    // function to calculate score based on number of correct answers and total questions
    const calculateScore = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // calculate scores by percentage * 1000 then rounded
        const calculatedScore = Math.round((correctAnswers / questions.length) * 1000);
        setScore(calculatedScore);

        // send score to backend
        try {
            await fetch(`${API_URL}users/score/put?score_to_add=${calculatedScore}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            setError('Failed to update score.');
        }

        return calculatedScore;
    };

    // function to check if user has unlocked any badges
    const checkbadgeUnlock = async (score) => {
        // badge id 2
        if (score > 0) {
            // ccheck if user already has badge
            const userhasbadge = await checkUserHasBadge(2);

            if (!userhasbadge) {
                await giveUserBadge(2);
            }
        }

        // other badges checks would go here
    };

    // function to check if user has a specific badge
    const checkUserHasBadge = async (badgeId) => {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        try {
            const response = await fetch(`${API_URL}badges/get?badge_id=${badgeId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (!response.ok) throw new Error("Failed to check badges.");

            const data = await response.json();
            return data.some(badge => badge.Badge_ID === badgeId);
        } catch (err) {
            setError(err.message);
            return false;
        }
    }

    const giveUserBadge = async (badgeId) => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        try {
            const response = await fetch(`${API_URL}users/badge/post?badge_id=${badgeId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to award badge.");
        } catch (err) {
            setError(err.message);
        }
    };

    const visibleDictionaryEntries = dictionaryEntries.filter(
        (entry) => Number(entry.Dictionary_ID) <= Number(userLevelId)
    );

    // render quiz page
    return (
        // main container for quiz page
        <main className="quiz-page page">

            {/* dictionary button */}
            <button className="dictionary-button" onClick={toggleDictionary}>
                {dictionaryOpen ? 'Close Dictionary' : 'Dictionary'}
            </button>

            {/* open dictionary box if button is toggled */}
            {dictionaryOpen && (
                <section className="box dictionary-box">
                    <h2 style={{ color: '#13f0e5' }}>Dictionary</h2>

                    {visibleDictionaryEntries.length === 0 ? (
                        <p className="dictionary-empty">No dictionary entries found.</p>
                    ) : (
                        <div className="dictionary-list">
                            {visibleDictionaryEntries.map((entry) => (
                                <div key={entry.Dictionary_ID} className="dictionary-entry">
                                    <h3>level {entry.Dictionary_ID}</h3>
                                    {entry.Description.split('\n').map((line, index) => (
                                        <p key={`${entry.Dictionary_ID}-${index}`}>{line}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* quiz box */}
            {!dictionaryOpen && (
            <section className="box quiz-box">
                {/* header */}
                <h1 style={{ color: '#13f0e5' }}>Test your knowledge:</h1>
                
                {/* show error message if login error occurs */}
                {error && <p className="login-error">{error}</p>}

                {/* if no level selected and the quiz is not finished, show level selection */}
                {!selectedLevel && !quizFinished && (
                    <div className="level-selection">

                        {/* subheader */}
                        <p>Select Level:</p>

                        {/* level selection buttons */}
                        <div className="level-box">
                            {/* map each level in levels array to a button */}
                            {levels.map((level, index) => (
                                <button 
                                    key={level.Level_ID}

                                    // apply different class based on whether level is unlocked or locked
                                    className={`level-button-unlocked ${Number(level.Level_ID) <= Number(userLevelId) ? 'level-button-unlocked' : 'level-button-locked'}`}
                                    
                                    // if level is unlocked, start quiz for that level, otherwise show locked level message
                                    onClick={() =>
                                      Number(level.Level_ID) <= Number(userLevelId)
                                        ? startQuiz(level.Level_ID)
                                        : handleLockedLevelClick(level.Level_ID)
                                  }
                                >
                                    Level {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* if a level is selected and the quiz is not finished and there are more questions, show the quiz form */}
                {selectedLevel && !quizFinished && questions.length > 0 && (

                    // quiz form for current question, submit answer on form submission, check valid answer and check correct answer from database 
                    <form className="login-form quiz-form" onSubmit={handleAnswerSubmit}>

                        {/* quiz progress bar */}
                        <div className="quiz-progress">
                            {/* show current question number and total questions */}
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        
                        {/* quiz question text */}
                        <div className="quiz-question-text">
                            {/* Render new lines from the database and format correctly */}
                            {/* get the current question text, split by new lines, then map each line to a paragraph */}
                            {questions[currentQuestionIndex].Question.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>

                        {/* answer input field */}
                        <div className="login-field">
                            {/* sub header */}
                            <label htmlFor="answer">Your Answer (e.g., A, B, C, D):</label>
                            
                            {/* answer input form */}
                            <input
                                id="answer"
                                type="text"
                                className="login-input"
                                value={userAnswer}                              // bind input value to userAnswer state
                                onChange={(e) => setUserAnswer(e.target.value)} // update userAnswer state on input change
                                required                                        // user must input a value
                            />
                        </div>

                        <button type="submit" className="login-button">Next</button>
                    </form>
                )}

                {/* quiz results */}
                {quizFinished && (
                    <div className="quiz-results">
                        <h2 style={{ color: '#13f0e5' }}>Quiz Complete!</h2>
                        <p className="score-text">Correct Answers: {correctAnswers} / {questions.length}</p>
                        <p className="score-text">Score Awarded: {score}</p>
                        <button className="login-button" onClick={resetQuiz}>Take Another Quiz</button>
                    </div>
                )}
            </section>
            )}
        </main>
    );
}

export default Home;