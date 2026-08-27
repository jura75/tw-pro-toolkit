javascript:(function(){
if(document.getElementById('twProPainterPanel'))return;

const sOff='tw_painted_off_v30', 
      sOffDead='tw_painted_off_dead_v30', 
      sDef='tw_painted_def_v30', 
      sDefDead='tw_painted_def_dead_v30', 
      sTower='tw_painted_tower_v30', 
      sUnknown='tw_painted_unknown_v30', 
      sCache='tw_painted_cache_v30';

function getStored(k){try{const d=localStorage.getItem(k);return d?JSON.parse(d):{};}catch(e){return{};}}
function saveStored(k,d){try{localStorage.setItem(k,JSON.stringify(d));}catch(e){console.warn('LocalStorage limit reached');}}

// Создаем панель управления
const p=document.createElement('div');
p.id='twProPainterPanel';
p.style.cssText='position:fixed;top:60px;right:10px;z-index:999999;background:#f5f5e1;border:2px solid #8B4513;border-radius:6px;padding:10px;width:320px;font-family:Verdana,Arial;font-size:11px;color:#333;box-shadow:0 4px 15px rgba(0,0,0,0.4);max-height:90vh;overflow-y:auto;';
p.innerHTML='<h3 style="margin:0 0 8px 0;color:#8B4513;text-align:center;font-size:13px;border-bottom:1px solid #c8b99c;padding-bottom:4px;">TW PRO Менеджер Заметок & Карта</h3>'+
'<div style="margin-bottom:8px;background:#fffbe8;padding:6px;border:1px solid #e2d4b7;border-radius:4px;">'+
  '<div style="display:flex;gap:4px;margin-bottom:4px;"><button id="twPaintNowBtn" style="flex:1;padding:6px;background:#2e7d32;color:#fff;border:1px solid #000;border-radius:3px;font-weight:bold;cursor:pointer;">🎨 Обновить покраску карты</button></div>'+
  '<div style="display:flex;gap:4px;"><button id="twClearCacheBtn" style="flex:1;padding:4px;background:#b7950b;color:#fff;border:1px solid #000;border-radius:3px;font-weight:bold;cursor:pointer;">🧹 Очистить кэш</button><button id="twClearBtn" style="padding:4px 6px;background:#a93226;color:#fff;border:1px solid #000;border-radius:3px;font-weight:bold;cursor:pointer;">Сброс</button></div>'+
'</div>'+
'<div style="margin-bottom:6px;background:#eef2f7;padding:5px;border:1px solid #b0c4de;border-radius:4px;">'+
  '<label style="display:block;font-weight:bold;margin-bottom:2px;color:#1c3d5a;font-size:10px;">🔍 Фильтр по координатам:</label>'+
  '<input type="text" id="twGlobalSearch" placeholder="Введите часть координат (например, 500)..." style="width:100%;padding:4px;font-size:10px;border:1px solid #93c5fd;border-radius:3px;box-sizing:border-box;">'+
'</div>'+
'<div style="margin-bottom:6px;border:1px solid #ff8a80;background:#ffe5e5;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#8e1b1b;">🔴 Офф (<span id="twCountOff">0</span>):</label><textarea id="twCoordsListOff" style="width:100%;height:30px;font-size:10px;border:1px solid #ff8a80;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #fbc02d;background:#fffde7;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#f57f17;">🟡 Офф слит (<span id="twCountOffDead">0</span>):</label><textarea id="twCoordsListOffDead" style="width:100%;height:30px;font-size:10px;border:1px solid #fbc02d;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #81c784;background:#e6f4ea;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#2e7d32;">🟢 Дефф (<span id="twCountDef">0</span>):</label><textarea id="twCoordsListDef" style="width:100%;height:30px;font-size:10px;border:1px solid #81c784;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #00e676;background:#e8f5e9;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#00c853;">🟢 Дефф слит (<span id="twCountDefDead">0</span>):</label><textarea id="twCoordsListDefDead" style="width:100%;height:30px;font-size:10px;border:1px solid #00e676;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #ffb74d;background:#fff3e0;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#e65100;">🟠 Башня (<span id="twCountTower">0</span>):</label><textarea id="twCoordsListTower" style="width:100%;height:30px;font-size:10px;border:1px solid #ffb74d;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
'<div style="margin-bottom:6px;border:1px solid #ce93d8;background:#f3e5f5;padding:5px;border-radius:4px;"><label style="display:block;font-weight:bold;margin-bottom:2px;color:#6a1b9a;">🟣 Неизвестно (<span id="twCountUnknown">0</span>):</label><textarea id="twCoordsListUnknown" style="width:100%;height:30px;font-size:10px;border:1px solid #ce93d8;border-radius:3px;background:#fff;box-sizing:border-box;resize:vertical;"></textarea></div>'+
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
    const o = getStored(sOff), 
          od = getStored(sOffDead), 
          d = getStored(sDef), 
          dd = getStored(sDefDead), 
          t = getStored(sTower), 
          u = getStored(sUnknown);

    document.getElementById('twCoordsListOff').value = Object.keys(o).join('\n');
    document.getElementById('twCountOff').textContent = Object.keys(o).length;

    document.getElementById('twCoordsListOffDead').value = Object.keys(od).join('\n');
    document.getElementById('twCountOffDead').textContent = Object.keys(od).length;

    document.getElementById('twCoordsListDef').value = Object.keys(d).join('\n');
    document.getElementById('twCountDef').textContent = Object.keys(d).length;

    document.getElementById('twCoordsListDefDead').value = Object.keys(dd).join('\n');
    document.getElementById('twCountDefDead').textContent = Object.keys(dd).length;

    document.getElementById('twCoordsListTower').value = Object.keys(t).join('\n');
    document.getElementById('twCountTower').textContent = Object.keys(t).length;

    document.getElementById('twCoordsListUnknown').value = Object.keys(u).join('\n');
    document.getElementById('twCountUnknown').textContent = Object.keys(u).length;
}
updateAreas();
document.getElementById('twClosePanel').onclick = () => p.remove();

document.getElementById('twClearBtn').onclick = () => {
    if(confirm('Очистить базы данных?')){
        localStorage.removeItem(sOff); localStorage.removeItem(sOffDead);
        localStorage.removeItem(sDef); localStorage.removeItem(sDefDead);
        localStorage.removeItem(sTower); localStorage.removeItem(sUnknown);
        localStorage.removeItem(sCache);
        updateAreas();
        document.getElementById('copy-status').textContent = 'Сброшено!';
    }
};

document.getElementById('twClearCacheBtn').onclick = () => {
    if(confirm('Очистить кэш карты?')){
        localStorage.removeItem(sCache);
        if(/screen=map/i.test(document.URL)) paintMap();
    }
};

// Быстрый фильтр по координатам
document.getElementById('twGlobalSearch').oninput = function(){
    const query = this.value.toLowerCase().trim();
    const o = getStored(sOff), od = getStored(sOffDead), d = getStored(sDef), dd = getStored(sDefDead), t = getStored(sTower), u = getStored(sUnknown);
    
    if(!query){ updateAreas(); return; }

    const filterObj = (obj) => Object.keys(obj).filter(coord => coord.toLowerCase().includes(query));

    document.getElementById('twCoordsListOff').value = filterObj(o).join('\n');
    document.getElementById('twCoordsListOffDead').value = filterObj(od).join('\n');
    document.getElementById('twCoordsListDef').value = filterObj(d).join('\n');
    document.getElementById('twCoordsListDefDead').value = filterObj(dd).join('\n');
    document.getElementById('twCoordsListTower').value = filterObj(t).join('\n');
    document.getElementById('twCoordsListUnknown').value = filterObj(u).join('\n');
};

function parseCoord(text) {
    const m = text.match(/(\d{3}\|\d{3})/);
    return m ? m[1] : null;
}

// Парсер заметок
function parseNotesFromDocument(doc, offObj, offDeadObj, defObj, defDeadObj, towerObj, unknownObj) {
    const rows = Array.from(doc.querySelectorAll('table.overview_table tbody tr'));
    rows.forEach(row => {
        const villageCell = row.querySelector('td:nth-child(1)');
        const noteBody = row.querySelector('.village-note-body');
        if (!villageCell || !noteBody) return;

        const coord = parseCoord(villageCell.textContent.trim());
        if (!coord) return;

        const rawText = noteBody.textContent || '';
        const noteBB = (noteBody.getAttribute('data-note-bb') || rawText).toUpperCase();

        // Сбрасываем старую принадлежность
        delete offObj[coord]; delete offDeadObj[coord];
        delete defObj[coord]; delete defDeadObj[coord];
        delete towerObj[coord]; delete unknownObj[coord];

        // Проверяем совпадения (с новыми цветами)
        if (noteBB.includes('БАШНЯ')) {
            towerObj[coord] = '#ffa500';
        }
        
        if (noteBB.includes('ОФФ СЛИТ') || noteBB.includes('ОФФ-СЛИТ') || noteBB.includes('СЛИТ ОФФ')) {
            offDeadObj[coord] = '#ffeb3b'; // Желтый
        } else if (noteBB.includes('ОФФ')) {
            offObj[coord] = '#ff0000';
        }

        if (noteBB.includes('ДЕФФ СЛИТ') || noteBB.includes('ДЕФ-СЛИТ') || noteBB.includes('СЛИТ ДЕФ') || noteBB.includes('ДЕФ СЛИТОМ')) {
            defDeadObj[coord] = '#00e676'; // Ярко-зеленый
        } else if (noteBB.includes('ДЕФФ') || noteBB.includes('ДЕФ')) {
            defObj[coord] = '#008000';
        }

        if (noteBB.includes('НЕИЗВЕСТНО') || (noteBB.includes('?') && noteBB.length < 15)) {
            unknownObj[coord] = '#ab47bc';
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

    const o = getStored(sOff), od = getStored(sOffDead), d = getStored(sDef), dd = getStored(sDefDead), t = getStored(sTower), u = getStored(sUnknown);
    parseNotesFromDocument(document, o, od, d, dd, t, u);

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
            parseNotesFromDocument(doc, o, od, d, dd, t, u);
        } catch(e) {}
    }

    saveStored(sOff, o); saveStored(sOffDead, od); saveStored(sDef, d); saveStored(sDefDead, dd); saveStored(sTower, t); saveStored(sUnknown, u);
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
        alert('Все заметки успешно собраны и разложены по окнам!');
        if(/screen=map/i.test(document.URL)) paintMap();
    } finally {
        this.disabled = false; this.textContent = '📥 Снять со ВСЕХ страниц';
    }
};

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

// Загрузка чужих заметок со ВСЕХ страниц выбранного игрока
document.getElementById('copy-notes-btn').onclick = async function(){
    const mId = document.getElementById('manual-player-id').value.trim() || document.getElementById('player-select').value;
    if(!mId){ alert('Укажите ID игрока или выберите из списка!'); return; }
    
    const st = document.getElementById('copy-status');
    st.textContent = '⏳ Загрузка 1-й страницы...';
    
    try {
        const vId = window.game_data ? window.game_data.village.id : '1';
        const firstUrl = `/game.php?village=${vId}&screen=notes&mode=ally&player=${mId}`;
        
        const firstDoc = await fetchPage(window.location.origin + firstUrl);
        
        const o = getStored(sOff), od = getStored(sOffDead), d = getStored(sDef), dd = getStored(sDefDead), t = getStored(sTower), u = getStored(sUnknown);
        parseNotesFromDocument(firstDoc, o, od, d, dd, t, u);

        const visited = new Set();
        visited.add(firstUrl);
        const queue = [];

        firstDoc.querySelectorAll('a.paged-nav-item').forEach(a => {
            const href = a.getAttribute('href');
            if(href) {
                const fullUrl = new URL(href, window.location.origin).toString();
                if(!visited.has(fullUrl)) { visited.add(fullUrl); queue.push(fullUrl); }
            }
        });

        let donePages = 1, totalPages = queue.length + 1;
        for(let url of queue) {
            st.textContent = `Сбор страниц: ${++donePages}/${totalPages}`;
            try {
                const doc = await fetchPage(url);
                parseNotesFromDocument(doc, o, od, d, dd, t, u);
            } catch(e) {}
        }
        
        saveStored(sOff, o); saveStored(sOffDead, od); saveStored(sDef, d); saveStored(sDefDead, dd); saveStored(sTower, t); saveStored(sUnknown, u);
        updateAreas();
        st.textContent = '✅ Загружено со всех страниц!';
        if(/screen=map/i.test(document.URL)) paintMap();
        alert(`Заметки игрока успешно загружены со всех страниц (${totalPages} шт.) и распределены по окнам!`);
    } catch(e){
        st.textContent = '❌ Ошибка загрузки';
        alert('Произошла ошибка при загрузке страниц игрока.');
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

    const o = getStored(sOff), od = getStored(sOffDead), d = getStored(sDef), dd = getStored(sDefDead), t = getStored(sTower), u = getStored(sUnknown), cache = getStored(sCache);
    
    for(let coord in o) cache[coord] = '#ff0000';
    for(let coord in od) cache[coord] = '#ffeb3b'; // Желтый
    for(let coord in d) cache[coord] = '#008000';
    for(let coord in dd) cache[coord] = '#00e676'; // Ярко-зеленый
    for(let coord in t) cache[coord] = '#ffa500';
    for(let coord in u) cache[coord] = '#ab47bc';
    saveStored(sCache, cache);

    for(let coord in cache){
        const [x, y] = coord.split('|');
        const color = cache[coord];
        let fill = 'rgba(255, 0, 0, 0.75)';
        if(color === '#ffeb3b') fill = 'rgba(255, 235, 59, 0.75)';
        if(color === '#008000') fill = 'rgba(0, 128, 0, 0.75)';
        if(color === '#00e676') fill = 'rgba(0, 230, 118, 0.75)';
        if(color === '#ffa500') fill = 'rgba(255, 165, 0, 0.85)';
        if(color === '#ab47bc') fill = 'rgba(171, 71, 188, 0.75)';

        MapSdk.circles.push({
            x: x, y: y, radius: 0.3,
            styling: {
                main: { strokeStyle: '#000000', lineWidth: 1, fillStyle: fill },
                mini: { strokeStyle: '#000000', lineWidth: 1, fillStyle: fill }
            },
            drawOnMini: true, drawOnMap: true, markCircleOrigin: false
        });
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
