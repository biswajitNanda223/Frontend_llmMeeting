import { MessageSquarePlus, MessageSquare, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({
    conversations,
    activeId,
    onSelect,
    onNew,
    onDelete,
    isOpen,
    toggleOpen
}) => {
    return (
        <>
            {/* ... (keep existing overlay and sidebar container code if any, but since we replace top part, we replace imports and props) ... */}
            {/* Note: Tool replaces lines 1-12, effectively replacing imports and Sidebar signature */}
            {/* Mobile overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleOpen}
            />

            {/* Sidebar Container */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-40 w-[240px] bg-slate-50 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] lg:shadow-none border-r border-slate-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 text-sm">
                            C
                        </div>
                        <span className="font-bold text-base text-slate-800 tracking-wide">The LLM Council</span>
                    </div>

                    <button
                        onClick={onNew}
                        className="w-full py-2.5 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/20 transition-all duration-200 font-medium flex items-center justify-center gap-2 group border border-transparent text-sm"
                    >
                        <MessageSquarePlus size={16} className="group-hover:scale-110 transition-transform" />
                        <span>New Chat</span>
                    </button>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1 scrollbar-hide">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">History</div>
                    {conversations.map((conv) => (
                        <div key={conv.id} className="group relative">
                            <button
                                onClick={() => {
                                    onSelect(conv.id);
                                    if (window.innerWidth < 1024) toggleOpen();
                                }}
                                className={clsx(
                                    "w-full text-left p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm pr-8", // added pr-8 for delete button space
                                    activeId === conv.id
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <MessageSquare
                                    size={16}
                                    className={clsx(
                                        "shrink-0 transition-colors",
                                        activeId === conv.id ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500"
                                    )}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate">
                                        {conv.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                                        ID: {conv.id}
                                    </p>
                                </div>
                            </button>
                            <button
                                onClick={(e) => onDelete(e, conv.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                title="Delete conversation"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer info (Minimal) */}
                <div className="p-3 border-t border-blue-50 text-center">
                    <p className="text-[9px] text-slate-400 font-medium tracking-wide">CONFIDENTIAL • INTERNAL USE</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
