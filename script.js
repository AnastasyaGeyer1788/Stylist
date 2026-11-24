// ----- Демо-логика -----
const demoItems = [
  {ico:'🧥', name:'Блейзер', cat:'верх', tag:'офис'},
  {ico:'👖', name:'Джинсы', cat:'низ', tag:'кэжуал'},
  {ico:'👟', name:'Кроссовки', cat:'обувь', tag:'спорт'},
  {ico:'👜', name:'Сумка', cat:'аксессуар', tag:'город'},
  {ico:'🧣', name:'Шарф', cat:'аксессуар', tag:'тепло'},
  {ico:'👗', name:'Платье', cat:'верх', tag:'вечер'},
  {ico:'👞', name:'Лоферы', cat:'обувь', tag:'офис'},
  {ico:'🧢', name:'Кепка', cat:'аксессуар', tag:'спорт'},
];

let items = []; // {ico, name, cat, tag}
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const thumbsEl = document.getElementById('thumbs');
const resultEl = document.getElementById('result');

// выбор файлов
dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
  [...e.target.files].forEach(f => addItemFromFile(f));
  fileInput.value = '';
});

// drag&drop
['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => {e.preventDefault(); dropzone.classList.add('dragover')}));
['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => {e.preventDefault(); dropzone.classList.remove('dragover')}));
dropzone.addEventListener('drop', e => {
  [...e.dataTransfer.files].forEach(f => addItemFromFile(f));
});

// «распознавание» файла — имитация: берём случайную вещь
function addItemFromFile(file){
  if(!file.type.startsWith('image/')) return;
  const random = demoItems[Math.floor(Math.random()*demoItems.length)];
  items.push({...random, custom:true, fileName:file.name});
  renderThumbs();
}

function renderThumbs(){
  thumbsEl.innerHTML = '';
  items.forEach((it, i) => {
    const d = document.createElement('div');
    d.className = 'thumb';
    d.innerHTML = `${it.ico}<button class="del" title="Удалить">×</button>`;
    d.querySelector('.del').addEventListener('click', e => {
      e.stopPropagation();
      items.splice(i,1);
      renderThumbs();
    });
    thumbsEl.appendChild(d);
  });
}

// заполнить примером
document.getElementById('demoFillBtn').addEventListener('click', () => {
  items = [ {...demoItems[0]}, {...demoItems[1]}, {...demoItems[2]}, {...demoItems[3]} ];
  renderThumbs();
});

// собрать образ
document.getElementById('generateBtn').addEventListener('click', () => {
  if(items.length < 2){
    resultEl.innerHTML = `<div class="placeholder"><span class="em">🧺</span>Добавь хотя бы 2 вещи,<br>чтобы собрать образ.</div>`;
    return;
  }
  // простая «логика»: берём верх/низ/обувь/аксессуар
  const pick = cat => items.find(i => i.cat === cat);
  const top = pick('верх') || items[0];
  const bottom = pick('низ') || items.find(i => i !== top) || items[1];
  const shoes = pick('обувь') || items.find(i => ![top,bottom].includes(i)) || items[2];
  const acc = pick('аксессуар');

  const chosen = [top, bottom, shoes, acc].filter(Boolean);

  // псевдо-объяснение
  const reasons = [
    'цвета не спорят, а поддерживают друг друга',
    'категории сбалансированы: верх + низ + обувь',
    'учтён повод и сезонность вещей',
    'аксессуар добавляет образу характер',
  ];
  const reason = reasons[Math.floor(Math.random()*reasons.length)];

  const outfitsNames = ['Городской кэжуал','Офис без скуки','Выходной в городе','Умный спорт','Вечерний минимализм'];
  const title = outfitsNames[Math.floor(Math.random()*outfitsNames.length)];

  resultEl.innerHTML = `
    <div class="outfit-title">${title}</div>
    <div class="outfit-meta">собрано из твоего гардероба · ${chosen.length} вещи</div>
    <div class="outfit-items">
      ${chosen.map(i => `<span class="oi">${i.ico} ${i.name}</span>`).join('')}
    </div>
    <div class="why">
      <b>Почему это работает:</b><br>${reason}. Образ опирается только на твои вещи — ничего покупать не нужно.
    </div>
    <div class
