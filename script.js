document.addEventListener('DOMContentLoaded', () => {
    // Lista de libros de la Biblia (ahora más completa y normalizada)
    const bibleBooksRaw = [
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
    const normalizedBibleBooks = bibleBooksRaw.map(book => ({ ...book, name: book.name.replace(/\u00A0/g, ' ').replace(/Ι/g, 'I') }));

    function createStdPlanEntry(b, sc, ec) { return { book: b, startChapter: sc, endChapter: ec, displayText: `${b} ${sc}-${ec}` }; }
    function createSpecialPlanEntry(b, c, dt) { return { book: b, startChapter: c, endChapter: c, displayText: dt || `${b} ${c}` }; }
    function createCombinedPlanEntry(cb, fbs, fbe, sbs, sbe, tbs, tbe, cdt) { return { book: cb, startChapter: 1, endChapter: 1, displayText: cdt }; }

    const dailyReadingPlan = [
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
        createCombinedPlanEntry("Abdías, Jonás", 1, 1, 1, 4, 0, 0, "Abdías 1, Jonás 1-4"),
        createStdPlanEntry("Miqueas", 1, 7),
        createCombinedPlanEntry("Nahúm, Habacuc", 1, 3, 1, 3, 0, 0, "Nahúm 1-3, Habacuc 1-3"),
        createCombinedPlanEntry("Sofonías, Ageo", 1, 3, 1, 2, 0, 0, "Sofonías 1-3, Ageo 1-2"),
        createStdPlanEntry("Zacarías", 1, 7), createStdPlanEntry("Zacarías", 8, 11), createStdPlanEntry("Zacarías", 12, 14),
        createStdPlanEntry("Malaquías", 1, 4),
        createStdPlanEntry("Mateo", 1, 4), createStdPlanEntry("Mateo", 5, 7), createStdPlanEntry("Mateo", 8, 10),
        createStdPlanEntry("Mateo", 11, 13), createStdPlanEntry("Mateo", 14, 17), createStdPlanEntry("Mateo", 18, 20),
        createStdPlanEntry("Mateo", 21, 23), createStdPlanEntry("Mateo", 24, 25), createSpecialPlanEntry("Mateo", 26, "Mateo 26"),
        createStdPlanEntry("Mateo", 27, 28),
        createStdPlanEntry("Marcos", 1, 3), createStdPlanEntry("Marcos", 4, 5), createStdPlanEntry("Marcos", 6, 7),
        createStdPlanEntry("Marcos", 8, 9), createStdPlanEntry("Marcos", 10, 11), createStdPlanEntry("Marcos", 12, 13),
        createStdPlanEntry("Marcos", 14, 16),
        createStdPlanEntry("Lucas", 1, 2), createStdPlanEntry("Lucas", 3, 4), createStdPlanEntry("Lucas", 5, 6),
        createStdPlanEntry("Lucas", 7, 8), createStdPlanEntry("Lucas", 9, 10), createStdPlanEntry("Lucas", 11, 12),
        createStdPlanEntry("Lucas", 13, 15), createStdPlanEntry("Lucas", 16, 18), createStdPlanEntry("Lucas", 19, 21),
        createStdPlanEntry("Lucas", 22, 24),
        createStdPlanEntry("Juan", 1, 2), createStdPlanEntry("Juan", 3, 4), createStdPlanEntry("Juan", 5, 6),
        createStdPlanEntry("Juan", 7, 8), createStdPlanEntry("Juan", 9, 10), createStdPlanEntry("Juan", 11, 12),
        createStdPlanEntry("Juan", 13, 15), createStdPlanEntry("Juan", 16, 18), createStdPlanEntry("Juan", 19, 21),
        createStdPlanEntry("Hechos", 1, 3), createStdPlanEntry("Hechos", 4, 6), createStdPlanEntry("Hechos", 7, 9),
        createStdPlanEntry("Hechos", 10, 12), createStdPlanEntry("Hechos", 13, 14), createStdPlanEntry("Hechos", 15, 17),
        createStdPlanEntry("Hechos", 18, 20), createStdPlanEntry("Hechos", 21, 23), createStdPlanEntry("Hechos", 24, 26),
        createStdPlanEntry("Hechos", 27, 28),
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
        createCombinedPlanEntry("Tito, Filemón", 1, 3, 1, 1, 0, 0, "Tito 1-3, Filemón 1"),
        createStdPlanEntry("Hebreos", 1, 6), createStdPlanEntry("Hebreos", 7, 10), createStdPlanEntry("Hebreos", 11, 13),
        createStdPlanEntry("Santiago", 1, 5),
        createStdPlanEntry("1 Pedro", 1, 5),
        createStdPlanEntry("2 Pedro", 1, 3),
        createStdPlanEntry("1 Juan", 1, 5),
        createCombinedPlanEntry("2 Juan, 3 Juan, Judas", 1, 1, 1, 1, 1, 1, "2 Juan 1, 3 Juan 1, Judas 1"),
        createStdPlanEntry("Apocalipsis", 1, 4), createStdPlanEntry("Apocalipsis", 5, 8),
        createStdPlanEntry("Apocalipsis", 9, 12), createStdPlanEntry("Apocalipsis", 13, 16),
        createStdPlanEntry("Apocalipsis", 17, 19), createStdPlanEntry("Apocalipsis", 20, 22)
    ];

    function getBookInfoForUrl(bookName, allBibleBooks) { const normalizedName = bookName.trim(); const bookData = allBibleBooks.find(b => b.name === normalizedName); if (!bookData) return null; const bookIndex = allBibleBooks.indexOf(bookData); return { name: bookData.name, code: (bookIndex + 1).toString().padStart(2, '0'), totalChapters: bookData.chapters }; }
    function padChapterOrVerse(num, size = 3) { return num.toString().padStart(size, '0'); }
    const generatedReadingUrls = dailyReadingPlan.map((planEntry, index) => { if (planEntry.url && typeof planEntry.url === 'string' && planEntry.url.startsWith('http')) return planEntry.url; const displayText = planEntry.displayText; if (!displayText) return `ERROR_EMPTY_DISPLAY_TEXT: Index ${index}`; const readingParts = displayText.split(',').map(p => p.trim()); let startBookName, startChapterNum, startVerseNum = 1, endBookName, endChapterNum, endVerseNum = 999; const readingPartRegex = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s+(\d+)(?:-(\d+))?/; const firstPartMatch = readingParts[0].match(readingPartRegex); if (!firstPartMatch) return `ERROR_PARSING_FIRST_PART: ${displayText}`; startBookName = firstPartMatch[1].trim(); startChapterNum = parseInt(firstPartMatch[2]); if (readingParts[0].match(/desde v\.\s*(\d+)/i)) startVerseNum = parseInt(RegExp.$1); if (!firstPartMatch[3] && readingParts[0].match(/desde v\.\s*(\d+)/i)) endChapterNum = startChapterNum; const lastPartMatch = readingParts[readingParts.length - 1].match(readingPartRegex); if (!lastPartMatch) return `ERROR_PARSING_LAST_PART: ${displayText}`; endBookName = lastPartMatch[1].trim(); endChapterNum = parseInt(lastPartMatch[3] || lastPartMatch[2]); if (readingParts[readingParts.length - 1].match(/hasta v\.\s*(\d+)/i)) endVerseNum = parseInt(RegExp.$1); if (startBookName === "Salmos" && startChapterNum === 119 && readingParts[0].match(/desde v\.\s*(\d+)/i)) { endBookName = "Salmos"; endChapterNum = 119; } if (endBookName === "Salmos" && endChapterNum === 119 && readingParts[readingParts.length - 1].match(/hasta v\.\s*(\d+)/i)) startBookName = "Salmos"; const startBookInfo = getBookInfoForUrl(startBookName, normalizedBibleBooks); const endBookInfo = getBookInfoForUrl(endBookName, normalizedBibleBooks); if (!startBookInfo) return `ERROR_START_BOOK_NOT_FOUND: ${startBookName} in ${displayText}`; if (!endBookInfo) return `ERROR_END_BOOK_NOT_FOUND: ${endBookName} in ${displayText}`; const bibleParam = `${startBookInfo.code}${padChapterOrVerse(startChapterNum)}${padChapterOrVerse(startVerseNum)}-${endBookInfo.code}${padChapterOrVerse(endChapterNum)}${padChapterOrVerse(endVerseNum)}`; return `https://www.jw.org/finder?wtlocale=S&bible=${bibleParam}`; });
    dailyReadingPlan.forEach((entry, i) => { if (generatedReadingUrls[i] && !generatedReadingUrls[i].startsWith('ERROR_')) entry.url = generatedReadingUrls[i]; else if (generatedReadingUrls[i]) { console.warn(`No URL for plan [${i}]: ${entry.displayText}. Error: ${generatedReadingUrls[i]}`); entry.url = '#ERROR'; } });

    const thematicSections = [
        { id: "creation_origin", title: "El relato de la creación y el origen de todos los pueblos", parts: [{ bookName: "Génesis", startChapter: 1, endChapter: 11 }], awardEmoji: "🌍" },
        { id: "conquest_promised_land", title: "La conquista de la Tierra Prometida", parts: [{ bookName: "Josué" }, { bookName: "Jueces" }, { bookName: "Rut" }], awardEmoji: "🏞️" },
        { id: "kings_ancient_israel", title: "Los reyes del antiguo Israel", parts: [{ bookName: "1 Samuel" }, { bookName: "2 Samuel" }, { bookName: "1 Reyes" }, { bookName: "2 Reyes" }, { bookName: "1 Crónicas" }, { bookName: "2 Crónicas" }], awardEmoji: "👑" },
        { id: "return_from_exile", title: "El regreso del exilio", parts: [{ bookName: "Esdras" }, { bookName: "Nehemías" }, { bookName: "Ester" }], awardEmoji: "📜" },
        { id: "story_of_job", title: "La historia de Job", parts: [{ bookName: "Job" }], awardEmoji: "🌪️" },
        { id: "songs_wise_counsel", title: "Canciones y consejos sabios", parts: [{ bookName: "Salmos" }, { bookName: "Proverbios" }, { bookName: "Eclesiastés" }, { bookName: "Cantar de los Cantares" }], awardEmoji: "🎶" },
        { id: "prophetic_books", title: "Los libros proféticos", parts: [{ bookName: "Isaías" }, { bookName: "Jeremías" }, { bookName: "Lamentaciones" }, { bookName: "Ezequiel" }, { bookName: "Daniel" }, { bookName: "Oseas" }, { bookName: "Joel" }, { bookName: "Amós" }, { bookName: "Abdías" }, { bookName: "Jonás" }, { bookName: "Miqueas" }, { bookName: "Nahúm" }, { bookName: "Habacuc" }, { bookName: "Sofonías" }, { bookName: "Ageo" }, { bookName: "Zacarías" }, { bookName: "Malaquías" }], awardEmoji: "🗣️" },
        { id: "life_ministry_jesus", title: "La vida y el ministerio de Jesús", parts: [{ bookName: "Mateo" }, { bookName: "Marcos" }, { bookName: "Lucas" }, { bookName: "Juan" }], awardEmoji: "🔥" },
        { id: "beginnings_christian_congregation", title: "Los comienzos de la congregación cristiana", parts: [{ bookName: "Hechos" }], awardEmoji: "💌" },
        { id: "apostle_paul_letters", title: "Las cartas del apóstol Pablo", parts: [{ bookName: "Romanos" }, { bookName: "1 Corintios" }, { bookName: "2 Corintios" }, { bookName: "Gálatas" }, { bookName: "Efesios" }, { bookName: "Filipenses" }, { bookName: "Colosenses" }, { bookName: "1 Tesalonicenses" }, { bookName: "2 Tesalonicenses" }, { bookName: "1 Timoteo" }, { bookName: "2 Timoteo" }, { bookName: "Tito" }, { bookName: "Filemón" }], awardEmoji: "✉️" },
        { id: "writings_other_apostles", title: "Los escritos de otros apóstoles y discípulos", parts: [{ bookName: "Hebreos" }, { bookName: "Santiago" }, { bookName: "1 Pedro" }, { bookName: "2 Pedro" }, { bookName: "1 Juan" }, { bookName: "2 Juan" }, { bookName: "3 Juan" }, { bookName: "Judas" }, { bookName: "Apocalipsis" }], awardEmoji: "🖋️" }
    ];

    const bibleBooksContainer = document.getElementById('bibleBooksContainer');
    const progressBar = document.getElementById('progressBar');
    const progressTextEl = document.getElementById('progressText');
    const currentYearText = document.getElementById('currentYearText');
    const bookFilter = document.getElementById('bookFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetProgressButton = document.getElementById('resetProgress');
    const currentDateTextEl = document.getElementById('currentDateText');
    const dailySuggestionMainTextEl = document.getElementById('dailySuggestionMainText');
    const dailySuggestionOnlineLinkEl = document.getElementById('dailySuggestionOnlineLink');
    const jwAppSuggestionNoteEl = document.getElementById('jwAppSuggestionNote');
    const markSuggestedAsReadButtonEl = document.getElementById('markSuggestedAsReadButton');
    const addToCalendarButtonEl = document.getElementById('addToCalendarButton');
    const planStartDateInput = document.getElementById('planStartDateInput');
    const setPlanStartDateButton = document.getElementById('setPlanStartDateButton');
    const currentPlanStartDateTextEl = document.getElementById('currentPlanStartDateText');
    const syncReadingSelect = document.getElementById('syncReadingSelect');
    const syncPlanButton = document.getElementById('syncPlanButton');
    const thematicSectionsContainer = document.getElementById('thematicSectionsContainer'); // Asegúrate que el ID es 'thematicSectionsContainer' en HTML
    const daysDelayedTextEl = document.getElementById('daysDelayedText');

    let readStatus = {};
    let awardedSectionsStatus = {};
    let newlyAwardedSections = new Set();
    window.currentSuggestedReading = null;
    window.todayUTC = null;
    window.dayDiff = 0;
    window.dayOfPlan = 0;

    const totalBibleChapters = normalizedBibleBooks.reduce((sum, book) => sum + book.chapters, 0);

    if (currentYearText) {
        currentYearText.textContent = new Date().getFullYear();
    }
    if (progressBar) {
         progressBar.setAttribute('aria-valuemax', totalBibleChapters);
         progressBar.setAttribute('aria-valuenow', 0);
         progressBar.setAttribute('aria-label', 'Progreso general de lectura');
    }

    function sanitizeKey(bookName, chapterNum) { return `key_${bookName.replace(/\s/g, '_')}_${chapterNum}`; }

    function loadState() {
        const savedReadStatus = localStorage.getItem('bibleReadStatus');
        if (savedReadStatus) { try { readStatus = JSON.parse(savedReadStatus); } catch (e) { console.error("Error parsing bibleReadStatus:", e); readStatus = {}; } }

        const savedPlanStartDate = localStorage.getItem('planStartDate');
        if (savedPlanStartDate && planStartDateInput) {
            planStartDateInput.value = savedPlanStartDate;
            try {
                const dateObj = new Date(savedPlanStartDate + "T00:00:00Z");
                if (isNaN(dateObj.getTime())) throw new Error("Invalid date value");
                if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = `Tu plan de lectura actual comenzó el: ` +
                    dateObj.toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
            } catch (e) {
                console.error("Error parsing planStartDate:", e);
                if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Fecha de inicio guardada inválida. Por favor, reestablécela.";
                localStorage.removeItem('planStartDate');
            }
        } else if (currentPlanStartDateTextEl) {
            currentPlanStartDateTextEl.textContent = "Aún no has establecido una fecha de inicio para tu plan.";
        }

        const savedAwards = localStorage.getItem('awardedSectionsStatus');
        if (savedAwards) { try { awardedSectionsStatus = JSON.parse(savedAwards); } catch (e) { console.error("Error parsing awardedSectionsStatus:", e); awardedSectionsStatus = {}; } }
    }

    function saveState() {
        localStorage.setItem('bibleReadStatus', JSON.stringify(readStatus));
        localStorage.setItem('awardedSectionsStatus', JSON.stringify(awardedSectionsStatus));
    }

    function checkThematicSectionCompletion(sectionId) {
        const section = thematicSections.find(s => s.id === sectionId);
        if (!section) return false;
        for (const part of section.parts) {
            const bookData = normalizedBibleBooks.find(b => b.name === part.bookName);
            if (!bookData) { console.warn(`Libro "${part.bookName}" de sección "${section.title}" no hallado.`); return false; }
            const startChap = part.startChapter || 1;
            const endChap = part.endChapter || bookData.chapters;
            for (let i = startChap; i <= endChap; i++) {
                if (!readStatus[sanitizeKey(part.bookName, i)]) return false;
            }
        }
        return true;
    }

    function updateAllThematicSectionsStatus() {
        let stateChanged = false;
        newlyAwardedSections.clear();
        thematicSections.forEach(section => {
            const isCompleted = checkThematicSectionCompletion(section.id);
            const wasPreviouslyAwarded = awardedSectionsStatus[section.id] === true;
            if (isCompleted && !wasPreviouslyAwarded) {
                awardedSectionsStatus[section.id] = true;
                stateChanged = true;
                newlyAwardedSections.add(section.id);
                setTimeout(() => { 
                    alert(`🎉 ¡Felicidades! 🎉\n\nHas completado la sección: "${section.title}"\n\n¡Has ganado el premio ${section.awardEmoji}!`);
                }, 100);
            } else if (!isCompleted && wasPreviouslyAwarded) {
                awardedSectionsStatus[section.id] = false;
                stateChanged = true;
            }
        });
        if (stateChanged) saveState();
        renderThematicSections();
    }

    function renderThematicSections() {
        if (!thematicSectionsContainer) return; // thematicSectionsContainer es el div donde se renderizan las metas
        thematicSectionsContainer.innerHTML = '';
        thematicSections.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'thematic-section-item';
            const isAwarded = awardedSectionsStatus[section.id] === true;
            if (isAwarded) {
                sectionEl.classList.add('awarded');
                if (newlyAwardedSections.has(section.id)) sectionEl.classList.add('newly-awarded');
            }
            const titleEl = document.createElement('h3');
            titleEl.className = 'thematic-section-title';
            titleEl.textContent = section.title;
            const awardEl = document.createElement('div');
            awardEl.className = 'thematic-section-award';
            awardEl.textContent = isAwarded ? section.awardEmoji : '🔒';
            awardEl.title = isAwarded ? `¡Completado! ${section.awardEmoji}` : "Pendiente";
            sectionEl.appendChild(titleEl);
            sectionEl.appendChild(awardEl);
            thematicSectionsContainer.appendChild(sectionEl);
        });
    }
    
    function actualizarInterfazDiasRetraso() {
        if (daysDelayedTextEl) {
            const delayToShow = window.dayDiff !== undefined ? window.dayDiff : 0;
            daysDelayedTextEl.textContent = delayToShow;
            daysDelayedTextEl.classList.toggle('has-delay', delayToShow > 0);
            const statusBlock = daysDelayedTextEl.closest('.suggestion-block--status');
            if (statusBlock) statusBlock.classList.toggle('has-delay', delayToShow > 0);
        }
    }

    function actualizarUltimaLectura() {
        const hoy = new Date();
        localStorage.setItem('lastReadingDate', hoy.toISOString());
        displayDailySuggestion();
    }
    
    function isDailyPlanEntryRead(planEntry) {
        if (!planEntry || !planEntry.displayText) return true; 
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
                            if (!readStatus[sanitizeKey(bookName, ch)]) return false;
                        } else { console.warn(`Capítulo ${ch} fuera de rango para ${bookName} en plan: ${planEntry.displayText}`); return false; }
                    }
                } else { console.warn(`Libro "${bookName}" no encontrado en plan: ${planEntry.displayText}`); return false; }
            } else {
                if (planEntry.book && planEntry.startChapter && planEntry.endChapter) {
                     const bookData = normalizedBibleBooks.find(b => b.name === planEntry.book);
                     if (bookData) {
                        for (let ch = planEntry.startChapter; ch <= planEntry.endChapter; ch++) {
                             if (ch >= 1 && ch <= bookData.chapters) { if (!readStatus[sanitizeKey(planEntry.book, ch)]) return false; } else return false;
                        }
                     } else return false;
                } else { console.warn(`No se pudo parsear parte "${part}" de plan: ${planEntry.displayText}, y no hay fallback.`); return false; }
            }
        }
        return true;
    }

    function calculateEffectiveDelay() {
        const planStartDateString = localStorage.getItem('planStartDate');
        if (!planStartDateString) return 0;
        let planStartDate;
        try { planStartDate = new Date(planStartDateString + "T00:00:00Z"); if (isNaN(planStartDate.getTime())) return 0; } catch (e) { return 0; }
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        if (todayUTC < planStartDate) return 0;
        const elapsedDaysSinceStart = Math.floor((todayUTC.getTime() - planStartDate.getTime()) / (1000 * 3600 * 24));
        let actualDelay = 0;
        let firstUnreadDayIndex = -1;
        for (let i = 0; i <= elapsedDaysSinceStart; i++) {
            if (i < dailyReadingPlan.length) {
                const readingEntryForDayI = dailyReadingPlan[i];
                if (!isDailyPlanEntryRead(readingEntryForDayI)) { if (firstUnreadDayIndex === -1) firstUnreadDayIndex = i; }
            }
        }
        if (firstUnreadDayIndex !== -1) actualDelay = (elapsedDaysSinceStart) - firstUnreadDayIndex + 1;
        return Math.max(0, actualDelay);
    }

    function displayDailySuggestion() {
        if (currentDateTextEl) currentDateTextEl.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' });
        const planStartDateString = localStorage.getItem('planStartDate');
        if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.innerHTML = ''; 
        if (dailySuggestionOnlineLinkEl) dailySuggestionOnlineLinkEl.style.display = 'none';
        if (markSuggestedAsReadButtonEl) markSuggestedAsReadButtonEl.style.display = 'none';
        if (addToCalendarButtonEl) addToCalendarButtonEl.style.display = 'none';
        if (jwAppSuggestionNoteEl) jwAppSuggestionNoteEl.style.display = 'none';
        window.currentSuggestedReading = null; window.todayUTC = null; window.dayOfPlan = 0;
        if (!planStartDateString) {
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "Establece una fecha de inicio para el plan de lectura.";
            window.dayDiff = 0; actualizarInterfazDiasRetraso(); return;
        }
        let planStartDate;
        try { planStartDate = new Date(planStartDateString + "T00:00:00Z"); if (isNaN(planStartDate.getTime())) throw new Error("Fecha de inicio inválida");
        } catch (e) {
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "Error en la fecha de inicio guardada. Por favor, reestablécela.";
            localStorage.removeItem('planStartDate'); window.dayDiff = 0; actualizarInterfazDiasRetraso(); return;
        }
        const now = new Date();
        const todayDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        window.todayUTC = todayDateUTC;
        const elapsedDaysSinceStart = Math.floor((todayDateUTC.getTime() - planStartDate.getTime()) / (1000 * 3600 * 24));
        if (elapsedDaysSinceStart < 0) {
            const daysUntilStart = -elapsedDaysSinceStart;
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = `Tu plan de lectura comenzará en ${daysUntilStart} día(s). La primera lectura será: ${dailyReadingPlan[0] ? dailyReadingPlan[0].displayText : 'N/A'}`;
            window.dayOfPlan = daysUntilStart; window.dayDiff = 0;
        } else {
            window.dayOfPlan = elapsedDaysSinceStart + 1;
            const currentReadingIndex = elapsedDaysSinceStart;
            if (dailyReadingPlan.length === 0) { if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "No hay un plan de lectura diario definido."; }
            else if (currentReadingIndex >= 0 && currentReadingIndex < dailyReadingPlan.length) {
                window.currentSuggestedReading = dailyReadingPlan[currentReadingIndex];
                if (dailySuggestionMainTextEl) {
                    const dayDisplay = document.createElement('span'); dayDisplay.className = 'suggested-reading__day'; dayDisplay.textContent = `Día ${window.dayOfPlan}`;
                    const scriptureDisplay = document.createElement('span'); scriptureDisplay.className = 'suggested-reading__scripture'; scriptureDisplay.textContent = window.currentSuggestedReading.displayText;
                    dailySuggestionMainTextEl.appendChild(dayDisplay); dailySuggestionMainTextEl.appendChild(document.createElement('br')); dailySuggestionMainTextEl.appendChild(scriptureDisplay);
                }
                if (window.currentSuggestedReading.url && window.currentSuggestedReading.url !== '#ERROR') {
                    if (dailySuggestionOnlineLinkEl) { dailySuggestionOnlineLinkEl.href = window.currentSuggestedReading.url; dailySuggestionOnlineLinkEl.style.display = 'inline-block'; }
                    if (markSuggestedAsReadButtonEl) markSuggestedAsReadButtonEl.style.display = 'inline-block';
                    if (addToCalendarButtonEl) addToCalendarButtonEl.style.display = 'inline-block';
                } else if (window.currentSuggestedReading.url === '#ERROR' && dailySuggestionMainTextEl) {
                    const errorMsg = document.createElement('p'); errorMsg.style.color = 'var(--danger-color, red)'; errorMsg.style.fontSize = '0.9em'; errorMsg.textContent = 'Error al generar el enlace para esta lectura.';
                    dailySuggestionMainTextEl.appendChild(errorMsg);
                }
                const isAndroid = /Android/i.test(navigator.userAgent);
                if (jwAppSuggestionNoteEl) {
                    if (isAndroid) { jwAppSuggestionNoteEl.textContent = 'Si tienes la aplicación JW Library instalada, considera abrir la lectura manualmente allí para una mejor experiencia.'; jwAppSuggestionNoteEl.style.display = 'block'; }
                    else { jwAppSuggestionNoteEl.style.display = 'none'; }
                }
            } else { if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "¡Felicidades! Has completado todas las lecturas del plan o estás más allá de su duración."; }
            window.dayDiff = calculateEffectiveDelay(); 
        }
        actualizarInterfazDiasRetraso();
    }

    function updateChapterButtonUI(bookName, chapterNum) {
        const key = sanitizeKey(bookName, chapterNum);
        const bookIdForGrid = sanitizeKey(bookName, '').substring(4).replace(/_undefined$|_null$|_$/,''); 
        const chapterGrid = document.getElementById(`chapters_${bookIdForGrid}`);
        if (!chapterGrid) return;
        const buttonSelector = `.chapter-button[data-book="${bookName}"][data-chapter="${chapterNum}"]`;
        const button = chapterGrid.querySelector(buttonSelector);
        if (button) {
            const isRead = !!readStatus[key];
            button.classList.toggle('read', isRead);
            button.setAttribute('aria-pressed', isRead ? 'true' : 'false');
            button.setAttribute('aria-label', `${bookName} capítulo ${chapterNum}, ${isRead ? 'leído' : 'no leído'}`);
        }
    }
    
    function updateOverallProgress() {
        if (!progressBar && !progressTextEl) return;
        const readCount = Object.values(readStatus).filter(v => v === true).length;
        const percent = totalBibleChapters > 0 ? Math.round((readCount / totalBibleChapters) * 100) : 0;
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressBar.textContent = percent > 5 ? `${percent}%` : '';
            progressBar.setAttribute('aria-valuenow', readCount);
        }
        if (progressTextEl) progressTextEl.textContent = `${percent}% completado (${readCount} de ${totalBibleChapters} capítulos)`;
    }

    function updateBookProgress(bookName) {
        const bookData = normalizedBibleBooks.find(b => b.name === bookName);
        if (!bookData) return;
        let readInBookCount = 0;
        for (let i = 1; i <= bookData.chapters; i++) { if (readStatus[sanitizeKey(bookName, i)]) readInBookCount++; }
        const bookId = sanitizeKey(bookName, '').substring(4).replace(/_undefined$|_null$|_$/,'');
        const progressElement = document.getElementById(`progress_${bookId}`);
        if (progressElement) {
            const percent = bookData.chapters > 0 ? Math.round((readInBookCount / bookData.chapters) * 100) : 0;
            progressElement.textContent = `${percent}% (${readInBookCount}/${bookData.chapters})`;
        }
    }

    function toggleChapterRead(bookName, chapterNum) {
        const key = sanitizeKey(bookName, chapterNum);
        readStatus[key] = !readStatus[key];
        if (readStatus[key]) actualizarUltimaLectura(); else displayDailySuggestion();
        updateChapterButtonUI(bookName, chapterNum);
        saveState();
        updateOverallProgress();
        updateBookProgress(bookName);
        updateAllThematicSectionsStatus();
    }

    // NUEVA FUNCIÓN para manejar el despliegue/contracción de capítulos
    function toggleBookChapters(bookId, titleElement) {
        const chapterGrid = document.getElementById(`chapters_${bookId}`);
        const icon = titleElement.querySelector('.book-toggle-icon'); 

        if (chapterGrid) {
            const isExpanded = chapterGrid.style.display === 'grid' || chapterGrid.style.display === '';
            
            if (isExpanded) {
                chapterGrid.style.display = 'none';
                titleElement.setAttribute('aria-expanded', 'false');
                if (icon) icon.textContent = '▼'; 
            } else {
                chapterGrid.style.display = 'grid'; 
                titleElement.setAttribute('aria-expanded', 'true');
                if (icon) icon.textContent = '▲'; 
            }
        }
    }

    function renderBooks(filterBookName = 'todos', filterStatus = 'todos') {
        if (!bibleBooksContainer) return;
        bibleBooksContainer.innerHTML = ''; 

        const booksToRender = normalizedBibleBooks.filter(book =>
            filterBookName === 'todos' || book.name === filterBookName
        );

        if (booksToRender.length === 0 && bibleBooksContainer) { // Añadido chequeo de bibleBooksContainer
            bibleBooksContainer.innerHTML = '<p>No hay libros que coincidan con los filtros seleccionados.</p>';
            return;
        }

        booksToRender.forEach(book => {
            const bookId = sanitizeKey(book.name, '').substring(4).replace(/_undefined$|_null$|_$/,''); 

            const section = document.createElement('div');
            section.className = 'book-section';
            section.setAttribute('id', `book-section-${bookId}`);

            const titleDiv = document.createElement('div');
            titleDiv.className = 'book-title';
            titleDiv.setAttribute('role', 'button');
            titleDiv.setAttribute('tabindex', '0'); 
            const chapterGridId = `chapters_${bookId}`;
            titleDiv.setAttribute('aria-expanded', 'false'); 
            titleDiv.setAttribute('aria-controls', chapterGridId);

            const bookNameSpan = document.createElement('span');
            bookNameSpan.className = 'book-name';
            bookNameSpan.textContent = book.name;

            const bookProgressSpan = document.createElement('span');
            bookProgressSpan.className = 'book-progress';
            bookProgressSpan.id = `progress_${bookId}`; 

            const toggleIconSpan = document.createElement('span');
            toggleIconSpan.className = 'book-toggle-icon';
            toggleIconSpan.setAttribute('aria-hidden', 'true');
            toggleIconSpan.textContent = '▼'; 

            titleDiv.appendChild(bookNameSpan);
            titleDiv.appendChild(bookProgressSpan);
            titleDiv.appendChild(toggleIconSpan);

            const chapterGrid = document.createElement('div');
            chapterGrid.className = 'chapters-grid';
            chapterGrid.setAttribute('id', chapterGridId);
            chapterGrid.style.display = 'none'; 

            let hasVisibleChapters = false;
            for (let i = 1; i <= book.chapters; i++) {
                const key = sanitizeKey(book.name, i);
                const isRead = !!readStatus[key];
                if (filterStatus === 'leidos' && !isRead) continue;
                if (filterStatus === 'no_leidos' && isRead) continue;
                hasVisibleChapters = true;
                const button = document.createElement('button');
                button.className = 'chapter-button';
                button.textContent = i;
                button.dataset.book = book.name;
                button.dataset.chapter = i;
                if (isRead) button.classList.add('read');
                button.setAttribute('aria-label', `${book.name} capítulo ${i}, ${isRead ? 'leído' : 'no leído'}. Púlsalo para cambiar estado.`);
                button.setAttribute('aria-pressed', isRead ? 'true' : 'false');
                button.addEventListener('click', () => toggleChapterRead(book.name, i));
                chapterGrid.appendChild(button);
            }
            
            if (!hasVisibleChapters && filterStatus !== 'todos') {
                section.style.display = 'none'; 
            } else {
                titleDiv.addEventListener('click', () => toggleBookChapters(bookId, titleDiv));
                titleDiv.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault(); 
                        toggleBookChapters(bookId, titleDiv);
                    }
                });
            }

            section.appendChild(titleDiv);
            section.appendChild(chapterGrid); 
            bibleBooksContainer.appendChild(section);
            updateBookProgress(book.name); 
        });

        if (filterBookName !== 'todos' && booksToRender.length === 1) {
            const singleBookSanitizedName = sanitizeKey(booksToRender[0].name, '').substring(4).replace(/_undefined$|_null$|_$/,'');
            const singleBookSection = document.getElementById(`book-section-${singleBookSanitizedName}`);

            if (singleBookSection && singleBookSection.style.display !== 'none') {
                const titleElement = singleBookSection.querySelector('.book-title');
                const bookId = singleBookSanitizedName; 
                const chapterGridElement = document.getElementById(`chapters_${bookId}`);
                if (titleElement && chapterGridElement && chapterGridElement.style.display === 'none') {
                     toggleBookChapters(bookId, titleElement);
                }
            }
        }
    }

    function populateFiltersAndSyncOptions() {
        if (bookFilter) {
            bookFilter.innerHTML = '<option value="todos">Todos los Libros</option>';
            normalizedBibleBooks.forEach(book => {
                const option = document.createElement('option'); option.value = book.name; option.textContent = book.name; bookFilter.appendChild(option);
            });
            bookFilter.addEventListener('change', () => renderBooks(bookFilter.value, statusFilter ? statusFilter.value : 'todos'));
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => renderBooks(bookFilter ? bookFilter.value : 'todos', statusFilter.value));
        }
        if (syncReadingSelect) {
            syncReadingSelect.innerHTML = '<option value="">Selecciona un día del plan para sincronizar...</option>';
            dailyReadingPlan.forEach((reading, index) => {
                const option = document.createElement('option'); option.value = index; option.textContent = `Día ${index + 1}: ${reading.displayText}`;
                syncReadingSelect.appendChild(option);
            });
        }
    }
    
    if (setPlanStartDateButton && planStartDateInput) {
        setPlanStartDateButton.addEventListener('click', () => {
            const dateValue = planStartDateInput.value;
            if (!dateValue || !dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) { alert("Por favor, introduce una fecha válida en formato AAAA-MM-DD."); return; }
            localStorage.setItem('planStartDate', dateValue); loadState(); displayDailySuggestion(); alert("Fecha de inicio del plan establecida correctamente.");
        });
    }

    if (syncPlanButton && syncReadingSelect && planStartDateInput) {
        syncPlanButton.addEventListener('click', () => {
            const selectedReadingIndex = parseInt(syncReadingSelect.value);
            if (isNaN(selectedReadingIndex) || selectedReadingIndex < 0 || selectedReadingIndex >= dailyReadingPlan.length) { alert("Por favor, selecciona una lectura válida del plan para sincronizar."); return; }
            const today = new Date();
            const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
            const newStartDateUTC = new Date(todayUTC);
            newStartDateUTC.setUTCDate(todayUTC.getUTCDate() - selectedReadingIndex);
            const newStartDateString = newStartDateUTC.toISOString().split('T')[0];
            localStorage.setItem('planStartDate', newStartDateString);
            if (planStartDateInput) planStartDateInput.value = newStartDateString; 
            loadState(); displayDailySuggestion(); alert(`Plan sincronizado. Hoy (${today.toLocaleDateString()}) es el Día ${selectedReadingIndex + 1} del plan.`);
        });
    }

    function markChaptersForBook(bookName, startChapter, endChapter) {
        let chaptersChanged = false;
        const bookData = normalizedBibleBooks.find(b => b.name === bookName);
        if (!bookData) { console.warn(`Libro "${bookName}" no encontrado al intentar marcar capítulos.`); return false; }
        for (let i = startChapter; i <= endChapter; i++) {
            if (i >= 1 && i <= bookData.chapters) {
                const key = sanitizeKey(bookName, i);
                if (!readStatus[key]) { readStatus[key] = true; updateChapterButtonUI(bookName, i); chaptersChanged = true; }
            } else { console.warn(`Capítulo ${i} fuera de rango para el libro ${bookName}.`); }
        }
        if (chaptersChanged) updateBookProgress(bookName);
        return chaptersChanged;
    }

    if (markSuggestedAsReadButtonEl) {
        markSuggestedAsReadButtonEl.addEventListener('click', () => {
            if (!window.currentSuggestedReading) { alert("No hay sugerencia de lectura actual para marcar."); return; }
            let overallChange = false; const { displayText } = window.currentSuggestedReading;
            const readingParts = displayText.split(',').map(part => part.trim());
            const regex = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s*(\d+)(?:-(\d+))?(?:\s*\(.*v\.\s*\d+(?:-\d+)?\))?/;
            readingParts.forEach(partStr => {
                const match = partStr.match(regex);
                if (match) {
                    const bookName = match[1].trim(); const startChapter = parseInt(match[2]); const endChapter = match[3] ? parseInt(match[3]) : startChapter;
                    const actualBook = normalizedBibleBooks.find(b => b.name === bookName);
                    if (actualBook) { if (markChaptersForBook(actualBook.name, startChapter, endChapter)) overallChange = true; }
                    else { console.warn(`Libro "${bookName}" no encontrado al procesar: "${partStr}"`); }
                } else {
                    if (window.currentSuggestedReading.book && window.currentSuggestedReading.startChapter && window.currentSuggestedReading.endChapter) {
                        const bookNameFallback = window.currentSuggestedReading.book.match(/([\w\s\dÁÉÍÓÚáéíóúÑñ]+)/);
                        if (bookNameFallback) {
                            const actualBookFallback = normalizedBibleBooks.find(b => b.name === bookNameFallback[1].trim());
                            if (actualBookFallback) { if(markChaptersForBook(actualBookFallback.name, window.currentSuggestedReading.startChapter, window.currentSuggestedReading.endChapter)) overallChange = true; }
                            else console.warn(`Libro (fallback) "${bookNameFallback[1].trim()}" no hallado.`);
                        } else console.warn(`Formato de libro (fallback) no reconocido: "${window.currentSuggestedReading.book}"`);
                    } else console.warn(`Formato de lectura no reconocido para marcar: "${partStr}" y no hay fallback.`);
                }
            });
            if (overallChange) { saveState(); updateOverallProgress(); updateAllThematicSectionsStatus(); actualizarUltimaLectura(); }
            else { alert(`Los capítulos de la lectura sugerida "${displayText}" ya estaban marcados.`); actualizarUltimaLectura(); }
        });
    }
    
    if (addToCalendarButtonEl) {
        addToCalendarButtonEl.onclick = () => { 
            if (!window.currentSuggestedReading || !window.todayUTC) { alert("No hay sugerencia de lectura o fecha para agregar al calendario."); return; }
            if (typeof downloadICS !== 'function') { console.error("La función downloadICS no está definida."); alert("Error: Funcionalidad de calendario no disponible."); return; }
            const title = `Lectura Bíblica Día ${window.dayOfPlan}: ${window.currentSuggestedReading.displayText}`;
            const description = `Leer según el plan: ${window.currentSuggestedReading.displayText}. Enlace: ${window.currentSuggestedReading.url || 'N/A'}`;
            const startDate = new Date(window.todayUTC.valueOf()); 
            const endDate = new Date(window.todayUTC.valueOf()); endDate.setDate(startDate.getDate() + 1);
            downloadICS({ title: title, description: description, startDate: startDate, endDate: endDate, isAllDay: true });
        };
    }
    if (typeof downloadICS === 'undefined') {
        window.downloadICS = function(eventDetails) {
            console.warn("Función `downloadICS` es un placeholder. Detalles:", eventDetails);
            alert("Descarga de ICS no implementada completamente.\n" + `Título: ${eventDetails.title}\nFecha: ${eventDetails.startDate.toLocaleDateString()}`);
        };
    }

    if (resetProgressButton) {
        resetProgressButton.addEventListener('click', () => {
            if (!confirm('¿Estás seguro de que quieres reiniciar todo tu progreso, incluyendo la fecha de inicio del plan y las secciones temáticas? Esta acción no se puede deshacer.')) return;
            readStatus = {}; awardedSectionsStatus = {}; newlyAwardedSections.clear();
            localStorage.removeItem('bibleReadStatus'); localStorage.removeItem('awardedSectionsStatus');
            localStorage.removeItem('planStartDate'); localStorage.removeItem('lastReadingDate');
            if (planStartDateInput) planStartDateInput.value = "";
            if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Aún no has establecido una fecha de inicio para tu plan.";
            saveState(); 
            renderBooks(bookFilter ? bookFilter.value : 'todos', statusFilter ? statusFilter.value : 'todos');
            updateOverallProgress(); updateAllThematicSectionsStatus(); 
            window.currentSuggestedReading = null; window.dayDiff = 0; window.dayOfPlan = 0;
            displayDailySuggestion(); 
            alert("Todo el progreso, la fecha de inicio del plan y los premios han sido reiniciados.");
        });
    }

    loadState();
    populateFiltersAndSyncOptions();
    renderBooks(); 
    updateOverallProgress();
    updateAllThematicSectionsStatus(); 
    displayDailySuggestion(); 
});
