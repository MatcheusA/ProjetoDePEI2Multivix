const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./vetclinic.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados vetclinic.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS tutores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL,
        endereco TEXT NOT NULL,
        preferencia TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela tutores:", err.message);
      } else {
        console.log("Tabela tutores criada com sucesso.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS animais (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especie TEXT NOT NULL,
        raca TEXT NOT NULL,
        temperamento TEXT NOT NULL,
        porte TEXT NOT NULL,
        idade INTEGER NOT NULL,
        tutor TEXT NOT NULL,
        castrado TEXT NOT NULL DEFAULT 'Indefinido',
        estado TEXT NOT NULL DEFAULT 'Vivo'
    )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela animais:", err.message);
      } else {
        console.log("Tabela animais criada com sucesso.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_consulta TEXT NOT NULL,
        data TEXT NOT NULL,
        horario TEXT NOT NULL,
        tutor TEXT NOT NULL,
        animal TEXT NOT NULL,
        historico_medico TEXT,
        reprodutivo TEXT,
        ambiente TEXT,
        dieta TEXT,
        higiene TEXT,
        atividade TEXT,
        medicamentos TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela consultas:", err.message);
      } else {
        console.log("Tabela consultas criada com sucesso.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS vacinas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        nome TEXT NOT NULL,
        data TEXT,
        tipo TEXT NOT NULL,
        produto TEXT NOT NULL,
        dose_atual INTEGER NOT NULL,
        total_doses INTEGER NOT NULL,
        observacoes TEXT,
        fabricante TEXT NOT NULL,
        partida TEXT NOT NULL,
        fabricacao TEXT,
        validade TEXT,
        reforco TEXT NOT NULL,
        animal TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela vacinas:", err.message);
      } else {
        console.log("Tabela vacinas criada com sucesso.");
      }
    }
  );
});

module.exports = db;
