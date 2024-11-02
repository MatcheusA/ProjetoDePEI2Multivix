document.addEventListener("DOMContentLoaded", () => {
  
  const applyPhoneMask = (inputElement) => {
    inputElement.addEventListener("input", (e) => {
      let input = e.target.value.replace(/\D/g, "");
      input = input.replace(/^(\d{2})(\d)/g, "($1) $2");
      input = input.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
      e.target.value = input;
    });
  };

  const telefoneInput = document.getElementById("tutor-telefone");
  if (telefoneInput) {
    applyPhoneMask(telefoneInput);
  }

 
  const adicionarTutorBtn = document.getElementById("adicionar-tutor-btn");
  const adicionarAnimalBtn = document.getElementById("adicionar-animal-btn");
  const agendarConsultaBtn = document.getElementById("agendar-consulta-btn");
  const adicionarVacinaBtn = document.getElementById("adicionar-vacina-btn");

  if (adicionarTutorBtn) {
    adicionarTutorBtn.addEventListener("click", () => {
      showModal("modal-tutor");
    });
  }

  if (adicionarAnimalBtn) {
    adicionarAnimalBtn.addEventListener("click", () => {
      showModal("modal-animal");
      prepareFormAnimal();
    });
  }

  if (agendarConsultaBtn) {
    agendarConsultaBtn.addEventListener("click", () => {
      showModal("modal-consulta");
      prepareFormConsulta();
    });
  }

  if (adicionarVacinaBtn) {
    adicionarVacinaBtn.addEventListener("click", () => {
      showModal("modal-vacina");
      prepareFormVacina();
    });
  }

  const fecharModalTutorBtn = document.getElementById("fechar-modal-tutor");
  const fecharModalAnimalBtn = document.getElementById("fechar-modal-animal");
  const fecharModalConsultaBtn = document.getElementById(
    "fechar-modal-consulta"
  );
  const fecharModalVacinaBtn = document.getElementById("fechar-modal-vacina");

  if (fecharModalTutorBtn) {
    fecharModalTutorBtn.addEventListener("click", () => {
      hideModal("modal-tutor");
    });
  }

  if (fecharModalAnimalBtn) {
    fecharModalAnimalBtn.addEventListener("click", () => {
      hideModal("modal-animal");
    });
  }

  if (fecharModalConsultaBtn) {
    fecharModalConsultaBtn.addEventListener("click", () => {
      hideModal("modal-consulta");
    });
  }

  if (fecharModalVacinaBtn) {
    fecharModalVacinaBtn.addEventListener("click", () => {
      hideModal("modal-vacina");
    });
  }

 
  window.showModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
      if (
        modalId === "modal-animal" ||
        modalId === "modal-consulta" ||
        modalId === "modal-vacina"
      ) {
        loadTutoresInSelect();
      }
      if (modalId === "modal-consulta" || modalId === "modal-vacina") {
        loadAnimaisInSelect();
      }
      if (modalId === "modal-animal") {
        fillAgeSelect();
      }
    }
  };

  window.hideModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  };

  
  const isValidTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours >= 8 && hours < 18;
  };

  
  const showError = (message) => {
    const errorDiv = document.getElementById("error-message");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
    }
  };

  const hideError = () => {
    const errorDiv = document.getElementById("error-message");
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
  };

  const getEstadoValue = () => {
    return document.getElementById("animal-estado").checked ? "Vivo" : "Morto";
  };

  
  const fillSelect = (selectId, items, formatter) => {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = '<option value="">Selecione</option>';
      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = formatter(item);
        option.textContent = formatter(item);
        select.appendChild(option);
      });
    }
  };

  
  const renderCardsList = (listId, items, formatter) => {
    const list = document.getElementById(listId);
    if (list) {
      list.innerHTML = "";
      items.forEach((item) => {
        const card = document.createElement("li");
        card.classList.add("info-card");
        card.innerHTML = formatter(item);
        list.appendChild(card);
      });
    }
  };

  const removeEmptyFields = (fields) => {
    return Object.fromEntries(Object.entries(fields).filter(([_, v]) => v));
  };

  
  const formatTutor = (tutor) => `
    <div class="info-content">
      <h3>${tutor.nome}</h3>
      <p><strong>Telefone:</strong> ${tutor.telefone}</p>
      <p><strong>Email:</strong> ${tutor.email}</p>
      <p><strong>Endereço:</strong> ${tutor.endereco}</p>
      <p><strong>Preferência:</strong> ${tutor.preferencia}</p>
    </div>
    <button class="delete-button" onclick="deleteTutor(${tutor.id})">Deletar</button>
  `;

  
  const formatAnimal = (animal) => {
    const fields = removeEmptyFields({
      Nome: animal.nome,
      Espécie: animal.especie,
      Raça: animal.raca,
      Temperamento: animal.temperamento,
      Porte: animal.porte,
      Castrado: animal.castrado,
      Idade: animal.idade && `${animal.idade} anos`,
      Tutor: animal.tutor,
      Estado: animal.estado,
    });

    let html =
      "<div class='info-content " +
      (animal.estado === "Morto" ? "animal-morto" : "") +
      "'>";
    for (const [label, value] of Object.entries(fields)) {
      html += `<p><strong>${label}:</strong> ${value}</p>`;
    }
    html += `</div><button class="delete-button" onclick="deleteAnimal(${animal.id})">Deletar</button>`;
    return html;
  };


  const formatConsulta = (consulta) => `
    <div class="info-content">
      <h3>Consulta</h3>
      <p><strong>Tipo de Consulta:</strong> ${consulta.tipo_consulta}</p>
      <p><strong>Data:</strong> ${consulta.data}</p>
      <p><strong>Horário:</strong> ${consulta.horario}</p>
      <p><strong>Tutor:</strong> ${consulta.tutor}</p>
      <p><strong>Animal:</strong> ${consulta.animal}</p>
      <div class="hidden-info" style="display: none;">
        <p><strong>Histórico Médico:</strong> ${
          consulta.historico_medico || "N/A"
        }</p>
        <p><strong>Histórico Reprodutivo:</strong> ${
          consulta.reprodutivo || "N/A"
        }</p>
        <p><strong>Informações Sobre o Ambiente:</strong> ${
          consulta.ambiente || "N/A"
        }</p>
        <p><strong>Dieta e Nutrição:</strong> ${consulta.dieta || "N/A"}</p>
        <p><strong>Rotina de Higiene:</strong> ${consulta.higiene || "N/A"}</p>
        <p><strong>Atividade Física:</strong> ${consulta.atividade || "N/A"}</p>
        <p><strong>Medicamentos e Tratamentos em Uso:</strong> ${
          consulta.medicamentos || "N/A"
        }</p>
      </div>
    </div>
    <button class="read-more-button" onclick="toggleReadMore(this)">ler mais...</button>
    <button class="delete-button" onclick="deleteConsulta(${
      consulta.id
    })">Deletar</button>
  `;

  
  const formatVacina = (vacina) => {
    const fields = removeEmptyFields({
      "Status da Vacina": vacina.status,
      "Nome da Vacina": vacina.nome,
      "Data da Vacinação": vacina.data,
      "Tipo de Vacina": vacina.tipo,
      "Nome do Produto": vacina.produto,
      "Dose Atual": vacina.dose_atual,
      "Total de Doses": vacina.total_doses,
      Observações: vacina.observacoes,
      "Nome da Fabricante": vacina.fabricante,
      "Número de Partida": vacina.partida,
      "Data de Fabricação": vacina.fabricacao,
      "Data de Validade": vacina.validade,
      "Próxima Dose ou Reforço": vacina.reforco,
      Animal: vacina.animal,
    });

    let html = "<div class='info-content'><h3>Vacina</h3>";
    for (const [label, value] of Object.entries(fields)) {
      html += `<p><strong>${label}:</strong> ${value}</p>`;
    }
    html += `</div><button class="delete-button" onclick="deleteVacina(${vacina.id})">Deletar</button>`;
    return html;
  };

  
  window.toggleReadMore = (button) => {
    const content = button.previousElementSibling.querySelector(".hidden-info");
    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
      button.textContent = "ler menos...";
    } else {
      content.style.display = "none";
      button.textContent = "ler mais...";
    }
  };

  const loadTutores = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tutores");
      const tutores = await response.json();
      renderCardsList("tutores-list", tutores, formatTutor);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAnimais = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/animais");
      const animais = await response.json();
      renderCardsList("animais-list", animais, formatAnimal);
    } catch (err) {
      console.error(err);
    }
  };

  const loadConsultas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/consultas");
      const consultas = await response.json();
      renderCardsList("consultas-list", consultas, formatConsulta);
    } catch (err) {
      console.error(err);
    }
  };

  const loadVacinas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/vacinas");
      const vacinas = await response.json();
      renderCardsList("vacinas-list", vacinas, formatVacina);
    } catch (err) {
      console.error(err);
    }
  };

  
  const fillAgeSelect = () => {
    const ageSelect = document.getElementById("animal-idade");
    if (ageSelect) {
      ageSelect.innerHTML = "";
      for (let i = 0; i <= 30; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        ageSelect.appendChild(option);
      }
    }
  };

  
  window.deleteTutor = async (id) => {
    if (confirm("Você realmente deseja deletar este tutor?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/tutores/${id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          loadTutores();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  window.deleteAnimal = async (id) => {
    if (confirm("Você realmente deseja deletar este animal?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/animais/${id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          loadAnimais();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  window.deleteConsulta = async (id) => {
    if (confirm("Você realmente deseja deletar esta consulta?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/consultas/${id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          loadConsultas();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  window.deleteVacina = async (id) => {
    if (confirm("Você realmente deseja deletar esta vacina?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/vacinas/${id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          loadVacinas();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const loadTutoresInSelect = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tutores");
      const tutores = await response.json();
      fillSelect("consulta-tutor", tutores, (tutor) => tutor.nome);
      fillSelect("animal-tutor", tutores, (tutor) => tutor.nome);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAnimaisInSelect = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/animais");
      const animais = await response.json();
      fillSelect("consulta-animal", animais, (animal) => animal.nome);
      fillSelect("vacina-animal", animais, (animal) => animal.nome);
    } catch (err) {
      console.error(err);
    }
  };

  if (window.location.pathname.includes("tutores.html")) {
    loadTutores();
    const formTutor = document.getElementById("form-tutor");
    formTutor.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        nome: document.getElementById("tutor-nome").value,
        telefone: document.getElementById("tutor-telefone").value,
        email: document.getElementById("tutor-email").value,
        endereco: document.getElementById("tutor-endereco").value,
        preferencia: document.getElementById("tutor-preferencia").value,
      };
      try {
        const response = await fetch("http://localhost:3000/api/tutores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          loadTutores();
          hideModal("modal-tutor");
          formTutor.reset();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (window.location.pathname.includes("animais.html")) {
    loadAnimais();

    const formAnimal = document.getElementById("form-animal");
    formAnimal.addEventListener("submit", async (e) => {
      e.preventDefault();
      const estado = document.getElementById("animal-estado").checked
        ? "Vivo"
        : "Morto";
      const data = {
        nome: document.getElementById("animal-nome").value,
        especie: document.getElementById("animal-especie").value,
        raca: document.getElementById("animal-raca").value,
        temperamento: document.getElementById("animal-temperamento").value,
        porte: document.getElementById("animal-porte").value,
        castrado: document.getElementById("animal-castrado").value,
        idade: document.getElementById("animal-idade").value,
        tutor: document.getElementById("animal-tutor").value,
        estado: estado,
      };
      try {
        const response = await fetch("http://localhost:3000/api/animais", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          loadAnimais();
          hideModal("modal-animal");
          formAnimal.reset();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (window.location.pathname.includes("consultas.html")) {
    loadConsultas();
    loadTutoresInSelect();
    loadAnimaisInSelect();

    const formConsulta = document.getElementById("form-consulta");
    formConsulta.addEventListener("submit", async (e) => {
      e.preventDefault();
      const tipoConsultaValue = document.querySelector(
        'input[name="tipo-consulta"]:checked'
      ).value;

      const data = {
        tipo_consulta: tipoConsultaValue,
        data: document.getElementById("consulta-data").value,
        horario: document.getElementById("consulta-horario").value,
        tutor: document.getElementById("consulta-tutor").value,
        animal: document.getElementById("consulta-animal").value,
      };

      if (data.tipo_consulta === "Detalhada")
        if (data.tipo_consulta === "Detalhada") {
          data.historico_medico =
            document.getElementById("historico-medico").value;
          data.reprodutivo = document.getElementById("reprodutivo").value;
          data.ambiente = document.getElementById("ambiente").value;
          data.dieta = document.getElementById("dieta").value;
          data.higiene = document.getElementById("higiene").value;
          data.atividade = document.getElementById("atividade").value;
          data.medicamentos = document.getElementById("medicamentos").value;
        }

      if (!isValidTime(data.horario)) {
        showError(
          "A clínica está fechada no horário selecionado. Por favor, escolha um horário entre 08:00 e 18:00."
        );
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/consultas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          loadConsultas();
          hideModal("modal-consulta");
          formConsulta.reset();
        }
      } catch (err) {
        console.error(err);
        showError("Erro ao agendar consulta.");
      }
    });

    
    const tipoConsultaRadios = document.querySelectorAll(
      'input[name="tipo-consulta"]'
    );
    tipoConsultaRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const anamneseSection = document.getElementById("anamnese-section");
        if (e.target.value === "Detalhada") {
          anamneseSection.style.display = "block";
        } else {
          anamneseSection.style.display = "none";
        }
      });
    });
  }

  
  if (window.location.pathname.includes("vacinas.html")) {
    loadVacinas();

    const formVacina = document.getElementById("form-vacina");
    formVacina.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        status: document.querySelector('input[name="status-vacina"]:checked')
          .value,
        nome: document.getElementById("vacina-nome").value,
        data: document.getElementById("vacina-data").value,
        tipo: document.getElementById("vacina-tipo").value,
        produto: document.getElementById("vacina-produto").value,
        dose_atual: document.getElementById("vacina-dose-atual").value,
        total_doses: document.getElementById("vacina-total-doses").value,
        observacoes: document.getElementById("vacina-observacoes").value,
        fabricante: document.getElementById("vacina-fabricante").value,
        partida: document.getElementById("vacina-partida").value,
        fabricacao: document.getElementById("vacina-fabricacao").value,
        validade: document.getElementById("vacina-validade").value,
        reforco: document.getElementById("vacina-reforco").checked
          ? "Sim"
          : "Não",
        animal: document.getElementById("vacina-animal").value,
      };

      try {
        const response = await fetch("http://localhost:3000/api/vacinas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          loadVacinas();
          hideModal("modal-vacina");
          formVacina.reset();
        }
      } catch (err) {
        console.error("Erro ao adicionar vacina:", err);
      }
    });
  }

  
  window.toggleTheme = function () {
    const body = document.body;
    const themeToggle = document.querySelector(".theme-toggle");

    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "🌙";
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "☀️";
    }
  };

 
  const theme = localStorage.getItem("theme");
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (theme === "dark" || (!theme && prefersDarkScheme)) {
    document.body.classList.add("dark");
    document.querySelector(".theme-toggle").textContent = "🌙";
  } else {
    document.body.classList.remove("dark");
    document.querySelector(".theme-toggle").textContent = "☀️";
  }

  
  const themeToggleButton = document.querySelector(".theme-toggle");
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }
});
