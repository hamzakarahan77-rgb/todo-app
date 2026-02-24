import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
```

---

Ama asıl sorun `App.jsx` dosyasının hâlâ değiştirilmemiş olması gibi görünüyor. Şunu dene:

CMD'de:
```
notepad C:\Windows\System32\todo-app\src\App.jsx
import { useState, useEffect } from "react";

// ── Sabitler ──────────────────────────────────────────────────────────────────
const PRIORITIES = ["Düşük", "Orta", "Yüksek"];
const PRIORITY_BADGE = { Düşük: "success", Orta: "warning", Yüksek: "danger" };

// ── Yardımcı fonksiyon: benzersiz id ──────────────────────────────────────────
const uid = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

// ── Ana Bileşen ───────────────────────────────────────────────────────────────
export default function TodoApp() {
  // ── State ──
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos") || "[]");
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({ text: "", priority: "Orta" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ text: "", priority: "Orta" });
  const [filter, setFilter] = useState("Hepsi"); // Hepsi | Aktif | Tamamlandı

  // ── LocalStorage senkronizasyonu ──
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  // Ekle
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    setTodos([
      ...todos,
      {
        id: uid(),
        text: form.text.trim(),
        priority: form.priority,
        completed: false,
        createdAt: new Date().toLocaleString("tr-TR"),
      },
    ]);
    setForm({ text: "", priority: "Orta" });
  };

  // Tamamlandı toggle
  const toggleComplete = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  // Düzenleme başlat
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditForm({ text: todo.text, priority: todo.priority });
  };

  // Güncelle
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editForm.text.trim()) return;
    setTodos(
      todos.map((t) =>
        t.id === editId ? { ...t, text: editForm.text.trim(), priority: editForm.priority } : t
      )
    );
    setEditId(null);
  };

  // Sil
  const handleDelete = (id) => setTodos(todos.filter((t) => t.id !== id));

  // Hepsini sil
  const clearCompleted = () => setTodos(todos.filter((t) => !t.completed));

  // ── Filtreleme ──
  const filtered = todos.filter((t) => {
    if (filter === "Aktif") return !t.completed;
    if (filter === "Tamamlandı") return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Google Font + Bootstrap CDN  */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --bg: #0d0f14;
          --card: #151820;
          --border: #252a35;
          --accent: #f5c542;
          --accent2: #e87c3e;
          --text: #e8eaf0;
          --muted: #6b7280;
          --radius: 14px;
        }

        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

        h1 { font-family: 'Syne', sans-serif; font-size: 2.6rem; letter-spacing: -1px; }

        .accent-bar {
          height: 4px;
          width: 64px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          border-radius: 2px;
        }

        .card-todo {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }

        .todo-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: border-color .2s, transform .15s;
        }
        .todo-item:hover { border-color: var(--accent); transform: translateY(-1px); }
        .todo-item.done { opacity: .55; }

        .form-control, .form-select {
          background: #1e2230 !important;
          border-color: var(--border) !important;
          color: var(--text) !important;
          border-radius: 8px !important;
        }
        .form-control:focus, .form-select:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px rgba(245,197,66,.15) !important;
        }
        .form-control::placeholder { color: var(--muted) !important; }

        .btn-add {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #0d0f14;
          font-weight: 700;
          border: none;
          border-radius: 8px;
        }
        .btn-add:hover { filter: brightness(1.1); color: #0d0f14; }

        .btn-save {
          background: var(--accent);
          color: #0d0f14;
          font-weight: 700;
          border: none;
          border-radius: 8px;
        }

        .filter-btn { border-radius: 20px !important; font-size: .85rem; border-color: var(--border) !important; color: var(--muted) !important; background: transparent !important; }
        .filter-btn.active { background: var(--accent) !important; color: #0d0f14 !important; border-color: var(--accent) !important; font-weight: 700; }

        .checkbox-custom {
          width: 20px; height: 20px;
          accent-color: var(--accent);
          cursor: pointer;
        }

        .badge-priority { font-size: .72rem; font-weight: 700; letter-spacing: .5px; }

        .todo-text { font-size: 1rem; }
        .todo-text.strikethrough { text-decoration: line-through; color: var(--muted); }

        .icon-btn { background: none; border: none; color: var(--muted); padding: 4px 8px; border-radius: 6px; transition: color .15s, background .15s; }
        .icon-btn:hover { background: var(--border); }
        .icon-btn.edit:hover { color: var(--accent); }
        .icon-btn.del:hover { color: #ef4444; }

        .stat-pill {
          background: var(--border);
          border-radius: 20px;
          padding: 4px 14px;
          font-size: .82rem;
          color: var(--muted);
        }

        .empty-state { color: var(--muted); }

        @keyframes slideIn {
          from { opacity:0; transform: translateY(8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .todo-item { animation: slideIn .25s ease; }
      `}</style>

      <div className="container py-5" style={{ maxWidth: 680 }}>

        {/* Başlık */}
        <div className="mb-4">
          <div className="accent-bar mb-3" />
          <h1 className="mb-1">Görev Listesi</h1>
          <p style={{ color: "var(--muted)" }}>Tüm görevlerini tek yerden yönet.</p>
        </div>

        {/* Ekle Formu */}
        <div className="card-todo p-4 mb-4">
          <h6 className="mb-3 fw-bold" style={{ color: "var(--accent)", fontSize: ".8rem", letterSpacing: 1, textTransform: "uppercase" }}>
            <i className="bi bi-plus-circle me-1" /> Yeni Görev Ekle
          </h6>
          <form onSubmit={handleAdd}>
            <div className="d-flex gap-2">
              <input
                className="form-control flex-grow-1"
                placeholder="Görev yaz..."
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
              <select
                className="form-select"
                style={{ width: 120 }}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <button type="submit" className="btn btn-add px-4">
                <i className="bi bi-plus-lg" />
              </button>
            </div>
          </form>
        </div>

        {/* İstatistik + Filtreler */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="d-flex gap-2">
            {["Hepsi", "Aktif", "Tamamlandı"].map((f) => (
              <button
                key={f}
                className={`btn filter-btn btn-sm ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="d-flex gap-2 align-items-center">
            <span className="stat-pill">
              {completedCount}/{todos.length} tamamlandı
            </span>
            {completedCount > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{ fontSize: ".78rem", borderRadius: 20, borderColor: "var(--border)", color: "var(--muted)" }}
                onClick={clearCompleted}
              >
                <i className="bi bi-trash me-1" />Tamamlananları sil
              </button>
            )}
          </div>
        </div>

        {/* Görev Listesi */}
        <div className="d-flex flex-column gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-5 empty-state">
              <i className="bi bi-inbox fs-1 d-block mb-2" />
              <span>Görev bulunamadı.</span>
            </div>
          )}

          {filtered.map((todo) =>
            editId === todo.id ? (
              /* ── Düzenleme Satırı ── */
              <div key={todo.id} className="todo-item p-3">
                <form onSubmit={handleUpdate} className="d-flex gap-2">
                  <input
                    className="form-control flex-grow-1"
                    value={editForm.text}
                    onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                    autoFocus
                  />
                  <select
                    className="form-select"
                    style={{ width: 120 }}
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <button type="submit" className="btn btn-save px-3">
                    <i className="bi bi-check-lg" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    style={{ borderRadius: 8, borderColor: "var(--border)", color: "var(--muted)" }}
                    onClick={() => setEditId(null)}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </form>
              </div>
            ) : (
              /* ── Normal Satır ── */
              <div key={todo.id} className={`todo-item p-3 d-flex align-items-center gap-3 ${todo.completed ? "done" : ""}`}>
                <input
                  type="checkbox"
                  className="checkbox-custom flex-shrink-0"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                <div className="flex-grow-1 min-w-0">
                  <span className={`todo-text ${todo.completed ? "strikethrough" : ""}`}>
                    {todo.text}
                  </span>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className={`badge text-bg-${PRIORITY_BADGE[todo.priority]} badge-priority`}>
                      {todo.priority}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: ".75rem" }}>
                      <i className="bi bi-clock me-1" />{todo.createdAt}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <button className="icon-btn edit" title="Düzenle" onClick={() => startEdit(todo)}>
                    <i className="bi bi-pencil" />
                  </button>
                  <button className="icon-btn del" title="Sil" onClick={() => handleDelete(todo.id)}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Alt bilgi */}
        <p className="text-center mt-5" style={{ color: "var(--muted)", fontSize: ".78rem" }}>
          React + Bootstrap 5 · Görev Yöneticisi
        </p>
      </div>
    </>
  );
}
