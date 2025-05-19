// Funciones para calcular y mostrar días de retraso
function calcularDiasDiferencia(fechaInicial, fechaFinal) {
    const MILISEGUNDOS_EN_UN_DIA = 1000 * 60 * 60 * 24;
    return Math.floor((fechaFinal - fechaInicial) / MILISEGUNDOS_EN_UN_DIA);
}

function obtenerFechaUltimaLectura() {
    const fechaGuardada = localStorage.getItem('lastReadingDate');
    if (fechaGuardada) {
        return new Date(fechaGuardada);
    }
    return null;
}

function actualizarDiasRetraso() {
    const lastReadingDate = obtenerFechaUltimaLectura();
    const hoy = new Date();
    const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    let diasRetraso = 0;

    if (lastReadingDate) {
        const ultimaLecturaSinHora = new Date(
            lastReadingDate.getFullYear(),
            lastReadingDate.getMonth(),
            lastReadingDate.getDate()
        );
        if (ultimaLecturaSinHora < hoySinHora) {
            diasRetraso = calcularDiasDiferencia(ultimaLecturaSinHora, hoySinHora);
        }
    } else {
        diasRetraso = 0;
    }

    const daysDelayedEl = document.getElementById('daysDelayed');
    if (daysDelayedEl) {
        daysDelayedEl.textContent = diasRetraso;
    }
}

function actualizarUltimaLectura() {
    const hoy = new Date();
    localStorage.setItem('lastReadingDate', hoy.toISOString());
    actualizarDiasRetraso();
}


document.addEventListener('DOMContentLoaded', () => {
    const bibleBooks = [
        { name: "Génesis", chapters: 50, testament: "Antiguo" },
        { name: "Éxodo", chapters: 40, testament: "Antiguo" },
        { name: "Levítico", chapters: 27, testament: "Antiguo" },
        { name: "Números", chapters: 36, testament: "Antiguo" },
        { name: "Deuteronomio", chapters: 34, testament: "Antiguo" },
        { name: "Josué", chapters: 24, testament: "Antiguo" },
        { name: "Jueces", chapters: 21, testament: "Antiguo" },
        { name: "Rut", chapters: 4, testament: "Antiguo" },
        { name: "1 Samuel", chapters: 31, testament: "Antiguo" },
        { name: "2 Samuel", chapters: 24, testament: "Antiguo" },
        { name: "1 Reyes", chapters: 22, testament: "Antiguo" },
        { name: "2 Reyes", chapters: 25, testament: "Antiguo" },
        { name: "1 Crónicas", chapters: 29, testament: "Antiguo" },
        { name: "2 Crónicas", chapters: 36, testament: "Antiguo" },
        { name: "Esdras", chapters: 10, testament: "Antiguo" },
        { name: "Nehemías", chapters: 13, testament: "Antiguo" },
        { name: "Ester", chapters: 10, testament: "Antiguo" },
        { name: "Job", chapters: 42, testament: "Antiguo" },
        { name: "Salmos", chapters: 150, testament: "Antiguo" },
        { name: "Proverbios", chapters: 31, testament: "Antiguo" },
        { name: "Eclesiastés", chapters: 12, testament: "Antiguo" },
        { name: "Cantar de los Cantares", chapters: 8, testament: "Antiguo" },
        { name: "Isaías", chapters: 66, testament: "Antiguo" },
        { name: "Jeremías", chapters: 52, testament: "Antiguo" },
        { name: "Lamentaciones", chapters: 5, testament: "Antiguo" },
        { name: "Ezequiel", chapters: 48, testament: "Antiguo" },
        { name: "Daniel", chapters: 12, testament: "Antiguo" },
        { name: "Oseas", chapters: 14, testament: "Antiguo" },
        { name: "Joel", chapters: 3, testament: "Antiguo" },
        { name: "Amós", chapters: 9, testament: "Antiguo" },
        { name: "Abdías", chapters: 1, testament: "Antiguo" },
        { name: "Jonás", chapters: 4, testament: "Antiguo" },
        { name: "Miqueas", chapters: 7, testament: "Antiguo" },
        { name: "Nahúm", chapters: 3, testament: "Antiguo" },
        { name: "Habacuc", chapters: 3, testament: "Antiguo" },
        { name: "Sofonías", chapters: 3, testament: "Antiguo" },
        { name: "Ageo", chapters: 2, testament: "Antiguo" },
        { name: "Zacarías", chapters: 14, testament: "Antiguo" },
        { name: "Malaquías", chapters: 4, testament: "Antiguo" },
        { name: "Mateo", chapters: 28, testament: "Nuevo" },
        { name: "Marcos", chapters: 16, testament: "Nuevo" },
        { name: "Lucas", chapters: 24, testament: "Nuevo" },
        { name: "Juan", chapters: 21, testament: "Nuevo" },
        { name: "Hechos", chapters: 28, testament: "Nuevo" },
        { name: "Romanos", chapters: 16, testament: "Nuevo" },
        { name: "1 Corintios", chapters: 16, testament: "Nuevo" },
        { name: "2 Corintios", chapters: 13, testament: "Nuevo" },
        { name: "Gálatas", chapters: 6, testament: "Nuevo" },
        { name: "Efesios", chapters: 6, testament: "Nuevo" },
        { name: "Filipenses", chapters: 4, testament: "Nuevo" },
        { name: "Colosenses", chapters: 4, testament: "Nuevo" },
        { name: "1 Tesalonicenses", chapters: 5, testament: "Nuevo" },
        { name: "2 Tesalonicenses", chapters: 3, testament: "Nuevo" },
        { name: "1 Timoteo", chapters: 6, testament: "Nuevo" },
        { name: "2 Timoteo", chapters: 4, testament: "Nuevo" },
        { name: "Tito", chapters: 3, testament: "Nuevo" },
        { name: "Filemón", chapters: 1, testament: "Nuevo" },
        { name: "Hebreos", chapters: 13, testament: "Nuevo" },
        { name: "Santiago", chapters: 5, testament: "Nuevo" },
        { name: "1 Pedro", chapters: 5, testament: "Nuevo" },
        { name: "2 Pedro", chapters: 3, testament: "Nuevo" },
        { name: "1 Juan", chapters: 5, testament: "Nuevo" },
        { name: "2 Juan", chapters: 1, testament: "Nuevo" },
        { name: "3 Juan", chapters: 1, testament: "Nuevo" },
        { name: "Judas", chapters: 1, testament: "Nuevo" },
        { name: "Apocalipsis", chapters: 22, testament: "Nuevo" }
    ];

    const normalizedBibleBooks = bibleBooks.map(book => ({
        ...book,
        name: book.name.replace(/\u00A0/g, ' ').replace(/Ι/g, 'I') // Also replace Greek Iota if present
    }));
    
    // Helper function to create a plan entry more easily
    // For single book entries in the plan
    function createStdPlanEntry(bookName, startChapter, endChapter) {
        return { book: bookName, startChapter: startChapter, endChapter: endChapter, displayText: `${bookName} ${startChapter}-${endChapter}`};
    }
    // For single chapter readings or special displayText
    function createSpecialPlanEntry(bookName, chapter, specialDisplayText) {
         return { book: bookName, startChapter: chapter, endChapter: chapter, displayText: specialDisplayText || `${bookName} ${chapter}`};
    }
    // For combined books or very custom displayText
    function createCombinedPlanEntry(compositeBookName, firstBookStartChap, firstBookEndChap, secondBookStartChap, secondBookEndChap, thirdBookStartChap, thirdBookEndChap, customDisplayText){
        // This is simplified; actual start/end chapters for URL gen will come from parsing customDisplayText
        return { book: compositeBookName, startChapter:1, endChapter:1, displayText: customDisplayText};
    }


    const dailyReadingPlan = [
        // ESCRITOS DE MOISÉS
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
        // ENTRADA DE ISRAEL EN LA TIERRA PROMETIDA
        createStdPlanEntry("Josué", 1, 4), createStdPlanEntry("Josué", 5, 7), createStdPlanEntry("Josué", 8, 9),
        createStdPlanEntry("Josué", 10, 12), createStdPlanEntry("Josué", 13, 15), createStdPlanEntry("Josué", 16, 18),
        createStdPlanEntry("Josué", 19, 21), createStdPlanEntry("Josué", 22, 24),
        createStdPlanEntry("Jueces", 1, 2), createStdPlanEntry("Jueces", 3, 5), createStdPlanEntry("Jueces", 6, 7),
        createStdPlanEntry("Jueces", 8, 9), createStdPlanEntry("Jueces", 10, 11), createStdPlanEntry("Jueces", 12, 13),
        createStdPlanEntry("Jueces", 14, 16), createStdPlanEntry("Jueces", 17, 19), createStdPlanEntry("Jueces", 20, 21),
        createStdPlanEntry("Rut", 1, 4),
        // ÉPOCA DE LOS REYES
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
        // REGRESO DEL DESTIERRO
        createStdPlanEntry("Esdras", 1, 3), createStdPlanEntry("Esdras", 4, 7), createStdPlanEntry("Esdras", 8, 10),
        createStdPlanEntry("Nehemías", 1, 3), createStdPlanEntry("Nehemías", 4, 6), createStdPlanEntry("Nehemías", 7, 8),
        createStdPlanEntry("Nehemías", 9, 10), createStdPlanEntry("Nehemías", 11, 13),
        createStdPlanEntry("Ester", 1, 4), createStdPlanEntry("Ester", 5, 10),
        // LIBROS DE CANCIONES Y CONSEJOS
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
        createSpecialPlanEntry("Salmos", 119, "Salmos 116-119 (hasta v. 63)"), // Special display for verse range
        createSpecialPlanEntry("Salmos", 119, "Salmos 119 (desde v. 64)"),   // Special display for verse range
        createStdPlanEntry("Salmos", 120, 129), createStdPlanEntry("Salmos", 130, 138),
        createStdPlanEntry("Salmos", 139, 144), createStdPlanEntry("Salmos", 145, 150),
        createStdPlanEntry("Proverbios", 1, 4), createStdPlanEntry("Proverbios", 5, 8), createStdPlanEntry("Proverbios", 9, 12),
        createStdPlanEntry("Proverbios", 13, 16), createStdPlanEntry("Proverbios", 17, 19), createStdPlanEntry("Proverbios", 20, 22),
        createStdPlanEntry("Proverbios", 23, 27), createStdPlanEntry("Proverbios", 28, 31),
        createStdPlanEntry("Eclesiastés", 1, 4), createStdPlanEntry("Eclesiastés", 5, 8), createStdPlanEntry("Eclesiastés", 9, 12),
        createStdPlanEntry("Cantar de los Cantares", 1, 8),
        // LOS PROFETAS
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
        // RELATOS DE LA VIDA Y MINISTERIO DE JESÚS
        createStdPlanEntry("Mateo", 1, 4), createStdPlanEntry("Mateo", 5, 7), createStdPlanEntry("Mateo", 8, 10),
        createStdPlanEntry("Mateo", 11, 13), createStdPlanEntry("Mateo", 14, 17), createStdPlanEntry("Mateo", 18, 20),
        createStdPlanEntry("Mateo", 21, 23), createStdPlanEntry("Mateo", 24, 25), createSpecialPlanEntry("Mateo", 26, "Mateo 26"),
        createStdPlanEntry("Mateo", 27, 28),
        createStdPlanEntry("Marcos", 1, 3), createStdPlanEntry("Marcos", 4, 5), createStdPlanEntry("Marcos", 6, 8),
        createStdPlanEntry("Marcos", 9, 10), createStdPlanEntry("Marcos", 11, 13), createStdPlanEntry("Marcos", 14, 16),
        createStdPlanEntry("Lucas", 1, 2), createStdPlanEntry("Lucas", 3, 5), createStdPlanEntry("Lucas", 6, 7),
        createStdPlanEntry("Lucas", 8, 9), createStdPlanEntry("Lucas", 10, 11), createStdPlanEntry("Lucas", 12, 13),
        createStdPlanEntry("Lucas", 14, 17), createStdPlanEntry("Lucas", 18, 19), createStdPlanEntry("Lucas", 20, 22),
        createStdPlanEntry("Lucas", 23, 24),
        createStdPlanEntry("Juan", 1, 3), createStdPlanEntry("Juan", 4, 5), createStdPlanEntry("Juan", 6, 7),
        createStdPlanEntry("Juan", 8, 9), createStdPlanEntry("Juan", 10, 12), createStdPlanEntry("Juan", 13, 15),
        createStdPlanEntry("Juan", 16, 18), createStdPlanEntry("Juan", 19, 21),
        // LOS COMIENZOS DE LA CONGREGACIÓN CRISTIANA
        createStdPlanEntry("Hechos", 1, 3), createStdPlanEntry("Hechos", 4, 6), createStdPlanEntry("Hechos", 7, 8),
        createStdPlanEntry("Hechos", 9, 11), createStdPlanEntry("Hechos", 12, 14), createStdPlanEntry("Hechos", 15, 16),
        createStdPlanEntry("Hechos", 17, 19), createStdPlanEntry("Hechos", 20, 21), createStdPlanEntry("Hechos", 22, 23),
        createStdPlanEntry("Hechos", 24, 26), createStdPlanEntry("Hechos", 27, 28),
        // CARTAS DE PABLO
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
        // ESCRITOS DE OTROS APÓSTOLES Y DISCÍPULOS
        createStdPlanEntry("Santiago", 1, 5),
        createStdPlanEntry("1 Pedro", 1, 5),
        createStdPlanEntry("2 Pedro", 1, 3),
        createStdPlanEntry("1 Juan", 1, 5),
        createCombinedPlanEntry("2 Juan, 3 Juan, Judas",1,1,1,1,1,1, "2 Juan 1, 3 Juan 1, Judas 1"),
        createStdPlanEntry("Apocalipsis", 1, 4), createStdPlanEntry("Apocalipsis", 5, 8),
        createStdPlanEntry("Apocalipsis", 9, 12), 
createStdPlanEntry("Apocalipsis", 13, 16),
createStdPlanEntry("Apocalipsis", 17, 19),
        createStdPlanEntry("Apocalipsis", 20, 22)
    ];


    // --- START: Código para generar URLs ---

    function getBookInfoForUrl(bookName, allBibleBooks) {
        const normalizedName = bookName.trim();
        const bookData = allBibleBooks.find(b => b.name === normalizedName);
        if (!bookData) {
            return null;
        }
        const bookIndexInArray = allBibleBooks.indexOf(bookData);
        return {
            name: bookData.name,
            code: (bookIndexInArray + 1).toString().padStart(2, '0'),
            totalChapters: bookData.chapters
        };
    }

    function padChapterOrVerse(num, size = 3) {
        return num.toString().padStart(size, '0');
    }

    const generatedReadingUrls = dailyReadingPlan.map((planEntry, index) => {
        if (planEntry.url && typeof planEntry.url === 'string' && planEntry.url.startsWith('http')) {
            return planEntry.url;
        }

        const displayText = planEntry.displayText;
        if (!displayText) {
            console.error(`https://stackoverflow.com/questions/36235578/how-can-i-include-the-genindex-in-a-sphinx-toc displayText está vacío o no definido para la entrada del plan:`, planEntry);
            return `ERROR_EMPTY_DISPLAY_TEXT: Index ${index}`;
        }

        const readingParts = displayText.split(',').map(p => p.trim());
        let startBookName, startChapterNum, startVerseNum = 1;
        let endBookName, endChapterNum, endVerseNum = 999;

        const readingPartRegex = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s+(\d+)(?:-(\d+))?/;

        const firstPartText = readingParts[0];
        const firstPartMatch = firstPartText.match(readingPartRegex);

        if (!firstPartMatch) {
            console.error(`https://stackoverflow.com/questions/36235578/how-can-i-include-the-genindex-in-a-sphinx-toc No se pudo parsear libro/capítulo de la primera parte: "${firstPartText}" en "${displayText}"`);
            return `ERROR_PARSING_FIRST_PART: ${displayText}`;
        }
        startBookName = firstPartMatch[1].trim();
        startChapterNum = parseInt(firstPartMatch[2]);

        const desdeVerseMatch = firstPartText.match(/desde v\.\s*(\d+)/i);
        if (desdeVerseMatch) {
            startVerseNum = parseInt(desdeVerseMatch[1]);
             // If "desde v. X" is present, and it's a single chapter part like "Salmos 119 (desde v. 64)"
             // the end chapter should be the same as the start chapter.
            if (!firstPartMatch[3]) { // No chapter range like X-Y
                endChapterNum = startChapterNum;
            }
        }
        
        const lastPartText = readingParts[readingParts.length - 1];
        const lastPartMatch = lastPartText.match(readingPartRegex);

        if (!lastPartMatch) {
            console.error(`https://stackoverflow.com/questions/36235578/how-can-i-include-the-genindex-in-a-sphinx-toc No se pudo parsear libro/capítulo de la última parte: "${lastPartText}" en "${displayText}"`);
            return `ERROR_PARSING_LAST_PART: ${displayText}`;
        }
        endBookName = lastPartMatch[1].trim();
        // If a chapter range X-Y is specified in the last part, use Y. Otherwise, use X.
        endChapterNum = parseInt(lastPartMatch[3] || lastPartMatch[2]);


        const hastaVerseMatch = lastPartText.match(/hasta v\.\s*(\d+)/i);
        if (hastaVerseMatch) {
            endVerseNum = parseInt(hastaVerseMatch[1]);
        }
        
        // Special case for "Salmos 119 (desde v. 64)" -> endChapterNum should be 119
        if (startBookName === "Salmos" && startChapterNum === 119 && desdeVerseMatch) {
            endBookName = "Salmos";
            endChapterNum = 119;
        }
         // Special case for "Salmos 116-119 (hasta v. 63)" -> startBook remains Salmos
        if (endBookName === "Salmos" && endChapterNum === 119 && hastaVerseMatch) {
             startBookName = "Salmos"; // ensure start book is also Salmos
        }


        const startBookInfo = getBookInfoForUrl(startBookName, normalizedBibleBooks);
        const endBookInfo = getBookInfoForUrl(endBookName, normalizedBibleBooks);

        if (!startBookInfo) {
            console.error(`https://stackoverflow.com/questions/36235578/how-can-i-include-the-genindex-in-a-sphinx-toc No se encontró información para el libro inicial: "${startBookName}" en "${displayText}"`);
            return `ERROR_START_BOOK_NOT_FOUND: ${startBookName} in ${displayText}`;
        }
        if (!endBookInfo) {
            console.error(`https://stackoverflow.com/questions/36235578/how-can-i-include-the-genindex-in-a-sphinx-toc No se encontró información para el libro final: "${endBookName}" en "${displayText}"`);
            return `ERROR_END_BOOK_NOT_FOUND: ${endBookName} in ${displayText}`;
        }

        const bibleParam = `${startBookInfo.code}${padChapterOrVerse(startChapterNum)}${padChapterOrVerse(startVerseNum)}-${endBookInfo.code}${padChapterOrVerse(endChapterNum)}${padChapterOrVerse(endVerseNum)}`;
        return `https://www.jw.org/finder?wtlocale=S&bible=${bibleParam}`;
    });

    dailyReadingPlan.forEach((entry, i) => {
        if (generatedReadingUrls[i] && !generatedReadingUrls[i].startsWith('ERROR_')) {
            entry.url = generatedReadingUrls[i];
        } else if (generatedReadingUrls[i] && generatedReadingUrls[i].startsWith('ERROR_')) {
            console.warn(`No se pudo generar URL para el plan [${i}]: ${entry.displayText}. Error: ${generatedReadingUrls[i]}`);
            entry.url = '#ERROR'; // Marcar que hubo un error
        }
    });
    // console.log(JSON.stringify(dailyReadingPlan, null, 2)); // For debugging the final plan with URLs

    // --- FIN: Código para generar URLs ---


    const bibleBooksContainer = document.getElementById('bibleBooksContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const bookFilter = document.getElementById('bookFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetProgressButton = document.getElementById('resetProgress');
    const currentDateSpan = document.getElementById('currentDate');
    const dailySuggestionText = document.getElementById('dailySuggestionText');
    const markSuggestedAsReadButton = document.getElementById('markSuggestedAsRead');
    const planStartDateInput = document.getElementById('planStartDateInput');
    const setPlanStartDateButton = document.getElementById('setPlanStartDateButton');
    const currentPlanStartDateText = document.getElementById('currentPlanStartDateText');
    const syncReadingSelect = document.getElementById('syncReadingSelect');
    const syncPlanButton = document.getElementById('syncPlanButton');

    let readStatus = {};
    let currentSuggestedReading = null;
    const totalBibleChapters = normalizedBibleBooks.reduce((sum, b) => sum + b.chapters, 0);

    function sanitizeKey(bookName, chapterNum) {
        return `key_${bookName.replace(/\s/g, '_')}_${chapterNum}`;
    }

    function loadState() {
        const saved = localStorage.getItem('bibleReadStatus');
        if (saved) {
            try { readStatus = JSON.parse(saved); }
            catch (e) { console.error("Error parsing bibleReadStatus:", e); readStatus = {}; }
        }
        const savedDate = localStorage.getItem('planStartDate');
        if (savedDate) {
            planStartDateInput.value = savedDate;
            try {
                const d = new Date(savedDate + "T00:00:00Z");
                if (isNaN(d.getTime())) throw new Error("Invalid date value");
                currentPlanStartDateText.textContent =
                    `Tu plan de lectura actual comenzó el: ` +
                    d.toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
            } catch (e) {
                console.error("Error parsing planStartDate:", e);
                currentPlanStartDateText.textContent = `Fecha de inicio guardada inválida: ${savedDate}`;
                localStorage.removeItem('planStartDate');
            }
        } else {
            currentPlanStartDateText.textContent = "Aún no has establecido una fecha de inicio para tu plan.";
        }
    }

    function saveState() {
        localStorage.setItem('bibleReadStatus', JSON.stringify(readStatus));
    }

    function updateChapterButtonUI(bookName, chapterNum) {
        const key = sanitizeKey(bookName, chapterNum);
        const bookId = sanitizeKey(bookName, '').substring(4).replace(/_undefined$|_null$|_$/, '');
        const grid = document.getElementById(`chapters_${bookId}`);
        if (!grid) {
            return;
        }
        const selector = `.chapter-button[data-book="${bookName}"][data-chapter="${chapterNum}"]`;
        const btn = grid.querySelector(selector);
        if (!btn) {
            return;
        }
        btn.classList.toggle('read', !!readStatus[key]);
    }

    function updateOverallProgress() {
        const readCount = Object.values(readStatus).filter(v => v).length;
        const pct = totalBibleChapters ? Math.round((readCount / totalBibleChapters) * 100) : 0;
        progressBar.style.width = `${pct}%`;
        progressBar.textContent = pct > 10 ? `${pct}%` : '';
        progressText.textContent = `${pct}% completado (${readCount}/${totalBibleChapters} capítulos)`;
    }

    function updateBookProgress(bookName) {
        const book = normalizedBibleBooks.find(b => b.name === bookName);
        if (!book) {
            return;
        }
        let read = 0;
        for (let i = 1; i <= book.chapters; i++) {
            if (readStatus[sanitizeKey(bookName, i)]) read++;
        }
        const bookId = sanitizeKey(bookName, '').substring(4).replace(/_undefined$|_null$|_$/, '');
        const el = document.getElementById(`progress_${bookId}`);
        if (el) {
            const pct = book.chapters ? Math.round((read / book.chapters) * 100) : 0;
            el.textContent = `${pct}% (${read}/${book.chapters})`;
        }
    }

    function toggleChapterRead(bookName, chapterNum) {
        const key = sanitizeKey(bookName, chapterNum);
        readStatus[key] = !readStatus[key];
        updateChapterButtonUI(bookName, chapterNum);
        saveState();
        updateOverallProgress();
        updateBookProgress(bookName);
    }

    setPlanStartDateButton.addEventListener('click', () => {
        const d = planStartDateInput.value;
        if (!d.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return alert("Fecha inválida. Usa AAAA-MM-DD.");
        }
        localStorage.setItem('planStartDate', d);
        loadState();
        displayDailySuggestion();
        actualizarDiasRetraso();
        alert("Fecha de inicio establecida.");
    });

    syncPlanButton.addEventListener('click', () => {
        const idx = parseInt(syncReadingSelect.value);
        if (isNaN(idx) || idx < 0 || idx >= dailyReadingPlan.length) {
            return alert("Selecciona una lectura válida.");
        }
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const newStartDateUTC = new Date(todayUTC);
        newStartDateUTC.setUTCDate(todayUTC.getUTCDate() - idx);
        const s = newStartDateUTC.toISOString().split('T')[0];
        localStorage.setItem('planStartDate', s);
        planStartDateInput.value = s;
        loadState();
        displayDailySuggestion();
        actualizarDiasRetraso();
        alert("Plan sincronizado.");
    });

    function displayDailySuggestion() {
        const now = new Date();
        currentDateSpan.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Madrid' });

        const sd = localStorage.getItem('planStartDate');
        if (!sd) {
            dailySuggestionText.textContent = "Establece o sincroniza una fecha de inicio.";
            markSuggestedAsReadButton.style.display = 'none';
            currentSuggestedReading = null;
            return;
        }

        let ps;
        try {
            ps = new Date(sd + "T00:00:00Z");
            if (isNaN(ps.getTime())) throw new Error("Invalid stored date");
        } catch (e) {
            dailySuggestionText.textContent = "Error con la fecha guardada. Reestablece.";
            markSuggestedAsReadButton.style.display = 'none';
            localStorage.removeItem('planStartDate');
            console.error("Error parsing plan start date for displayDailySuggestion:", e);
            currentSuggestedReading = null;
            return;
        }

        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        if (todayUTC < ps) {
            const diff = Math.ceil((ps.getTime() - todayUTC.getTime()) / (1000 * 3600 * 24));
            dailySuggestionText.textContent = `Tu plan comenzará el ${ps.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}. Faltan ${diff} día(s).`;
            markSuggestedAsReadButton.style.display = 'none';
            currentSuggestedReading = null;
            return;
        }

        const dayDiff = Math.floor((todayUTC.getTime() - ps.getTime()) / (1000 * 3600 * 24));

        if (!dailyReadingPlan.length) {
            dailySuggestionText.textContent = "No hay plan de lectura.";
            markSuggestedAsReadButton.style.display = 'none';
            currentSuggestedReading = null;
            return;
        }

        const planEffectiveLength = dailyReadingPlan.length;
        const idx = dayDiff % planEffectiveLength;

        if (idx >= 0 && idx < dailyReadingPlan.length) {
            currentSuggestedReading = dailyReadingPlan[idx];
            dailySuggestionText.innerHTML = ''; 

            const textNode = document.createTextNode(`Día ${dayDiff + 1}: ${currentSuggestedReading.displayText} `);
            dailySuggestionText.appendChild(textNode);

            if (currentSuggestedReading.url && currentSuggestedReading.url !== '#ERROR' && !currentSuggestedReading.url.startsWith('ERROR_')) {
                const link = document.createElement('a');
                link.href = currentSuggestedReading.url;
                link.textContent = "(Leer en jw.org)";
                link.target = "_blank";
                link.style.marginLeft = "5px";
                dailySuggestionText.appendChild(link);
            }
            markSuggestedAsReadButton.style.display = 'inline-block';
        } else {
            dailySuggestionText.textContent = "Lectura del plan no encontrada para hoy.";
            markSuggestedAsReadButton.style.display = 'none';
            currentSuggestedReading = null;
        }
    }

    function markChaptersForBook(bookName, startChap, endChap) {
        let changedSomething = false;
        const bookData = normalizedBibleBooks.find(b => b.name === bookName);
        if (!bookData) {
            console.warn(`Libro "${bookName}" no encontrado en normalizedBibleBooks.`);
            return false;
        }
        for (let i = startChap; i <= endChap; i++) {
            // Asegurarse de que el capítulo esté dentro del rango válido para el libro
            if (i >= 1 && i <= bookData.chapters) {
                const key = sanitizeKey(bookName, i);
                if (!readStatus[key]) {
                    readStatus[key] = true;
                    updateChapterButtonUI(bookName, i); // Asumiendo que esta función existe y está correcta
                    changedSomething = true;
                }
            } else {
                console.warn(`Capítulo ${i} fuera de rango para ${bookName} (Total: ${bookData.chapters})`);
            }
        }
        if (changedSomething) {
            updateBookProgress(bookName); // Asumiendo que esta función existe y está correcta
        }
        return changedSomething;
    }

    markSuggestedAsReadButton.addEventListener('click', () => {
        if (!currentSuggestedReading) return;

        let overallChanged = false;
        const { book: planBookEntry, displayText } = currentSuggestedReading; // No necesitamos planStartChapter/EndChapter si displayText es la fuente de verdad
        
        const readingParts = displayText.split(',').map(part => part.trim());
        const regex = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s*(\d+)(?:-(\d+))?(?:\s*\(.*v\.\s*(\d+)\))?/;


        readingParts.forEach(part => {
            const match = part.match(regex);
            if (match) {
                const bookName = match[1].trim();
                const startChap = parseInt(match[2]);
                // Si displayText es "Libro X", endChap es startChap. Si es "Libro X-Y", endChap es Y.
                // Ignorar los detalles de versos (grupo 4) para marcar capítulos enteros.
                const endChap = match[3] ? parseInt(match[3]) : startChap; 
                
                const actualBook = normalizedBibleBooks.find(b => b.name === bookName);
                if (actualBook) {
                    if (markChaptersForBook(actualBook.name, startChap, endChap)) {
                        overallChanged = true;
                    }
                } else {
                    console.warn(`Libro "${bookName}" de displayText no encontrado para marcar: "${part}"`);
                }
            } else {
                 // Fallback si la regex no funciona para una parte, podría ser un libro único del plan original
                 // Esto es menos probable si displayText siempre está bien formateado.
                const singleBookTarget = normalizedBibleBooks.find(b => b.name === planBookEntry);
                if(singleBookTarget && currentSuggestedReading.startChapter && currentSuggestedReading.endChapter){
                    if (markChaptersForBook(singleBookTarget.name, currentSuggestedReading.startChapter, currentSuggestedReading.endChapter)) {
                        overallChanged = true;
                    }
                } else {
                    console.warn(`Formato de parte de lectura no reconocido: "${part}" y planBookEntry "${planBookEntry}" no es un libro individual válido o faltan capítulos.`);
                }
            }
        });
    
        if (overallChanged) {
            saveState();
            updateOverallProgress();
            alert(`${displayText} marcado como leído.`);
            actualizarUltimaLectura(); 
            if (dailySuggestionText) { 
                 if (dailySuggestionText.firstChild && dailySuggestionText.firstChild.nodeType === Node.TEXT_NODE) {
                    dailySuggestionText.firstChild.textContent = "¡Lectura completada por hoy! ";
                 } else {
                     dailySuggestionText.textContent = "¡Lectura completada por hoy! ";
                 }
                 const existingLink = dailySuggestionText.querySelector('a');
                 if(existingLink) existingLink.remove();
            }
            if (markSuggestedAsReadButton) markSuggestedAsReadButton.style.display = 'none';


        } else {
            alert(`Ya estaban leídos los capítulos de: ${displayText}.`);
            actualizarUltimaLectura(); 
            if (dailySuggestionText) {
                 if (dailySuggestionText.firstChild && dailySuggestionText.firstChild.nodeType === Node.TEXT_NODE) {
                    dailySuggestionText.firstChild.textContent = "Lectura de hoy ya estaba completada. ";
                 } else {
                     dailySuggestionText.textContent = "Lectura de hoy ya estaba completada. ";
                 }
                 const existingLink = dailySuggestionText.querySelector('a');
                 if(existingLink) existingLink.remove();
            }
            if (markSuggestedAsReadButton) markSuggestedAsReadButton.style.display = 'none'; 
        }
    });


    function renderBooks(filterBook = 'todos', filterStatus = 'todos') {
        bibleBooksContainer.innerHTML = '';
        const list = normalizedBibleBooks.filter(b => filterBook === 'todos' || b.name === filterBook);
        list.forEach(book => {
            const bookId = sanitizeKey(book.name, '').substring(4).replace(/_undefined$|_null$|_$/, '');
            const section = document.createElement('div');
            section.className = 'book-section';
            section.innerHTML = `
                <div class="book-title">
                ${book.name}
                <span class="book-progress" id="progress_${bookId}"></span>
                </div>
                <div class="chapters-grid" id="chapters_${bookId}"></div>
            `;
            bibleBooksContainer.appendChild(section);
            const grid = section.querySelector('.chapters-grid');
            let hasVisibleChapters = false;
            for (let i = 1; i <= book.chapters; i++) {
                const key = sanitizeKey(book.name, i);
                const isRead = !!readStatus[key];
                if (
                    (filterStatus === 'leidos' && !isRead) ||
                    (filterStatus === 'no_leidos' && isRead)
                ) continue;
                hasVisibleChapters = true;
                const btn = document.createElement('button');
                btn.className = 'chapter-button';
                btn.textContent = i;
                btn.dataset.book = book.name;
                btn.dataset.chapter = i;
                if (isRead) btn.classList.add('read');
                btn.addEventListener('click', () => toggleChapterRead(book.name, i));
                grid.appendChild(btn);
            }
            if (!hasVisibleChapters && filterStatus !== 'todos') {
                section.style.display = 'none';
            }
            updateBookProgress(book.name);
        });
    }

    function populateFiltersAndSyncOptions() {
        bookFilter.innerHTML = '<option value="todos">Todos los Libros</option>';
        normalizedBibleBooks.forEach(b => {
            const o = document.createElement('option');
            o.value = b.name; o.textContent = b.name;
            bookFilter.appendChild(o);
        });
        bookFilter.addEventListener('change', () => renderBooks(bookFilter.value, statusFilter.value));
        statusFilter.addEventListener('change', () => renderBooks(bookFilter.value, statusFilter.value));

        syncReadingSelect.innerHTML = '';
        dailyReadingPlan.forEach((r, i) => {
            const o = document.createElement('option');
            o.value = i;
            o.textContent = `Día ${i + 1}: ${r.displayText}`;
            syncReadingSelect.appendChild(o);
        });
    }

    resetProgressButton.addEventListener('click', () => {
        if (!confirm('¿Reiniciar todo el progreso?')) return;
        readStatus = {};
        saveState();
        localStorage.removeItem('lastReadingDate');
        actualizarDiasRetraso();
        renderBooks(bookFilter.value, statusFilter.value);
        updateOverallProgress();
        displayDailySuggestion();
        alert("Progreso reiniciado.");
    });

    // --- Inicialización ---
    loadState();
    populateFiltersAndSyncOptions();
    renderBooks();
    updateOverallProgress();
    displayDailySuggestion(); 
    actualizarDiasRetraso();

    // --- Service Worker PWA ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js') 
                .then(r => console.log('ServiceWorker registrado con scope:', r.scope))
                .catch(e => console.error('Error al registrar ServiceWorker:', e));
        });
    }
});
