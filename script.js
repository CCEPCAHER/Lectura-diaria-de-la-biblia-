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
        createStdPlanEntry("Marcos", 1, 3), createStdPlanEntry("Marcos", 4, 5), createStdPlanEntry("Marcos", 6, 8),
        createStdPlanEntry("Marcos", 9, 10), createStdPlanEntry("Marcos", 11, 13), createStdPlanEntry("Marcos", 14, 16),
        createStdPlanEntry("Lucas", 1, 2), createStdPlanEntry("Lucas", 3, 5), createStdPlanEntry("Lucas", 6, 7),
        createStdPlanEntry("Lucas", 8, 9), createStdPlanEntry("Lucas", 10, 11), createStdPlanEntry("Lucas", 12, 13),
        createStdPlanEntry("Lucas", 14, 17), createStdPlanEntry("Lucas", 18, 19), createStdPlanEntry("Lucas", 20, 22),
        createStdPlanEntry("Lucas", 23, 24),
        createStdPlanEntry("Juan", 1, 3), createStdPlanEntry("Juan", 4, 5), createStdPlanEntry("Juan", 6, 7),
        createStdPlanEntry("Juan", 8, 9), createStdPlanEntry("Juan", 10, 12), createStdPlanEntry("Juan", 13, 15),
        createStdPlanEntry("Juan", 16, 18), createStdPlanEntry("Juan", 19, 21),
        createStdPlanEntry("Hechos", 1, 3), createStdPlanEntry("Hechos", 4, 6), createStdPlanEntry("Hechos", 7, 8),
        createStdPlanEntry("Hechos", 9, 11), createStdPlanEntry("Hechos", 12, 14), createStdPlanEntry("Hechos", 15, 16),
        createStdPlanEntry("Hechos", 17, 19), createStdPlanEntry("Hechos", 20, 21), createStdPlanEntry("Hechos", 22, 23),createStdPlanEntry("Hechos", 24, 26),
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
    const thematicSectionsContainer = document.getElementById('thematicSectionsContainer'); 
    const daysDelayedTextEl = document.getElementById('daysDelayedText');

    // NUEVO: Referencias a los nuevos botones de generación de calendario
    const generateMonthCalendarButton = document.getElementById('generateMonthCalendarButton');
    const generateYearCalendarButton = document.getElementById('generateYearCalendarButton');


    const monthlyProgressContainer = document.getElementById('monthlyProgressContainer');
    const annualProgressContainer = document.getElementById('annualProgressContainer');
    const streakTextEl = document.getElementById('streakText');
    const exportBackupButton = document.getElementById('exportBackupButton');
    const importBackupButton = document.getElementById('importBackupButton');
    const importBackupInput = document.getElementById('importBackupInput');

    let readStatus = {};
    let readDates = {}; // clave de capítulo -> 'AAAA-MM-DD' (fecha local en que se marcó)
    let chapterTimes = {}; // clave de capítulo -> ms del último cambio (marcar o desmarcar)
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

    const DAY_MS = 1000 * 3600 * 24;
    function localDateKey(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
    // Hoy (según el reloj local del dispositivo) representado como medianoche UTC, igual que planStartDate.
    function todayAsUTCDate() { const now = new Date(); return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())); }
    function utcDateKey(ms) { return new Date(ms).toISOString().slice(0, 10); }

    function setChapterRead(key, isRead) {
        if (isRead) { readStatus[key] = true; readDates[key] = localDateKey(); }
        else { delete readStatus[key]; delete readDates[key]; }
        chapterTimes[key] = Date.now(); // para la sincronización: gana el cambio más reciente
    }

    // Guarda la fecha de inicio (o la borra) recordando cuándo cambió, para sincronizar entre dispositivos.
    function storePlanStartDate(value) {
        if (value) localStorage.setItem('planStartDate', value); else localStorage.removeItem('planStartDate');
        localStorage.setItem('planStartDateUpdatedAt', String(Date.now()));
        document.dispatchEvent(new CustomEvent('lectura:changed'));
    }

    function loadState() {
        readStatus = {}; readDates = {}; chapterTimes = {}; awardedSectionsStatus = {};
        const savedReadStatus = localStorage.getItem('bibleReadStatus');
        if (savedReadStatus) { try { readStatus = JSON.parse(savedReadStatus); } catch (e) { console.error("Error parsing bibleReadStatus:", e); readStatus = {}; } }
        const savedReadDates = localStorage.getItem('bibleReadDates');
        if (savedReadDates) { try { readDates = JSON.parse(savedReadDates); } catch (e) { console.error("Error parsing bibleReadDates:", e); readDates = {}; } }
        const savedTimes = localStorage.getItem('syncChapterTimes');
        if (savedTimes) { try { chapterTimes = JSON.parse(savedTimes); } catch (e) { chapterTimes = {}; } }

        const savedPlanStartDate = localStorage.getItem('planStartDate');
        if (savedPlanStartDate && planStartDateInput) {
            planStartDateInput.value = savedPlanStartDate;
            try {
                const dateObj = new Date(savedPlanStartDate + "T00:00:00Z"); // Asegurar que se interpreta como UTC
                if (isNaN(dateObj.getTime())) throw new Error("Invalid date value");
                if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = `Empezó el ` +
                    dateObj.toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
            } catch (e) {
                console.error("Error parsing planStartDate:", e);
                if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Fecha de inicio guardada inválida. Por favor, reestablécela.";
                localStorage.removeItem('planStartDate');
            }
        } else {
            if (planStartDateInput) planStartDateInput.value = '';
            if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Elige la fecha de inicio";
        }
        const planPanel = document.getElementById('plan-management');
        if (planPanel) planPanel.open = !localStorage.getItem('planStartDate');

        const savedAwards = localStorage.getItem('awardedSectionsStatus');
        if (savedAwards) { try { awardedSectionsStatus = JSON.parse(savedAwards); } catch (e) { console.error("Error parsing awardedSectionsStatus:", e); awardedSectionsStatus = {}; } }
    }

    function saveState() {
        localStorage.setItem('bibleReadStatus', JSON.stringify(readStatus));
        localStorage.setItem('bibleReadDates', JSON.stringify(readDates));
        localStorage.setItem('awardedSectionsStatus', JSON.stringify(awardedSectionsStatus));
        localStorage.setItem('syncChapterTimes', JSON.stringify(chapterTimes));
        document.dispatchEvent(new CustomEvent('lectura:changed'));
    }

    function computeStreaks() {
        const days = new Set(Object.entries(readDates).filter(([key]) => readStatus[key]).map(([, day]) => day));
        if (days.size === 0) return { current: 0, best: 0 };
        let best = 0, run = 0, prev = null;
        [...days].sort().forEach(day => {
            const t = Date.parse(day + 'T00:00:00Z');
            run = (prev !== null && t - prev === DAY_MS) ? run + 1 : 1;
            best = Math.max(best, run);
            prev = t;
        });
        // La racha sigue viva si hoy o ayer hubo lectura.
        const today = todayAsUTCDate().getTime();
        let t = days.has(utcDateKey(today)) ? today : today - DAY_MS;
        let current = 0;
        while (days.has(utcDateKey(t))) { current++; t -= DAY_MS; }
        return { current, best, readToday: days.has(utcDateKey(today)) };
    }

    function updateStreakUI(streaks) {
        if (!streakTextEl) return;
        streakTextEl.textContent = streaks.current;
        const unitEl = document.getElementById('streakUnit');
        if (unitEl) unitEl.textContent = streaks.current === 1 ? 'día' : 'días';
        const block = streakTextEl.closest('.daily-suggestion__streak');
        if (block) block.title = `Mejor racha: ${streaks.best} día(s)`;
    }

    function renderPeriodRows(container, rows, emptyText) {
        container.innerHTML = '';
        if (rows.length === 0) {
            const p = document.createElement('p'); p.className = 'period-empty'; p.textContent = emptyText; container.appendChild(p); return;
        }
        const max = Math.max(1, ...rows.map(r => r.value));
        rows.forEach(r => {
            const row = document.createElement('div'); row.className = 'period-row';
            const head = document.createElement('div'); head.className = 'period-row__head';
            const label = document.createElement('span'); label.className = 'period-row__label'; label.textContent = r.label;
            const value = document.createElement('span'); value.className = 'period-row__value'; value.textContent = r.detail;
            head.append(label, value);
            const track = document.createElement('div'); track.className = 'period-row__track';
            const bar = document.createElement('div'); bar.className = 'period-row__bar'; bar.style.width = `${Math.round((r.value / max) * 100)}%`;
            track.appendChild(bar);
            row.append(head, track);
            container.appendChild(row);
        });
    }

    function renderProgressViews() {
        const byMonth = {}, byYear = {}, daysByMonth = {};
        let dated = 0;
        Object.entries(readDates).forEach(([key, day]) => {
            if (!readStatus[key] || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
            dated++;
            const month = day.slice(0, 7), year = day.slice(0, 4);
            byMonth[month] = (byMonth[month] || 0) + 1;
            byYear[year] = (byYear[year] || 0) + 1;
            (daysByMonth[month] = daysByMonth[month] || new Set()).add(day);
        });
        const readCount = Object.values(readStatus).filter(v => v === true).length;
        const undated = readCount - dated;
        const now = new Date();

        if (monthlyProgressContainer) {
            const rows = [];
            for (let i = 0; i < 6; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const chapters = byMonth[key] || 0;
                const days = daysByMonth[key] ? daysByMonth[key].size : 0;
                if (i > 0 && chapters === 0) continue;
                const monthName = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                const daysOf = i === 0 ? ` de ${now.getDate()}` : '';
                rows.push({ label: monthName.charAt(0).toUpperCase() + monthName.slice(1), value: chapters, detail: `${chapters} cap. · ${days}${daysOf} días` });
            }
            renderPeriodRows(monthlyProgressContainer, rows, 'Aún no hay lecturas registradas este mes.');
        }

        if (annualProgressContainer) {
            const currentYear = String(now.getFullYear());
            const years = new Set([currentYear, ...Object.keys(byYear)]);
            const rows = [...years].sort().reverse().map(year => {
                const chapters = byYear[year] || 0;
                const percent = Math.round((chapters / totalBibleChapters) * 100);
                return { label: year, value: chapters, detail: `${chapters} cap. · ${percent}% de la Biblia` };
            });
            renderPeriodRows(annualProgressContainer, rows, 'Aún no hay lecturas registradas.');
            if (undated > 0) {
                const note = document.createElement('p'); note.className = 'period-empty';
                note.textContent = `${undated} capítulo(s) marcados antes de que la app guardara fechas no aparecen aquí.`;
                annualProgressContainer.appendChild(note);
            }
        }
    }

    // Comunica un resumen del progreso (sin datos personales) a stats.js.
    function publishSummary(streaks) {
        const readCount = Object.values(readStatus).filter(v => v === true).length;
        document.dispatchEvent(new CustomEvent('lectura:summary', { detail: {
            chapters: readCount,
            plan: localStorage.getItem('planStartDate') ? 1 : 0,
            delay: calculateEffectiveDelay(),
            streak: streaks.current,
            bestStreak: streaks.best,
            readToday: !!streaks.readToday,
            awards: Object.values(awardedSectionsStatus).filter(v => v === true).length
        } }));
    }

    function announceChaptersRead(count) {
        if (count > 0) document.dispatchEvent(new CustomEvent('lectura:read', { detail: { count } }));
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
                notify(`🎉 ¡Felicidades! Has completado "${section.title}" y ganado el premio ${section.awardEmoji}`, { type: 'success', duration: 7000 });
            } else if (!isCompleted && wasPreviouslyAwarded) {
                awardedSectionsStatus[section.id] = false;
                stateChanged = true;
            }
        });
        if (stateChanged) saveState();
        renderThematicSections();
    }

    function renderThematicSections() {
        if (!thematicSectionsContainer) return; 
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
        publishToday();
    }

    // Para reminders.js: plan, fecha de inicio y si la lectura de hoy ya está hecha.
    function publishToday() {
        document.dispatchEvent(new CustomEvent('lectura:today', { detail: {
            start: localStorage.getItem('planStartDate'),
            plan: dailyReadingPlan.map(entry => entry.displayText),
            todayRead: window.currentSuggestedReading ? isDailyPlanEntryRead(window.currentSuggestedReading) : false,
            date: localDateKey()
        } }));
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
        const todayUTC = todayAsUTCDate();
        if (todayUTC < planStartDate) return 0;
        const elapsedDaysSinceStart = Math.floor((todayUTC.getTime() - planStartDate.getTime()) / DAY_MS);
        // Retraso = lecturas de días anteriores que siguen sin hacer. La de hoy aún está a tiempo.
        const pastDays = Math.min(elapsedDaysSinceStart, dailyReadingPlan.length);
        let pendingReadings = 0;
        for (let i = 0; i < pastDays; i++) {
            if (!isDailyPlanEntryRead(dailyReadingPlan[i])) pendingReadings++;
        }
        return pendingReadings;
    }

    function displayDailySuggestion() {
        if (currentDateTextEl) currentDateTextEl.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        const planStartDateString = localStorage.getItem('planStartDate');
        if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.innerHTML = ''; 
        if (dailySuggestionOnlineLinkEl) dailySuggestionOnlineLinkEl.style.display = 'none';
        if (markSuggestedAsReadButtonEl) markSuggestedAsReadButtonEl.style.display = 'none';
        if (addToCalendarButtonEl) addToCalendarButtonEl.style.display = 'none';
        if (jwAppSuggestionNoteEl) jwAppSuggestionNoteEl.style.display = 'none';
        window.currentSuggestedReading = null; window.todayUTC = null; window.dayOfPlan = 0;
        if (!planStartDateString) {
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "Elige en «Mi plan de lectura» la fecha en que empiezas y aquí verás la lectura de cada día.";
            window.dayDiff = 0; actualizarInterfazDiasRetraso(); return;
        }
        let planStartDate;
        try { planStartDate = new Date(planStartDateString + "T00:00:00Z"); if (isNaN(planStartDate.getTime())) throw new Error("Fecha de inicio inválida");
        } catch (e) {
            if (dailySuggestionMainTextEl) dailySuggestionMainTextEl.textContent = "Error en la fecha de inicio guardada. Por favor, reestablécela.";
            localStorage.removeItem('planStartDate'); window.dayDiff = 0; actualizarInterfazDiasRetraso(); return;
        }
        const todayDateUTC = todayAsUTCDate();
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
            progressBar.textContent = '';
            progressBar.setAttribute('aria-valuenow', readCount);
        }
        if (progressTextEl) progressTextEl.textContent = `${readCount} de ${totalBibleChapters} capítulos`;
        const ring = document.getElementById('progressRing');
        if (ring) ring.style.setProperty('--p', (readCount / totalBibleChapters * 100).toFixed(1));
        const percentEl = document.getElementById('progressPercent');
        if (percentEl) percentEl.textContent = `${percent}%`;
        const streaks = computeStreaks();
        updateStreakUI(streaks);
        renderProgressViews();
        publishSummary(streaks);
        if (typeof renderWeeklyReading === 'function') renderWeeklyReading();
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
            progressElement.textContent = `${readInBookCount}/${bookData.chapters}`;
            const section = document.getElementById(`book-section-${bookId}`);
            if (section) {
                section.style.setProperty('--book-p', `${percent}%`);
                section.classList.toggle('is-complete', percent === 100);
                section.classList.toggle('is-started', readInBookCount > 0 && percent < 100);
            }
        }
    }

    function toggleChapterRead(bookName, chapterNum) {
        const key = sanitizeKey(bookName, chapterNum);
        const nowRead = !readStatus[key];
        setChapterRead(key, nowRead);
        if (nowRead) { actualizarUltimaLectura(); announceChaptersRead(1); } else displayDailySuggestion();
        updateChapterButtonUI(bookName, chapterNum);
        saveState();
        updateOverallProgress();
        updateBookProgress(bookName);
        updateAllThematicSectionsStatus();
    }

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

        if (booksToRender.length === 0 && bibleBooksContainer) {
            bibleBooksContainer.innerHTML = '<p>No hay libros que coincidan con los filtros seleccionados.</p>';
            return;
        }

        const testamentTitles = { Antiguo: 'Escrituras Hebreo-arameas', Nuevo: 'Escrituras Griegas Cristianas' };
        let lastTestament = null;
        booksToRender.forEach(book => {
            if (filterBookName === 'todos' && book.testament !== lastTestament) {
                lastTestament = book.testament;
                const heading = document.createElement('h3');
                heading.className = 'books__group';
                heading.textContent = testamentTitles[book.testament] || book.testament;
                bibleBooksContainer.appendChild(heading);
            }
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
            if (!dateValue || !dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) { notify("Por favor, introduce una fecha válida en formato AAAA-MM-DD."); return; }
            storePlanStartDate(dateValue); loadState(); displayDailySuggestion(); notify("Fecha de inicio del plan establecida correctamente.");
        });
    }

    if (syncPlanButton && syncReadingSelect && planStartDateInput) {
        syncPlanButton.addEventListener('click', () => {
            const selectedReadingIndex = parseInt(syncReadingSelect.value);
            if (isNaN(selectedReadingIndex) || selectedReadingIndex < 0 || selectedReadingIndex >= dailyReadingPlan.length) { notify("Por favor, selecciona una lectura válida del plan para sincronizar."); return; }
            const today = new Date();
            const todayUTC = todayAsUTCDate();
            const newStartDateUTC = new Date(todayUTC);
            newStartDateUTC.setUTCDate(todayUTC.getUTCDate() - selectedReadingIndex);
            const newStartDateString = newStartDateUTC.toISOString().split('T')[0];
            storePlanStartDate(newStartDateString);
            if (planStartDateInput) planStartDateInput.value = newStartDateString; 
            loadState(); displayDailySuggestion(); notify(`Plan sincronizado. Hoy (${today.toLocaleDateString()}) es el Día ${selectedReadingIndex + 1} del plan.`);
        });
    }

    function markChaptersForBook(bookName, startChapter, endChapter) {
        let chaptersMarked = 0;
        const bookData = normalizedBibleBooks.find(b => b.name === bookName);
        if (!bookData) { console.warn(`Libro "${bookName}" no encontrado al intentar marcar capítulos.`); return 0; }
        for (let i = startChapter; i <= endChapter; i++) {
            if (i >= 1 && i <= bookData.chapters) {
                const key = sanitizeKey(bookName, i);
                if (!readStatus[key]) { setChapterRead(key, true); updateChapterButtonUI(bookName, i); chaptersMarked++; }
            } else { console.warn(`Capítulo ${i} fuera de rango para el libro ${bookName}.`); }
        }
        if (chaptersMarked) updateBookProgress(bookName);
        return chaptersMarked;
    }

    if (markSuggestedAsReadButtonEl) {
        markSuggestedAsReadButtonEl.addEventListener('click', () => {
            if (!window.currentSuggestedReading) { notify("No hay sugerencia de lectura actual para marcar."); return; }
            let markedCount = 0; const { displayText } = window.currentSuggestedReading;
            const readingParts = displayText.split(',').map(part => part.trim());
            const regex = /([\w\s\dÁÉÍÓÚáéíóúÑñ]+?)\s*(\d+)(?:-(\d+))?(?:\s*\(.*v\.\s*\d+(?:-\d+)?\))?/;
            readingParts.forEach(partStr => {
                const match = partStr.match(regex);
                if (match) {
                    const bookName = match[1].trim(); const startChapter = parseInt(match[2]); const endChapter = match[3] ? parseInt(match[3]) : startChapter;
                    const actualBook = normalizedBibleBooks.find(b => b.name === bookName);
                    if (actualBook) { markedCount += markChaptersForBook(actualBook.name, startChapter, endChapter); }
                    else { console.warn(`Libro "${bookName}" no encontrado al procesar: "${partStr}"`); }
                } else {
                    if (window.currentSuggestedReading.book && window.currentSuggestedReading.startChapter && window.currentSuggestedReading.endChapter) {
                        const bookNameFallback = window.currentSuggestedReading.book.match(/([\w\s\dÁÉÍÓÚáéíóúÑñ]+)/);
                        if (bookNameFallback) {
                            const actualBookFallback = normalizedBibleBooks.find(b => b.name === bookNameFallback[1].trim());
                            if (actualBookFallback) { markedCount += markChaptersForBook(actualBookFallback.name, window.currentSuggestedReading.startChapter, window.currentSuggestedReading.endChapter); }
                            else console.warn(`Libro (fallback) "${bookNameFallback[1].trim()}" no hallado.`);
                        } else console.warn(`Formato de libro (fallback) no reconocido: "${window.currentSuggestedReading.book}"`);
                    } else console.warn(`Formato de lectura no reconocido para marcar: "${partStr}" y no hay fallback.`);
                }
            });
            if (markedCount > 0) {
                saveState(); actualizarUltimaLectura(); updateOverallProgress(); updateAllThematicSectionsStatus();
                announceChaptersRead(markedCount);
                notify(`✅ ${displayText} marcado como leído`, { type: 'success' });
            }
            else { notify(`Los capítulos de la lectura sugerida "${displayText}" ya estaban marcados.`); actualizarUltimaLectura(); }
        });
    }
    
    // MODIFICADO: Reemplazo de la función downloadICS original
    function downloadICS(eventDetails, filename = 'LecturaBiblica.ics') {
        let eventsArray = Array.isArray(eventDetails) ? eventDetails : [eventDetails];
        let icsContent = generateICSContent(eventsArray);
        downloadFile(filename, icsContent);
    }
    
    // NUEVA: Función para generar el contenido de un archivo .ics para múltiples eventos
    function generateICSContent(events) {
        const calHeader = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//mycongre.com//Lectura diaria de la Biblia//ES",
            "CALSCALE:GREGORIAN"
        ];
        const calFooter = ["END:VCALENDAR"];
        let eventStrings = [];

        events.forEach(event => {
            const uid = `planbiblico-${Date.now()}-${Math.random().toString(36).substring(2, 15)}@mylectura.mycongre.com`;
            const dtstamp = new Date().toISOString().replace(/[-:.]/g, "").substring(0, 15) + "Z";
            
            // Formato YYYYMMDD para fechas de día completo
            const formatDate = (date) => {
                return date.getUTCFullYear() + 
                       ('0' + (date.getUTCMonth() + 1)).slice(-2) + 
                       ('0' + date.getUTCDate()).slice(-2);
            };

            let eventLines = [
                "BEGIN:VEVENT",
                `UID:${uid}`,
                `DTSTAMP:${dtstamp}`,
                `SUMMARY:${event.title.replace(/,/g, '\\,')}`, // Escapar comas
            ];

            if (event.isAllDay) {
                eventLines.push(`DTSTART;VALUE=DATE:${formatDate(event.startDate)}`);
                const endDatePlusOne = new Date(event.endDate); // endDate para DTEND es exclusivo
                endDatePlusOne.setUTCDate(endDatePlusOne.getUTCDate() + 1);
                eventLines.push(`DTEND;VALUE=DATE:${formatDate(endDatePlusOne)}`);
            } else {
                // Para eventos con hora específica (no usado aquí pero podría ser útil)
                eventLines.push(`DTSTART:${event.startDate.toISOString().replace(/[-:.]/g, "").substring(0, 15) + "Z"}`);
                eventLines.push(`DTEND:${event.endDate.toISOString().replace(/[-:.]/g, "").substring(0, 15) + "Z"}`);
            }
            
            if (event.description) {
                eventLines.push(`DESCRIPTION:${event.description.replace(/,/g, '\\,').replace(/\n/g, '\\n')}`); // Escapar comas y saltos de línea
            }
            eventLines.push("END:VEVENT");
            eventStrings.push(eventLines.join("\r\n"));
        });

        return calHeader.join("\r\n") + "\r\n" + eventStrings.join("\r\n") + "\r\n" + calFooter.join("\r\n");
    }

    // NUEVA: Función para descargar un archivo
    function downloadFile(filename, content, mimeType = 'text/calendar;charset=utf-8') {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // NUEVA: Lógica para generar eventos de calendario para un período
    function generateCalendarEventsForPeriod(numberOfDays, filenameSuffix) {
        const planStartDateString = localStorage.getItem('planStartDate');
        if (!planStartDateString) {
            notify("Por favor, establece primero una fecha de inicio para el plan de lectura.");
            return;
        }

        let baseStartDate;
        try {
            // Aseguramos que la fecha se interpreta como UTC para evitar problemas de zona horaria
            baseStartDate = new Date(planStartDateString + 'T00:00:00Z');
            if (isNaN(baseStartDate.getTime())) throw new Error("Fecha inválida");
        } catch (e) {
            notify("La fecha de inicio del plan guardada no es válida. Por favor, reestablécela.");
            return;
        }

        const eventsForCalendar = [];
        for (let i = 0; i < numberOfDays && i < dailyReadingPlan.length; i++) {
            const planEntry = dailyReadingPlan[i];
            const eventDate = new Date(baseStartDate.valueOf());
            eventDate.setUTCDate(baseStartDate.getUTCDate() + i); // Sumamos días en UTC

            const title = `Lectura Día ${i + 1}: ${planEntry.displayText}`;
            const description = `Plan de Lectura Bíblica.\nLectura: ${planEntry.displayText}\nEnlace: ${planEntry.url || 'No disponible'}`;
            
            eventsForCalendar.push({
                title: title,
                description: description,
                startDate: new Date(eventDate.valueOf()), // Clonar la fecha
                endDate: new Date(eventDate.valueOf()),   // Clonar la fecha, para DTEND es startDate
                isAllDay: true
            });
        }

        if (eventsForCalendar.length > 0) {
            const filename = `PlanLecturaBiblica_${filenameSuffix}.ics`;
            downloadICS(eventsForCalendar, filename);
        } else {
            notify("No hay lecturas en el plan para generar el calendario o la duración solicitada es cero.");
        }
    }


    if (addToCalendarButtonEl) {
        addToCalendarButtonEl.onclick = () => { 
            if (!window.currentSuggestedReading || !window.todayUTC) { notify("No hay sugerencia de lectura o fecha para agregar al calendario."); return; }
            // La función downloadICS ahora maneja la generación y descarga
            const title = `Lectura Bíblica Día ${window.dayOfPlan}: ${window.currentSuggestedReading.displayText}`;
            const description = `Leer según el plan: ${window.currentSuggestedReading.displayText}. Enlace: ${window.currentSuggestedReading.url || 'N/A'}`;
            const startDate = new Date(window.todayUTC.valueOf()); 
            // Para un evento de día completo, endDate suele ser el mismo día o el inicio del siguiente día.
            // Para DTEND con VALUE=DATE, el final es exclusivo, por lo que el mismo día es correcto.
            const endDate = new Date(window.todayUTC.valueOf()); 
            downloadICS({ title: title, description: description, startDate: startDate, endDate: endDate, isAllDay: true });
        };
    }
    
    // NUEVO: Event Listeners para los botones de generar calendario mensual/anual
    if (generateMonthCalendarButton) {
        generateMonthCalendarButton.addEventListener('click', () => {
            // Usamos 30 días como aproximación para un mes.
            // Se podría calcular el número exacto de días del mes si se quiere más precisión.
            generateCalendarEventsForPeriod(30, 'Mes'); 
        });
    }

    if (generateYearCalendarButton) {
        generateYearCalendarButton.addEventListener('click', () => {
            // Usamos 365 días. El plan de lectura tiene menos, así que se limitará a la longitud del plan.
            generateCalendarEventsForPeriod(365, 'Anual'); 
        });
    }


    if (resetProgressButton) {
        resetProgressButton.addEventListener('click', () => {
            if (!confirm('¿Estás seguro de que quieres reiniciar todo tu progreso, incluyendo la fecha de inicio del plan y las secciones temáticas? Esta acción no se puede deshacer.')) return;
            // Se deja constancia de cada capítulo desmarcado para que la sincronización no lo recupere.
            Object.keys(readStatus).forEach(key => { chapterTimes[key] = Date.now(); });
            readStatus = {}; readDates = {}; awardedSectionsStatus = {}; newlyAwardedSections.clear();
            localStorage.removeItem('bibleReadStatus'); localStorage.removeItem('bibleReadDates'); localStorage.removeItem('awardedSectionsStatus');
            storePlanStartDate(''); localStorage.removeItem('lastReadingDate');
            if (planStartDateInput) planStartDateInput.value = "";
            if (currentPlanStartDateTextEl) currentPlanStartDateTextEl.textContent = "Elige la fecha de inicio";
            saveState(); 
            renderBooks(bookFilter ? bookFilter.value : 'todos', statusFilter ? statusFilter.value : 'todos');
            updateOverallProgress(); updateAllThematicSectionsStatus(); 
            window.currentSuggestedReading = null; window.dayDiff = 0; window.dayOfPlan = 0;
            displayDailySuggestion(); 
            notify("Todo el progreso, la fecha de inicio del plan y los premios han sido reiniciados.");
        });
    }

    // Copia de seguridad: el progreso vive solo en este navegador, así que permitimos exportarlo e importarlo.
    const BACKUP_KEYS = ['bibleReadStatus', 'bibleReadDates', 'syncChapterTimes', 'awardedSectionsStatus', 'planStartDate', 'planStartDateUpdatedAt', 'lastReadingDate', 'theme-primary', 'theme-accent'];

    if (exportBackupButton) {
        exportBackupButton.addEventListener('click', () => {
            const data = {};
            BACKUP_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v !== null) data[k] = v; });
            const backup = { app: 'lectura-diaria', version: 1, exportedAt: new Date().toISOString(), data };
            downloadFile(`lectura-diaria-copia-${localDateKey()}.json`, JSON.stringify(backup, null, 2), 'application/json');
            notify('Copia descargada. Guárdala en un lugar seguro.', { type: 'success' });
        });
    }

    if (importBackupButton && importBackupInput) {
        importBackupButton.addEventListener('click', () => importBackupInput.click());
        importBackupInput.addEventListener('change', async () => {
            const file = importBackupInput.files && importBackupInput.files[0];
            importBackupInput.value = '';
            if (!file) return;
            try {
                const backup = JSON.parse(await file.text());
                if (!backup || backup.app !== 'lectura-diaria' || typeof backup.data !== 'object') throw new Error('Formato no válido');
                if (!confirm('¿Restaurar esta copia? Se reemplazará el progreso actual de este dispositivo.')) return;
                BACKUP_KEYS.forEach(k => {
                    const v = backup.data[k];
                    if (typeof v === 'string') localStorage.setItem(k, v); else localStorage.removeItem(k);
                });
                notify('Copia restaurada. Recargando…', { type: 'success' });
                setTimeout(() => location.reload(), 800);
            } catch (e) {
                console.error('Error al importar copia:', e);
                notify('No se pudo leer el archivo. Asegúrate de que es una copia de esta app.', { type: 'error' });
            }
        });
    }

    // ---- Lectura de la semana (reunión Vida y Ministerio) ----
    const WEEKLY_CACHE_KEY = 'weeklyReading';
    const weeklyEls = {
        card: document.getElementById('weeklyReadingCard'),
        range: document.getElementById('weeklyRange'),
        text: document.getElementById('weeklyReadingText'),
        badge: document.getElementById('weeklyDoneBadge'),
        link: document.getElementById('weeklyReadingLink'),
        guide: document.getElementById('weeklyGuideLink'),
        mark: document.getElementById('weeklyMarkButton')
    };
    let weeklyReading = null; // { week, title, reading, guideUrl, parts: [{ book, start, end }] }

    // Semana ISO (lunes a domingo), igual que la usa el servidor: "2026-40".
    function isoWeekKey(d = new Date()) {
        const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
        const week = Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / DAY_MS + 1) / 7);
        return `${t.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
    }

    const simplifyName = str => str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

    // "JEREMÍAS 38, 39" · "JEREMÍAS 42-44" · "1 CRÓNICAS 1-4" · "ABDÍAS; JONÁS 1-4"
    function parseWeeklyReading(raw) {
        const parts = [];
        String(raw || '').split(';').map(p => p.trim()).filter(Boolean).forEach(part => {
            const m = part.match(/^((?:\d\s*)?[^\d]+?)\s*([\d][\d\s,\-–]*)?$/);
            if (!m) return;
            const book = normalizedBibleBooks.find(b => simplifyName(b.name) === simplifyName(m[1]));
            if (!book) return;
            const nums = m[2] ? m[2].match(/\d+/g).map(Number) : [1, book.chapters];
            const start = Math.max(1, Math.min(...nums));
            const end = Math.min(book.chapters, Math.max(...nums));
            parts.push({ book: book.name, start, end });
        });
        return parts;
    }

    const formatReadingParts = parts => parts.map(p => `${p.book} ${p.start === p.end ? p.start : `${p.start}-${p.end}`}`).join(', ');

    function weeklyReadingUrl(parts) {
        const code = name => String(normalizedBibleBooks.findIndex(b => b.name === name) + 1).padStart(2, '0');
        const first = parts[0], last = parts[parts.length - 1];
        return `https://www.jw.org/finder?wtlocale=S&bible=${code(first.book)}${padChapterOrVerse(first.start)}001-${code(last.book)}${padChapterOrVerse(last.end)}999`;
    }

    function isWeeklyReadingDone(parts) {
        return parts.every(p => {
            for (let c = p.start; c <= p.end; c++) if (!readStatus[sanitizeKey(p.book, c)]) return false;
            return true;
        });
    }

    function renderWeeklyReading() {
        if (!weeklyEls.card) return;
        if (!weeklyReading || weeklyReading.parts.length === 0) { weeklyEls.card.hidden = true; return; }
        const { parts, title, guideUrl } = weeklyReading;
        const done = isWeeklyReadingDone(parts);
        weeklyEls.card.hidden = false;
        weeklyEls.range.textContent = title ? title.toLowerCase() : '';
        weeklyEls.text.textContent = formatReadingParts(parts);
        weeklyEls.link.href = weeklyReadingUrl(parts);
        weeklyEls.guide.hidden = !guideUrl;
        if (guideUrl) weeklyEls.guide.href = guideUrl;
        weeklyEls.badge.hidden = !done;
        weeklyEls.mark.hidden = done;
        weeklyEls.card.classList.toggle('is-read', done);
    }

    function applyWeeklyReading(data) {
        weeklyReading = data && data.reading ? { ...data, parts: parseWeeklyReading(data.reading) } : null;
        renderWeeklyReading();
    }

    // Se pide al servidor una vez por semana; después se usa la copia guardada (también sin conexión).
    async function loadWeeklyReading() {
        const week = isoWeekKey();
        let cached = null;
        try { cached = JSON.parse(localStorage.getItem(WEEKLY_CACHE_KEY)); } catch (e) { cached = null; }
        if (cached && cached.week === week) { applyWeeklyReading(cached); return; }
        try {
            const res = await fetch(`api/weekly.php?date=${localDateKey()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.reading) localStorage.setItem(WEEKLY_CACHE_KEY, JSON.stringify(data)); // una semana vacía se vuelve a consultar
            applyWeeklyReading(data);
        } catch (e) {
            console.warn('Lectura de la semana no disponible:', e);
            applyWeeklyReading(null); // nunca mostrar la lectura de otra semana
        }
    }

    if (weeklyEls.mark) {
        weeklyEls.mark.addEventListener('click', () => {
            if (!weeklyReading) return;
            let marked = 0;
            weeklyReading.parts.forEach(p => { marked += markChaptersForBook(p.book, p.start, p.end); });
            if (marked > 0) {
                saveState(); actualizarUltimaLectura(); updateOverallProgress(); updateAllThematicSectionsStatus();
                announceChaptersRead(marked);
            }
            notify(`✅ ${formatReadingParts(weeklyReading.parts)} marcada como leída`, { type: 'success' });
        });
    }

    // Al volver a la app (p. ej. el lunes siguiente) se comprueba si cambió la semana.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && (!weeklyReading || weeklyReading.week !== isoWeekKey())) loadWeeklyReading();
    });

    // sync.js llama a esto tras traer cambios de otro dispositivo.
    window.lecturaApp = {
        reload() {
            loadState();
            renderBooks(bookFilter ? bookFilter.value : 'todos', statusFilter ? statusFilter.value : 'todos');
            updateOverallProgress();
            updateAllThematicSectionsStatus();
            displayDailySuggestion();
        }
    };

    loadState();
    populateFiltersAndSyncOptions();
    renderBooks(); 
    updateOverallProgress();
    updateAllThematicSectionsStatus(); 
    displayDailySuggestion(); 
    loadWeeklyReading();
});
