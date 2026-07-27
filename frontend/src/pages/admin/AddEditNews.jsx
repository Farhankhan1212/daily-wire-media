import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { fetchCategories, fetchNewsById, createNews, updateNews } from "../../services/api";

const AUTO_DELETE_OPTIONS = [
  { value: "never", label: "Never Delete" },
  { value: "24h", label: "Delete after 24 Hours" },
  { value: "3d", label: "Delete after 3 Days" },
  { value: "7d", label: "Delete after 7 Days" },
  { value: "30d", label: "Delete after 30 Days" },
];

const emptyForm = {
  title: "", category: "", description: "", content: "", author: "",
  tags: "", breaking: false, featured: false, trending: false,
  status: "draft", autoDeleteDuration: "never", metaTitle: "", metaDescription: "",
};

const AddEditNews = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data } = await fetchNewsById(id);
      const match = data.news;
      if (match) {
        setForm({
          title: match.title,
          category: match.category?._id || "",
          description: match.description,
          content: match.content,
          author: match.author,
          tags: (match.tags || []).map((t) => t.name).join(", "),
          breaking: match.breaking,
          featured: match.featured,
          trending: match.trending,
          status: match.status,
          autoDeleteDuration: match.autoDeleteDuration || "never",
          metaTitle: match.metaTitle || "",
          metaDescription: match.metaDescription || "",
        });
        setExistingImage(match.image?.url || "");
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) await updateNews(id, fd);
      else await createNews(fd);

      navigate("/admin/news");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Helmet><title>{isEdit ? "Edit" : "Add"} News — Admin</title></Helmet>
      <h1 className="font-display font-bold text-3xl mb-6">{isEdit ? "Edit" : "Add"} News</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold block mb-1">Title</label>
          <input name="title" required value={form.title} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Category</label>
            <select name="category" required value={form.category} onChange={handleChange} className="input-field">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Author</label>
            <input name="author" required value={form.author} onChange={handleChange} className="input-field" placeholder="Staff Reporter" />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Short Description</label>
          <textarea name="description" required maxLength={400} rows={3} value={form.description} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Full Content</label>
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(val) => setForm((f) => ({ ...f, content: val }))}
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Featured Image</label>
          {existingImage && !imageFile && (
            <img src={existingImage} alt="current" className="w-40 h-24 object-cover rounded-sm mb-2" />
          )}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="elections, budget, delhi" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Auto Delete</label>
            <select name="autoDeleteDuration" value={form.autoDeleteDuration} onChange={handleChange} className="input-field">
              {AUTO_DELETE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {["breaking", "featured", "trending"].map((flag) => (
            <label key={flag} className="flex items-center gap-2 text-sm font-medium capitalize">
              <input type="checkbox" name={flag} checked={form[flag]} onChange={handleChange} />
              {flag} News
            </label>
          ))}
        </div>

        <details className="border border-ink/10 dark:border-paper/10 rounded-sm p-4">
          <summary className="cursor-pointer font-semibold text-sm">SEO Settings (optional)</summary>
          <div className="mt-4 space-y-3">
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="Meta title" className="input-field" />
            <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Meta description" rows={2} className="input-field" />
          </div>
        </details>

        {error && <p className="text-crimson text-sm">{error}</p>}

        <div className="flex gap-3">
          <button disabled={saving} type="submit" className="btn-primary">
            {saving ? "Saving…" : isEdit ? "Update Article" : "Publish Article"}
          </button>
          <button type="button" onClick={() => navigate("/admin/news")} className="btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNews;
