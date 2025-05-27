// Funciones para calcular y mostrar días de retraso
function calcularDiasDiferencia(fechaInicial, fechaFinal) {
    const MILISEGUNDOS_EN_UN_DIA = 1000 * 60 * 60 * 24;
    return Math.floor((fechaFinal - fechaInicial) / MILISEGUNDOS_EN_UN_DIA);
}

function obtenerFechaUltimaLectura() {
    const fechaGuardada = localStorage.getItem('lastReadingDate');
    if (fechaGuardada) { return new Date(fechaGuardada); }
    return null;
}

// Se llama desde displayDailySuggestion después de calcular el nuevo window.dayDiff
function actualizarInterfazDiasRetraso() {
    const daysDelayedEl = document.getElementById('daysDelayedText'); // ID del HTML
    if (daysDelayedEl) {
        const delayToShow = window.dayDiff !== undefined ? window.dayDiff : 0;
        daysDelayedEl.textContent = delayToShow;
        daysDelayedEl.classList.toggle('has-delay', delayToShow > 0);
        const statusBlock = daysDelayedEl.closest('.suggestion-block--status');
        if (statusBlock) statusBlock.classList.toggle('has-delay', delayToShow > 0);
    }
}

function actualizarUltimaLectura() {
    const hoy = new Date();
    localStorage.setItem('lastReadingDate', hoy.toISOString());
    displayDailySuggestion(); 
}


document.addEventListener('DOMContentLoaded', () => {
    const bibleBooks = [
        { name: "Génesis", chapters: 50, testament: "Antiguo" }, { name: "Éxodo", chapters: 40, testament: "Antiguo" },
        { name: "Levítico", chapters: 27, testament: "Antiguo" }, { name: "Números", chapters: 36, testament: "Antiguo" },
        { name: "Deuteronomio", chapters: 34, testament: "Antiguo" }, { name: "Josué", chapters: 24, testament: "Antiguo" },
        { name: "Jueces", chapters: 21, testament: "Antiguo" }, { name: "Rut", chapters: 4, testament: "Antiguo" },
        { name: "1 Samuel", chapters: 31, testament: "Antiguo" }, { name: "2 Samuel", chapters: 24, testament: "Antiguo" },
        { name: "1 Reyes", chapters: 22, testament: "Antiguo" }, { name: "2 Reyes", chapters: 25, testament: "Antiguo" },
        { name: "1 Crónicas", chapters: 29, testament: "Antiguo" }, { name: "2 Crónicas", chapters: 36, testament: "Antiguo" },
        { name: "Esdras", chapters: 10, testament: "Antiguo" }, { name: "Nehemías", chapters: 13, testament: "Antiguo" },
        { name: "Ester", chapters: 10, testament: "Antiguo" }, { name: "Job", chapters: 42, testament: "Antiguo" },
        { name: "Salmos", chapters: 150, testament: "Antiguo" }, { name: "Proverbios", chapters: 31, testament: "Antiguo" },
        { name: "Eclesiastés", chapters: 12, testament: "Antiguo" }, { name: "Cantar de los Cantares", chapters: 8, testament: "Antiguo" },
        { name: "Isaías", chapters: 66, testament: "Antiguo" }, { name: "Jeremías", chapters: 52, testament: "Antiguo" },
        { name: "Lamentaciones", chapters: 5, testament: "Antiguo" }, { name: "Ezequiel", chapters: 48, testament: "Antiguo" },
        { name: "Daniel", chapters: 12, testament: "Antiguo" }, { name: "Oseas", chapters: 14, testament: "Antiguo" },
        { name: "Joel", chapters: 3, testament: "Antiguo" }, { name: "Amós", chapters: 9, testament: "Antiguo" },
        { name: "Abdías", chapters: 1, testament: "Antiguo" }, { name: "Jonás", chapters: 4, testament: "Antiguo" },
        { name: "Miqueas", chapters: 7, testament: "Antiguo" }, { name: "Nahúm", chapters: 3, testament: "Antiguo" },
        { name: "Habacuc", chapters: 3, testament: "Antiguo" }, { name: "Sofonías", chapters: 3, testament: "Antiguo" },
        { name: "Ageo", chapters: 2, testament: "Antiguo" }, { name: "Zacarías", chapters: 14, testament: "Antiguo" },
        { name: "Malaquías", chapters: 4, testament: "Antiguo" }, { name: "Mateo", chapters: 28, testament: "Nuevo" },
        { name: "Marcos", chapters: 16, testament: "Nuevo" }, { name: "Lucas", chapters: 24, testament: "Nuevo" },
        { name: "Juan", chapters: 21, testament: "Nuevo" }, { name: "Hechos", chapters: 28, testament: "Nuevo" },
        { name: "Romanos", chapters: 16, testament: "Nuevo" }, { name: "1 Corintios", chapters: 16, testament: "Nuevo" },
        { name: "2 Corintios", chapters: 13, testament: "Nuevo" }, { name: "Gálatas", chapters: 6, testament: "Nuevo" },
        { name: "Efesios", chapters: 6, testament: "Nuevo" }, { name: "Filipenses", chapters: 4, testament: "Nuevo" },
        { name: "Colosenses", chapters: 4, testament: "Nuevo" }, { name: "1 Tesalonicenses", chapters: 5, testament: "Nuevo" },
        { name: "2 Tesalonicenses", chapters: 3, testament: "Nuevo" }, { name: "1 Timoteo", chapters: 6, testament: "Nuevo" },
        { name: "2 Timoteo", chapters: 4, testament: "Nuevo" }, { name: "Tito", chapters: 3, testament: "Nuevo" },
        { name: "Filemón", chapters: 1, testament: "Nuevo" }, { name: "Hebreos", chapters: 13, testament: "Nuevo" },
        { name: "Santiago", chapters: 5, testament: "Nuevo" }, { name: "1 Pedro", chapters: 5, testament: "Nuevo" },
        { name: "2 Pedro", chapters: 3, testament: "Nuevo" }, { name: "1 Juan", chapters: 5, testament: "Nuevo" },
        { name: "2 Juan", chapters: 1, testament: "Nuevo" }, { name: "3 Juan", chapters: 1, testament: "Nuevo" },
        { name: "Judas", chapters: 1, testament: "Nuevo" }, { name: "Apocalipsis", chapters: 22, testament: "Nuevo" }
    ];
    const normalizedBibleBooks = bibleBooks.map(book => ({...book, name: book.name.replace(/\u00A0/g, ' ').replace(/Ι/g, 'I') }));
    
    function createStdPlanEntry(b, sc, ec) { return { book: b, startChapter: sc, endChapter: ec, displayText: `${b} ${sc}-${ec}`}; }
    function createSpecialPlanEntry(b, c, dt) { return { book: b, startChapter: c, endChapter: c, displayText: dt || `${b} ${c}`}; }
    function createCombinedPlanEntry(cb, fbs, fbe, sbs, sbe, tbs, tbe, cdt){ return { book: cb,startChapter:1,endChapter:1,displayText:cdt}; }

    const dailyReadingPlan = [ /* ... (contenido del plan sin cambios, muy largo para repetir) ... */
        createStdPlanEntry("Génesis", 1, 3), createStdPlanEntry("Génesis", 4, 7), createStdPlanEntry("Génesis", 8, 11),
        createStdPlanEntry("Génesis", 12, 15), createStdPlanEntry("Génesis", 16, 18), createStdPlanEntry("Génesis", 19, 22),
        createStdPlanEntry("Génesis", 23, 24), createStdPlanEntry("Génesis", 25, 27), createStdPlanEntry("Génesis", 28, 30),
        createStdPlanEntry("Génesis", 31, 32), createStdPlanEntry("Génesis", 33, 34), createStdPlanEntry("Génesis", 35, 37),
        createStdPlanEntry("Génesis", 38, 40), createStdPlanEntry("Génesis", 41, 42), createStdPlanEntry("Génesis", 43, 45),
        createStdPlanEntry("Génesis", 46, 48), createStdPlanEntry("Génesis", 49, 50),
        createStdPlanEntry("Éxodo", 1, 4), createStdPlanEntry("Éxodo", 5, 7), createStdPlanEntry("Éxodo", 8, 10),
        createStdPlanEntry("Éxodo", 11, 13), createStdPlanEntry("Éxodo", 14, 15), createStdPlanEntry("Éxodo", 16, 18),
        createStdPlanEntry("Éxodo", 19, 21), createStdPlanEntry("Éxodo", 22, 25), createStdPlanEntry("Éxodo", 26, 28),
        createStdPlanEntry("Éxodo", 29, 30), createStdPlanEntry("Éxodo", 31, 33), createStdPlanEntry("Éxodo", 34, 35),
        createStdPlanEntry("Éxodo", 36, 38), createStdPlanEntry("Éxodo", 39, 40),
        createStdPlanEntry("Levítico", 1, 4), createStdPlanEntry("Levítico", 5, 7), createStdPlanEntry("Levítico", 8, 10),
        createStdPlanEntry("Levítico", 11, 13), createStdPlanEntry("Levítico", 14, 15), createStdPlanEntry("Levítico", 16, 18),
        createStdPlanEntry("Levítico", 19, 21), createStdPlanEntry("Levítico", 22, 23), createStdPlanEntry("Levítico", 24, 25),
        createStdPlanEntry("Levítico", 26, 27),
        createStdPlanEntry("Números", 1, 3), createStdPlanEntry("Números", 4, 6), createStdPlanEntry("Números", 7, 9),
        createStdPlanEntry("Números", 10, 12), createStdPlanEntry("Números", 13, 15), createStdPlanEntry("Números", 16, 18),
        createStdPlanEntry("Números", 19, 21), createStdPlanEntry("Números", 22, 24), createStdPlanEntry("Números", 25, 27),
        createStdPlanEntry("Números", 28, 30), createStdPlanEntry("Números", 31, 32), createStdPlanEntry("Números", 33, 36),
        createStdPlanEntry("Deuteronomio", 1, 2), createStdPlanEntry("Deuteronomio", 3, 4), createStdPlanEntry("Deuteronomio", 5, 7),
        createStdPlanEntry("Deuteronomio", 8, 10), createStdPlanEntry("Deuteronomio", 11, 13), createStdPlanEntry("Deuteronomio", 14, 16),
        createStdPlanEntry("Deuteronomio", 17, 19), createStdPlanEntry("Deuteronomio", 20, 22), createStdPlanEntry("Deuteronomio", 23, 26),
        createStdPlanEntry("Deuteronomio", 27, 28), createStdPlanEntry("Deuteronomio", 29, 31),
        createSpecialPlanEntry("Deuteronomio", 32, "Deuteronomio 32"), createStdPlanEntry("Deuteronomio", 33, 34),
        createStdPlanEntry("Josué", 1, 4), createStdPlanEntry("Josué", 5, 7), createStdPlanEntry("Josué", 8, 9),
        createStdPlanEntry("Josué", 10, 12), createStdPlanEntry("Josué", 13, 15), createStdPlanEntry("Josué", 16, 18),
        createStdPlanEntry("Josué", 19, 21), createStdPlanEntry("Josué", 22, 24),
        createStdPlanEntry("Jueces", 1, 2), createStdPlanEntry("Jueces", 3, 5), createStdPlanEntry("Jueces", 6, 7),
        createStdPlanEntry("Jueces", 8, 9), createStdPlanEntry("Jueces", 10, 11), createStdPlanEntry("Jueces", 12, 13),
        createStdPlanEntry("Jueces", 14, 16), createStdPlanEntry("Jueces", 17, 19), createStdPlanEntry("Jueces", 20, 21),
        createStdPlanEntry("Rut", 1, 4),
        createStdPlanEntry("1 Samuel", 1, 2), createStdPlanEntry("1 Samuel", 3, 6), createStdPlanEntry("1 Samuel", 7, 9),
        createStdPlanEntry("1 Samuel", 10, 12), createStdPlanEntry("1 Samuel", 13, 14), createStdPlanEntry("1 Samuel", 15, 16),
        createStdPlanEntry("1 Samuel", 17, 18), createStdPlanEntry("1 Samuel", 19, 21), createStdPlanEntry("1 Samuel", 22, 24),
        createStdPlanEntry("1 Samuel", 25, 27), createStdPlanEntry("1 Samuel", 28, 31),
        createStdPlanEntry("2 Samuel", 1, 2), createStdPlanEntry("2 Samuel", 3, 5), createStdPlanEntry("2 Samuel", 6, 8),
        createStdPlanEntry("2 Samuel", 9, 12), createStdPlanEntry("2 Samuel", 13, 14), createStdPlanEntry("2 Samuel", 15, 16),
        createStdPlanEntry("2 Samuel", 17, 18), createStdPlanEntry("2 Samuel", 19, 20), createStdPlanEntry("2 Samuel", 21, 22),
        createStdPlanEntry("2 Samuel", 23, 24),
        createStdPlanEntry("1 Reyes", 1, 2), createStdPlanEntry("1 Reyes", 3, 5), createStdPlanEntry("1 Reyes", 6, 7),
        createSpecialPlanEntry("1 Reyes", 8, "1 Reyes 8"), createStdPlanEntry("1 Reyes", 9, 10), createStdPlanEntry("1 Reyes", 11, 12),
        createStdPlanEntry("1 Reyes", 13, 14), createStdPlanEntry("1 Reyes", 15, 17), createStdPlanEntry("1 Reyes", 18, 19),
        createStdPlanEntry("1 Reyes", 20, 21), createSpecialPlanEntry("1 Reyes", 22, "1 Reyes 22"),
        createStdPlanEntry("2 Reyes", 1, 3), createStdPlanEntry("2 Reyes", 4, 5), createStdPlanEntry("2 Reyes", 6, 8),
        createStdPlanEntry("2 Reyes", 9, 10), createStdPlanEntry("2 Reyes", 11, 13), createStdPlanEntry("2 Reyes", 14, 15),
        createStdPlanEntry("2 Reyes", 16, 17), createStdPlanEntry("2 Reyes", 18, 19), createStdPlanEntry("2 Reyes", 20, 22),
        createStdPlanEntry("2 Reyes", 23, 25),
        createStdPlanEntry("1 Crónicas", 1, 2), createStdPlanEntry("1 Crónicas", 3, 5), createStdPlanEntry("1 Crónicas", 6, 7),
        createStdPlanEntry("1 Crónicas", 8, 10), createStdPlanEntry("1 Crónicas", 11, 12), createStdPlanEntry("1 Crónicas", 13, 15),
        createStdPlanEntry("1 Crónicas", 16, 17), createStdPlanEntry("1 Crónicas", 18, 20), createStdPlanEntry("1 Crónicas", 21, 23),
        createStdPlanEntry("1 Crónicas", 24, 26), createStdPlanEntry("1 Crónicas", 27, 29),
        createStdPlanEntry("2 Crónicas", 1, 3), createStdPlanEntry("2 Crónicas", 4, 6), createStdPlanEntry("2 Crónicas", 7, 9),
        createStdPlanEntry("2 Crónicas", 10, 14), createStdPlanEntry("2 Crónicas", 15, 18), createStdPlanEntry("2 Crónicas", 19, 22),
        createStdPlanEntry("2 Crónicas", 23, 25), createStdPlanEntry("2 Crónicas", 26, 28), createStdPlanEntry("2 Crónicas", 29, 30),
        createStdPlanEntry("2 Crónicas", 31, 33), createStdPlanEntry("2 Crónicas", 34, 36),
        createStdPlanEntry("Esdras", 1, 3), createStdPlanEntry("Esdras", 4, 7), createStdPlanEntry("Esdras", 8, 10),
        createStdPlanEntry("Nehemías", 1, 3), createStdPlanEntry("Nehemías", 4, 6), createStdPlanEntry("Nehemías", 7, 8),
        createStdPlanEntry("Nehemías", 9, 10), createStdPlanEntry("Nehemías", 11, 13),
        createStdPlanEntry("Ester", 1, 4), createStdPlanEntry("Ester", 5, 10),
        createStdPlanEntry("Job", 1, 5), createStdPlanEntry("Job", 6, 9), createStdPlanEntry("Job", 10, 14),
        createStdPlanEntry("Job", 15, 18), createStdPlanEntry("Job", 19, 20), createStdPlanEntry("Job", 21, 24),
        createStdPlanEntry("Job", 25, 29), createStdPlanEntry("Job", 30, 31), createStdPlanEntry("Job", 32, 34),
        createStdPlanEntry("Job", 35, 38), createStdPlanEntry("Job", 39, 42),
        createStdPlanEntry("Salmos", 1, 8), createStdPlanEntry("Salmos", 9, 16), createStdPlanEntry("Salmos", 17, 19),
        createStdPlanEntry("Salmos", 20, 25), createStdPlanEntry("Salmos", 26, 31), createStdPlanEntry("Salmos", 32, 35),
        createStdPlanEntry("Salmos", 36, 38), createStdPlanEntry("Salmos", 39, 42), createStdPlanEntry("Salmos", 43, 47),
        createStdPlanEntry("Salmos", 48, 52), createStdPlanEntry("Salmos", 53, 58), createStdPlanEntry("Salmos", 59, 64),
        createStdPlanEntry("Salmos", 65, 68), createStdPlanEntry("Salmos", 69, 72), createStdPlanEntry("Salmos", 73, 77),
        createStdPlanEntry("Salmos", 78, 79), createStdPlanEntry("Salmos", 80, 86), createStdPlanEntry("Salmos", 87, 90),
        createStdPlanEntry("Salmos", 91, 96), createStdPlanEntry("Salmos", 97, 103), createStdPlanEntry("Salmos", 104, 105),
        createStdPlanEntry("Salmos", 106, 108), createStdPlanEntry("Salmos", 109, 115),
        createSpecialPlanEntry("Salmos", 119, "Salmos 116-119 (hasta v. 63)"), 
        createSpecialPlanEntry("Salmos", 119, "Salmos 119 (desde v. 64)"),   
        createStdPlanEntry("Salmos", 120, 129), createStdPlanEntry("Salmos", 130, 138),
        createStdPlanEntry("Salmos", 139, 144), createStdPlanEntry("Salmos", 145, 150),
        createStdPlanEntry("Proverbios", 1, 4), createStdPlanEntry("Proverbios", 5, 8), createStdPlanEntry("Proverbios", 9, 12),
        createStdPlanEntry("Proverbios", 13, 16), createStdPlanEntry("Proverbios", 17, 19), createStdPlanEntry("Proverbios", 20, 22),
        createStdPlanEntry("Proverbios", 23, 27), createStdPlanEntry("Proverbios", 28, 31),
        createStdPlanEntry("Eclesiastés", 1, 4), createStdPlanEntry("Eclesiastés", 5, 8), createStdPlanEntry("Eclesiastés", 9, 12),
        createStdPlanEntry("Cantar de los Cantares", 1, 8),
        createStdPlanEntry("Isaías", 1, 4), createStdPlanEntry("Isaías", 5, 7), createStdPlanEntry("Isaías", 8, 10),
        createStdPlanEntry("Isaías", 11, 14), createStdPlanEntry("Isaías", 15, 19), createStdPlanEntry("Isaías", 20, 24),
        createStdPlanEntry("Isaías", 25, 28), createStdPlanEntry("Isaías", 29, 31), createStdPlanEntry("Isaías", 32, 35),
        createStdPlanEntry("Isaías", 36, 37), createStdPlanEntry("Isaías", 38, 40), createStdPlanEntry("Isaías", 41, 43),
        createStdPlanEntry("Isaías", 44, 47), createStdPlanEntry("Isaías", 48, 50), createStdPlanEntry("Isaías", 51, 55),
        createStdPlanEntry("Isaías", 56, 58), createStdPlanEntry("Isaías", 59, 62), createStdPlanEntry("Isaías", 63, 66),
        createStdPlanEntry("Jeremías", 1, 3), createStdPlanEntry("Jeremías", 4, 5), createStdPlanEntry("Jeremías", 6, 7),
        createStdPlanEntry("Jeremías", 8, 10), createStdPlanEntry("Jeremías", 11, 13), createStdPlanEntry("Jeremías", 14, 16),
        createStdPlanEntry("Jeremías", 17, 20), createStdPlanEntry("Jeremías", 21, 23), createStdPlanEntry("Jeremías", 24, 26),
        createStdPlanEntry("Jeremías", 27, 29), createStdPlanEntry("Jeremías", 30, 31), createStdPlanEntry("Jeremías", 32, 33),
        createStdPlanEntry("Jeremías", 34, 36), createStdPlanEntry("Jeremías", 37, 39), createStdPlanEntry("Jeremías", 40, 42),
        createStdPlanEntry("Jeremías", 43, 44), createStdPlanEntry("Jeremías", 45, 48), createStdPlanEntry("Jeremías", 49, 50),
        createStdPlanEntry("Jeremías", 51, 52),
        createStdPlanEntry("Lamentaciones", 1, 2), createStdPlanEntry("Lamentaciones", 3, 5),
        createStdPlanEntry("Ezequiel", 1, 3), createStdPlanEntry("Ezequiel", 4, 6), createStdPlanEntry("Ezequiel", 7, 9),
        createStdPlanEntry("Ezequiel", 10, 12), createStdPlanEntry("Ezequiel", 13, 15), createSpecialPlanEntry("Ezequiel", 16, "Ezequiel 16"),
        createStdPlanEntry("Ezequiel", 17, 18), createStdPlanEntry("Ezequiel", 19, 21), createStdPlanEntry("Ezequiel", 22, 23),
        createStdPlanEntry("Ezequiel", 24, 26), createStdPlanEntry("Ezequiel", 27, 28), createStdPlanEntry("Ezequiel", 29, 31),
        createStdPlanEntry("Ezequiel", 32, 33), createStdPlanEntry("Ezequiel", 34, 36), createStdPlanEntry("Ezequiel", 37, 38),
        createStdPlanEntry("Ezequiel", 39, 40), createStdPlanEntry("Ezequiel", 41, 43), createStdPlanEntry("Ezequiel", 44, 45),
        createStdPlanEntry("Ezequiel", 46, 48),
        createStdPlanEntry("Daniel", 1, 2), createStdPlanEntry("Daniel", 3, 4), createStdPlanEntry("Daniel", 5, 7),
        createStdPlanEntry("Daniel", 8, 10), createStdPlanEntry("Daniel", 11, 12),
        createStdPlanEntry("Oseas", 1, 7), createStdPlanEntry("Oseas", 8, 14),
        createStdPlanEntry("Joel", 1, 3),
        createStdPlanEntry("Amós", 1, 5), createStdPlanEntry("Amós", 6, 9),
        createCombinedPlanEntry("Abdías, Jonás", 1,1,1,4,0,0, "Abdías 1, Jonás 1-4"),
        createStdPlanEntry("Miqueas", 1, 7),
        createCombinedPlanEntry("Nahúm, Habacuc",1,3,1,3,0,0, "Nahúm 1-3, Habacuc 1-3"),
        createCombinedPlanEntry("Sofonías, Ageo",1,3,1,2,0,0, "Sofonías 1-3, Ageo 1-2"),
        createStdPlanEntry("Zacarías", 1, 7), createStdPlanEntry("Zacarías", 8, 11), createStdPlanEntry("Zacarías", 12, 14),
        createStdPlanEntry("Malaquías", 1, 4),
        createStdPlanEntry("Mateo", 1, 4), createStdPlanEntry("Mateo", 5, 7), createStdPlanEntry("Mateo", 8, 10),
        createStdPlanEntry("Mateo", 11, 13), createStdPlanEntry("Mateo", 14, 17), createStdPlanEntry("Mateo", 18, 20),
        createStdPlanEntry("Mateo", 21, 23), createStdPlanEntry("Mateo", 24, 25), createSpecialPlanEntry("Mateo", 26, "Mateo 26"),
        createStdPlanEntry("Mateo", 27, 28), // Índice 294
        createStdPlanEntry("Marcos", 1, 3), 
        // ... resto del plan
        createStdPlanEntry("Romanos", 1, 3), createStdPlanEntry("Romanos", 4, 7), createStdPlanEntry("Romanos", 8, 11),
        createStdPlanEntry("Romanos", 12, 16),
        createStdPlanEntry("1 Corintios", 1, 6), createStdPlanEntry("1 Corintios", 7, 10),
        createStdPlanEntry("1 Corintios", 11, 14), createStdPlanEntry("1 Corintios", 15, 16),
        createStdPlanEntry("2 Corintios", 1, 6), createStdPlanEntry("2 Corintios", 7, 10), createStdPlanEntry("2 Corintios", 11, 13),
        createStdPlanEntry("Gálatas", 1, 6),
        createStdPlanEntry("Efesios", 1, 6),
        createStdPlanEntry("Filipenses", 1, 4),
        createStdPlanEntry("Colosenses", 1, 4),
        createStdPlanEntry("1 Tesalonicenses", 1, 5),
        createStdPlanEntry("2 Tesalonicenses", 1, 3),
        createStdPlanEntry("1 Timoteo", 1, 6),
        createStdPlanEntry("2 Timoteo", 1, 4),
        createCombinedPlanEntry("Tito, Filemón",1,3,1,1,0,0, "Tito 1-3, Filemón 1"),
        createStdPlanEntry("Hebreos", 1, 6), createStdPlanEntry("Hebreos", 7, 10), createStdPlanEntry("Hebreos", 11, 13),
        createStdPlanEntry("Santiago", 1, 5),
        createStdPlanEntry("1 Pedro", 1, 5),
        createStdPlanEntry("2 Pedro", 1, 3),
        createStdPlanEntry("1 Juan", 1, 5),
        createCombinedPlanEntry("2 Juan, 3 Juan, Judas",1,1,1,1,1,1, "2 Juan 1, 3 Juan 1, Judas 1"),
        createStdPlanEntry("Apocalipsis", 1, 4), createStdPlanEntry("Apocalipsis", 5, 8),
        createStdPlanEntry("Apocalipsis", 9, 12), createStdPlanEntry("Apocalipsis", 13, 16),
        createStdPlanEntry("Apocalipsis", 17, 19), createStdPlanEntry("Apocalipsis", 20, 22)
    ];

    function getBookInfoForUrl(bn, abb) { const nn = bn.trim(); const bd = abb.find(b => b.name === nn); if (!bd) return null; const bidx = abb.indexOf(bd); return { name: bd.name, code: (bidx + 1).toString().padStart(2, '0'), totalChapters: bd.chapters }; }
    function padChapterOrVerse(n, s = 3) { return n.toString().padStart(s, '0'); }
    const generatedReadingUrls = dailyReadingPlan.map((pe, idx) => { if (pe.url && typeof pe.url === 'string' && pe.url.startsWith('http')) return pe.url; const dt = pe.displayText; if (!dt) return `ERROR_EMPTY_DISPLAY_TEXT: Index ${idx}`; const rps = dt.split(',').map(p => p.trim()); let sbn, scn, svn = 1, ebn, ecn, evn = 999; const rpr = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s+(\d+)(?:-(\d+))?/; const fpm = rps[0].match(rpr); if (!fpm) return `ERROR_PARSING_FIRST_PART: ${dt}`; sbn = fpm[1].trim(); scn = parseInt(fpm[2]); if (rps[0].match(/desde v\.\s*(\d+)/i)) svn = parseInt(RegExp.$1); if (!fpm[3] && rps[0].match(/desde v\.\s*(\d+)/i)) ecn = scn; const lpm = rps[rps.length - 1].match(rpr); if (!lpm) return `ERROR_PARSING_LAST_PART: ${dt}`; ebn = lpm[1].trim(); ecn = parseInt(lpm[3] || lpm[2]); if (rps[rps.length - 1].match(/hasta v\.\s*(\d+)/i)) evn = parseInt(RegExp.$1); if (sbn === "Salmos" && scn === 119 && rps[0].match(/desde v\.\s*(\d+)/i)) { ebn = "Salmos"; ecn = 119; } if (ebn === "Salmos" && ecn === 119 && rps[rps.length - 1].match(/hasta v\.\s*(\d+)/i)) sbn = "Salmos"; const sbi = getBookInfoForUrl(sbn, normalizedBibleBooks); const ebi = getBookInfoForUrl(ebn, normalizedBibleBooks); if (!sbi) return `ERROR_START_BOOK_NOT_FOUND: ${sbn} in ${dt}`; if (!ebi) return `ERROR_END_BOOK_NOT_FOUND: ${ebn} in ${dt}`; const bp = `${sbi.code}${padChapterOrVerse(scn)}${padChapterOrVerse(svn)}-${ebi.code}${padChapterOrVerse(ecn)}${padChapterOrVerse(evn)}`; return `https://www.jw.org/finder?wtlocale=S&bible=${bp}`; });
    dailyReadingPlan.forEach((e, i) => { if (generatedReadingUrls[i] && !generatedReadingUrls[i].startsWith('ERROR_')) e.url = generatedReadingUrls[i]; else if (generatedReadingUrls[i]) { console.warn(`No URL for plan [${i}]: ${e.displayText}. Error: ${generatedReadingUrls[i]}`); e.url = '#ERROR'; }});

    const thematicSections = [
        {id:"creation_origin",title:"El relato de la creación y el origen de todos los pueblos",parts:[{bookName:"Génesis",startChapter:1,endChapter:11}],awardEmoji:"🌍"},
        {id:"conquest_promised_land",title:"La conquista de la Tierra Prometida",parts:[{bookName:"Josué"},{bookName:"Jueces"},{bookName:"Rut"}],awardEmoji:"🏞️"},
        {id:"kings_ancient_israel",title:"Los reyes del antiguo Israel",parts:[{bookName:"1 Samuel"},{bookName:"2 Samuel"},{bookName:"1 Reyes"},{bookName:"2 Reyes"},{bookName:"1 Crónicas"},{bookName:"2 Crónicas"}],awardEmoji:"👑"},
        {id:"return_from_exile",title:"El regreso del exilio",parts:[{bookName:"Esdras"},{bookName:"Nehemías"},{bookName:"Ester"}],awardEmoji:"📜"},
        {id:"story_of_job",title:"La historia de Job",parts:[{bookName:"Job"}],awardEmoji:"🌪️"},
        {id:"songs_wise_counsel",title:"Canciones y consejos sabios",parts:[{bookName:"Salmos"},{bookName:"Proverbios"},{bookName:"Eclesiastés"},{bookName:"Cantar de los Cantares"}],awardEmoji:"🎶"},
        {id:"prophetic_books",title:"Los libros proféticos",parts:[{bookName:"Isaías"},{bookName:"Jeremías"},{bookName:"Lamentaciones"},{bookName:"Ezequiel"},{bookName:"Daniel"},{bookName:"Oseas"},{bookName:"Joel"},{bookName:"Amós"},{bookName:"Abdías"},{bookName:"Jonás"},{bookName:"Miqueas"},{bookName:"Nahúm"},{bookName:"Habacuc"},{bookName:"Sofonías"},{bookName:"Ageo"},{bookName:"Zacarías"},{bookName:"Malaquías"}],awardEmoji:"🗣️"},
        {id:"life_ministry_jesus",title:"La vida y el ministerio de Jesús",parts:[{bookName:"Mateo"},{bookName:"Marcos"},{bookName:"Lucas"},{bookName:"Juan"}],awardEmoji:"🔥"},
        {id:"beginnings_christian_congregation",title:"Los comienzos de la congregación cristiana",parts:[{bookName:"Hechos"}],awardEmoji:"💌"},
        {id:"apostle_paul_letters",title:"Las cartas del apóstol Pablo",parts:[{bookName:"Romanos"},{bookName:"1 Corintios"},{bookName:"2 Corintios"},{bookName:"Gálatas"},{bookName:"Efesios"},{bookName:"Filipenses"},{bookName:"Colosenses"},{bookName:"1 Tesalonicenses"},{bookName:"2 Tesalonicenses"},{bookName:"1 Timoteo"},{bookName:"2 Timoteo"},{bookName:"Tito"},{bookName:"Filemón"}],awardEmoji:"✉️"},
        {id:"writings_other_apostles",title:"Los escritos de otros apóstoles y discípulos",parts:[{bookName:"Hebreos"},{bookName:"Santiago"},{bookName:"1 Pedro"},{bookName:"2 Pedro"},{bookName:"1 Juan"},{bookName:"2 Juan"},{bookName:"3 Juan"},{bookName:"Judas"},{bookName:"Apocalipsis"}],awardEmoji:"🖋️"}
    ];
    let awardedSectionsStatus = {};
    let newlyAwardedSections = new Set();

    const bibleBooksContainer = document.getElementById('bibleBooksContainer');
    const progressBar = document.getElementById('progressBar');
    const progressTextEl = document.getElementById('progressText'); // ID del HTML
    const bookFilter = document.getElementById('bookFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetProgressButton = document.getElementById('resetProgress');
    
    const currentDateTextEl = document.getElementById('currentDateText'); // ID del HTML
    const dailySuggestionMainTextEl = document.getElementById('dailySuggestionMainText'); // ID del HTML
    const dailySuggestionOnlineLinkEl = document.getElementById('dailySuggestionOnlineLink'); // ID del HTML
    const jwAppSuggestionNoteEl = document.getElementById('jwAppSuggestionNote');
    const markSuggestedAsReadButtonEl = document.getElementById('markSuggestedAsReadButton');
    const addToCalendarButtonEl = document.getElementById('addToCalendarButton');
    // const daysDelayedTextEl = document.getElementById('daysDelayedText'); // Ya obtenido en actualizarInterfazDiasRetraso

    const planStartDateInput = document.getElementById('planStartDateInput');
    const setPlanStartDateButton = document.getElementById('setPlanStartDateButton');
    const currentPlanStartDateTextEl = document.getElementById('currentPlanStartDateText'); // ID del HTML
    const syncReadingSelect = document.getElementById('syncReadingSelect');
    const syncPlanButton = document.getElementById('syncPlanButton');
    const thematicSectionsContainer = document.getElementById('thematicSectionsContainer');

    let readStatus = {};
    window.currentSuggestedReading = null;
    window.todayUTC = null;
    window.dayDiff = 0; // Este será el retraso efectivo
    window.dayOfPlan = 0; // Este es el número del día actual en el plan

    const totalBibleChapters = normalizedBibleBooks.reduce((sum, b) => sum + b.chapters, 0);

    function sanitizeKey(bookName, chapterNum) { return `key_${bookName.replace(/\s/g, '_')}_${chapterNum}`; }

    function loadState() { /* ... (sin cambios) ... */
        const saved = localStorage.getItem('bibleReadStatus');
        if (saved) { try { readStatus = JSON.parse(saved); } catch (e) { readStatus = {}; } }
        
        const savedDate = localStorage.getItem('planStartDate');
        if (savedDate) {
            planStartDateInput.value = savedDate;
            try {
                const d = new Date(savedDate + "T00:00:00Z");
                if (isNaN(d.getTime())) throw new Error("Invalid date value");
                if(currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = `Tu plan de lectura actual comenzó el: ` +
                    d.toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
            } catch (e) {
                if(currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Fecha de inicio guardada inválida.";
                localStorage.removeItem('planStartDate');
            }
        } else {
            if(currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Aún no has establecido una fecha de inicio para tu plan.";
        }

        const savedAwards = localStorage.getItem('awardedSectionsStatus');
        if (savedAwards) { try { awardedSectionsStatus = JSON.parse(savedAwards); } catch (e) { awardedSectionsStatus = {}; } }
    }
    function saveState() { /* ... (sin cambios) ... */
        localStorage.setItem('bibleReadStatus', JSON.stringify(readStatus));
        localStorage.setItem('awardedSectionsStatus', JSON.stringify(awardedSectionsStatus));
    }

    function checkThematicSectionCompletion(sectionId) { const section = thematicSections.find(s => s.id === sectionId); if (!section) return false; for (const part of section.parts) { const bookData = normalizedBibleBooks.find(b => b.name === part.bookName); if (!bookData) { console.warn(`Libro "${part.bookName}" de sección "${section.title}" no hallado.`); return false; } const startChap = part.startChapter||1; const endChap = part.endChapter||bookData.chapters; for (let i=startChap; i<=endChap; i++) { if (!readStatus[sanitizeKey(part.bookName, i)]) return false; }} return true; }
    function updateAllThematicSectionsStatus() { let sc = false; newlyAwardedSections.clear(); thematicSections.forEach(s => { const ic = checkThematicSectionCompletion(s.id); const wpa = awardedSectionsStatus[s.id]===true; if (ic && !wpa) { awardedSectionsStatus[s.id]=true; sc=true; newlyAwardedSections.add(s.id); setTimeout(() => {alert(`🎉 ¡Felicidades! 🎉\n\nHas completado la sección: "${s.title}"\n\n¡Has ganado el premio ${s.awardEmoji}!`);},100);} else if (!ic && wpa) {awardedSectionsStatus[s.id]=false; sc=true;}}); if (sc)saveState(); renderThematicSections(); }
    function renderThematicSections() { if (!thematicSectionsContainer) return; thematicSectionsContainer.innerHTML = ''; thematicSections.forEach(s => { const se = document.createElement('div'); se.className = 'thematic-section-item'; const ia = awardedSectionsStatus[s.id]===true; if (ia) { se.classList.add('awarded'); if (newlyAwardedSections.has(s.id)) se.classList.add('newly-awarded');} const te = document.createElement('h3'); te.className = 'thematic-section-title'; te.textContent = s.title; const ae = document.createElement('div'); ae.className = 'thematic-section-award'; ae.textContent = ia ? s.awardEmoji : '🔒'; ae.title = ia ? `¡Completado! ${s.awardEmoji}` : "Pendiente"; se.appendChild(te); se.appendChild(ae); thematicSectionsContainer.appendChild(se); }); }
    
    // --- NUEVA LÓGICA PARA CALCULAR EL RETRASO EFECTIVO ---
    function isDailyPlanEntryRead(planEntry) {
        if (!planEntry || !planEntry.displayText) return true; // Si no hay info, no podemos decir que no está leída

        const readingParts = planEntry.displayText.split(',').map(part => part.trim());
        const regex = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s*(\d+)(?:-(\d+))?/;

        for (const part of readingParts) {
            const match = part.match(regex);
            if (match) {
                const bookName = match[1].trim();
                const startChap = parseInt(match[2]);
                const endChap = match[3] ? parseInt(match[3]) : startChap;
                const bookData = normalizedBibleBooks.find(b => b.name === bookName);

                if (bookData) {
                    for (let ch = startChap; ch <= endChap; ch++) {
                        if (ch >= 1 && ch <= bookData.chapters) {
                            if (!readStatus[sanitizeKey(bookName, ch)]) {
                                return false; 
                            }
                        } else {
                            console.warn(`Capítulo ${ch} fuera de rango para ${bookName} en plan: ${planEntry.displayText}`);
                            return false; 
                        }
                    }
                } else {
                    console.warn(`Libro "${bookName}" no encontrado en plan: ${planEntry.displayText}`);
                    return false;
                }
            } else {
                console.warn(`No se pudo parsear parte "${part}" de plan: ${planEntry.displayText}`);
                // Intentar con la estructura original del plan si displayText es simple
                if (planEntry.book && planEntry.startChapter && planEntry.endChapter) {
                    const bookData = normalizedBibleBooks.find(b => b.name === planEntry.book);
                    if (bookData) {
                        for (let ch = planEntry.startChapter; ch <= planEntry.endChapter; ch++) {
                             if (ch >= 1 && ch <= bookData.chapters) {
                                if (!readStatus[sanitizeKey(planEntry.book, ch)]) return false;
                             } else return false;
                        }
                    } else return false;
                } else {
                    return false; // No se puede determinar, asumir no leída para seguridad
                }
            }
        }
        return true; 
    }

    function calculateEffectiveDelay() {
        const planStartDateString = localStorage.getItem('planStartDate');
        if (!planStartDateString) return 0;

        let planStartDate;
        try {
            planStartDate = new Date(planStartDateString + "T00:00:00Z");
            if (isNaN(planStartDate.getTime())) return 0;
        } catch (e) { return 0; }

        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        if (todayUTC < planStartDate) return 0;

        const elapsedDaysSinceStart = Math.floor((todayUTC.getTime() - planStartDate.getTime()) / (1000 * 3600 * 24));
        let actualDelay = 0;
        let firstUnreadDayIndex = -1;

        // Iterar desde el día 0 del plan hasta AYER (índice elapsedDaysSinceStart - 1)
        for (let i = 0; i < elapsedDaysSinceStart; i++) {
            if (i < dailyReadingPlan.length) {
                const readingEntry = dailyReadingPlan[i];
                if (!isDailyPlanEntryRead(readingEntry)) {
                    if (firstUnreadDayIndex === -1) {
                        firstUnreadDayIndex = i; // Marca el primer día de lectura pasada no leída
                    }
                }
            }
        }
        
        if (firstUnreadDayIndex !== -1) {
            // El retraso es el número de días desde el primer día no leído hasta ayer.
            // (Índice de ayer es elapsedDaysSinceStart - 1)
            actualDelay = (elapsedDaysSinceStart - 1) - firstUnreadDayIndex + 1;
        }
        return actualDelay;
    }

    function displayDailySuggestion() {
        if (currentDateTextEl) {
            currentDateTextEl.textContent = new Date().toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid'});
        }

        const planStartDateString = localStorage.getItem('planStartDate');
        
        if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.innerHTML = ''; // Limpiar siempre
        if (dailySuggestionOnlineLinkEl) dailySuggestionOnlineLinkEl.style.display = 'none';
        if (markSuggestedAsReadButtonEl) markSuggestedAsReadButtonEl.style.display = 'none';
        if (addToCalendarButtonEl) addToCalendarButtonEl.style.display = 'none';
        if (jwAppSuggestionNoteEl) jwAppSuggestionNoteEl.style.display = 'none';

        window.currentSuggestedReading = null;
        window.todayUTC = null; 
        window.dayOfPlan = 0;
        
        if (!planStartDateString) {
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "Establece una fecha de inicio para el plan.";
            window.dayDiff = 0; // No hay plan, no hay retraso
            actualizarInterfazDiasRetraso();
            return;
        }

        let planStartDate;
        try {
            planStartDate = new Date(planStartDateString + "T00:00:00Z");
            if (isNaN(planStartDate.getTime())) throw new Error("Fecha de inicio inválida");
        } catch (e) {
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "Error en fecha de inicio. Reestablécela.";
            localStorage.removeItem('planStartDate');
            window.dayDiff = 0;
            actualizarInterfazDiasRetraso();
            return;
        }

        const now = new Date();
        const todayDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        window.todayUTC = todayDateUTC;

        const elapsedDaysSinceStart = Math.floor((todayDateUTC.getTime() - planStartDate.getTime()) / (1000 * 3600 * 24));
        
        if (elapsedDaysSinceStart < 0) { // El plan comienza en el futuro
            const daysUntilStart = -elapsedDaysSinceStart;
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = `Tu plan comenzará en ${daysUntilStart} día(s).`;
            window.dayOfPlan = daysUntilStart; // Podríamos usarlo para mostrar "Faltan X días"
            window.dayDiff = 0; // No hay retraso aún
        } else {
            window.dayOfPlan = elapsedDaysSinceStart + 1;
            const currentReadingIndex = elapsedDaysSinceStart;

            if (dailyReadingPlan.length === 0) {
                if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "No hay plan de lectura definido.";
            } else if (currentReadingIndex >= 0 && currentReadingIndex < dailyReadingPlan.length) {
                window.currentSuggestedReading = dailyReadingPlan[currentReadingIndex];
                
                if (dailySuggestionMainTextEl) {
                    const dayDisplay = document.createElement('span');
                    dayDisplay.className = 'suggested-reading__day';
                    dayDisplay.textContent = `Día ${window.dayOfPlan}`;
                    const scriptureDisplay = document.createElement('span');
                    scriptureDisplay.className = 'suggested-reading__scripture';
                    scriptureDisplay.textContent = window.currentSuggestedReading.displayText;
                    dailySuggestionMainTextEl.appendChild(dayDisplay);
                    dailySuggestionMainTextEl.appendChild(document.createElement('br'));
                    dailySuggestionMainTextEl.appendChild(scriptureDisplay);
                }

                if (window.currentSuggestedReading.url && window.currentSuggestedReading.url !== '#ERROR') {
                    if (dailySuggestionOnlineLinkEl) { dailySuggestionOnlineLinkEl.href = window.currentSuggestedReading.url; dailySuggestionOnlineLinkEl.style.display = 'inline-block'; }
                    if (markSuggestedAsReadButtonEl) markSuggestedAsReadButtonEl.style.display = 'inline-block';
                    if (addToCalendarButtonEl) {
                         addToCalendarButtonEl.style.display = 'inline-block';
                         addToCalendarButtonEl.onclick = () => {
                            if (!window.currentSuggestedReading || !window.todayUTC) return;
                            const title = `Lectura día ${window.dayOfPlan}: ${window.currentSuggestedReading.displayText}`;
                            const desc = `Leer según plan: ${window.currentSuggestedReading.url}`;
                            const start = new Date(window.todayUTC.valueOf()); const end = new Date(window.todayUTC.valueOf()); end.setDate(start.getDate() + 1);
                            if (typeof downloadICS === 'function') downloadICS({ title, description: desc, startDate: start, endDate: end });
                            else console.error("Función downloadICS no encontrada.");
                        };
                    }
                } else if (window.currentSuggestedReading.url === '#ERROR' && dailySuggestionMainTextEl) {
                    const errorMsg = document.createElement('p'); errorMsg.style.color = 'var(--danger-color)'; errorMsg.style.fontSize = '0.9em'; errorMsg.textContent = 'Error al generar enlace.'; dailySuggestionMainTextEl.appendChild(errorMsg);
                }

                const isAndroid = /Android/i.test(navigator.userAgent);
                if (jwAppSuggestionNoteEl) {
                    if (isAndroid) { jwAppSuggestionNoteEl.textContent = 'Si tienes JW Library, considera abrir manualmente.'; jwAppSuggestionNoteEl.style.display = 'block';}
                    else jwAppSuggestionNoteEl.style.display = 'none';
                }
            } else { // Plan completado o fuera de rango
                if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "¡Has completado el plan o estás fuera de su rango!";
            }
            window.dayDiff = calculateEffectiveDelay(); // Calcular el retraso real basado en lecturas pasadas no completadas
        }
        actualizarInterfazDiasRetraso();
    }

    function updateChapterButtonUI(bn, cn) { /* ... (sin cambios) ... */ const k=sanitizeKey(bn,cn); const bid=sanitizeKey(bn,'').substring(4).replace(/_undefined$|_null$|_$/,''); const g=document.getElementById(`chapters_${bid}`); if(!g)return; const s=`.chapter-button[data-book="${bn}"][data-chapter="${cn}"]`; const b=g.querySelector(s); if(!b)return; b.classList.toggle('read',!!readStatus[k]); }
    function updateOverallProgress() { /* ... (sin cambios, asegurándose que usa `progressTextEl`) ... */ const rc=Object.values(readStatus).filter(v=>v).length; const p=totalBibleChapters?Math.round((rc/totalBibleChapters)*100):0; progressBar.style.width=`${p}%`; progressBar.textContent=p>5?`${p}%`:''; if(progressTextEl) progressTextEl.textContent=`${p}% completado (${rc} de ${totalBibleChapters} capítulos)`; progressBar.setAttribute('aria-valuenow',rc); progressBar.setAttribute('aria-valuemax',totalBibleChapters); }
    function updateBookProgress(bn) { /* ... (sin cambios) ... */ const b=normalizedBibleBooks.find(bk=>bk.name===bn); if(!b)return; let r=0; for(let i=1;i<=b.chapters;i++){if(readStatus[sanitizeKey(bn,i)])r++;} const bid=sanitizeKey(bn,'').substring(4).replace(/_undefined$|_null$|_$/,''); const e=document.getElementById(`progress_${bid}`); if(e){const p=b.chapters?Math.round((r/b.chapters)*100):0;e.textContent=`${p}% (${r}/${b.chapters})`;}}
    function toggleChapterRead(bn, cn) { const k=sanitizeKey(bn,cn); readStatus[k]=!readStatus[k]; if(readStatus[k])actualizarUltimaLectura(); else displayDailySuggestion(); /* Recalcular retraso si se desmarca */ updateChapterButtonUI(bn,cn); saveState(); updateOverallProgress(); updateBookProgress(bn); updateAllThematicSectionsStatus(); }
    
    if(setPlanStartDateButton) setPlanStartDateButton.addEventListener('click', () => { const dv=planStartDateInput.value; if(!dv||!dv.match(/^\d{4}-\d{2}-\d{2}$/)){alert("Fecha inválida.");return;} localStorage.setItem('planStartDate',dv); loadState(); displayDailySuggestion(); alert("Fecha de inicio establecida.");});
    if(syncPlanButton) syncPlanButton.addEventListener('click', () => { const si=parseInt(syncReadingSelect.value); if(isNaN(si)||si<0||si>=dailyReadingPlan.length){alert("Selecciona lectura válida.");return;} const t=new Date(); const tutc=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate())); const nsutc=new Date(tutc); nsutc.setUTCDate(tutc.getUTCDate()-si); const nss=nsutc.toISOString().split('T')[0]; localStorage.setItem('planStartDate',nss); planStartDateInput.value=nss; loadState(); displayDailySuggestion(); alert("Plan sincronizado.");});
    
    function markChaptersForBook(bn, sc, ec) { let cs=false; const bd=normalizedBibleBooks.find(b=>b.name===bn); if(!bd){console.warn(`Libro "${bn}" no hallado.`);return false;} for(let i=sc;i<=ec;i++){if(i>=1&&i<=bd.chapters){const k=sanitizeKey(bn,i);if(!readStatus[k]){readStatus[k]=true;updateChapterButtonUI(bn,i);cs=true;}}else{console.warn(`Cap ${i} fuera rango ${bn}`);}} if(cs)updateBookProgress(bn); return cs;}
    
    if (markSuggestedAsReadButtonEl) {
        markSuggestedAsReadButtonEl.addEventListener('click', () => {
            if (!window.currentSuggestedReading) return;
            let oc = false; const { displayText } = window.currentSuggestedReading;
            const rps = displayText.split(',').map(p => p.trim());
            const r = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s*(\d+)(?:-(\d+))?(?:\s*\(.*v\.\s*\d+(?:-\d+)?\))?/;
            rps.forEach(p => { const m = p.match(r); if (m) { const bn=m[1].trim(); const sc=parseInt(m[2]); const ec=m[3]?parseInt(m[3]):sc; const ab=normalizedBibleBooks.find(b=>b.name===bn); if(ab){if(markChaptersForBook(ab.name,sc,ec))oc=true;}else console.warn(`Libro "${bn}" no hallado: "${p}"`);} else { const sm=window.currentSuggestedReading.book && window.currentSuggestedReading.book.match(/([\w\s\dÁÉÍÓÚáéíóúÑñ]+)/); if(sm&&window.currentSuggestedReading.startChapter&&window.currentSuggestedReading.endChapter){const bns=sm[1].trim();const abs=normalizedBibleBooks.find(b=>b.name===bns); if(abs){if(markChaptersForBook(abs.name,window.currentSuggestedReading.startChapter,window.currentSuggestedReading.endChapter))oc=true;}else console.warn(`Libro "${bns}" no hallado.`);}else console.warn(`Formato no reconocido: "${p}"`);}});
            if (oc) { saveState(); updateOverallProgress(); updateAllThematicSectionsStatus(); actualizarUltimaLectura(); } 
            else { alert(`Ya estaban leídos los capítulos de: ${displayText}.`); actualizarUltimaLectura(); }
        });
    }

    function renderBooks(fb='todos',fs='todos'){bibleBooksContainer.innerHTML='';const l=normalizedBibleBooks.filter(b=>fb==='todos'||b.name===fb);l.forEach(b=>{const bid=sanitizeKey(b.name,'').substring(4).replace(/_undefined$|_null$|_$/,'');const s=document.createElement('div');s.className='book-section';s.innerHTML=`<div class="book-title"><span>${b.name}</span><span class="book-progress" id="progress_${bid}"></span></div><div class="chapters-grid" id="chapters_${bid}"></div>`;bibleBooksContainer.appendChild(s);const g=s.querySelector('.chapters-grid');let hvc=false;for(let i=1;i<=b.chapters;i++){const k=sanitizeKey(b.name,i);const ir=!!readStatus[k];if((fs==='leidos'&&!ir)||(fs==='no_leidos'&&ir))continue;hvc=true;const btn=document.createElement('button');btn.className='chapter-button';btn.textContent=i;btn.dataset.book=b.name;btn.dataset.chapter=i;if(ir)btn.classList.add('read');btn.setAttribute('aria-label',`Marcar ${b.name} cap ${i} como ${ir?'no leído':'leído'}`);btn.setAttribute('aria-pressed',ir?'true':'false');btn.addEventListener('click',()=>{toggleChapterRead(b.name,i);btn.setAttribute('aria-pressed',readStatus[sanitizeKey(b.name,i)]?'true':'false');btn.setAttribute('aria-label',`Marcar ${b.name} cap ${i} como ${readStatus[sanitizeKey(b.name,i)]?'no leído':'leído'}`);});g.appendChild(btn);}if(!hvc&&fs!=='todos')s.style.display='none';updateBookProgress(b.name);});}
    function populateFiltersAndSyncOptions(){bookFilter.innerHTML='<option value="todos">Todos los Libros</option>';normalizedBibleBooks.forEach(b=>{const o=document.createElement('option');o.value=b.name;o.textContent=b.name;bookFilter.appendChild(o);});bookFilter.addEventListener('change',()=>renderBooks(bookFilter.value,statusFilter.value));statusFilter.addEventListener('change',()=>renderBooks(bookFilter.value,statusFilter.value));syncReadingSelect.innerHTML='<option value="">Selecciona día para sincronizar...</option>';dailyReadingPlan.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`Día ${i+1}: ${r.displayText}`;syncReadingSelect.appendChild(o);});}
    
    if (resetProgressButton) {
        resetProgressButton.addEventListener('click', () => {
            if (!confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) return;
            readStatus = {}; awardedSectionsStatus = {}; newlyAwardedSections.clear();
            localStorage.removeItem('planStartDate'); localStorage.removeItem('lastReadingDate');
            if(planStartDateInput) planStartDateInput.value = "";
            if(currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Aún no has establecido una fecha de inicio para tu plan.";
            saveState(); renderBooks(bookFilter.value,statusFilter.value); updateOverallProgress(); updateAllThematicSectionsStatus();
            window.currentSuggestedReading=null; window.dayDiff=0; window.dayOfPlan=0;
            displayDailySuggestion(); 
            alert("Progreso y fecha de inicio reiniciados.");
        });
    }

    loadState();
    populateFiltersAndSyncOptions();
    renderBooks();
    updateOverallProgress();
    updateAllThematicSectionsStatus(); 
    displayDailySuggestion();

});
