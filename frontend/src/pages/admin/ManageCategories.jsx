import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { fetchCategories, createCategory, deleteCategory } from "../../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await fetchCategories();
    setCategories(data.categories);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCategory({ name });
      setName("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="max-w-xl">
      <Helmet><title>Manage Categories — Admin</title></Helmet>
      <h1 className="font-display font-bold text-3xl mb-6">Manage Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="New category name" required className="input-field"
        />
        <button type="submit" className="btn-primary flex items-center gap-1"><FiPlus /> Add</button>
      </form>
      {error && <p className="text-crimson text-sm mb-4">{error}</p>}

      <ul className="divide-y divide-ink/10 dark:divide-paper/10 border border-ink/10 dark:border-paper/10 rounded-sm">
        {categories.map((c) => (
          <li key={c._id} className="flex items-center justify-between px-4 py-3">
            <span>{c.name}</span>
            <button onClick={() => handleDelete(c._id, c.name)} className="text-slate-650 hover:text-crimson">
              <FiTrash2 size={16} />
            </button>
          </li>
        ))}
        {categories.length === 0 && <li className="px-4 py-6 text-center text-slate-650">No categories yet.</li>}
      </ul>
    </div>
  );
};

export default ManageCategories;
