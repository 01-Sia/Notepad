// Load todos from localStorage
let todoList = JSON.parse(localStorage.getItem('todos') || '[]');

function renderList() {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';
  const gardenEmojis = ["🌱", "🌸", "🌼", "🌻", "🍃"];
  todoList.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (item.done ? ' done' : '');
    const emoji = gardenEmojis[idx % gardenEmojis.length];
    li.innerHTML = `
13      <input type="checkbox" ${item.done ? 'checked' : ''} data-idx="${idx}">
14      <span class="garden-dot">${emoji}</span>
15      <span class="todo-text">${item.text}</span>
16      <button data-del="${idx}" class="delete-btn" title="Delete">❌</button>
17    `;
    ul.appendChild(li);
  });
}

function saveList() {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

function addItem() {
  const val = document.getElementById('new-item').value.trim();
  if (val) {
    todoList.push({ text: val, done: false });
    saveList();
    renderList();
    document.getElementById('new-item').value = '';
  }
}

document.getElementById('add-btn').onclick = addItem;

document.getElementById('new-item').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addItem();
});

document.getElementById('todo-list').onclick = (e) => {
  if (e.target.type === 'checkbox') {
    const idx = e.target.dataset.idx;
    todoList[idx].done = e.target.checked;
    saveList();
    renderList();
  }
  if (e.target.dataset.del !== undefined) {
    todoList.splice(e.target.dataset.del, 1);
    saveList();
    renderList();
  }
};

renderList();

// Speech-to-Text (Web Speech API)
const micBtn = document.getElementById('mic-btn');
let recognition, recognizing = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.onclick = () => {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.start();
    recognizing = true;
    micBtn.classList.add('listening');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('new-item').value = transcript;
    recognizing = false;
    micBtn.classList.remove('listening');
  };
  recognition.onend = () => {
    recognizing = false;
    micBtn.classList.remove('listening');
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported in this browser";
}