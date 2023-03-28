import bot from './assents/bot.svg';
import user from './assents/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {

    element.textContent = '';

    loadInterval = setInterval(() => {

        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}


function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}


function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {

    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                 <div class="message" id=${uniqueId}>${value}</div>
              
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(form)
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset()
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    const response = await fetch('https://chatgpt-6clo.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')

        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim()
        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Algo deu errado"
        alert(err);
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

// FUNÇÃO PARA BLOQUEAR O ENVIO DE MENSAGEM QUANDO O CAMPO NÃO FOR PREENCHIDO

function verificarTecla(event) {
    if (event.key === "Enter") { // verifica se a tecla pressionada é a tecla Enter
      event.preventDefault(); // impede o envio do formulário
      verificarFormulario(); // chama a função verificarFormulario() para verificar se o campo foi preenchido
    }
  }
  
  function verificarFormulario() {
    var mensagem = document.getElementById("mensagem").value;
    var aviso = document.getElementById("aviso");
    
    if (mensagem.trim() === "") { // verifica se o campo está vazio ou contém apenas espaços em branco
      aviso.innerHTML = "Por favor, preencha o campo!";
    } else {
      aviso.innerHTML = ""; // limpa o aviso
      document.forms[0].submit(); // envia o formulário
    }
  }


// ROLAGEM AUTOMATICA QUANDO O CAMPO COMEÇA A SER PREENCHIDO

const scrollableDiv = document.getElementById("scrollable-div");
scrollableDiv.scrollTop = scrollableDiv.scrollHeight;

let isScrolling = false;

scrollableDiv.addEventListener('scroll', function(event) {
  isScrolling = true;
});

setInterval(function() {
  if (!isScrolling) {
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  }
  isScrolling = false;
}, 100);



