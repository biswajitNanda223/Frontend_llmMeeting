import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import ChatInterface from './components/chat/ChatInterface';
import CouncilView from './components/council/CouncilView';
import { api } from './api/apiService';
import { Menu } from 'lucide-react';
import { ToastContainer, toast, Zoom } from 'react-toastify';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeCouncilData, setActiveCouncilData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load initial conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
      if (data.length > 0 && !activeId) {
        // Optionally auto-select first
        // handleSelectConversation(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const handleSelectConversation = async (id) => {
    setActiveId(id);
    setActiveCouncilData(null); // Close metadata view
    try {
      const msgs = await api.getConversationMessages(id);
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await api.createConversation();
      setConversations(prev => [newConv, ...prev]);
      setActiveId(newConv.id);
      setMessages([]);
      setActiveCouncilData(null);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  const handleDeleteConversation = (e, id) => {
    e.stopPropagation();

    // Dismiss any existing toasts
    toast.dismiss();

    toast(
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200 flex flex-col gap-3 min-w-[240px] pointer-events-auto">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm text-slate-800">Delete Conversation?</h3>
          <p className="text-xs text-slate-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss();
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              performDelete(id);
              toast.dismiss();
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>,
      {
        closeButton: false,
        icon: false,
        autoClose: false,
        hideProgressBar: true,
        transition: Zoom,
        className: "!bg-transparent !p-0 !shadow-none !border-0"
      }
    );
  };

  const performDelete = async (id) => {
    try {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
        setActiveCouncilData(null);
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        toggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-white border-b border-slate-200 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu size={20} />
          </button>
          <span className="font-bold text-slate-800">Adani AI Labs</span>
        </div>

        {activeId ? (
          <ChatInterface
            conversationId={activeId}
            messages={messages}
            setMessages={setMessages}
            onViewCouncil={(data) => setActiveCouncilData(data)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to LLM Council</h1>
            <p className="max-w-md">Select a conversation from the sidebar or start a new one to begin collaborating with the multi-model council.</p>
            <button
              onClick={handleNewConversation}
              className="mt-8 btn-primary"
            >
              Start New Conversation
            </button>
          </div>
        )}
      </div>

      {/* Right Drawer for Metadata */}
      <AnimatePresence>
        {activeCouncilData && (
          <CouncilView
            data={activeCouncilData}
            onClose={() => setActiveCouncilData(null)}
            key="council-view"
          />
        )}
      </AnimatePresence>

      {/* Toast Container - Centered for better visibility of alerts */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="light"
        limit={1}
        style={{ width: "auto" }}
        toastClassName="!rounded-xl !shadow-none !p-0 !bg-transparent"
        bodyClassName="!p-0 !m-0"
      />
    </div>
  );
}

export default App;
