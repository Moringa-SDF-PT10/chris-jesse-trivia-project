class TriviaGame {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        
        // DOM Elements
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.questionText = document.getElementById('question-text');
        this.questionNumber = document.getElementById('question-number');
        this.optionsContainer = document.getElementById('options-container');
        this.feedback = document.getElementById('feedback');
        this.finalScore = document.getElementById('final-score');
        this.reviewAnswers = document.getElementById('review-answers');
        
        // Buttons
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        // Event Listeners
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.restartBtn.addEventListener('click', () => this.startQuiz());
    }

    async fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
            const data = await response.json();
            this.questions = data.results;
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    async startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        
        await this.fetchQuestions();
        
        this.startScreen.classList.add('hidden');
        this.resultsScreen.classList.add('hidden');
        this.quizScreen.classList.remove('hidden');
        
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.innerHTML = question.question;
        this.questionNumber.textContent = `Question ${this.currentQuestionIndex + 1}/${this.questions.length}`;
        
        // Combine correct and incorrect answers
        const answers = [...question.incorrect_answers, question.correct_answer];
        // Shuffle answers
        this.shuffleArray(answers);
        
        this.optionsContainer.innerHTML = '';
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'option';
            button.innerHTML = answer;
            button.addEventListener('click', () => this.checkAnswer(answer));
            this.optionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedAnswer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correct_answer;
        
        if (isCorrect) {
            this.score++;
        } else {
            this.wrongAnswers.push({
                question: question.question,
                userAnswer: selectedAnswer,
                correctAnswer: question.correct_answer
            });
        }

        this.showFeedback(isCorrect);
        
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }, 1500);
    }

    showFeedback(isCorrect) {
        this.feedback.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
        this.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        this.feedback.classList.remove('hidden');
        
        setTimeout(() => {
            this.feedback.classList.add('hidden');
        }, 1500);
    }

    showResults() {
        this.quizScreen.classList.add('hidden');
        this.resultsScreen.classList.remove('hidden');
        
        this.finalScore.textContent = `${this.score}/${this.questions.length}`;
        
        this.reviewAnswers.innerHTML = '';
        this.wrongAnswers.forEach(wrong => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <p><strong>Question:</strong> ${wrong.question}</p>
                <p><strong>Your Answer:</strong> ${wrong.userAnswer}</p>
                <p><strong>Correct Answer:</strong> ${wrong.correctAnswer}</p>
            `;
            this.reviewAnswers.appendChild(reviewItem);
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TriviaGame();
});