const express = require('express');
const router = express.Router();
const axios = require('axios');
const Question = require('../models/questions');
const mongoose = require("mongoose");

// Environment variables
require('dotenv').config();

// Database connection
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_URL}/?retryWrites=true&w=majority`;

mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Database connected successfully');
  // Start the server or perform any other operations that depend on the database connection
});

mongoose.connect(uri, { useNewUrlParser: true });

const trivia_uri = 'https://opentdb.com/api.php?amount=10&category=9&type=multiple';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(trivia_uri);
    const questions = [];

    for (const question of response.data.results) {
      const newQuestion = new Question({
        question: question.question,
        answer: question.correct_answer,
      });

      try {
        await newQuestion.save();
      } catch (error) {
        console.error('Error saving question:', error);
        // Handle the error appropriately (e.g., logging, error response, etc.)
      }

      questions.push({
        ...question,
        answer_options: shuffle([...question.incorrect_answers, question.correct_answer]),
      });
    }

    res.render('trivia', { questions });
  } catch (error) {
    console.error('Error fetching trivia:', error);
    res.render('error');
  }
});

router.post('/check-answers', async (req, res) => {
  const userAnswers = req.body.answers;
  let score = 0;

  try {
    for (const userAnswer of userAnswers) {
      const questionText = userAnswer.question;
      const userResponse = userAnswer.answer;

      const question = await Question.findOne({ question: questionText });

      if (question && question.answer.toString() === userResponse.toString()) {
        score++;
      }
    }

    res.json({ score });
  } catch (error) {
    console.error('Error checking answers:', error);
    res.status(500).json({ error: 'Error checking answers' });
  }
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = router;