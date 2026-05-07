import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  studentName: "",
  phone: "",
  cpf: "",
  course: "",
  conclusionDate: "",
  sistecRegistration: "",
  diplomaRegistration: "",
  bookNumber: "",
  sheetNumber: "",
  registrationDate: "",
  trackingCode: "",
  poleId: "",
  city: "",
  status: "registrado",
  notes: "",
};

async function exportarPDF() {
  const response = await api.get("/diplomas/export/pdf", {
    responseType: "blob", // Importante para arquivos
  });

  // Cria um link temporário para o navegador baixar o arquivo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "diplomas.pdf");
  document.body.appendChild(link);
  link.click();
}

async function exportarCSV() {
  const response = await api.get("/diplomas/export/csv", {
    responseType: "blob", // Importante para arquivos
  });

  // Cria um link temporário para o navegador baixar o arquivo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "diplomas.csv");
  document.body.appendChild(link);
  link.click();
}

export default function DiplomasPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [poles, setPoles] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    poleId: "",
    city: "",
    status: "",
  });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  async function load() {
    const params = new URLSearchParams(filters).toString();
    const { data } = await api.get(`/diplomas?${params}`);
    setItems(data);
  }

  useEffect(() => {
    api.get("/poles").then(({ data }) => setPoles(data));
    load();
  }, []);

  useEffect(() => {
    load();
  }, [filters.search, filters.poleId, filters.city, filters.status]);

  const cities = useMemo(() => [...new Set(poles.map((p) => p.city))], [poles]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setSelectedFiles([]);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      studentName: item.studentName,
      phone: item.phone,
      cpf: item.cpf,
      course: item.course,
      conclusionDate: item.conclusionDate.slice(0, 10),
      sistecRegistration: item.sistecRegistration,
      diplomaRegistration: item.diplomaRegistration,
      bookNumber: item.bookNumber,
      sheetNumber: item.sheetNumber,
      registrationDate: item.registrationDate.slice(0, 10),
      trackingCode: item.trackingCode || "",
      poleId: String(item.poleId),
      city: item.city,
      status: item.status,
      notes: item.notes || "",
    });
  }
  async function baixarComprovante(id) {
    try {
      // Faz a requisição para a rota específica do comprovante
      const response = await api.get(`/diplomas/${id}/proof`, {
        responseType: "blob",
      });

      // Cria a URL do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Define o nome do arquivo (ajuste conforme necessário)
      link.setAttribute("download", `comprovante-${id}.pdf`);

      document.body.appendChild(link);
      link.click();

      // Limpeza: remove o link e libera a URL da memória
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
      // Aqui você pode colocar um alerta para o usuário
    }
  }
  async function save(e) {
    e.preventDefault();
    const payload = { ...form };

    if (editingId) {
      await api.put(`/diplomas/${editingId}`, payload);
      if (selectedFiles.length) {
        const fd = new FormData();
        Array.from(selectedFiles).forEach((file) => fd.append("files", file));
        await api.post(`/diplomas/${editingId}/attachments`, fd);
      }
    } else {
      const { data } = await api.post("/diplomas", payload);
      if (selectedFiles.length) {
        const fd = new FormData();
        Array.from(selectedFiles).forEach((file) => fd.append("files", file));
        await api.post(`/diplomas/${data.id}/attachments`, fd);
      }
    }
    resetForm();
    load();
  }

  async function remove(id) {
    if (!confirm("Deseja excluir este diploma?")) return;
    await api.delete(`/diplomas/${id}`);
    load();
  }

  return (
    <div className="grid-cols-2" style={{ alignItems: "start" }}>
      <div className="panel">
        <h3>{editingId ? "Editar diploma" : "Cadastrar diploma"}</h3>
        <form onSubmit={save} className="form-grid">
          {/* Nome do Aluno */}
          <div className="form-group">
            <label htmlFor="studentName">Nome do Aluno</label>
            <input
              id="studentName"
              value={form.studentName}
              onChange={(e) =>
                setForm({ ...form, studentName: e.target.value })
              }
              placeholder="Digite o nome completo"
            />
          </div>

          {/* Telefone */}
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>

          {/* CPF */}
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              placeholder="000.000.000-00"
            />
          </div>

          {/* Curso */}
          <div className="form-group">
            <label htmlFor="course">Curso</label>
            <input
              id="course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              placeholder="Nome do curso"
            />
          </div>

          {/* Data de Conclusão */}
          <div className="form-group">
            <label htmlFor="conclusionDate">Data de Conclusão</label>
            <input
              id="conclusionDate"
              type="date"
              value={form.conclusionDate}
              onChange={(e) =>
                setForm({ ...form, conclusionDate: e.target.value })
              }
            />
          </div>

          {/* Registro SISTEC */}
          <div className="form-group">
            <label htmlFor="sistecRegistration">Registro SISTEC</label>
            <input
              id="sistecRegistration"
              value={form.sistecRegistration}
              onChange={(e) =>
                setForm({ ...form, sistecRegistration: e.target.value })
              }
              placeholder="Número SISTEC"
            />
          </div>

          {/* Registro do Diploma */}
          <div className="form-group">
            <label htmlFor="diplomaRegistration">Registro do Diploma</label>
            <input
              id="diplomaRegistration"
              value={form.diplomaRegistration}
              onChange={(e) =>
                setForm({ ...form, diplomaRegistration: e.target.value })
              }
              placeholder="Número do registro"
            />
          </div>

          {/* Livro */}
          <div className="form-group">
            <label htmlFor="bookNumber">Livro</label>
            <input
              id="bookNumber"
              value={form.bookNumber}
              onChange={(e) => setForm({ ...form, bookNumber: e.target.value })}
              placeholder="Nº do Livro"
            />
          </div>

          {/* Folha */}
          <div className="form-group">
            <label htmlFor="sheetNumber">Folha</label>
            <input
              id="sheetNumber"
              value={form.sheetNumber}
              onChange={(e) =>
                setForm({ ...form, sheetNumber: e.target.value })
              }
              placeholder="Nº da Folha"
            />
          </div>

          {/* Data de Registro */}
          <div className="form-group">
            <label htmlFor="registrationDate">Data de Registro</label>
            <input
              id="registrationDate"
              type="date"
              value={form.registrationDate}
              onChange={(e) =>
                setForm({ ...form, registrationDate: e.target.value })
              }
            />
          </div>

          {/* Código de Rastreamento */}
          <div className="form-group">
            <label htmlFor="trackingCode">Código de Rastreamento</label>
            <input
              id="trackingCode"
              value={form.trackingCode}
              onChange={(e) =>
                setForm({ ...form, trackingCode: e.target.value })
              }
              placeholder="Ex: AA123456789BR"
            />
          </div>

          {/* Seleção do Polo */}
          <div className="form-group">
            <label htmlFor="poleId">Polo</label>
            <select
              id="poleId"
              value={form.poleId}
              onChange={(e) => {
                const pole = poles.find((p) => String(p.id) === e.target.value);
                setForm({
                  ...form,
                  poleId: e.target.value,
                  city: pole?.city || "",
                });
              }}
            >
              <option value="">Selecione o polo</option>
              {poles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.city}
                </option>
              ))}
            </select>
          </div>

          {/* Cidade */}
          <div className="form-group">
            <label htmlFor="city">Cidade</label>
            <input
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Cidade do polo"
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="registrado">Registrado</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="confeccao">Em Confecção</option>
            </select>
          </div>

          {/* Arquivos (Full Width) */}
          <div className="form-group full">
            <label htmlFor="files">Documentos Anexos</label>
            <input
              id="files"
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
          </div>

          {/* Observações (Full Width) */}
          <div className="form-group full">
            <label htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              rows="4"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Botões */}
          <div
            className="full"
            style={{ display: "flex", gap: 10, marginTop: "10px" }}
          >
            <button type="submit">{editingId ? "Atualizar" : "Salvar"}</button>
            <button type="button" className="secondary" onClick={resetForm}>
              Limpar
            </button>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <div className="toolbar">
          <input
            placeholder="Buscar aluno, CPF, curso..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <select
            value={filters.poleId}
            onChange={(e) => setFilters({ ...filters, poleId: e.target.value })}
          >
            <option value="">Todos os polos</option>
            {poles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option value="">Todas as cidades</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Todos os status</option>
            <option value="registrado">Registrado</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="confeccao">Em Confecção</option>
          </select>

          <button type="button" onClick={exportarCSV}>
            Exportar CSV{" "}
          </button>
          <button type="button" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Curso</th>
              <th>Polo</th>
              <th>Cidade</th>
              <th>Registro</th>
              <th>Status</th>
              <th>Rastreio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.studentName}</strong>
                  <br />
                  <span className="muted">{item.cpf}</span>
                </td>
                <td>{item.course}</td>
                <td>{item.pole?.name}</td>
                <td>{item.city}</td>
                <td>{item.diplomaRegistration}</td>
                <td>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </td>
                <td>{item.trackingCode || "-"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => startEdit(item)}
                  >
                    Editar
                  </button>{" "}
                  {user?.role === "admin" && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => remove(item.id)}
                    >
                      Excluir
                    </button>
                  )}{" "}
                  <button
                    type="button"
                    onClick={() => baixarComprovante(item.id)}
                  >
                    Comprovante
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan="8">Nenhum diploma encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
