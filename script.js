const chat = document.getElementById('chat');
const inputText = document.getElementById('inputText');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');

const responses = [
  { key: 'tarefa', text: 'Com certeza, Senhor. Já registrei essa nova tarefa no protocolo prioritário. Deseja que eu também agende um lembrete?' },
  { key: 'agenda', text: 'Entendido. Sua agenda foi otimizada para evitar conflitos e priorizar compromissos mais urgentes.' },
  { key: 'resumo', text: 'Analisando os dados disponíveis... Pronto, compactei a visão principal em um resumo rápido e funcional para você.' },
  { key: 'olá', text: 'Olá, Senhor. J.A.R.V.I.S. online e pronto para atendê-lo.' },
  { key: 'bom dia', text: 'Bom dia, Senhor. Sistema operacional está em nível máximo de prontidão.' },
  { key: 'oi', text: 'Olá, Senhor. Em que posso ajudar?' }
];

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.innerHTML = `
    <span class="label">${role === 'jarvis' ? 'J.A.R.V.I.S.' : 'Você'}</span>
    ${text}
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getResponse(input) {
  const lower = input.toLowerCase();

  for (const item of responses) {
    if (lower.includes(item.key)) {
      return item.text;
    }
  }

  return `Entendido, Senhor. Estou processando sua solicitação sobre "${input}". Executando os protocolos necessários agora mesmo.`;
}

function sendMessage() {
  const value = inputText.value.trim();
  if (!value) return;

  addMessage('user', value);
  inputText.value = '';

  setTimeout(() => {
    addMessage('jarvis', getResponse(value));
  }, 500);
}

sendBtn.addEventListener('click', sendMessage);

inputText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

document.querySelectorAll('.chip').forEach((button) => {
  button.addEventListener('click', () => {
    const cmd = button.dataset.command;
    inputText.value = cmd;
    sendMessage();
  });
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;

  voiceBtn.addEventListener('click', () => recognition.start());

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
    sendMessage();
  };

  recognition.onerror = () => {
    addMessage('jarvis', 'Microfone indisponível ou permissão negada. Use o campo de texto para continuar.');
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = 'Seu navegador não suporta reconhecimento de voz';
  voiceBtn.style.opacity = '0.5';
  voiceBtn.style.cursor = 'not-allowed';
}
