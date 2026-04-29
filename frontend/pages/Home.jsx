import { useState, useEffect } from 'react';
import './Home.css';

const API_URL = "http://localhost:8000/";

function Home() {
    const [levels, setLevels] = useState([]);
    const [userLevelId, setUserLevelId] = useState(2);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizFinished, setQuizFinished] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            return;
        }

        // fetch levels from database
        fetch(`${API_URL}levels/get`)
            .then(res => res.json())
            .then(data => {
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
    }, []);

    const startQuiz = async (levelId) => {
        setSelectedLevel(levelId);
        setError('');
        try {
            const response = await fetch(`${API_URL}Questions/get?Level_ID=${levelId}`);
            if (!response.ok) throw new Error("No questions found for this level.");
            
            const data = await response.json();
            const questionsArray = Array.isArray(data) ? data : [data];
            setQuestions(questionsArray);
            setCurrentQuestionIndex(0);
            setScore(0);
            setQuizFinished(false);
            setUserAnswer('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        const currentQuestion = questions[currentQuestionIndex];
        
        // Simple string comparison (ignoring case/whitespace)
        if (userAnswer.trim().toLowerCase() === currentQuestion.Answer.trim().toLowerCase()) {
            setScore(score + 1);
        }

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setUserAnswer('');
        } else {
            setQuizFinished(true);
        }
    };

    const resetQuiz = () => {
        setSelectedLevel(null);
        setQuestions([]);
        setQuizFinished(false);
    };

    const handleLockedLevelClick = () => {
        setError('Level locked');
    };

    return (
        <main className="quiz-page page">
            <section className="box quiz-box">
                <h1 style={{ color: '#13f0e5' }}>CompuTaught Quiz</h1>
                
                {error && <p className="login-error">{error}</p>}

                {!selectedLevel && !quizFinished && (
                    <div className="level-selection">
                        <p>Select Level:</p>
                        <div className="level-box">
                            {levels.map((level, index) => (
                                <button 
                                    key={level.Level_ID} 
                                    className={`level-button-unlocked ${Number(level.Level_ID) <= Number(userLevelId) ? 'level-button-unlocked' : 'level-button-locked'}`}
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

                {selectedLevel && !quizFinished && questions.length > 0 && (
                    <form className="login-form quiz-form" onSubmit={handleAnswerSubmit}>
                        <div className="quiz-progress">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        
                        <div className="quiz-question-text">
                            {/* Rendering new lines from the database correctly */}
                            {questions[currentQuestionIndex].Question.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>

                        <div className="login-field">
                            <label htmlFor="answer">Your Answer (e.g., A, B, C, D):</label>
                            <input
                                id="answer"
                                type="text"
                                className="login-input"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-button">Next</button>
                    </form>
                )}

                {quizFinished && (
                    <div className="quiz-results">
                        <h2 style={{ color: '#13f0e5' }}>Quiz Complete!</h2>
                        <p className="score-text">Your Score: {score} / {questions.length}</p>
                        <button className="login-button" onClick={resetQuiz}>Take Another Quiz</button>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;