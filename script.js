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
        // Si no hay 'lastReadingDate', se considera 0 días de retraso desde la última marca,
        // ya que nunca se ha marcado nada. Podrías cambiarlo a "N/A" o
        // calcular desde planStartDate si prefieres "retraso del plan".
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
        name: book.name.replace(/\u00A0/g, ' ') 
    }));

    const dailyReadingPlan = [
      { "book": "Génesis", "startChapter": 1,  "endChapter": 3,  "displayText": "Génesis 1-3"   },
      { "book": "Génesis", "startChapter": 4,  "endChapter": 7,  "displayText": "Génesis 4-7"   },
      { "book": "Génesis", "startChapter": 8,  "endChapter": 11, "displayText": "Génesis 8-11"  },
      { "book": "Génesis", "startChapter": 12, "endChapter": 15, "displayText": "Génesis 12-15" },
      { "book": "Génesis", "startChapter": 16, "endChapter": 18, "displayText": "Génesis 16-18" },
      { "book": "Génesis", "startChapter": 19, "endChapter": 22, "displayText": "Génesis 19-22" },
      { "book": "Génesis", "startChapter": 23, "endChapter": 24, "displayText": "Génesis 23-24" },
      { "book": "Génesis", "startChapter": 25, "endChapter": 27, "displayText": "Génesis 25-27" },
      { "book": "Génesis", "startChapter": 28, "endChapter": 30, "displayText": "Génesis 28-30" },
      { "book": "Génesis", "startChapter": 31, "endChapter": 32, "displayText": "Génesis 31-32" },
      { "book": "Génesis", "startChapter": 33, "endChapter": 34, "displayText": "Génesis 33-34" },
      { "book": "Génesis", "startChapter": 35, "endChapter": 37, "displayText": "Génesis 35-37" },
      { "book": "Génesis", "startChapter": 38, "endChapter": 40, "displayText": "Génesis 38-40" },
      { "book": "Génesis", "startChapter": 41, "endChapter": 42, "displayText": "Génesis 41-42" },
      { "book": "Génesis", "startChapter": 43, "endChapter": 45, "displayText": "Génesis 43-45" },
      { "book": "Génesis", "startChapter": 46, "endChapter": 48, "displayText": "Génesis 46-48" },
      { "book": "Génesis", "startChapter": 49, "endChapter": 50, "displayText": "Génesis 49-50" },
      { "book": "Éxodo",    "startChapter": 1,  "endChapter": 4,  "displayText": "Éxodo 1-4"   },
      { "book": "Éxodo",    "startChapter": 5,  "endChapter": 7,  "displayText": "Éxodo 5-7"   },
      { "book": "Éxodo",    "startChapter": 8,  "endChapter": 10, "displayText": "Éxodo 8-10"  },
      { "book": "Éxodo",    "startChapter": 11, "endChapter": 13, "displayText": "Éxodo 11-13" },
      { "book": "Éxodo",    "startChapter": 14, "endChapter": 15, "displayText": "Éxodo 14-15" },
      { "book": "Éxodo",    "startChapter": 16, "endChapter": 18, "displayText": "Éxodo 16-18" },
      { "book": "Éxodo",    "startChapter": 19, "endChapter": 21, "displayText": "Éxodo 19-21" },
      { "book": "Éxodo",    "startChapter": 22, "endChapter": 25, "displayText": "Éxodo 22-25" },
      { "book": "Éxodo",    "startChapter": 26, "endChapter": 28, "displayText": "Éxodo 26-28" },
      { "book": "Éxodo",    "startChapter": 29, "endChapter": 30, "displayText": "Éxodo 29-30" },
      { "book": "Éxodo",    "startChapter": 31, "endChapter": 33, "displayText": "Éxodo 31-33" },
      { "book": "Éxodo",    "startChapter": 34, "endChapter": 35, "displayText": "Éxodo 34-35" },
      { "book": "Éxodo",    "startChapter": 36, "endChapter": 38, "displayText": "Éxodo 36-38" },
      { "book": "Éxodo",    "startChapter": 39, "endChapter": 40, "displayText": "Éxodo 39-40" },
      { "book": "Levítico", "startChapter": 1,  "endChapter": 4,  "displayText": "Levítico 1-4"  },
      { "book": "Levítico", "startChapter": 5,  "endChapter": 7,  "displayText": "Levítico 5-7"  },
      { "book": "Levítico", "startChapter": 8,  "endChapter": 10, "displayText": "Levítico 8-10" },
      { "book": "Levítico", "startChapter": 11, "endChapter": 13, "displayText": "Levítico 11-13"},
      { "book": "Levítico", "startChapter": 14, "endChapter": 15, "displayText": "Levítico 14-15"},
      { "book": "Levítico", "startChapter": 16, "endChapter": 18, "displayText": "Levítico 16-18"},
      { "book": "Levítico", "startChapter": 19, "endChapter": 21, "displayText": "Levítico 19-21"},
      { "book": "Levítico", "startChapter": 22, "endChapter": 23, "displayText": "Levítico 22-23"},
      { "book": "Levítico", "startChapter": 24, "endChapter": 25, "displayText": "Levítico 24-25"},
      { "book": "Levítico", "startChapter": 26, "endChapter": 27, "displayText": "Levítico 26-27"},
      { "book": "Números",  "startChapter": 1,  "endChapter": 3,  "displayText": "Números 1-3" },
      { "book": "Números",  "startChapter": 4,  "endChapter": 6,  "displayText": "Números 4-6" },
      { "book": "Números",  "startChapter": 7,  "endChapter": 9,  "displayText": "Números 7-9" },
      { "book": "Números",  "startChapter": 10, "endChapter": 12, "displayText": "Números 10-12"},
      { "book": "Números",  "startChapter": 13, "endChapter": 15, "displayText": "Números 13-15"},
      { "book": "Números",  "startChapter": 16, "endChapter": 18, "displayText": "Números 16-18"},
      { "book": "Números",  "startChapter": 19, "endChapter": 21, "displayText": "Números 19-21"},
      { "book": "Números",  "startChapter": 22, "endChapter": 24, "displayText": "Números 22-24"},
      { "book": "Números",  "startChapter": 25, "endChapter": 27, "displayText": "Números 25-27"},
      { "book": "Números",  "startChapter": 28, "endChapter": 30, "displayText": "Números 28-30"},
      { "book": "Números",  "startChapter": 31, "endChapter": 32, "displayText": "Números 31-32"},
      { "book": "Números",  "startChapter": 33, "endChapter": 36, "displayText": "Números 33-36"},
      { "book": "Deuteronomio", "startChapter": 1,  "endChapter": 2,  "displayText": "Deuteronomio 1-2" },
      { "book": "Deuteronomio", "startChapter": 3,  "endChapter": 4,  "displayText": "Deuteronomio 3-4" },
      { "book": "Deuteronomio", "startChapter": 5,  "endChapter": 7,  "displayText": "Deuteronomio 5-7" },
      { "book": "Deuteronomio", "startChapter": 8,  "endChapter": 10, "displayText": "Deuteronomio 8-10"},
      { "book": "Deuteronomio", "startChapter": 11, "endChapter": 13, "displayText": "Deuteronomio 11-13"},
      { "book": "Deuteronomio", "startChapter": 14, "endChapter": 16, "displayText": "Deuteronomio 14-16"},
      { "book": "Deuteronomio", "startChapter": 17, "endChapter": 19, "displayText": "Deuteronomio 17-19"},
      { "book": "Deuteronomio", "startChapter": 20, "endChapter": 22, "displayText": "Deuteronomio 20-22"},
      { "book": "Deuteronomio", "startChapter": 23, "endChapter": 26, "displayText": "Deuteronomio 23-26"},
      { "book": "Deuteronomio", "startChapter": 27, "endChapter": 28, "displayText": "Deuteronomio 27-28"},
      { "book": "Deuteronomio", "startChapter": 29, "endChapter": 31, "displayText": "Deuteronomio 29-31"},
      { "book": "Deuteronomio", "startChapter": 32, "endChapter": 32, "displayText": "Deuteronomio 32"    },
      { "book": "Deuteronomio", "startChapter": 33, "endChapter": 34, "displayText": "Deuteronomio 33-34"},
      { "book": "Josué",      "startChapter": 1,  "endChapter": 4,  "displayText": "Josué 1-4"   },
      { "book": "Josué",      "startChapter": 5,  "endChapter": 7,  "displayText": "Josué 5-7"   },
      { "book": "Josué",      "startChapter": 8,  "endChapter": 9,  "displayText": "Josué 8-9"   },
      { "book": "Josué",      "startChapter": 10, "endChapter": 12, "displayText": "Josué 10-12"},
      { "book": "Josué",      "startChapter": 13, "endChapter": 15, "displayText": "Josué 13-15"},
      { "book": "Josué",      "startChapter": 16, "endChapter": 18, "displayText": "Josué 16-18"},
      { "book": "Josué",      "startChapter": 19, "endChapter": 21, "displayText": "Josué 19-21"},
      { "book": "Josué",      "startChapter": 22, "endChapter": 24, "displayText": "Josué 22-24"},
      { "book": "Jueces",     "startChapter": 1,  "endChapter": 2,  "displayText": "Jueces 1-2"   },
      { "book": "Jueces",     "startChapter": 3,  "endChapter": 5,  "displayText": "Jueces 3-5"   },
      { "book": "Jueces",     "startChapter": 6,  "endChapter": 7,  "displayText": "Jueces 6-7"   },
      { "book": "Jueces",     "startChapter": 8,  "endChapter": 9,  "displayText": "Jueces 8-9"   },
      { "book": "Jueces",     "startChapter": 10, "endChapter": 11, "displayText": "Jueces 10-11"},
      { "book": "Jueces",     "startChapter": 12, "endChapter": 13, "displayText": "Jueces 12-13"},
      { "book": "Jueces",     "startChapter": 14, "endChapter": 16, "displayText": "Jueces 14-16"},
      { "book": "Jueces",     "startChapter": 17, "endChapter": 19, "displayText": "Jueces 17-19"},
      { "book": "Jueces",     "startChapter": 20, "endChapter": 21, "displayText": "Jueces 20-21"},
      { "book": "Rut",        "startChapter": 1,  "endChapter": 4,  "displayText": "Rut 1-4"      },
      { "book": "1 Samuel",   "startChapter": 1,  "endChapter": 2,  "displayText": "1 Samuel 1-2" }, 
      { "book": "1 Samuel",   "startChapter": 3,  "endChapter": 6,  "displayText": "1 Samuel 3-6" }, 
      { "book": "1 Samuel",   "startChapter": 7,  "endChapter": 9,  "displayText": "1 Samuel 7-9" }, 
      { "book": "1 Samuel",   "startChapter": 10, "endChapter": 12, "displayText": "1 Samuel 10-12"},
      { "book": "1 Samuel",   "startChapter": 13, "endChapter": 14, "displayText": "1 Samuel 13-14"},
      { "book": "1 Samuel",   "startChapter": 15, "endChapter": 16, "displayText": "1 Samuel 15-16"},
      { "book": "1 Samuel",   "startChapter": 17, "endChapter": 18, "displayText": "1 Samuel 17-18"},
      { "book": "1 Samuel",   "startChapter": 19, "endChapter": 21, "displayText": "1 Samuel 19-21"},
      { "book": "1 Samuel",   "startChapter": 22, "endChapter": 24, "displayText": "1 Samuel 22-24"},
      { "book": "1 Samuel",   "startChapter": 25, "endChapter": 27, "displayText": "1 Samuel 25-27"},
      { "book": "1 Samuel",   "startChapter": 28, "endChapter": 31, "displayText": "1 Samuel 28-31"},
      { "book": "2 Samuel",   "startChapter": 1,  "endChapter": 2,  "displayText": "2 Samuel 1-2" }, 
      { "book": "2 Samuel",   "startChapter": 3,  "endChapter": 5,  "displayText": "2 Samuel 3-5" }, 
      { "book": "2 Samuel",   "startChapter": 6,  "endChapter": 8,  "displayText": "2 Samuel 6-8" }, 
      { "book": "2 Samuel",   "startChapter": 9,  "endChapter": 12, "displayText": "2 Samuel 9-12"}, 
      { "book": "2 Samuel",   "startChapter": 13, "endChapter": 14, "displayText": "2 Samuel 13-14"},
      { "book": "2 Samuel",   "startChapter": 15, "endChapter": 16, "displayText": "2 Samuel 15-16"},
      { "book": "2 Samuel",   "startChapter": 17, "endChapter": 18, "displayText": "2 Samuel 17-18"},
      { "book": "2 Samuel",   "startChapter": 19, "endChapter": 20, "displayText": "2 Samuel 19-20"},
      { "book": "2 Samuel",   "startChapter": 21, "endChapter": 22, "displayText": "2 Samuel 21-22"},
      { "book": "2 Samuel",   "startChapter": 23, "endChapter": 24, "displayText": "2 Samuel 23-24"},
      { "book": "1 Reyes",    "startChapter": 1,  "endChapter": 2,  "displayText": "1 Reyes 1-2"  },  
      { "book": "1 Reyes",    "startChapter": 3,  "endChapter": 5,  "displayText": "1 Reyes 3-5"  },  
      { "book": "1 Reyes",    "startChapter": 6,  "endChapter": 7,  "displayText": "1 Reyes 6-7"  },  
      { "book": "1 Reyes",    "startChapter": 8,  "endChapter": 8,  "displayText": "1 Reyes 8"    },  
      { "book": "1 Reyes",    "startChapter": 9,  "endChapter": 10, "displayText": "1 Reyes 9-10" }, 
      { "book": "1 Reyes",    "startChapter": 11, "endChapter": 12, "displayText": "1 Reyes 11-12"}, 
      { "book": "1 Reyes",    "startChapter": 13, "endChapter": 14, "displayText": "1 Reyes 13-14"}, 
      { "book": "1 Reyes",    "startChapter": 15, "endChapter": 17, "displayText": "1 Reyes 15-17"}, 
      { "book": "1 Reyes",    "startChapter": 18, "endChapter": 19, "displayText": "1 Reyes 18-19"}, 
      { "book": "1 Reyes",    "startChapter": 20, "endChapter": 21, "displayText": "1 Reyes 20-21"}, 
      { "book": "1 Reyes",    "startChapter": 22, "endChapter": 22, "displayText": "1 Reyes 22"   }, 
      { "book": "2 Reyes",    "startChapter": 1,  "endChapter": 3,  "displayText": "2 Reyes 1-3"  },  
      { "book": "2 Reyes",    "startChapter": 4,  "endChapter": 5,  "displayText": "2 Reyes 4-5"  },  
      { "book": "2 Reyes",    "startChapter": 6,  "endChapter": 8,  "displayText": "2 Reyes 6-8"  },  
      { "book": "2 Reyes",    "startChapter": 9,  "endChapter": 10, "displayText": "2 Reyes 9-10" }, 
      { "book": "2 Reyes",    "startChapter": 11, "endChapter": 13, "displayText": "2 Reyes 11-13"}, 
      { "book": "2 Reyes",    "startChapter": 14, "endChapter": 15, "displayText": "2 Reyes 14-15"}, 
      { "book": "2 Reyes",    "startChapter": 16, "endChapter": 17, "displayText": "2 Reyes 16-17"}, 
      { "book": "2 Reyes",    "startChapter": 18, "endChapter": 19, "displayText": "2 Reyes 18-19"}, 
      { "book": "2 Reyes",    "startChapter": 20, "endChapter": 22, "displayText": "2 Reyes 20-22"}, 
      { "book": "2 Reyes",    "startChapter": 23, "endChapter": 25, "displayText": "2 Reyes 23-25"}, 
      { "book": "1 Crónicas","startChapter": 1,  "endChapter": 2,  "displayText": "1 Crónicas 1-2" },
      { "book": "1 Crónicas","startChapter": 3,  "endChapter": 5,  "displayText": "1 Crónicas 3-5" },
      { "book": "1 Crónicas","startChapter": 6,  "endChapter": 7,  "displayText": "1 Crónicas 6-7" },
      { "book": "1 Crónicas","startChapter": 8,  "endChapter": 10, "displayText": "1 Crónicas 8-10"},
      { "book": "1 Crónicas","startChapter": 11, "endChapter": 12, "displayText": "1 Crónicas 11-12"},
      { "book": "1 Crónicas","startChapter": 13, "endChapter": 15, "displayText": "1 Crónicas 13-15"},
      { "book": "1 Crónicas","startChapter": 16, "endChapter": 17, "displayText": "1 Crónicas 16-17"},
      { "book": "1 Crónicas","startChapter": 18, "endChapter": 20, "displayText": "1 Crónicas 18-20"},
      { "book": "1 Crónicas","startChapter": 21, "endChapter": 23, "displayText": "1 Crónicas 21-23"},
      { "book": "1 Crónicas","startChapter": 24, "endChapter": 26, "displayText": "1 Crónicas 24-26"},
      { "book": "1 Crónicas","startChapter": 27, "endChapter": 29, "displayText": "1 Crónicas 27-29"},
      { "book": "2 Crónicas","startChapter": 1,  "endChapter": 3,  "displayText": "2 Crónicas 1-3"  },
      { "book": "2 Crónicas","startChapter": 4,  "endChapter": 6,  "displayText": "2 Crónicas 4-6"  },
      { "book": "2 Crónicas","startChapter": 7,  "endChapter": 9,  "displayText": "2 Crónicas 7-9"  },
      { "book": "2 Crónicas","startChapter": 10, "endChapter": 14, "displayText": "2 Crónicas 10-14"},
      { "book": "2 Crónicas","startChapter": 15, "endChapter": 18, "displayText": "2 Crónicas 15-18"},
      { "book": "2 Crónicas","startChapter": 19, "endChapter": 22, "displayText": "2 Crónicas 19-22"},
      { "book": "2 Crónicas","startChapter": 23, "endChapter": 25, "displayText": "2 Crónicas 23-25"},
      { "book": "2 Crónicas","startChapter": 26, "endChapter": 28, "displayText": "2 Crónicas 26-28"},
      { "book": "2 Crónicas","startChapter": 29, "endChapter": 30, "displayText": "2 Crónicas 29-30"},
      { "book": "2 Crónicas","startChapter": 31, "endChapter": 33, "displayText": "2 Crónicas 31-33"},
      { "book": "2 Crónicas","startChapter": 34, "endChapter": 36, "displayText": "2 Crónicas 34-36"},
      { "book": "Esdras",     "startChapter": 1,  "endChapter": 3,  "displayText": "Esdras 1-3"    },
      { "book": "Esdras",     "startChapter": 4,  "endChapter": 7,  "displayText": "Esdras 4-7"    },
      { "book": "Esdras",     "startChapter": 8,  "endChapter": 10, "displayText": "Esdras 8-10"   },
      { "book": "Nehemías",   "startChapter": 1,  "endChapter": 3,  "displayText": "Nehemías 1-3"  },
      { "book": "Nehemías",   "startChapter": 4,  "endChapter": 6,  "displayText": "Nehemías 4-6"  },
      { "book": "Nehemías",   "startChapter": 7,  "endChapter": 8,  "displayText": "Nehemías 7-8"  },
      { "book": "Nehemías",   "startChapter": 9,  "endChapter": 10, "displayText": "Nehemías 9-10" },
      { "book": "Nehemías",   "startChapter": 11, "endChapter": 13, "displayText": "Nehemías 11-13"},
      { "book": "Ester",      "startChapter": 1,  "endChapter": 4,  "displayText": "Ester 1-4"     },
      { "book": "Ester",      "startChapter": 5,  "endChapter": 10, "displayText": "Ester 5-10"    },
      { "book": "Job",        "startChapter": 1,  "endChapter": 5,  "displayText": "Job 1-5"       },
      { "book": "Job",        "startChapter": 6,  "endChapter": 9,  "displayText": "Job 6-9"       },
      { "book": "Job",        "startChapter": 10, "endChapter": 14, "displayText": "Job 10-14"     },
      { "book": "Job",        "startChapter": 15, "endChapter": 18, "displayText": "Job 15-18"     },
      { "book": "Job",        "startChapter": 19, "endChapter": 20, "displayText": "Job 19-20"     },
      { "book": "Job",        "startChapter": 21, "endChapter": 24, "displayText": "Job 21-24"     },
      { "book": "Job",        "startChapter": 25, "endChapter": 29, "displayText": "Job 25-29"     },
      { "book": "Job",        "startChapter": 30, "endChapter": 31, "displayText": "Job 30-31"     },
      { "book": "Job",        "startChapter": 32, "endChapter": 34, "displayText": "Job 32-34"     },
      { "book": "Job",        "startChapter": 35, "endChapter": 38, "displayText": "Job 35-38"     },
      { "book": "Job",        "startChapter": 39, "endChapter": 42, "displayText": "Job 39-42"     },
      { "book": "Salmos",     "startChapter": 1,  "endChapter": 8,   "displayText": "Salmos 1-8"    },
      { "book": "Salmos",     "startChapter": 9,  "endChapter": 16,  "displayText": "Salmos 9-16"   },
      { "book": "Salmos",     "startChapter": 17, "endChapter": 19,  "displayText": "Salmos 17-19"  },
      { "book": "Salmos",     "startChapter": 20, "endChapter": 25,  "displayText": "Salmos 20-25"  },
      { "book": "Salmos",     "startChapter": 26, "endChapter": 31,  "displayText": "Salmos 26-31"  },
      { "book": "Salmos",     "startChapter": 32, "endChapter": 35,  "displayText": "Salmos 32-35"  },
      { "book": "Salmos",     "startChapter": 36, "endChapter": 38,  "displayText": "Salmos 36-38"  },
      { "book": "Salmos",     "startChapter": 39, "endChapter": 42,  "displayText": "Salmos 39-42"  },
      { "book": "Salmos",     "startChapter": 43, "endChapter": 47,  "displayText": "Salmos 43-47"  },
      { "book": "Salmos",     "startChapter": 48, "endChapter": 52,  "displayText": "Salmos 48-52"  },
      { "book": "Salmos",     "startChapter": 53, "endChapter": 58,  "displayText": "Salmos 53-58"  },
      { "book": "Salmos",     "startChapter": 59, "endChapter": 64,  "displayText": "Salmos 59-64"  },
      { "book": "Salmos",     "startChapter": 65, "endChapter": 68,  "displayText": "Salmos 65-68"  },
      { "book": "Salmos",     "startChapter": 69, "endChapter": 72,  "displayText": "Salmos 69-72"  },
      { "book": "Salmos",     "startChapter": 73, "endChapter": 77,  "displayText": "Salmos 73-77"  },
      { "book": "Salmos",     "startChapter": 78, "endChapter": 79,  "displayText": "Salmos 78-79"  },
      { "book": "Salmos",     "startChapter": 80, "endChapter": 86,  "displayText": "Salmos 80-86"  },
      { "book": "Salmos",     "startChapter": 87, "endChapter": 90,  "displayText": "Salmos 87-90"  },
      { "book": "Salmos",     "startChapter": 91, "endChapter": 96,  "displayText": "Salmos 91-96"  },
      { "book": "Salmos",     "startChapter": 97, "endChapter": 103, "displayText": "Salmos 97-103" },
      { "book": "Salmos",     "startChapter": 104,"endChapter": 105, "displayText": "Salmos 104-105"},
      { "book": "Salmos",     "startChapter": 106,"endChapter": 108, "displayText": "Salmos 106-108"},
      { "book": "Salmos",     "startChapter": 109,"endChapter": 115, "displayText": "Salmos 109-115"},
      { "book": "Salmos",     "startChapter": 116,"endChapter": 119, "displayText": "Salmos 116-119 (hasta v. 63)"}, //displayText needs specific handling if marking partial chapters
      { "book": "Salmos",     "startChapter": 119,"endChapter": 119, "displayText": "Salmos 119 (desde v. 64)"}, //displayText needs specific handling
      { "book": "Salmos",     "startChapter": 120,"endChapter": 129, "displayText": "Salmos 120-129"},
      { "book": "Salmos",     "startChapter": 130,"endChapter": 138, "displayText": "Salmos 130-138"},
      { "book": "Salmos",     "startChapter": 139,"endChapter": 144, "displayText": "Salmos 139-144"},
      { "book": "Salmos",     "startChapter": 145,"endChapter": 150, "displayText": "Salmos 145-150"},
      { "book": "Proverbios", "startChapter": 1,  "endChapter": 4,  "displayText": "Proverbios 1-4"   },
      { "book": "Proverbios", "startChapter": 5,  "endChapter": 8,  "displayText": "Proverbios 5-8"   },
      { "book": "Proverbios", "startChapter": 9,  "endChapter": 12, "displayText": "Proverbios 9-12"  },
      { "book": "Proverbios", "startChapter": 13, "endChapter": 16, "displayText": "Proverbios 13-16" },
      { "book": "Proverbios", "startChapter": 17, "endChapter": 19, "displayText": "Proverbios 17-19" },
      { "book": "Proverbios", "startChapter": 20, "endChapter": 22, "displayText": "Proverbios 20-22" },
      { "book": "Proverbios", "startChapter": 23, "endChapter": 27, "displayText": "Proverbios 23-27" },
      { "book": "Proverbios", "startChapter": 28, "endChapter": 31, "displayText": "Proverbios 28-31" },
      { "book": "Eclesiastés","startChapter": 1,  "endChapter": 4,  "displayText": "Eclesiastés 1-4" },
      { "book": "Eclesiastés","startChapter": 5,  "endChapter": 8,  "displayText": "Eclesiastés 5-8" },
      { "book": "Eclesiastés","startChapter": 9,  "endChapter": 12, "displayText": "Eclesiastés 9-12"},
      { "book": "Cantar de los Cantares","startChapter": 1, "endChapter": 8,  "displayText": "Cantar de los Cantares 1-8"},
      { "book": "Isaías",     "startChapter": 1,  "endChapter": 4,  "displayText": "Isaías 1-4"   },
      { "book": "Isaías",     "startChapter": 5,  "endChapter": 7,  "displayText": "Isaías 5-7"   },
      { "book": "Isaías",     "startChapter": 8,  "endChapter": 10, "displayText": "Isaías 8-10"  },
      { "book": "Isaías",     "startChapter": 11, "endChapter": 14, "displayText": "Isaías 11-14" },
      { "book": "Isaías",     "startChapter": 15, "endChapter": 19, "displayText": "Isaías 15-19" },
      { "book": "Isaías",     "startChapter": 20, "endChapter": 24, "displayText": "Isaías 20-24" },
      { "book": "Isaías",     "startChapter": 25, "endChapter": 28, "displayText": "Isaías 25-28" },
      { "book": "Isaías",     "startChapter": 29, "endChapter": 31, "displayText": "Isaías 29-31" },
      { "book": "Isaías",     "startChapter": 32, "endChapter": 35, "displayText": "Isaías 32-35" },
      { "book": "Isaías",     "startChapter": 36, "endChapter": 37, "displayText": "Isaías 36-37" },
      { "book": "Isaías",     "startChapter": 38, "endChapter": 40, "displayText": "Isaías 38-40" },
      { "book": "Isaías",     "startChapter": 41, "endChapter": 43, "displayText": "Isaías 41-43" },
      { "book": "Isaías",     "startChapter": 44, "endChapter": 47, "displayText": "Isaías 44-47" },
      { "book": "Isaías",     "startChapter": 48, "endChapter": 50, "displayText": "Isaías 48-50" },
      { "book": "Isaías",     "startChapter": 51, "endChapter": 55, "displayText": "Isaías 51-55" },
      { "book": "Isaías",     "startChapter": 56, "endChapter": 58, "displayText": "Isaías 56-58" },
      { "book": "Isaías",     "startChapter": 59, "endChapter": 62, "displayText": "Isaías 59-62" },
      { "book": "Isaías",     "startChapter": 63, "endChapter": 66, "displayText": "Isaías 63-66" },
      { "book": "Jeremías",   "startChapter": 1,  "endChapter": 3,  "displayText": "Jeremías 1-3"   },
      { "book": "Jeremías",   "startChapter": 4,  "endChapter": 5,  "displayText": "Jeremías 4-5"   },
      { "book": "Jeremías",   "startChapter": 6,  "endChapter": 7,  "displayText": "Jeremías 6-7"   },
      { "book": "Jeremías",   "startChapter": 8,  "endChapter": 10, "displayText": "Jeremías 8-10"  },
      { "book": "Jeremías",   "startChapter": 11, "endChapter": 13, "displayText": "Jeremías 11-13" },
      { "book": "Jeremías",   "startChapter": 14, "endChapter": 16, "displayText": "Jeremías 14-16" },
      { "book": "Jeremías",   "startChapter": 17, "endChapter": 20, "displayText": "Jeremías 17-20" },
      { "book": "Jeremías",   "startChapter": 21, "endChapter": 23, "displayText": "Jeremías 21-23" },
      { "book": "Jeremías",   "startChapter": 24, "endChapter": 26, "displayText": "Jeremías 24-26" },
      { "book": "Jeremías",   "startChapter": 27, "endChapter": 29, "displayText": "Jeremías 27-29" },
      { "book": "Jeremías",   "startChapter": 30, "endChapter": 31, "displayText": "Jeremías 30-31" },
      { "book": "Jeremías",   "startChapter": 32, "endChapter": 33, "displayText": "Jeremías 32-33" },
      { "book": "Jeremías",   "startChapter": 34, "endChapter": 36, "displayText": "Jeremías 34-36" },
      { "book": "Jeremías",   "startChapter": 37, "endChapter": 39, "displayText": "Jeremías 37-39" },
      { "book": "Jeremías",   "startChapter": 40, "endChapter": 42, "displayText": "Jeremías 40-42" },
      { "book": "Jeremías",   "startChapter": 43, "endChapter": 44, "displayText": "Jeremías 43-44" },
      { "book": "Jeremías",   "startChapter": 45, "endChapter": 48, "displayText": "Jeremías 45-48" },
      { "book": "Jeremías",   "startChapter": 49, "endChapter": 50, "displayText": "Jeremías 49-50" },
      { "book": "Jeremías",   "startChapter": 51, "endChapter": 52, "displayText": "Jeremías 51-52" },
      { "book": "Lamentaciones","startChapter": 1,"endChapter": 2,  "displayText": "Lamentaciones 1-2" },
      { "book": "Lamentaciones","startChapter": 3,"endChapter": 5,  "displayText": "Lamentaciones 3-5" },
      { "book": "Ezequiel",   "startChapter": 1,  "endChapter": 3,  "displayText": "Ezequiel 1-3"   },
      { "book": "Ezequiel",   "startChapter": 4,  "endChapter": 6,  "displayText": "Ezequiel 4-6"   },
      { "book": "Ezequiel",   "startChapter": 7,  "endChapter": 9,  "displayText": "Ezequiel 7-9"   },
      { "book": "Ezequiel",   "startChapter": 10, "endChapter": 12, "displayText": "Ezequiel 10-12"},
      { "book": "Ezequiel",   "startChapter": 13, "endChapter": 15, "displayText": "Ezequiel 13-15"},
      { "book": "Ezequiel",   "startChapter": 16, "endChapter": 16, "displayText": "Ezequiel 16"   },
      { "book": "Ezequiel",   "startChapter": 17, "endChapter": 18, "displayText": "Ezequiel 17-18"},
      { "book": "Ezequiel",   "startChapter": 19, "endChapter": 21, "displayText": "Ezequiel 19-21"},
      { "book": "Ezequiel",   "startChapter": 22, "endChapter": 23, "displayText": "Ezequiel 22-23"},
      { "book": "Ezequiel",   "startChapter": 24, "endChapter": 26, "displayText": "Ezequiel 24-26"},
      { "book": "Ezequiel",   "startChapter": 27, "endChapter": 28, "displayText": "Ezequiel 27-28"},
      { "book": "Ezequiel",   "startChapter": 29, "endChapter": 31, "displayText": "Ezequiel 29-31"},
      { "book": "Ezequiel",   "startChapter": 32, "endChapter": 33, "displayText": "Ezequiel 32-33"},
      { "book": "Ezequiel",   "startChapter": 34, "endChapter": 36, "displayText": "Ezequiel 34-36"},
      { "book": "Ezequiel",   "startChapter": 37, "endChapter": 38, "displayText": "Ezequiel 37-38"},
      { "book": "Ezequiel",   "startChapter": 39, "endChapter": 40, "displayText": "Ezequiel 39-40"},
      { "book": "Ezequiel",   "startChapter": 41, "endChapter": 43, "displayText": "Ezequiel 41-43"},
      { "book": "Ezequiel",   "startChapter": 44, "endChapter": 45, "displayText": "Ezequiel 44-45"},
      { "book": "Ezequiel",   "startChapter": 46, "endChapter": 48, "displayText": "Ezequiel 46-48"},
      { "book": "Daniel",     "startChapter": 1,  "endChapter": 2,  "displayText": "Daniel 1-2"     },
      { "book": "Daniel",     "startChapter": 3,  "endChapter": 4,  "displayText": "Daniel 3-4"     },
      { "book": "Daniel",     "startChapter": 5,  "endChapter": 7,  "displayText": "Daniel 5-7"     },
      { "book": "Daniel",     "startChapter": 8,  "endChapter": 10, "displayText": "Daniel 8-10"    },
      { "book": "Daniel",     "startChapter": 11, "endChapter": 12, "displayText": "Daniel 11-12"   },
      { "book": "Oseas",      "startChapter": 1,  "endChapter": 7,  "displayText": "Oseas 1-7"      },
      { "book": "Oseas",      "startChapter": 8,  "endChapter": 14, "displayText": "Oseas 8-14"     },
      { "book": "Joel",       "startChapter": 1,  "endChapter": 3,  "displayText": "Joel 1-3"       },
      { "book": "Amós",       "startChapter": 1,  "endChapter": 5,  "displayText": "Amós 1-5"       },
      { "book": "Amós",       "startChapter": 6,  "endChapter": 9,  "displayText": "Amós 6-9"       },
      // Para libros combinados, la propiedad "book" aquí es una cadena.
      // La lógica de marcado de capítulos debe manejar esto (ver markSuggestedAsReadButton).
      { "book": "Abdías, Jonás", "startChapter": 1, "endChapter": 4, "displayText": "Abdías 1, Jonás 1-4"      }, // Asumiendo 'endChapter' cubre el segundo libro
      { "book": "Miqueas",    "startChapter": 1,  "endChapter": 7,  "displayText": "Miqueas 1-7"    },
      { "book": "Nahúm, Habacuc", "startChapter": 1, "endChapter": 3, "displayText": "Nahúm 1-3, Habacuc 1-3"    },
      { "book": "Sofonías, Ageo", "startChapter": 1, "endChapter": 3, "displayText": "Sofonías 1-3, Ageo 1-2"       },
      { "book": "Zacarías",   "startChapter": 1,  "endChapter": 7,  "displayText": "Zacarías 1-7"   },
      { "book": "Zacarías",   "startChapter": 8,  "endChapter": 11, "displayText": "Zacarías 8-11"  },
      { "book": "Zacarías",   "startChapter": 12, "endChapter": 14, "displayText": "Zacarías 12-14" },
      { "book": "Malaquías",  "startChapter": 1,  "endChapter": 4,  "displayText": "Malaquías 1-4"  },
      { "book": "Mateo",      "startChapter": 1,  "endChapter": 4,  "displayText": "Mateo 1-4"      },
      { "book": "Mateo",      "startChapter": 5,  "endChapter": 7,  "displayText": "Mateo 5-7"      },
      { "book": "Mateo",      "startChapter": 8,  "endChapter": 10, "displayText": "Mateo 8-10"     },
      { "book": "Mateo",      "startChapter": 11, "endChapter": 13, "displayText": "Mateo 11-13"    },
      { "book": "Mateo",      "startChapter": 14, "endChapter": 17, "displayText": "Mateo 14-17"    },
      { "book": "Mateo",      "startChapter": 18, "endChapter": 20, "displayText": "Mateo 18-20"    },
      { "book": "Mateo",      "startChapter": 21, "endChapter": 23, "displayText": "Mateo 21-23"    },
      { "book": "Mateo",      "startChapter": 24, "endChapter": 25, "displayText": "Mateo 24-25"    },
      { "book": "Mateo",      "startChapter": 26, "endChapter": 26, "displayText": "Mateo 26"       },
      { "book": "Mateo",      "startChapter": 27, "endChapter": 28, "displayText": "Mateo 27-28"    },
      { "book": "Marcos",     "startChapter": 1,  "endChapter": 3,  "displayText": "Marcos 1-3"     },
      { "book": "Marcos",     "startChapter": 4,  "endChapter": 5,  "displayText": "Marcos 4-5"     },
      { "book": "Marcos",     "startChapter": 6,  "endChapter": 8,  "displayText": "Marcos 6-8"     },
      { "book": "Marcos",     "startChapter": 9,  "endChapter": 10, "displayText": "Marcos 9-10"    },
      { "book": "Marcos",     "startChapter": 11, "endChapter": 13, "displayText": "Marcos 11-13"   },
      { "book": "Marcos",     "startChapter": 14, "endChapter": 16, "displayText": "Marcos 14-16"   },
      { "book": "Lucas",      "startChapter": 1,  "endChapter": 2,  "displayText": "Lucas 1-2"      },
      { "book": "Lucas",      "startChapter": 3,  "endChapter": 5,  "displayText": "Lucas 3-5"      },
      { "book": "Lucas",      "startChapter": 6,  "endChapter": 7,  "displayText": "Lucas 6-7"      },
      { "book": "Lucas",      "startChapter": 8,  "endChapter": 9,  "displayText": "Lucas 8-9"      },
      { "book": "Lucas",      "startChapter": 10, "endChapter": 11, "displayText": "Lucas 10-11"    },
      { "book": "Lucas",      "startChapter": 12, "endChapter": 13, "displayText": "Lucas 12-13"    },
      { "book": "Lucas",      "startChapter": 14, "endChapter": 17, "displayText": "Lucas 14-17"    },
      { "book": "Lucas",      "startChapter": 18, "endChapter": 19, "displayText": "Lucas 18-19"    },
      { "book": "Lucas",      "startChapter": 20, "endChapter": 22, "displayText": "Lucas 20-22"    },
      { "book": "Lucas",      "startChapter": 23, "endChapter": 24, "displayText": "Lucas 23-24"    },
      { "book": "Juan",       "startChapter": 1,  "endChapter": 3,  "displayText": "Juan 1-3"       },
      { "book": "Juan",       "startChapter": 4,  "endChapter": 5,  "displayText": "Juan 4-5"       },
      { "book": "Juan",       "startChapter": 6,  "endChapter": 7,  "displayText": "Juan 6-7"       },
      { "book": "Juan",       "startChapter": 8,  "endChapter": 9,  "displayText": "Juan 8-9"       },
      { "book": "Juan",       "startChapter": 10, "endChapter": 12, "displayText": "Juan 10-12"     },
      { "book": "Juan",       "startChapter": 13, "endChapter": 15, "displayText": "Juan 13-15"     },
      { "book": "Juan",       "startChapter": 16, "endChapter": 18, "displayText": "Juan 16-18"     },
      { "book": "Juan",       "startChapter": 19, "endChapter": 21, "displayText": "Juan 19-21"     },
      { "book": "Hechos",     "startChapter": 1,  "endChapter": 3,  "displayText": "Hechos 1-3"     },
      { "book": "Hechos",     "startChapter": 4,  "endChapter": 6,  "displayText": "Hechos 4-6"     },
      { "book": "Hechos",     "startChapter": 7,  "endChapter": 8,  "displayText": "Hechos 7-8"     },
      { "book": "Hechos",     "startChapter": 9,  "endChapter": 11, "displayText": "Hechos 9-11"    },
      { "book": "Hechos",     "startChapter": 12, "endChapter": 14, "displayText": "Hechos 12-14"   },
      { "book": "Hechos",     "startChapter": 15, "endChapter": 16, "displayText": "Hechos 15-16"   },
      { "book": "Hechos",     "startChapter": 17, "endChapter": 19, "displayText": "Hechos 17-19"   },
      { "book": "Hechos",     "startChapter": 20, "endChapter": 21, "displayText": "Hechos 20-21"   },
      { "book": "Hechos",     "startChapter": 22, "endChapter": 23, "displayText": "Hechos 22-23"   },
      { "book": "Hechos",     "startChapter": 24, "endChapter": 26, "displayText": "Hechos 24-26"   },
      { "book": "Hechos",     "startChapter": 27, "endChapter": 28, "displayText": "Hechos 27-28"   },
      { "book": "Romanos",    "startChapter": 1,  "endChapter": 3,  "displayText": "Romanos 1-3"    },
      { "book": "Romanos",    "startChapter": 4,  "endChapter": 7,  "displayText": "Romanos 4-7"    },
      { "book": "Romanos",    "startChapter": 8,  "endChapter": 11, "displayText": "Romanos 8-11"   },
      { "book": "Romanos",    "startChapter": 12, "endChapter": 16, "displayText": "Romanos 12-16"  },
      { "book": "1 Corintios","startChapter": 1,  "endChapter": 6,  "displayText": "1 Corintios 1-6"},
      { "book": "1 Corintios","startChapter": 7,  "endChapter": 10, "displayText": "1 Corintios 7-10"},
      { "book": "1 Corintios","startChapter": 11, "endChapter": 14, "displayText": "1 Corintios 11-14"},
      { "book": "1 Corintios","startChapter": 15, "endChapter": 16, "displayText": "1 Corintios 15-16"},
      { "book": "2 Corintios","startChapter": 1,  "endChapter": 6,  "displayText": "2 Corintios 1-6"},
      { "book": "2 Corintios","startChapter": 7,  "endChapter": 10, "displayText": "2 Corintios 7-10"},
      { "book": "2 Corintios","startChapter": 11, "endChapter": 13, "displayText": "2 Corintios 11-13"},
      { "book": "Gálatas",    "startChapter": 1,  "endChapter": 6,  "displayText": "Gálatas 1-6"    },
      { "book": "Efesios",    "startChapter": 1,  "endChapter": 6,  "displayText": "Efesios 1-6"    },
      { "book": "Filipenses", "startChapter": 1,  "endChapter": 4,  "displayText": "Filipenses 1-4" },
      { "book": "Colosenses", "startChapter": 1,  "endChapter": 4,  "displayText": "Colosenses 1-4"},
      { "book": "1 Tesalonicenses","startChapter": 1,"endChapter": 5,"displayText": "1 Tesalonicenses 1-5"},
      { "book": "2 Tesalonicenses","startChapter": 1,"endChapter": 3,"displayText": "2 Tesalonicenses 1-3"},
      { "book": "1 Timoteo",  "startChapter": 1,  "endChapter": 6,  "displayText": "1 Timoteo 1-6"  },
      { "book": "2 Timoteo",  "startChapter": 1,  "endChapter": 4,  "displayText": "2 Timoteo 1-4"  },
      { "book": "Tito, Filemón", "startChapter": 1, "endChapter": 3, "displayText": "Tito 1-3, Filemón 1"      }, // Asumiendo 'endChapter' cubre el primer libro
      { "book": "Hebreos",    "startChapter": 1,  "endChapter": 6,  "displayText": "Hebreos 1-6"    },
      { "book": "Hebreos",    "startChapter": 7,  "endChapter": 10, "displayText": "Hebreos 7-10"   },
      { "book": "Hebreos",    "startChapter": 11, "endChapter": 13, "displayText": "Hebreos 11-13"  },
      { "book": "Santiago",   "startChapter": 1,  "endChapter": 5,  "displayText": "Santiago 1-5"   },
      { "book": "1 Pedro",    "startChapter": 1,  "endChapter": 5,  "displayText": "1 Pedro 1-5"    },
      { "book": "2 Pedro",    "startChapter": 1,  "endChapter": 3,  "displayText": "2 Pedro 1-3"    },
      { "book": "1 Juan",     "startChapter": 1,  "endChapter": 5,  "displayText": "1 Juan 1-5"     },
      { "book": "2 Juan, 3 Juan, Judas", "startChapter": 1, "endChapter": 1, "displayText": "2 Juan 1, 3 Juan 1, Judas 1" },
      { "book": "Apocalipsis","startChapter": 1,  "endChapter": 4,  "displayText": "Apocalipsis 1-4"  },
      { "book": "Apocalipsis","startChapter": 5,  "endChapter": 9,  "displayText": "Apocalipsis 5-9"  },
      { "book": "Apocalipsis","startChapter": 10, "endChapter": 14, "displayText": "Apocalipsis 10-14"},
      { "book": "Apocalipsis","startChapter": 15, "endChapter": 18, "displayText": "Apocalipsis 15-18"},
      { "book": "Apocalipsis","startChapter": 19, "endChapter": 22, "displayText": "Apocalipsis 19-22"}
    ];

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
    const totalBibleChapters = normalizedBibleBooks.reduce((sum,b)=> sum + b.chapters, 0);

    function sanitizeKey(bookName, chapterNum) {
        return `key_${bookName.replace(/\s/g, '_')}_${chapterNum}`;
    }

    function loadState() {
        const saved = localStorage.getItem('bibleReadStatus');
        if (saved) {
            try { readStatus = JSON.parse(saved); }
            catch(e) { console.error("Error parsing bibleReadStatus:", e); readStatus = {}; }
        }
        const savedDate = localStorage.getItem('planStartDate');
        if (savedDate) {
            planStartDateInput.value = savedDate;
            try {
                const d = new Date(savedDate + "T00:00:00Z"); // Asegurar que se trata como UTC
                if (isNaN(d.getTime())) throw new Error("Invalid date value");
                currentPlanStartDateText.textContent =
                `Tu plan de lectura actual comenzó el: ` +
                d.toLocaleDateString('es-ES',
                    { timeZone: 'UTC', day:'numeric',month:'long',year:'numeric' }); // Mostrar en UTC o ajustar a local si es necesario
            } catch(e) {
                console.error("Error parsing planStartDate:", e);
                currentPlanStartDateText.textContent =
                `Fecha de inicio guardada inválida: ${savedDate}`;
                localStorage.removeItem('planStartDate');
            }
        } else {
            currentPlanStartDateText.textContent =
                "Aún no has establecido una fecha de inicio para tu plan.";
        }
    }

    function saveState() {
        localStorage.setItem('bibleReadStatus', JSON.stringify(readStatus));
    }

    function updateChapterButtonUI(bookName, chapterNum) {
        const key = sanitizeKey(bookName, chapterNum);
        const bookId = sanitizeKey(bookName, '')
                        .substring(4).replace(/_undefined$|_null$|_$/, '');
        const grid = document.getElementById(`chapters_${bookId}`);
        if (!grid) {
            // console.warn(`Grid no encontrado para actualizar UI: chapters_${bookId} (libro: ${bookName})`);
            return;
        }
        const selector = `.chapter-button[data-book="${bookName}"][data-chapter="${chapterNum}"]`;
        const btn = grid.querySelector(selector);
        if (!btn) {
            // console.warn(`Botón de capítulo no encontrado para UI: ${selector}`);
            return;
        }
        btn.classList.toggle('read', !!readStatus[key]);
    }

    function updateOverallProgress() {
        const readCount = Object.values(readStatus).filter(v=>v).length;
        const pct = totalBibleChapters
        ? Math.round((readCount/totalBibleChapters)*100)
        : 0;
        progressBar.style.width = `${pct}%`;
        progressBar.textContent = pct>10? `${pct}%`: '';
        progressText.textContent =
        `${pct}% completado (${readCount}/${totalBibleChapters} capítulos)`;
    }

    function updateBookProgress(bookName) {
        const book = normalizedBibleBooks.find(b=>b.name===bookName);
        if (!book) {
            // console.warn(`Libro no encontrado para actualizar progreso: ${bookName}`);
            return;
        }
        let read = 0;
        for (let i=1; i<=book.chapters; i++) {
            if (readStatus[sanitizeKey(bookName,i)]) read++;
        }
        const bookId = sanitizeKey(bookName,'')
                        .substring(4).replace(/_undefined$|_null$|_$/,'');
        const el = document.getElementById(`progress_${bookId}`);
        if (el) {
            const pct = book.chapters
                ? Math.round((read/book.chapters)*100)
                : 0;
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

    setPlanStartDateButton.addEventListener('click', ()=>{
        const d = planStartDateInput.value;
        if (!d.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return alert("Fecha inválida. Usa AAAA-MM-DD.");
        }
        localStorage.setItem('planStartDate', d);
        loadState(); // Recarga el estado, incluyendo la fecha mostrada
        displayDailySuggestion();
        actualizarDiasRetraso(); // Actualiza el contador de retraso si la fecha de inicio afecta
        alert("Fecha de inicio establecida.");
    });

    syncPlanButton.addEventListener('click', ()=>{
        const idx = parseInt(syncReadingSelect.value);
        if (isNaN(idx) || idx < 0 || idx >= dailyReadingPlan.length) { // Validar índice
            return alert("Selecciona una lectura válida.");
        }
        const today = new Date(); // Hora local actual
        // Queremos que la nueva fecha de inicio sea tal que `idx` sea la lectura de `today`
        // Las fechas deben manejarse consistentemente, preferiblemente en UTC para los cálculos de días.
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        
        const newStartDateUTC = new Date(todayUTC);
        newStartDateUTC.setUTCDate(todayUTC.getUTCDate() - idx); // Resta `idx` días
        
        const s = newStartDateUTC.toISOString().split('T')[0];
        localStorage.setItem('planStartDate', s);
        planStartDateInput.value = s;
        loadState(); // Recarga el estado
        displayDailySuggestion();
        actualizarDiasRetraso(); // Actualiza el contador de retraso
        alert("Plan sincronizado.");
    });

    function displayDailySuggestion() {
        const now = new Date(); // Hora local
        currentDateSpan.textContent = now.toLocaleDateString('es-ES',
        { weekday:'long', year:'numeric', month:'long', day:'numeric',
            timeZone:'Europe/Madrid' }); // Especificar zona horaria para consistencia

        const sd = localStorage.getItem('planStartDate');
        if (!sd) {
            dailySuggestionText.textContent =
                "Establece o sincroniza una fecha de inicio.";
            markSuggestedAsReadButton.style.display = 'none';
            return;
        }
        
        let ps; // planStartDate en UTC
        try {
            // La fecha se guarda como YYYY-MM-DD. Al añadir T00:00:00Z, se interpreta como medianoche UTC.
            ps = new Date(sd + "T00:00:00Z");
            if (isNaN(ps.getTime())) throw new Error("Invalid stored date");
        } catch(e) {
            dailySuggestionText.textContent =
                "Error con la fecha guardada. Reestablece.";
            markSuggestedAsReadButton.style.display = 'none';
            localStorage.removeItem('planStartDate'); // Limpiar fecha inválida
            console.error("Error parsing plan start date for displayDailySuggestion:", e);
            return;
        }

        // todayUTC es hoy a medianoche UTC
        const todayUTC = new Date(Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
        ));

        if (todayUTC < ps) {
            const diff = Math.ceil((ps.getTime() - todayUTC.getTime())/(1000*3600*24)); // getTime() para asegurar que son números
            dailySuggestionText.textContent =
                `Tu plan comenzará el ${ps.toLocaleDateString('es-ES',
                {day:'numeric',month:'long',year:'numeric', timeZone: 'UTC'})}. `+ // Mostrar en UTC o ajustar
                `Faltan ${diff} día(s).`;
            markSuggestedAsReadButton.style.display = 'none';
            currentSuggestedReading = null; // No hay sugerencia aún
            return;
        }

        const dayDiff = Math.floor((todayUTC.getTime() - ps.getTime())/(1000*3600*24)); // 0-indexed day number
        
        if (!dailyReadingPlan.length) {
            dailySuggestionText.textContent = "No hay plan de lectura.";
            markSuggestedAsReadButton.style.display = 'none';
            currentSuggestedReading = null;
            return;
        }

        const planEffectiveLength = dailyReadingPlan.length; // Podría ser un ciclo de 365 días, etc.
        const idx = dayDiff % planEffectiveLength; // Asegura que el índice está dentro del plan
        
        if (idx >= 0 && idx < dailyReadingPlan.length) {
            currentSuggestedReading = dailyReadingPlan[idx];
            dailySuggestionText.textContent =
                `Día ${dayDiff+1}: ${currentSuggestedReading.displayText}`;
            markSuggestedAsReadButton.style.display = 'inline-block';
        } else {
             dailySuggestionText.textContent = "Lectura del plan no encontrada para hoy.";
             markSuggestedAsReadButton.style.display = 'none';
             currentSuggestedReading = null;
        }
    }
    
    // Función para marcar capítulos de un libro específico
    function markChaptersForBook(bookName, startChap, endChap) {
        let changedSomething = false;
        const bookData = normalizedBibleBooks.find(b => b.name === bookName);
        if (!bookData) {
            console.warn(`Libro "${bookName}" no encontrado en normalizedBibleBooks.`);
            return false;
        }
        for (let i = startChap; i <= endChap; i++) {
            if (i >= 1 && i <= bookData.chapters) {
                const key = sanitizeKey(bookName, i);
                if (!readStatus[key]) {
                    readStatus[key] = true;
                    updateChapterButtonUI(bookName, i);
                    changedSomething = true;
                }
            }
        }
        if (changedSomething) {
            updateBookProgress(bookName);
        }
        return changedSomething;
    }


    markSuggestedAsReadButton.addEventListener('click', ()=>{
        if (!currentSuggestedReading) return;
    
        let overallChanged = false;
        const { book: planBookEntry, startChapter: planStartChapter, endChapter: planEndChapter, displayText } = currentSuggestedReading;
    
        // Manejar libros combinados en la entrada del plan (ej. "Abdías, Jonás")
        // Esto requiere parsear el displayText o tener una estructura más detallada en dailyReadingPlan
        // Ejemplo simplificado: Asumimos que displayText es la fuente de verdad para los capítulos.
        // "Abdías 1, Jonás 1-4" -> marca Abdías 1 y Jonás 1-4
        // "Tito 1-3, Filemón 1" -> marca Tito 1-3 y Filemón 1
        
        const readingParts = displayText.split(',').map(part => part.trim());
        // Esta regex intenta extraer "Libro X-Y" o "Libro Z"
        const regex = /([\w\s]+?)\s*(\d+)(?:-(\d+))?$/; 

        readingParts.forEach(part => {
            const match = part.match(regex);
            if (match) {
                const bookName = match[1].trim(); // Nombre del libro, ej: "Génesis", "1 Samuel"
                const startChap = parseInt(match[2]);
                const endChap = match[3] ? parseInt(match[3]) : startChap; // Si no hay rango, endChapter = startChapter
                
                // Validar que el libro extraído existe en normalizedBibleBooks
                const actualBook = normalizedBibleBooks.find(b => b.name === bookName);
                if (actualBook) {
                    if (markChaptersForBook(actualBook.name, startChap, endChap)) {
                        overallChanged = true;
                    }
                } else {
                    console.warn(`Libro "${bookName}" de displayText no encontrado para marcar.`);
                }
            } else {
                 // Si el formato no coincide, intentar con el `book` y `startChapter`/`endChapter` del plan
                 // Esto puede ser problemático si `planBookEntry` es una cadena combinada.
                 const singleBookTarget = normalizedBibleBooks.find(b => b.name === planBookEntry);
                 if(singleBookTarget){ // Si el book del plan es un libro válido y único
                    if (markChaptersForBook(singleBookTarget.name, planStartChapter, planEndChapter)) {
                        overallChanged = true;
                    }
                 } else {
                    console.warn(`Formato de parte de lectura no reconocido: "${part}" y planBookEntry "${planBookEntry}" no es un libro individual válido.`);
                 }
            }
        });
    
        if (overallChanged) {
            saveState();
            updateOverallProgress(); // Actualiza el progreso general
            // La actualización del progreso por libro ya se hace en markChaptersForBook
            alert(`${displayText} marcado como leído.`);
            actualizarUltimaLectura(); // Actualiza la fecha de última lectura y el contador de retraso
            if (dailySuggestionText) dailySuggestionText.textContent = "¡Lectura completada por hoy!";
            if (markSuggestedAsReadButton) markSuggestedAsReadButton.style.display = 'none';
        } else {
            alert(`Ya estaban leídos los capítulos de: ${displayText}.`);
            actualizarUltimaLectura(); // Aun así, actualiza la fecha como actividad reciente
             if (dailySuggestionText) dailySuggestionText.textContent = "Lectura de hoy ya estaba completada.";
            // if (markSuggestedAsReadButton) markSuggestedAsReadButton.style.display = 'none'; // Opcional: ocultar igual
        }
    });
    

    function renderBooks(filterBook='todos', filterStatus='todos') {
        bibleBooksContainer.innerHTML = '';
        const list = normalizedBibleBooks.filter(b=>
        filterBook==='todos'||b.name===filterBook
        );
        list.forEach(book=>{
            const bookId = sanitizeKey(book.name,'')
                            .substring(4).replace(/_undefined$|_null$|_$/,'');
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
            for (let i=1; i<=book.chapters; i++) {
                const key = sanitizeKey(book.name, i);
                const isRead = !!readStatus[key];
                if (
                    (filterStatus==='leidos'&&!isRead) ||
                    (filterStatus==='no_leidos'&&isRead)
                ) continue;
                hasVisibleChapters = true;
                const btn = document.createElement('button');
                btn.className = 'chapter-button';
                btn.textContent = i;
                btn.dataset.book = book.name;
                btn.dataset.chapter = i;
                if (isRead) btn.classList.add('read');
                btn.addEventListener('click', ()=> toggleChapterRead(book.name, i));
                grid.appendChild(btn);
            }
            if (!hasVisibleChapters && filterStatus!=='todos') {
                section.style.display='none';
            }
            updateBookProgress(book.name);
        });
    }

    function populateFiltersAndSyncOptions() {
        bookFilter.innerHTML = '<option value="todos">Todos los Libros</option>';
        normalizedBibleBooks.forEach(b=>{
            const o = document.createElement('option');
            o.value = b.name; o.textContent = b.name;
            bookFilter.appendChild(o);
        });
        bookFilter.addEventListener('change', ()=> 
            renderBooks(bookFilter.value, statusFilter.value)
        );
        statusFilter.addEventListener('change', ()=> 
            renderBooks(bookFilter.value, statusFilter.value)
        );

        syncReadingSelect.innerHTML = ''; // Limpiar opciones previas
        dailyReadingPlan.forEach((r,i)=>{
            const o = document.createElement('option');
            o.value = i; // El valor es el índice del plan
            o.textContent = `Día ${i+1}: ${r.displayText}`;
            syncReadingSelect.appendChild(o);
        });
    }

    resetProgressButton.addEventListener('click', ()=>{
        if (!confirm('¿Reiniciar todo el progreso?')) return;
        readStatus = {};
        saveState();
        // También reiniciar la fecha de última lectura y el contador de retraso
        localStorage.removeItem('lastReadingDate');
        actualizarDiasRetraso(); 
        renderBooks(bookFilter.value, statusFilter.value); // Re-renderizar con filtros actuales
        updateOverallProgress();
        alert("Progreso reiniciado.");
    });

    // --- Inicialización ---
    loadState();
    populateFiltersAndSyncOptions();
    renderBooks(); // Render inicial sin filtros específicos o con los por defecto
    updateOverallProgress();
    displayDailySuggestion(); // Mostrar sugerencia diaria
    actualizarDiasRetraso(); // Actualizar contador de días de retraso al cargar

    // --- Service Worker PWA ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('/sw.js') // Asegúrate que la ruta a sw.js es correcta
            .then(r=> console.log('ServiceWorker registrado con scope:', r.scope))
            .catch(e=> console.error('Error al registrar ServiceWorker:', e));
        });
    }
});
