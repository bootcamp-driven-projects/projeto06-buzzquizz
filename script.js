axios.defaults.headers.common['Authorization'] = 'BtXNJoiFoeQE4oiiOTK7wiYj';
let currentQuizz, arrayQuizzes, idCurrentQuestion = 0, percentage = 0, score = 0, QuizzCriatedId, url = 'https://mock-api.driven.com.br/api/vm/buzzquizz/';

BuzzQuizzInit();

function Formulary() {
  document.querySelector('.screen').classList.add('hide');
  document.querySelector('.create-quizz').classList.remove('hide');
};

function BuzzQuizzInit() {
  let promise = axios.get( url + 'quizzes' );
  promise.then(renderAllQuizzes);
};

function renderAllQuizzes(resp) {
  renderHomeScreen();
  arrayQuizzes = resp.data;
  let usersID = JSON.parse(localStorage.getItem('ids')) || [];
  let quizzGallery = document.querySelector('.all-quizzes .quizz-gallery');
  let yourQuizzes = document.querySelector('.created-quizzes');
  if (usersID !== []) {
    yourQuizzes.innerHTML = '';
    document.querySelector('.created-quizzes').style.flexDirection = 'row';
  }

  for (let i = 0; i < arrayQuizzes.length; i++) {
    if (!usersID.includes(arrayQuizzes[i].id)) {
      quizzGallery.innerHTML += `
      <div class="quizz" onclick="getByQuizz(${arrayQuizzes[i].id})" data-test="others-quiz">
          <img src="${arrayQuizzes[i].image}">
          <div class="degrade"></div>
          <span>${arrayQuizzes[i].title}</span>
      </div>
      `;
    } else {
      yourQuizzes.innerHTML += `
      <div class="quizz space"  onclick="getByQuizz(${arrayQuizzes[i].id})">
          <img src="${arrayQuizzes[i].image}">
          <div class="degrade"></div>
          <span>${arrayQuizzes[i].title}</span>
      </div>
      `;
    }
  }
};

function renderHomeScreen() {
  let screen = document.querySelector('.screen');
  screen.innerHTML = '';
  screen.innerHTML = `
    
        <div class="quizzes-user">
            <div class="your-created-quizzes">
                <h2>Seus Quizzes</h2>
                <ion-icon
                name="add-circle"
                class="novo-quizz"
                onclick="Formulary()"
                ></ion-icon>
            </div>
            <div class="created-quizzes">
                <p>Você não criou nenhum quizz ainda :(</p>
                <button type="button" onclick="Formulary()">Criar Quizz</button>
            </div>
        </div>
        <div class="all-quizzes">
            <h2>Todos os Quizzes</h2>
            <div class="quizz-gallery">
            </div>
        </div>
    `;
};

function getByQuizz(id) {
  let promise = axios.get( url + `quizzes/${id}`);
  promise.then(displayQuizz);
};

function displayQuizz(quizz) {
  let screen = document.querySelector('.screen');
  currentQuizz = quizz.data;
  screen.innerHTML = '';
  generateBanner();
  generateQuestions();
};

function generateBanner() {
  let screen = document.querySelector('.screen');
  screen.innerHTML += `
    <div class="banner-quizz" data-test="banner">
        <img src="${currentQuizz.image}">
        <p>${currentQuizz.title}</p>
    </div>
    `;
};

function generateQuestions() {
  let screen = document.querySelector('.screen');
  for (let i = 0; i < currentQuizz.questions.length; i++) {
    screen.innerHTML += `
        <div class="question-container" data-test="question">
            <div class="question${i} questions" data-test="question-title">
                <p >${currentQuizz.questions[i].title}</p>
            </div>
            <div class="options${i} options">
            </div>
        </div>`;

    generateOptions(i);
    document.querySelector(
      `.question${i}`
    ).style.backgroundColor = `${currentQuizz.questions[i].color}`;
  }

  screen.innerHTML += `
        <div class="question-container result-box hide"></div>
    `;

  generateButtons();
};

function generateOptions(questionID) {
  let divOptions = document.querySelector(`.screen .options${questionID}`);

  let answers = currentQuizz.questions[questionID].answers;
  answers = answers.sort(comparador);

  for (let i = 0; i < answers.length; i++) {
    // se a resposta atual for a correta ele vai criar ela com a classe
    // `option correct`
    if (answers[i].isCorrectAnswer) {
      divOptions.innerHTML += `
            <div class="option correct" onclick="selectOption(this)" data-test="answer" >
                <img src="${answers[i].image}">
                <p data-test="answer-text">${answers[i].text}</p>
            </div>
        `;
      // se a resposta não for a correta, só vai gerar com a classe option
    } else {
      divOptions.innerHTML += `
            <div data-test=my-quiz class="option" onclick="selectOption(this)" data-test="answer">
                <img src="${answers[i].image}">
                <p data-test="answer-text">${answers[i].text}</p>
            </div>
        `;
    }
  }
  // vai retornar a divOptions para ser usada na função de gerar perguntas
  return divOptions;
};

function selectOption(option) {
  let options = option.parentNode.querySelectorAll('.option');
  let selected = option.parentNode.querySelector('.not-selected');

  if (selected === null && isCurrentQuestion(option)) {
    options.forEach((element) => {
      if (element !== option) {
        element.classList.add('not-selected');
      }
    });

    checkAsnwer(option, options);
  }
};

function checkAsnwer(option, options) {
  let correctAnswer = option.parentNode.querySelector('.option.correct');

  options.forEach((element) => {
    if (element === correctAnswer) {
      element.classList.add('correct-option');
    } else {
      element.classList.add('validated-option');
    }
  });

  if (correctAnswer === option) {
    score++;
  }
};

function isCurrentQuestion(option) {
  let currentQuestion = option.parentNode.parentNode.querySelector(
    `.questions.question${idCurrentQuestion}`
  );

  if (currentQuestion !== null) {
    idCurrentQuestion++;

    let nextQuestion = document.querySelector(`.question${idCurrentQuestion}`);
    setTimeout(function () {
      if (idCurrentQuestion === currentQuizz.questions.length) {
        generateResultBox();
        document.querySelector('.result-box').classList.remove('hide');
        document.querySelector('.buttons').classList.remove('hide');

        document
          .querySelector('.result-box')
          .scrollIntoView({ behavior: 'smooth' });
      } else {
        nextQuestion.parentNode.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);

    return currentQuestion;
  }
};

function generateResultBox() {
  let questionBox = document.querySelector('.question-container.result-box');

  let level = currentQuizz.levels[checkLevel()];

  let title = level.title;
  let img = level.image;
  let description = level.text;

  questionBox.innerHTML = `
          <div class="question${currentQuizz.questions.length}">
              <p data-test="level-title">${percentage}% de acerto: ${title}</p>
          </div>
          <div class="container-box">
              <img src="${img}"  data-test="level-img">
              <p data-test="level-text">${description}</p>
          </div>
  `;
};

function checkLevel() {
  percentage = Math.round((score / currentQuizz.questions.length) * 100);

  let levels = currentQuizz.levels;

  for (let i = levels.length - 1; i >= 0; i--) {
    let minValue = currentQuizz.levels[i].minValue;

    if (percentage >= minValue) {
      return i;
    }
  }
};

function generateButtons() {
  let screen = document.querySelector('.screen');
  screen.innerHTML += `
        <div class="buttons hide">
            <div class="btn-restart" onclick="restartQuizz() data-test="restart"">
                <p>Reiniciar Quizz</p>
            </div>
            <div class="goto-home" onclick="BuzzQuizzInitialPage()" data-test="go-home">
                <p>Volta para home</p>
            </div>
        </div>
    `;
};

function resetAttributes() {
  currentQuizz;
  arrayQuizzes;
  idCurrentQuestion = 0;
  percentage = 0;
  score = 0;
};

function restartQuizz() {
  resetAttributes();

  let reset;

  reset = document.querySelectorAll('.correct-option');
  reset.forEach((element) => {
    element.classList.remove('correct-option');
  });

  reset = document.querySelectorAll('.validated-option');
  reset.forEach((element) => {
    element.classList.remove('validated-option');
  });

  reset = document.querySelectorAll('.not-selected');
  reset.forEach((element) => {
    element.classList.remove('not-selected');
  });

  document.querySelector('.result-box').classList.add('hide');
  document.querySelector('.buttons').classList.add('hide');

  document
    .querySelector('.banner-quizz')
    .scrollIntoView({ behavior: 'smooth' });
};

function BuzzQuizzInitialPage() {
  let screen = document.querySelector('.screen');
  screen.innerHTML = '';
  resetAttributes();
  BuzzQuizzInit();
  location.reload();
};

let newQuizzTitle, newQuizzUrl, newQuizzQuestions, newQuizzLevels;

function quizzCreationBasic() {
  newQuizzTitle = document.querySelector('.form-questions :nth-child(1)').value;
  newQuizzUrl = document.querySelector('.form-questions :nth-child(2)').value;
  newQuizzQuestions = parseInt(
    document.querySelector('.form-questions :nth-child(3)').value
  );
  newQuizzLevels = parseInt(
    document.querySelector('.form-questions :nth-child(4)').value
  );
  if (newQuizzTitle.length < 20 || newQuizzTitle > 65)
    alert('O título do quizz deve ter no mínimo 20 e no máximo 65 caracteres');
  else if (
    newQuizzUrl.slice(0, 8) !== 'https://' &&
    newQuizzUrl.slice(0, 7) !== 'http://'
  )
    alert(`A URL da imagem deve iniciar com http:// ou https://`);
  else if (newQuizzQuestions < 3 || isNaN(newQuizzQuestions))
    alert('O quizz deve possuir no mínimo 3 perguntas');
  else if (newQuizzLevels < 2 || isNaN(newQuizzLevels))
    alert('O quizz deve possuir no mínimo 2 níveis');
  else renderQuestionsPage();
};

function hideQuestionDetails(element) {
  element
    .querySelector('.field-header')
    .querySelector('img')
    .classList.toggle('hide');
  element.querySelector('.user-input').classList.toggle('hide');
};

function renderQuestionsPage() {
  document.querySelector('.new-quizz-basic-information').classList.add('hide');
  document.querySelector('.new-quizz-questions').classList.remove('hide');
  document.querySelector('.new-questions').innerHTML = '';
  for (let i = 1; i <= newQuizzQuestions; i++) {
    document.querySelector(
      '.new-questions'
    ).innerHTML += `   <div class="form-questions" data-test="question-ctn">
            <div class="field-header" onclick="hideQuestionDetails(this.parentElement)">
                <h3>Pergunta ${i}</h3>
                <img src="assets/edit.png" data-test="toggle"/>
            </div>
            <div class="user-input question-${i} hide">
                <input placeholder="Texto da pergunta"/ data-test="question-input">
                <input type="color" placeholder="Cor de fundo da pergunta" data-test="question-color-input"/>
                <h3>Resposta correta</h3>
                <input placeholder="Resposta correta" data-test="correct-answer-input"/>
                <input placeholder="URL da imagem" data-test="correct-img-input"/>
                <h3>Respostas incorretas</h3>
                <input placeholder="Resposta incorreta 1" data-test="wrong-answer-input"/>
                <input placeholder="URL da imagem 1" data-test="wrong-img-input"/>
                <br><br>
                <input placeholder="Resposta incorreta 2" data-test="wrong-answer-input"/>
                <input placeholder="URL da imagem 2" data-test="wrong-img-input"/>
                <br><br>  
                <input placeholder="Resposta incorreta 3" data-test="wrong-answer-input"/>
                <input placeholder="URL da imagem 3" data-test="wrong-img-input"/> 
            </div>
        </div>`;
    if (i === 1)
      hideQuestionDetails(
        document.querySelector('.new-questions :nth-child(1)')
      );
  }
};

function sendQuizzServer() {
  const userQuizz = {
    title: newQuizzTitle,
    image: newQuizzUrl,
    questions: questions,
    levels: levels,
  };
  const quizzCreationPromise = axios.post(
    'https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes',
    userQuizz
  );
  quizzCreationPromise.then(quizzCreationSuccess);
  quizzCreationPromise.catch(quizzCreationError);
};

function quizzCreationError(error) {
  console.log(error);
};

function renderLevelsPage() {
  document.querySelector('.new-quizz-questions').classList.add('hide');
  document.querySelector('.new-quizz-levels').classList.remove('hide');
  document.querySelector('.new-levels').innerHTML = '';
  for (let i = 1; i <= newQuizzLevels; i++) {
    document.querySelector(
      '.new-levels'
    ).innerHTML += `   <div class="form-questions" data-test="level-ctn">
            <div class="field-header" onclick="hideQuestionDetails(this.parentElement)" data-test="toggle">
                <h3>Nível ${i}</h3>
                <img src="assets/edit.png"/>
            </div>
            <div class="user-input level-${i} hide">
                <input placeholder="Título do nível" data-test="level-input"/>
                <input placeholder="% de acerto mínima" data-test="level-percent-input"/>
                <input placeholder="URL da imagem do nível" data-test="level-img-input"/>
                <input placeholder="Descrição do nível" class="level-description" data-test="level-description-input"/>
            </div>
        </div>`;
    if (i === 1)
      hideQuestionDetails(document.querySelector('.new-levels :nth-child(1)'));
  }
};

function comparador() {
  return Math.random() - 0.5;
};

function goToQuizz() {
  getByQuizz(QuizzCriatedId);
  document.querySelector('.quizz-creation-success').style.display = 'none';
  document.querySelector('.screen').style.display = 'block';
};

function addIdToLocalStorage(id) {
  if (typeof Storage !== 'undefined') {
    let userQuizzesIds = JSON.parse(localStorage.getItem('ids')) || [];
    if (!userQuizzesIds.includes(id)) {
      userQuizzesIds.push(id);
      localStorage.setItem('ids', JSON.stringify(userQuizzesIds));
    }
  } else {
    console.log('LocalStorage não disponível. Criando um novo...');
    let userQuizzesIds = [id];
    localStorage.setItem('ids', JSON.stringify(userQuizzesIds));
  }
};

function quizzCreationSuccess(data) {
  let quizzID = data.data.id, pics = data.data.image;
  const screenQCS = document.querySelector('.quizz-creation-success');
  QuizzCriatedId = quizzID;  
  document.getElementById('qcs').style.display = 'flex';
  document.querySelector('.create-quizz').classList.add('hide');
  addIdToLocalStorage(quizzID);
  console.log(`Quizz de Id ${quizzID} criado com sucesso!`);
  renderQuizzCreationSuccess(screenQCS, pics);
};

function renderQuizzCreationSuccess(screenQCS, pics) {
  window.scrollTo(0, 0);
  screenQCS.innerHTML = `
      <h1>Seu quizz está pronto!</h1>
      <figure data-test="success-banner" class="quizz-finish-creation"></figure>
      <button data-test="go-quiz" class="access-quizz" onclick="goToQuizz()">
          <p>Acessar Quizz</p>
      </button>
      <button data-test="go-home" class="go-to-homepage" onclick="BuzzQuizzInitialPage()">
          <p>Voltar pra home</p>
      </button>    
  `;
  screenQCS.querySelector(
    'figure'
  ).style.background = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.62%, rgba(0, 0, 0, 0.8) 100%), url("${pics}")`;
};

//VALIDATIONS

let questions = [], levels = [];

function hexadecimalValidation(colorQuestion) {
  if (colorQuestion.length != 7) return false;
  else if (colorQuestion[0] !== '#') return false;
  for (let i = 1; i < colorQuestion.length; i++) {
    if (!'abcdefABCDEF0123456789'.includes(colorQuestion[i])) return false;
  }
  return true;
};

function urlValidation(url) {
  if (url.slice(0, 8) !== 'https://' && url.slice(0, 7) !== 'http://')
    return false;
  return true;
};

function questionsValidation() {
  let textQuestion;
  let colorQuestion;
  questions = [];
  for (let i = 1; i <= newQuizzQuestions; i++) {
    let question;
    let questionObject;
    const answers = [];
    question = document.querySelector(`.question-${i}`);
    textQuestion = question.querySelector(':nth-child(1)').value;
    if (textQuestion.length < 20) {
      alert('As perguntas devem possuir no mínimo 20 caracteres.');
      return;
    }
    colorQuestion = question.querySelector(':nth-child(2)').value;
    if (!hexadecimalValidation(colorQuestion)) {
      alert('A cor deve estar em formato hexadecimal.');
      return;
    }
    let text = question.querySelector(':nth-child(4)').value;
    if (text.length === 0) {
      alert('O texto da resposta correta não pode estar vazio.');
      return;
    }
    let urlImage = question.querySelector(':nth-child(5)').value;
    if (!urlValidation(urlImage)) {
      alert('Insira uma url de imagem válida para as respostas corretas');
      return;
    }
    let answer = {
      image: urlImage,
      text: text,
      isCorrectAnswer: true,
    };
    answers.push(answer);
    for (let j = 7; j < 16; j = j + 4) {
      text = question.querySelector(`:nth-child(${j})`).value;
      urlImage = question.querySelector(`:nth-child(${j + 1})`).value;
      if (text != '' && urlImage != '' && urlValidation(urlImage)) {
        answer = {
          text: text,
          image: urlImage,
          isCorrectAnswer: false,
        };
        answers.push(answer);
      } else if (urlImage != '' || text) {
        alert(
          'Verifique se não está faltando nenhum texto ou url nas respostas incorretas.'
        );
        return;
      } else if (urlImage != '' && !urlValidation(urlImage)) {
        alert('A url inserida na resposta incorreta não é válida.');
        return;
      }
    }
    if (answers.length < 2) {
      alert(
        'Deve ser informada no minimo uma resposta incorreta. (texto e url)'
      );
      return;
    }
    questionObject = {
      title: textQuestion,
      color: colorQuestion,
      answers: answers,
    };
    questions.push(questionObject);
  }
  renderLevelsPage();
};

function levelsValidation() {
  let level;
  let levelObject;
  let levelZero = 0;
  levels = [];
  for (let i = 1; i <= newQuizzLevels; i++) {
    level = document.querySelector(`.level-${i}`);
    let title = level.querySelector(':nth-child(1)').value;
    if (title.length < 10) {
      alert('O título do nível deve ter no mínimo 10 caracteres.');
      return;
    }
    let percentage = parseInt(level.querySelector(':nth-child(2)').value);
    if (percentage < 0 || percentage > 100 || isNaN(percentage)) {
      alert('A porcentagem de acerto mínima deve ser um número entre 0 e 100.');
      return;
    }
    if (percentage === 0) levelZero++;
    let levelUrl = level.querySelector(':nth-child(3)').value;
    if (!urlValidation(levelUrl)) {
      alert('A url inserida na resposta incorreta não é válida.');
      return;
    }
    let description = level.querySelector(':nth-child(4)').value;
    if (description.length < 30) {
      alert('A descrição do nível deve ter no mínimo 30 caracteres.');
      return;
    }
    levelObject = {
      title: title,
      image: levelUrl,
      text: description,
      minValue: percentage,
    };
    levels.push(levelObject);
  }
  if (levelZero === 0) {
    alert(
      'É obrigatório existir pelo menos um nível cuja porcentagem de acerto mínima seja 0%'
    );
    return;
  }
  sendQuizzServer();
};