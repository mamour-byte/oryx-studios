"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Loader2,
  LogOut,
  Folder,
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  Upload,
  Play,
  Check,
  ExternalLink,
  Sparkles,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Save,
} from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [slider, setSlider] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [films, setFilms] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState<"slider" | "albums" | "films">("albums");

  // Forms states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Slider form
  const [sliderFile, setSliderFile] = useState<File | null>(null);
  const [sliderTag, setSliderTag] = useState("Oryx Studios");
  const [sliderHeadline, setSliderHeadline] = useState("");
  const [sliderSubline, setSliderSubline] = useState("");
  const [sliderDetail, setSliderDetail] = useState("");
  const [sliderAccent, setSliderAccent] = useState("#7dd3fc");

  // 2. Albums form
  const [selectedAlbumId, setSelectedAlbumId] = useState(""); // for existing album
  const [newAlbumTitle, setNewAlbumTitle] = useState(""); // for new album
  const [albumPhotos, setAlbumPhotos] = useState<FileList | null>(null);
  const [viewingAlbumId, setViewingAlbumId] = useState<string | null>(null);

  // 3. Films form
  const [filmSourceType, setFilmSourceType] = useState<"youtube" | "video">("youtube");
  const [filmYoutubeUrl, setFilmYoutubeUrl] = useState("");
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmCategory, setFilmCategory] = useState("Clip musical");
  const [filmDuration, setFilmDuration] = useState("");
  const [filmDescription, setFilmDescription] = useState("");
  const [filmClient, setFilmClient] = useState("");
  const [filmYear, setFilmYear] = useState(new Date().getFullYear().toString());

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch all media when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchMedia = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setSlider(data.slider || []);
        setAlbums(data.albums || []);
        setFilms(data.films || []);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setLoginError(data.error || "Mot de passe incorrect.");
      }
    } catch {
      setLoginError("Une erreur est survenue.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      // Reset lists
      setSlider([]);
      setAlbums([]);
      setFilms([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Toast message helpers
  const showToast = (success: boolean, msg: string) => {
    if (success) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 5000);
    }
  };

  const handleDelete = async (publicId: string, resourceType: "image" | "video") => {
    if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, resourceType }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(true, "Média supprimé avec succès !");
        fetchMedia();
      } else {
        showToast(false, data.error || "Erreur de suppression.");
      }
    } catch {
      showToast(false, "Une erreur est survenue.");
    }
  };

  // Move an item up or down in a list (returns new list)
  const handleMoveItem = <T extends { id: string | number }>(list: T[], id: string | number, dir: "up" | "down"): T[] => {
    const idx = list.findIndex((item) => item.id === id);
    if (idx < 0) return list;
    if (dir === "up" && idx === 0) return list;
    if (dir === "down" && idx === list.length - 1) return list;
    const newList = [...list];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    return newList;
  };

  // Save the current order of a list to Cloudinary
  const handleSaveOrder = async (list: any[], section: "slider" | "films" | "albums") => {
    setReorderLoading(true);
    try {
      // For slider and films: use item.id as publicId
      // For albums: use album.id as publicId (the albumId context)
      const items = list.map((item, idx) => ({
        publicId: item.id,
        order: idx,
      }));
      const res = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(true, "Ordre sauvegardé avec succès !");
      } else {
        showToast(false, data.error || "Erreur de sauvegarde de l'ordre.");
      }
    } catch {
      showToast(false, "Une erreur réseau est survenue.");
    } finally {
      setReorderLoading(false);
    }
  };

  const handleUploadSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sliderFile) return showToast(false, "Veuillez sélectionner un fichier.");

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", sliderFile);
      formData.append("section", "slider");
      formData.append("tag", sliderTag);
      formData.append("headline", sliderHeadline);
      formData.append("subline", sliderSubline);
      formData.append("detail", sliderDetail);
      formData.append("accent", sliderAccent);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast(true, "Slide ajouté avec succès !");
        setSliderFile(null);
        setSliderHeadline("");
        setSliderSubline("");
        setSliderDetail("");
        // Reset file input
        const fileInput = document.getElementById("slider-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchMedia();
      } else {
        showToast(false, data.error || "Erreur d'upload.");
      }
    } catch {
      showToast(false, "Une erreur réseau est survenue.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUploadPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !selectedAlbumId;
    if (isNew && !newAlbumTitle) return showToast(false, "Titre de l'album requis.");
    if (!albumPhotos || albumPhotos.length === 0) return showToast(false, "Veuillez sélectionner au moins une photo.");

    setUploadLoading(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      const albumTitle = isNew ? newAlbumTitle : albums.find((a) => a.id === selectedAlbumId)?.title || "Album";
      const albumId = isNew ? "" : selectedAlbumId;

      for (let i = 0; i < albumPhotos.length; i++) {
        const file = albumPhotos[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("section", "photo");
        formData.append("albumTitle", albumTitle);
        if (albumId) formData.append("albumId", albumId);
        // First photo in new album becomes the cover by default
        if (isNew && i === 0) {
          formData.append("isCover", "true");
        }

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) successCount++;
        else failedCount++;
      }

      if (successCount > 0) {
        showToast(true, `${successCount} photo(s) téléversée(s) avec succès !`);
        setNewAlbumTitle("");
        setSelectedAlbumId("");
        setAlbumPhotos(null);
        const fileInput = document.getElementById("album-photos") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchMedia();
      } else {
        showToast(false, "Aucune photo n'a pu être téléversée.");
      }
    } catch {
      showToast(false, "Erreur lors du traitement de l'album.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSetCover = async (photoUrl: string, albumId: string, albumTitle: string) => {
    // Setting cover is a simple trick: we search for the image in Cloudinary with matching url and update context 'isCover' to true.
    // However, our API also sets 'isCover=false' on other photos in the album.
    // To implement this securely, we can just call upload endpoint or a simple cover update endpoint.
    // Since we don't have a dedicated update API yet, we can just upload a transparent metadata file, or let's create a cover API.
    // Wait, simpler: we can build this cover setting. But since it's just metadata, what if we keep it simple or implement it?
    // Let's just create a quick action, but wait! Let's check how the user handles covers.
    // Usually, just letting the first photo be the cover is fine, or we can just support cover selection in the admin dashboard by modifying the context.
    // Let's create an API endpoint or handle it in a quick way, or simply tell the user that the first photo uploaded acts as the cover, OR we can implement updating context.
    // Wait! Let's implement a quick metadata update in `delete/route.ts` or as a new endpoint `/api/admin/update-cover`.
    // Actually, Cloudinary context can be updated easily via Admin API: `cloudinary.v2.api.update(public_id, { context: 'isCover=true' })`.
    // Let's implement an endpoint `/api/admin/set-cover` to make it a premium feature!
    setUploadLoading(true);
    try {
      const res = await fetch("/api/admin/set-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl, albumId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(true, "Couverture mise à jour !");
        fetchMedia();
      } else {
        showToast(false, data.error || "Erreur de mise à jour.");
      }
    } catch {
      showToast(false, "Erreur réseau.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUploadFilm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (filmSourceType === "youtube" && !filmYoutubeUrl) {
      return showToast(false, "Veuillez entrer l'URL de la vidéo YouTube.");
    }
    if (filmSourceType === "video" && !filmFile) {
      return showToast(false, "Veuillez sélectionner un fichier vidéo.");
    }

    setUploadLoading(true);
    try {
      if (filmSourceType === "youtube") {
        // Call YouTube endpoint
        const res = await fetch("/api/admin/add-youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: filmYoutubeUrl,
            title: filmTitle,
            category: filmCategory,
            duration: filmDuration,
            description: filmDescription,
            client: filmClient,
            year: filmYear,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(true, "Vidéo YouTube ajoutée avec succès !");
          setFilmYoutubeUrl("");
          setFilmTitle("");
          setFilmDuration("");
          setFilmDescription("");
          setFilmClient("");
          fetchMedia();
        } else {
          showToast(false, data.error || "Erreur d'ajout.");
        }
      } else {
        // Video upload
        const formData = new FormData();
        formData.append("file", filmFile!);
        formData.append("section", "film");
        formData.append("title", filmTitle);
        formData.append("category", filmCategory);
        formData.append("duration", filmDuration);
        formData.append("description", filmDescription);
        formData.append("client", filmClient);
        formData.append("year", filmYear);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          showToast(true, "Film vidéo téléversé avec succès !");
          setFilmFile(null);
          setFilmTitle("");
          setFilmDuration("");
          setFilmDescription("");
          setFilmClient("");
          const fileInput = document.getElementById("film-file") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
          fetchMedia();
        } else {
          showToast(false, data.error || "Erreur d'upload.");
        }
      }
    } catch {
      showToast(false, "Une erreur est survenue lors de l'ajout.");
    } finally {
      setUploadLoading(false);
    }
  };

  // Loading state on checkAuth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-gray-400 font-medium">Chargement du portail admin...</p>
        </div>
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <Lock className="text-blue-400" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Oryx Studios</h1>
            <p className="text-gray-400 text-sm mt-1">Espace d'administration sécurisé</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2">
                Mot de passe d'accès
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {loginError && (
              <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/40 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD PANEL
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
      {/* Toast notifications */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/20 animate-fade-in-down">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Check size={14} />
          </div>
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 bg-rose-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-rose-400/20 animate-fade-in-down">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Trash2 size={14} />
          </div>
          <span className="font-medium text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-900 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-blue-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Oryx Studios</h1>
              <p className="text-xs text-gray-500">Console d'administration média</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-xs font-semibold text-gray-400 hover:text-white transition flex items-center gap-1.5 bg-gray-900 px-3 py-2 rounded-lg border border-gray-800"
            >
              Voir le site <ExternalLink size={12} />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-950/20 hover:bg-red-900/35 border border-red-900/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg text-xs font-semibold transition"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-gray-950/40 border border-gray-900 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
              SECTIONS
            </p>
            <button
              onClick={() => {
                setActiveTab("albums");
                setViewingAlbumId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "albums"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/50"
              }`}
            >
              <Folder size={18} /> Albums Photos
            </button>
            <button
              onClick={() => setActiveTab("slider")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "slider"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/50"
              }`}
            >
              <ImageIcon size={18} /> Slider d'accueil
            </button>
            <button
              onClick={() => setActiveTab("films")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "films"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/50"
              }`}
            >
              <Film size={18} /> Portfolio Films
            </button>
          </div>

          {/* Quick status */}
          <div className="bg-gray-950/20 border border-gray-900 rounded-2xl p-4 text-xs space-y-3 text-gray-400">
            <p className="font-bold text-white text-[10px] uppercase tracking-widest">
              ÉTAT DU PORTFOLIO
            </p>
            <div className="flex justify-between">
              <span>Slides Slider :</span>
              <span className="font-semibold text-white">{slider.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Albums :</span>
              <span className="font-semibold text-white">{albums.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Vidéos / Films :</span>
              <span className="font-semibold text-white">{films.length}</span>
            </div>
          </div>
        </aside>

        {/* Dashboard Work Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* TAB 1: ALBUMS */}
          {activeTab === "albums" && (
            <div className="space-y-8">
              {/* Form Create/Upload */}
              <div className="bg-gray-950/40 border border-gray-900 p-6 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-blue-400" size={20} /> Ajouter des photos à la Galerie
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Créez un nouvel album ou ajoutez des images à un album existant.
                  </p>
                </div>

                <form onSubmit={handleUploadPhotos} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Album Existant
                      </label>
                      <select
                        value={selectedAlbumId}
                        onChange={(e) => {
                          setSelectedAlbumId(e.target.value);
                          if (e.target.value) setNewAlbumTitle("");
                        }}
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Créer un nouvel album --</option>
                        {albums.map((album) => (
                          <option key={album.id} value={album.id}>
                            {album.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {!selectedAlbumId && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                          Nom du Nouvel Album
                        </label>
                        <input
                          type="text"
                          value={newAlbumTitle}
                          onChange={(e) => setNewAlbumTitle(e.target.value)}
                          placeholder="Ex: Portraits Artistiques 2025"
                          className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Sélectionner des Photos
                    </label>
                    <input
                      type="file"
                      id="album-photos"
                      multiple
                      accept="image/*"
                      onChange={(e) => setAlbumPhotos(e.target.files)}
                      className="w-full bg-black/40 border border-gray-800 border-dashed rounded-xl px-4 py-6 text-sm text-gray-400 focus:outline-none hover:border-blue-500/50 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      Vous pouvez sélectionner plusieurs photos à la fois.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Mise en ligne...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Téléverser les photos
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* View Albums */}
              {viewingAlbumId ? (
                // Viewing a specific album's photos
                <div className="bg-gray-950/20 border border-gray-900 p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                    <div>
                      <button
                        onClick={() => setViewingAlbumId(null)}
                        className="text-xs text-blue-400 hover:underline mb-1 inline-block"
                      >
                        ← Retour aux albums
                      </button>
                      <h3 className="text-xl font-bold text-white">
                        Album : {albums.find((a) => a.id === viewingAlbumId)?.title}
                      </h3>
                    </div>
                  </div>

                  {dataLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {albums
                        .find((a) => a.id === viewingAlbumId)
                        ?.photos.map((photoUrl: string) => {
                          const isCover =
                            albums.find((a) => a.id === viewingAlbumId)?.cover === photoUrl;

                          // Helper to get public id from URL: extract /oryx-studios/photo/filename.jpg
                          const match = photoUrl.match(/\/oryx-studios\/[^/]+\/([^/.]+)/);
                          const publicId = match ? `oryx-studios/photo/${match[1]}` : "";

                          return (
                            <div
                              key={photoUrl}
                              className="relative aspect-[4/5] rounded-xl overflow-hidden group border border-gray-900 bg-gray-950"
                            >
                              <img
                                src={photoUrl}
                                alt="Album Photo"
                                className="w-full h-full object-cover"
                              />

                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
                                <div className="flex justify-between items-start">
                                  {isCover ? (
                                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                                      Couverture
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleSetCover(photoUrl, viewingAlbumId, albums.find((a) => a.id === viewingAlbumId)?.title)
                                      }
                                      className="bg-white/20 hover:bg-white/40 text-white text-[9px] font-bold px-2 py-0.5 rounded transition"
                                    >
                                      Mettre en couverture
                                    </button>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleDelete(publicId, "image")}
                                  className="w-full py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                                >
                                  <Trash2 size={12} /> Supprimer
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                // Display Albums Grid
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold text-white">Albums Existants</h3>
                    {albums.length > 1 && (
                      <button
                        onClick={() => handleSaveOrder(albums, "albums")}
                        disabled={reorderLoading}
                        className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        {reorderLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        Sauvegarder l'ordre
                      </button>
                    )}
                  </div>
                  {dataLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                  ) : albums.length === 0 ? (
                    <div className="text-center py-12 bg-gray-950/20 border border-gray-900 rounded-2xl text-gray-500 text-sm">
                      Aucun album configuré pour le moment.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {albums.map((album, idx) => (
                        <div
                          key={album.id}
                          className="bg-gray-950/30 border border-gray-900 rounded-2xl overflow-hidden flex items-center gap-4 p-2 hover:border-gray-800 transition group"
                        >
                          {/* Order controls */}
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setAlbums((prev) => handleMoveItem(prev, album.id, "up")); }}
                              disabled={idx === 0}
                              className="p-1 rounded-lg bg-gray-800/60 hover:bg-blue-700/60 disabled:opacity-20 text-white transition"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <GripVertical size={14} className="text-gray-600 mx-auto" />
                            <button
                              onClick={(e) => { e.stopPropagation(); setAlbums((prev) => handleMoveItem(prev, album.id, "down")); }}
                              disabled={idx === albums.length - 1}
                              className="p-1 rounded-lg bg-gray-800/60 hover:bg-blue-700/60 disabled:opacity-20 text-white transition"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>

                          {/* Position */}
                          <span className="text-xs font-bold text-gray-500 w-5 text-center flex-shrink-0">{idx + 1}</span>

                          {/* Cover */}
                          <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                            <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                          </div>

                          {/* Info — clickable to navigate */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => setViewingAlbumId(album.id)}
                          >
                            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition truncate">
                              {album.title}
                            </h4>
                            <span className="text-[10px] text-blue-400 font-semibold">
                              {album.photos.length} photo(s) — Gérer l'album →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SLIDER */}
          {activeTab === "slider" && (
            <div className="space-y-8">
              {/* Form Add Slide */}
              <div className="bg-gray-950/40 border border-gray-900 p-6 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-blue-400" size={20} /> Ajouter un Slide Hero
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Téléversez une image ou vidéo pour le slider plein écran de la page d'accueil.
                  </p>
                </div>

                <form onSubmit={handleUploadSlider} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Fichier Média (Image ou Vidéo MP4)
                      </label>
                      <input
                        type="file"
                        id="slider-file"
                        required
                        accept="image/*,video/mp4"
                        onChange={(e) => setSliderFile(e.target.files?.[0] || null)}
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Surtitre / Tag
                      </label>
                      <input
                        type="text"
                        value={sliderTag}
                        onChange={(e) => setSliderTag(e.target.value)}
                        placeholder="Ex: Shooting / Portrait"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Titre Principal (Headline)
                      </label>
                      <input
                        type="text"
                        value={sliderHeadline}
                        onChange={(e) => setSliderHeadline(e.target.value)}
                        placeholder="Ex: La lumière"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Sous-titre (Subline)
                      </label>
                      <input
                        type="text"
                        value={sliderSubline}
                        onChange={(e) => setSliderSubline(e.target.value)}
                        placeholder="Ex: comme langage."
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Détail / Description courte
                      </label>
                      <input
                        type="text"
                        value={sliderDetail}
                        onChange={(e) => setSliderDetail(e.target.value)}
                        placeholder="Ex: Séances portraits & identité visuelle"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Accent de Couleur (Hex)
                      </label>
                      <input
                        type="color"
                        value={sliderAccent}
                        onChange={(e) => setSliderAccent(e.target.value)}
                        className="w-full h-[42px] bg-black/40 border border-gray-800 rounded-xl p-1 focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Envoi...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Ajouter la slide
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Slider list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-bold text-white">Slides Actives</h3>
                  {slider.length > 1 && (
                    <button
                      onClick={() => handleSaveOrder(slider, "slider")}
                      disabled={reorderLoading}
                      className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      {reorderLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      Sauvegarder l'ordre
                    </button>
                  )}
                </div>
                {dataLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                  </div>
                ) : slider.length === 0 ? (
                  <div className="text-center py-12 bg-gray-950/20 border border-gray-900 rounded-2xl text-gray-500 text-sm">
                    Aucun slide configuré. Le site utilise les images locales par défaut.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {slider.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="bg-gray-950/30 border border-gray-900 rounded-2xl overflow-hidden flex items-center gap-4 p-2 group"
                      >
                        {/* Order controls */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => setSlider((prev) => handleMoveItem(prev, slide.id, "up"))}
                            disabled={idx === 0}
                            className="p-1 rounded-lg bg-gray-800/60 hover:bg-blue-700/60 disabled:opacity-20 text-white transition"
                            title="Déplacer vers le haut"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <GripVertical size={14} className="text-gray-600 mx-auto" />
                          <button
                            onClick={() => setSlider((prev) => handleMoveItem(prev, slide.id, "down"))}
                            disabled={idx === slider.length - 1}
                            className="p-1 rounded-lg bg-gray-800/60 hover:bg-blue-700/60 disabled:opacity-20 text-white transition"
                            title="Déplacer vers le bas"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        {/* Position badge */}
                        <span className="text-xs font-bold text-gray-500 w-5 text-center flex-shrink-0">{idx + 1}</span>

                        {/* Thumbnail */}
                        <div className="w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                          {slide.type === "video" ? (
                            <video src={slide.video} muted className="w-full h-full object-cover" />
                          ) : (
                            <img src={slide.image} alt={slide.tag} className="w-full h-full object-cover" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <span className="bg-blue-600/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-blue-400 uppercase">
                            {slide.tag}
                          </span>
                          {slide.headline && (
                            <h4 className="font-bold text-white text-sm mt-1 truncate">
                              {slide.headline} {slide.subline}
                            </h4>
                          )}
                          {slide.detail && (
                            <p className="text-xs text-gray-400 truncate">{slide.detail}</p>
                          )}
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(slide.id, slide.type)}
                          className="flex-shrink-0 bg-red-600/80 hover:bg-red-600 p-2 rounded-lg text-white transition shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FILMS */}
          {activeTab === "films" && (
            <div className="space-y-8">
              {/* Form Add Film */}
              <div className="bg-gray-950/40 border border-gray-900 p-6 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-blue-400" size={20} /> Ajouter un Film Portfolio
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Intégrez une vidéo YouTube ou téléversez directement une vidéo MP4 sur Cloudinary.
                  </p>
                </div>

                <form onSubmit={handleUploadFilm} className="space-y-4">
                  <div className="flex border-b border-gray-900 pb-3 gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                      <input
                        type="radio"
                        checked={filmSourceType === "youtube"}
                        onChange={() => setFilmSourceType("youtube")}
                        className="text-blue-600 focus:ring-0"
                      />
                      Lien YouTube
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                      <input
                        type="radio"
                        checked={filmSourceType === "video"}
                        onChange={() => setFilmSourceType("video")}
                        className="text-blue-600 focus:ring-0"
                      />
                      Téléverser Vidéo (MP4)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={filmSourceType === "youtube" ? "" : "hidden"}>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Lien / URL YouTube
                      </label>
                      <input
                        type="url"
                        value={filmYoutubeUrl}
                        onChange={(e) => setFilmYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className={filmSourceType === "video" ? "" : "hidden"}>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Fichier Vidéo (MP4, MOV, M4V)
                      </label>
                      <input
                        type="file"
                        id="film-file"
                        accept="video/mp4,video/quicktime,video/x-m4v,video/*"
                        onChange={(e) => setFilmFile(e.target.files?.[0] || null)}
                        className="w-full bg-black/40 border border-gray-800 border-dashed rounded-xl px-4 py-6 text-sm text-gray-400 focus:outline-none hover:border-blue-500/50 cursor-pointer"
                      />
                      {filmFile && (
                        <p className="text-[10px] text-emerald-400 mt-1">
                          ✓ {filmFile.name} ({(filmFile.size / 1024 / 1024).toFixed(1)} Mo)
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Titre du Film
                      </label>
                      <input
                        type="text"
                        required
                        value={filmTitle}
                        onChange={(e) => setFilmTitle(e.target.value)}
                        placeholder="Ex: Clip musical Thiompetance"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Catégorie
                      </label>
                      <input
                        type="text"
                        value={filmCategory}
                        onChange={(e) => setFilmCategory(e.target.value)}
                        placeholder="Ex: Clip musical / Publicité"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Durée (Ex: 2:45)
                      </label>
                      <input
                        type="text"
                        value={filmDuration}
                        onChange={(e) => setFilmDuration(e.target.value)}
                        placeholder="Ex: 2:45"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Client
                      </label>
                      <input
                        type="text"
                        value={filmClient}
                        onChange={(e) => setFilmClient(e.target.value)}
                        placeholder="Ex: Akhlou Brick"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Année de Production
                      </label>
                      <input
                        type="text"
                        value={filmYear}
                        onChange={(e) => setFilmYear(e.target.value)}
                        placeholder="Ex: 2025"
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Description du Projet
                    </label>
                    <textarea
                      value={filmDescription}
                      onChange={(e) => setFilmDescription(e.target.value)}
                      placeholder="Décrivez l'aspect artistique, les coulisses ou les intentions du projet..."
                      rows={3}
                      className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Traitement...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Ajouter le film
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Films list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-bold text-white">Films Actifs</h3>
                  {films.length > 1 && (
                    <button
                      onClick={() => handleSaveOrder(films, "films")}
                      disabled={reorderLoading}
                      className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      {reorderLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      Sauvegarder l'ordre
                    </button>
                  )}
                </div>
                {dataLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                  </div>
                ) : films.length === 0 ? (
                  <div className="text-center py-12 bg-gray-950/20 border border-gray-900 rounded-2xl text-gray-500 text-sm">
                    Aucun film configuré. Le site utilise les vidéos locales par défaut.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {films.map((film, idx) => (
                      <div
                        key={film.id}
                        className="bg-gray-950/30 border border-gray-900 rounded-2xl overflow-hidden flex items-center gap-4 p-2 group"
                      >
                        {/* Order controls */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => setFilms((prev) => handleMoveItem(prev, film.id, "up"))}
                            disabled={idx === 0}
                            className="p-1 rounded-lg bg-gray-800/60 hover:bg-blue-700/60 disabled:opacity-20 text-white transition"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <GripVertical size={14} className="text-gray-600 mx-auto" />
                          <button
                            onClick={() => setFilms((prev) => handleMoveItem(prev, film.id, "down"))}
                            disabled={idx === films.length - 1}
                            className="p-1 rounded-lg bg-gray-800/60 hover:bg-blue-700/60 disabled:opacity-20 text-white transition"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        {/* Position */}
                        <span className="text-xs font-bold text-gray-500 w-5 text-center flex-shrink-0">{idx + 1}</span>

                        {/* Thumbnail */}
                        <div className="w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-black relative">
                          <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="w-7 h-7 rounded-full bg-white/90 text-blue-600 flex items-center justify-center">
                              <Play size={12} fill="currentColor" />
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <span className="bg-blue-600/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-blue-400 uppercase">
                            {film.category}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-1 truncate">{film.title}</h4>
                          <div className="flex gap-3 text-[10px] text-gray-500 mt-0.5">
                            {film.client && <span>Client: <strong className="text-gray-400">{film.client}</strong></span>}
                            {film.year && <span>Année: <strong className="text-gray-400">{film.year}</strong></span>}
                            <span className="text-gray-600">{film.sourceType === "youtube" ? "YouTube" : "Cloudinary"}</span>
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(film.id, film.sourceType === "video" ? "video" : "image")}
                          className="flex-shrink-0 bg-red-600/80 hover:bg-red-600 p-2 rounded-lg text-white transition shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
