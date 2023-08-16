window.addEventListener('load', () => {
    const form = document.querySelector('#trivia-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const answerInputs = document.querySelectorAll('.answer-input');
      const answers = [];
      answerInputs.forEach(input => {
        answers.push({
          question: input.dataset.questionText,
          answer: input.value
        });
      });
  
      try {
        const response = await axios.post('/check-answers', { answers });
        alert(`Your score is ${response.data.score} out of 10`)
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    });
  });
  