const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


const handleDatabaseError = (res, err, msg) => {
  console.error(`${msg}:`, err.message);
  res.status(500).json({ error: msg });
};


app.get("/api/tutores", (req, res) => {
  db.all("SELECT * FROM tutores", [], (err, rows) => {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao buscar tutores");
    }
    res.json(rows);
  });
});

app.post("/api/tutores", (req, res) => {
  const { nome, telefone, email, endereco, preferencia } = req.body;
  db.run(
    `INSERT INTO tutores (nome, telefone, email, endereco, preferencia) VALUES (?, ?, ?, ?, ?)`,
    [nome, telefone, email, endereco, preferencia],
    function (err) {
      if (err) {
        return handleDatabaseError(res, err, "Erro ao inserir tutor");
      }
      res.status(201).json({
        id: this.lastID,
        nome,
        telefone,
        email,
        endereco,
        preferencia,
      });
    }
  );
});

app.delete("/api/tutores/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM tutores WHERE id = ?`, id, function (err) {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao deletar tutor");
    }
    res.status(200).json({ deletedID: id });
  });
});


app.get("/api/animais", (req, res) => {
  db.all("SELECT * FROM animais", [], (err, rows) => {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao buscar animais");
    }
    res.json(rows);
  });
});

app.post("/api/animais", (req, res) => {
  const { nome, especie, raca, temperamento, porte, idade, tutor, castrado } =
    req.body;
  db.run(
    `INSERT INTO animais (nome, especie, raca, temperamento, porte, idade, tutor, castrado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, especie, raca, temperamento, porte, idade, tutor, castrado],
    function (err) {
      if (err) {
        return handleDatabaseError(res, err, "Erro ao inserir animal");
      }
      res.status(201).json({
        id: this.lastID,
        nome,
        especie,
        raca,
        temperamento,
        porte,
        idade,
        tutor,
        castrado,
      });
    }
  );
});

app.delete("/api/animais/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM animais WHERE id = ?`, id, function (err) {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao deletar animal");
    }
    res.status(200).json({ deletedID: id });
  });
});


app.get("/api/consultas", (req, res) => {
  db.all("SELECT * FROM consultas", [], (err, rows) => {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao buscar consultas");
    }
    res.json(rows);
  });
});

app.post("/api/consultas", (req, res) => {
  const {
    tipo_consulta,
    data,
    horario,
    tutor,
    animal,
    historico_medico,
    reprodutivo,
    ambiente,
    dieta,
    higiene,
    atividade,
    medicamentos,
  } = req.body;
  db.run(
    `INSERT INTO consultas (tipo_consulta, data, horario, tutor, animal,
      historico_medico, reprodutivo, ambiente, dieta, higiene, atividade, medicamentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tipo_consulta,
      data,
      horario,
      tutor,
      animal,
      historico_medico,
      reprodutivo,
      ambiente,
      dieta,
      higiene,
      atividade,
      medicamentos,
    ],
    function (err) {
      if (err) {
        return handleDatabaseError(res, err, "Erro ao inserir consulta");
      }
      res.status(201).json({
        id: this.lastID,
        tipo_consulta,
        data,
        horario,
        tutor,
        animal,
        historico_medico,
        reprodutivo,
        ambiente,
        dieta,
        higiene,
        atividade,
        medicamentos,
      });
    }
  );
});

app.delete("/api/consultas/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM consultas WHERE id = ?`, id, function (err) {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao deletar consulta");
    }
    res.status(200).json({ deletedID: id });
  });
});


app.get("/api/vacinas", (req, res) => {
  db.all("SELECT * FROM vacinas", [], (err, rows) => {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao buscar vacinas");
    }
    res.json(rows);
  });
});

app.post("/api/vacinas", (req, res) => {
  const {
    status,
    nome,
    data,
    tipo,
    produto,
    dose_atual,
    total_doses,
    observacoes,
    fabricante,
    partida,
    fabricacao,
    validade,
    reforco,
    animal,
  } = req.body;
  console.log("Recebendo dados de vacina: ", req.body);
  db.run(
    `INSERT INTO vacinas (
      status, 
      nome, 
      data, 
      tipo, 
      produto, 
      dose_atual, 
      total_doses, 
      observacoes, 
      fabricante, 
      partida, 
      fabricacao, 
      validade, 
      reforco, 
      animal
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      status,
      nome,
      data,
      tipo,
      produto,
      dose_atual,
      total_doses,
      observacoes,
      fabricante,
      partida,
      fabricacao,
      validade,
      reforco,
      animal,
    ],
    function (err) {
      if (err) {
        console.error("Erro ao inserir vacina:", err.message);
        return handleDatabaseError(res, err, "Erro ao inserir vacina");
      }
      res.status(201).json({
        id: this.lastID,
        status,
        nome,
        data,
        tipo,
        produto,
        dose_atual,
        total_doses,
        observacoes,
        fabricante,
        partida,
        fabricacao,
        validade,
        reforco,
        animal,
      });
    }
  );
});

app.delete("/api/vacinas/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM vacinas WHERE id = ?`, id, function (err) {
    if (err) {
      return handleDatabaseError(res, err, "Erro ao deletar vacina");
    }
    res.status(200).json({ deletedID: id });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
