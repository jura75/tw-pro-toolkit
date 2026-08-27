javascript:(function(){
if(document.getElementById('twProPainterPanel'))return;

const sOff='tw_painted_off_v26', sDef='tw_painted_def_v26', sTower='tw_painted_tower_v26', sCache='tw_painted_cache_v26';

function getStored(k){try{const d=localStorage.getItem(k);return d?JSON.parse(d):{};}catch(e){return{};}}
function saveStored(k,d){localStorage.setItem(k,JSON.stringify(d));}

// Создаем панель управления
const p=document.createElement('div');
p.id='twProPainterPanel';
p.style.cssText='position:fixed;top:60px;right:10px;z-index:999999;background:#f5f5e1;border:2px solid #8B4513;border-radius:6px;padding:10px;width:320px;font-family:Verdana,Arial;font-size:11px;color:#333;box-shadow:0 4px 15px rgba(0,0,0,0.4);max-height:90vh;overflow-y:auto;';
p.innerHTML='<h3 style="margin:0 0 8px 0;color:#8B4513;text-align:center;font-size:13px;border-bottom:1px solid #c8b99c;padding-bottom:4px;">TW PRO Менеджер Заметок & Карта</h3>'+
'<div style="margin-bottom:8px;background:#fffbe8;padding:6px;border:1px solid #e2d4b7;border-radius:4px;">'+
  '<div style="display:flex;gap:4px;margin-bottom:4px;"><button id="twPaintNowBtn" style="flex:1;padding:6px;background:#2e7d32;color:#fff;border:1px solid #000;border-radius:3px;font-weight:bold;cursor:pointer;">🎨 Обновить покраску карты</button></div>'+
  '<div style="display:flex;gap:4px;"><button id="twClearCacheBtn" style="flex:1;padding:4px;background:#b7950b;color:#fff;border:1px solid #000;border-radius:3px;font-weight:bold;cursor:pointer;">🧹 Очистить кэш</button><button id="twClearBtn" style="padding:4px 6px;background:#a93226;color:#fff;border:1px solid #000;border-radius:3px;font-weight:bold;cursor:pointer;">Сброс</button></div>'+
'</div>'+
'<div style="margin-bottom:6px;border:1px solid #ff8a80;background:#ffe5e5;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#8e1b1b;">🔴 Офф координаты (<span id="twCountOff">0</span>):</label><textarea id="twCoordsListOff" style="width:100%;height:35px;font-size:10px;border:1px solid #ff8a80;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #81c784;background:#e6f4ea;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#2e7d32;">🟢 Дефф координаты (<span id="twCountDef">0</span>):</label><textarea id="twCoordsListDef" style="width:100%;height:35px;font-size:10px;border:1px solid #81c784;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #ffb74d;background:#fff3e0;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#e65100;">🟠 Башня координаты (<span id="twCountTower">0</span>):</label><textarea id="twCoordsListTower" style="width:100%;height:35px;font-size:10px;border:1px solid #ffb74d;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="border-top:1px dashed #8B4513;margin:8px 0;padding-top:6px;">'+
  '<button id="collect-all-notes-btn" style="width:100%;padding:6px;background:#2196F3;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;margin-bottom:6px;font-size:11px;">📥 Снять со ВСЕХ страниц</button>'+
  '<div style="margin-bottom:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#495057;font-size:10px;">Поиск и выбор игрока:</label>'+
  '<input type="text" id="player-search-input" placeholder="🔍 Введите имя для поиска..." style="width:100%;padding:4px;font-size:10px;border:1px solid #ced4da;border-radius:3px;box-sizing:border-box;margin-bottom:3px;">'+
  '<select id="player-select" size="3" style="width:100%;padding:3px;border:1px solid #ced4da;border-radius:3px;font-size:10px;box-sizing:border-box;background:#fff;"><option value="">Загрузка списка...</option></select></div>'+
  '<div style="display:flex;gap:4px;margin-bottom:4px;"><input type="text" id="manual-player-id" placeholder="ID игрока" style="width:70px;padding:3px;font-size:10px;border:1px solid #ced4da;border-radius:3px;"><button type="button" id="copy-notes-btn" style="flex:1;padding:3px;background:#0066cc;color:white;border:none;border-radius:3px;cursor:pointer;font-weight:bold;font-size:10px;">📥 Загрузить чужие</button></div>'+
  '<div id="copy-status" style="font-size:10px;margin-top:2px;text-align:center;font-weight:bold;color:#0066cc;">Готов к работе</div>'+
'</div>'+
'<div style="text-align:right;"><span id="twClosePanel" style="cursor:pointer;color:#a93226;font-size:10px;text-decoration:underline;">Закрыть панель</span></div>';
document.body.appendChild(p);

function updateAreas(){
    const o=getStored(sOff), d=getStored(sDef), t=getStored(sTower);
    document.getElementById('twCoordsListOff').value=Object.keys(o).join('\n');
    document.getElementById('twCountOff').textContent=Object.keys(o).length;
    document.getElementById('twCoordsListDef').value=Object.keys(d).join('\n');
    document.getElementById('twCountDef').textContent=Object.keys(d).length;
    document.getElementById('twCoordsListTower').value=Object.keys(t).join('\n');
    document.getElementById('twCountTower').textContent=Object.keys(t).length;
}
updateAreas();
document.getElementById('twClosePanel').onclick=()=>p.remove();

document.getElementById('twClearBtn').onclick=()=>{if(confirm('Очистить базы данных?')){localStorage.removeItem(sOff);localStorage.removeItem(sDef);localStorage.removeItem(sTower);updateAreas();document.getElementById('twStatus').textContent='Сброшено!';}};
document.getElementById('twClearCacheBtn').onclick=()=>{if(confirm('Очистить кэш карты?')){localStorage.removeItem(sCache);if(/screen=map/i.test(document.URL)) paintMap();}};

// Парсинг документа
function parseCoord(text) {
    const m = text.match(/(\d{3}\|\d{3})/);
    return m ? m[1] : null;
}

function parseNotesFromDocument(doc, offObj, defObj, towerObj) {
    const rows = Array.from(doc.querySelectorAll('table.overview_table tbody tr'));
    rows.forEach(row => {
        const villageCell = row.querySelector('td:nth-child(1)');
        const noteBody = row.querySelector('.village-note-body');
        if (!villageCell || !noteBody) return;

        const coord = parseCoord(villageCell.textContent.trim());
        if (!coord) return;

        const noteBB = (noteBody.getAttribute('data-note-bb') || noteBody.textContent || '').toUpperCase();

        if (noteBB.includes('БАШНЯ')) {
            towerObj[coord] = '#ffa500';
        }
        if (noteBB.includes('ОФФ')) {
            offObj[coord] = '#ff0000';
            delete defObj[coord];
        } else if (noteBB.includes('ДЕФФ') || noteBB.includes('ДЕФ')) {
            defObj[coord] = '#008000';
            delete offObj[coord];
        }
    });
}

async function fetchPage(url) {
    const res = await fetch(url, { credentials: 'same-origin' });
    const text = await res.text();
    return new DOMParser().parseFromString(text, 'text/html');
}

async function collectAllNotes() {
    const startUrl = window.location.href;
    const visited = new Set();
    visited.add(startUrl);

    const o = getStored(sOff), d = getStored(sDef), t = getStored(sTower);
    parseNotesFromDocument(document, o, d, t);

    const queue = [];
    document.querySelectorAll('a.paged-nav-item').forEach(a => {
        const href = a.getAttribute('href');
        if(href) {
            const fullUrl = new URL(href, window.location.origin).toString();
            if(!visited.has(fullUrl)) { visited.add(fullUrl); queue.push(fullUrl); }
        }
    });

    let donePages = 1, totalPages = queue.length + 1;
    for(let url of queue) {
        const st = document.getElementById('copy-status');
        if(st) st.textContent = `Сбор: ${++donePages}/${totalPages}`;
        try {
            const doc = await fetchPage(url);
            parseNotesFromDocument(doc, o, d, t);
        } catch(e) {}
    }

    saveStored(sOff, o); saveStored(sDef, d); saveStored(sTower, t);
    updateAreas();
}

document.getElementById('collect-all-notes-btn').onclick = async function() {
    if(!/screen=notes/i.test(document.URL)){
        alert('Для сбора своих заметок перейдите на страницу заметок (Обзор -> Заметки)!');
        return;
    }
    this.disabled = true; this.textContent = '⏳ Сбор...';
    try {
        await collectAllNotes();
        document.getElementById('copy-status').textContent = 'Сбор завершен!';
        alert('Все заметки со всех страниц успешно собраны!');
        if(/screen=map/i.test(document.URL)) paintMap();
    } finally {
        this.disabled = false; this.textContent = '📥 Снять со ВСЕХ страниц';
    }
};

// Загрузка списка игроков с фильтром по строке поиска
let allPlayersData = [];
async function loadList(){
    const sel = document.getElementById('player-select');
    if(!sel) return;
    try {
        const vId = window.game_data ? window.game_data.village.id : '1';
        const res = await fetch(`/game.php?village=${vId}&screen=notes&mode=ally`, {credentials: 'same-origin'});
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const fs = doc.querySelector('#friend-change-select');
        
        allPlayersData = [];
        if(fs){
            fs.querySelectorAll('option').forEach(o => {
                if(o.value && o.value !== '0'){
                    allPlayersData.push({id: o.value, name: o.textContent});
                }
            });
            renderPlayerSelect(allPlayersData);
        } else {
            sel.innerHTML = '<option value="">Список пуст</option>';
        }
    } catch(e) {
        sel.innerHTML = '<option value="">Ошибка загрузки</option>';
    }
}

function renderPlayerSelect(arr){
    const sel = document.getElementById('player-select');
    sel.innerHTML = '';
    if(arr.length === 0){
        sel.innerHTML = '<option value="">Ничего не найдено</option>';
        return;
    }
    arr.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        sel.appendChild(opt);
    });
}

document.getElementById('player-search-input').oninput = function(){
    const term = this.value.toLowerCase().trim();
    const filtered = allPlayersData.filter(p => p.name.toLowerCase().includes(term));
    renderPlayerSelect(filtered);
};

document.getElementById('player-select').onchange = function(){
    if(this.value) document.getElementById('manual-player-id').value = this.value;
};

document.getElementById('copy-notes-btn').onclick = async function(){
    const mId = document.getElementById('manual-player-id').value.trim() || document.getElementById('player-select').value;
    if(!mId){ alert('Укажите ID игрока или выберите из списка!'); return; }
    
    const st = document.getElementById('copy-status');
    st.textContent = '⏳ Загрузка заметок...';
    try {
        const vId = window.game_data ? window.game_data.village.id : '1';
        const res = await fetch(`/game.php?village=${vId}&screen=notes&mode=ally&player=${mId}`, {credentials: 'same-origin'});
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        
        const o = getStored(sOff), d = getStored(sDef), t = getStored(sTower);
        parseNotesFromDocument(doc, o, d, t);
        
        saveStored(sOff, o); saveStored(sDef, d); saveStored(sTower, t);
        updateAreas();
        st.textContent = '✅ Загружено!';
        if(/screen=map/i.test(document.URL)) paintMap();
        alert('Заметки игрока успешно загружены и распределены!');
    } catch(e){
        st.textContent = '❌ Ошибка';
    }
};

// Покраска карты
function paintMap(){
    if(!/screen=map/i.test(document.URL)) return;
    if(typeof MapSdk === 'undefined'){
        $.getScript('https://shinko-to-kuma.com/scripts/mapSdk.js', function(){
            setTimeout(paintMap, 300);
        });
        return;
    }
    MapSdk.init();
    MapSdk.circles = [];

    const o = getStored(sOff), d = getStored(sDef), t = getStored(sTower), cache = getStored(sCache);
    
    for(let coord in o) cache[coord] = '#ff0000';
    for(let coord in d) cache[coord] = '#008000';
    for(let coord in t) cache[coord] = '#ffa500';
    saveStored(sCache, cache);

    let total = 0;
    for(let coord in cache){
        const [x, y] = coord.split('|');
        const color = cache[coord];
        let fill = 'rgba(255, 0, 0, 0.75)';
        if(color === '#008000') fill = 'rgba(0, 128, 0, 0.75)';
        if(color === '#ffa500') fill = 'rgba(255, 165, 0, 0.85)';

        MapSdk.circles.push({
            x: x, y: y, radius: 0.3,
            styling: {
                main: { strokeStyle: '#000000', lineWidth: 1, fillStyle: fill },
                mini: { strokeStyle: '#000000', lineWidth: 1, fillStyle: fill }
            },
            drawOnMini: true, drawOnMap: true, markCircleOrigin: false
        });
        total++;
    }

    if(MapSdk.mapOverlay && typeof MapSdk.mapOverlay.reload === 'function'){
        MapSdk.mapOverlay.reload();
    }
}

document.getElementById('twPaintNowBtn').onclick = () => paintMap();

if(/screen=map/i.test(document.URL)){
    $.getScript('https://shinko-to-kuma.com/scripts/mapSdk.js', function(){
        setTimeout(paintMap, 400);
    });
}

setTimeout(loadList, 200);
})();
