import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { api } from "./api.js";
import Navbar from "./components/Navbar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import HomePage from "./pages/HomePage.jsx";
import SellPage from "./pages/SellPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const categories = [
  { label: "All" },
  { label: "Books" },
  { label: "Electronics" },
  { label: "Cycle" },
  { label: "Furniture" },
  { label: "Hostel" },
  { label: "Calculator" }
];

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("campus_cart_user") || "null"));
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const savedIds = useMemo(() => new Set(wishlist.map((item) => item._id)), [wishlist]);

  async function loadItems() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    const data = await api(`/items?${params.toString()}`);
    setItems(data.items || []);
  }

  async function loadPrivateData() {
    if (!user) return;

    try {
      const [saved, mine, chats] = await Promise.all([
        api("/items/wishlist"),
        api("/items/my-listings"),
        api("/chats")
      ]);
      setWishlist(saved.items || []);
      setMyListings(mine.items || []);
      setConversations(chats.conversations || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadItems().catch((error) => setNotice(error.message));
  }, [search, category]);

  useEffect(() => {
    loadPrivateData().catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return undefined;

    const refresh = () => {
      api(`/chats/${selectedChat._id}/messages`)
        .then((data) => {
          setSelectedChat(data.conversation);
          setMessages(data.messages || []);
        })
        .catch((error) => setNotice(error.message));
    };

    refresh();
    const timer = setInterval(refresh, 8000);
    return () => clearInterval(timer);
  }, [selectedChat?._id]);

  function saveSession(data) {
    localStorage.setItem("campus_cart_token", data.token);
    localStorage.setItem("campus_cart_user", JSON.stringify(data.user));
    setUser(data.user);
    setNotice(`Welcome, ${data.user.name}`);
    setAuthModalOpen(false);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const data = await api(`/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      saveSession(data);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  function openAuthModal(mode) {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
  }

  function logout() {
    localStorage.removeItem("campus_cart_token");
    localStorage.removeItem("campus_cart_user");
    setUser(null);
    setWishlist([]);
    setMyListings([]);
    setConversations([]);
    setSelectedChat(null);
  }

  async function createItem(event) {
    event.preventDefault();
    setBusy(true);

    try {
      await api("/items", {
        method: "POST",
        body: new FormData(event.currentTarget)
      });
      event.currentTarget.reset();
      setNotice("Item listed successfully");
      await Promise.all([loadItems(), loadPrivateData()]);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleWishlist(item) {
    if (!user) {
      setAuthMode("login");
      setAuthModalOpen(true);
      return;
    }

    try {
      await api(`/items/${item._id}/wishlist`, { method: "PATCH" });
      await loadPrivateData();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function toggleSold(item) {
    try {
      await api(`/items/${item._id}/sold`, { method: "PATCH" });
      await Promise.all([loadItems(), loadPrivateData()]);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function startChat(item) {
    if (!user) {
      setAuthMode("login");
      setAuthModalOpen(true);
      return;
    }

    try {
      const data = await api(`/chats/start/${item._id}`, { method: "POST" });
      setSelectedChat(data.conversation);
      await loadPrivateData();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function deleteItem(itemId) {
    try {
      await api(`/items/${itemId}`, { method: "DELETE" });
      setNotice("Listing deleted successfully");
      await Promise.all([loadItems(), loadPrivateData()]);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = form.get("text")?.toString().trim();
    if (!text) return;

    try {
      await api(`/chats/${selectedChat._id}/messages`, {
        method: "POST",
        body: JSON.stringify({ text })
      });
      event.currentTarget.reset();
      const data = await api(`/chats/${selectedChat._id}/messages`);
      setMessages(data.messages || []);
      await loadPrivateData();
    } catch (error) {
      setNotice(error.message);
    }
  }

  function refreshChat() {
    if (!selectedChat) return;
    api(`/chats/${selectedChat._id}/messages`)
      .then((data) => setMessages(data.messages || []))
      .catch((error) => setNotice(error.message));
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar
          user={user}
          search={search}
          category={category}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onOpenAuth={openAuthModal}
          onLogout={logout}
        />

        <main className="app-main">
          {notice && (
            <div className="notice" onClick={() => setNotice("")}>{notice}</div>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  items={items}
                  categories={categories}
                  activeCategory={category}
                  onCategorySelect={setCategory}
                  savedIds={savedIds}
                  onToggleWishlist={toggleWishlist}
                  onChat={startChat}
                  userId={user?.id}
                />
              }
            />
            <Route path="/sell" element={<SellPage user={user} busy={busy} onSubmit={createItem} />} />
            <Route
              path="/wishlist"
              element={<WishlistPage items={wishlist} savedIds={savedIds} onToggleWishlist={toggleWishlist} onChat={startChat} userId={user?.id} />}
            />
            <Route
              path="/chat"
              element={<ChatPage user={user} conversations={conversations} selectedChat={selectedChat} setSelectedChat={setSelectedChat} messages={messages} onSend={sendMessage} onRefresh={refreshChat} />}
            />
            <Route
              path="/product/:id"
              element={<ProductPage items={items} savedIds={savedIds} onToggleWishlist={toggleWishlist} onChat={startChat} onToggleSold={toggleSold} user={user} />}
            />
            <Route
              path="/listings"
              element={<ListingsPage items={myListings} savedIds={savedIds} onToggleWishlist={toggleWishlist} onChat={startChat} onToggleSold={toggleSold} onDelete={deleteItem} userId={user?.id} />}
            />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {authModalOpen && (
          <AuthModal mode={authMode} setMode={setAuthMode} busy={busy} onSubmit={handleAuth} onClose={closeAuthModal} />
        )}
      </div>
    </BrowserRouter>
  );
}
