import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Bot, User, FileText, ChevronRight, Activity } from 'lucide-react';

const MessageBubble = ({ message, onViewCouncil }) => {
    const isBot = message.role === 'assistant';
    const hasCouncilData = isBot && message.council_data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            className={clsx(
                "flex w-full mb-4",
                isBot ? "justify-start" : "justify-end"
            )}
        >
            <div
                className={clsx(
                    "flex max-w-[80%] md:max-w-[70%] gap-2",
                    isBot ? "flex-row" : "flex-row-reverse"
                )}
            >
                {/* Avatar */}
                <div
                    className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
                        isBot
                            ? "bg-white border-blue-100 text-blue-500"
                            : "bg-blue-500 border-blue-600 text-white"
                    )}
                >
                    {isBot ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-1 min-w-0">
                    {/* Main Bubble */}
                    <div
                        className={clsx(
                            "p-3 rounded-2xl shadow-sm border text-sm leading-relaxed break-words relative group",
                            isBot
                                ? "bg-white border-blue-50 text-slate-700 rounded-tl-none"
                                : "bg-blue-500 text-white border-blue-600 rounded-tr-none shadow-blue-500/10"
                        )}
                    >
                        <div className="prose prose-sm max-w-none">
                            {message.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-1 last:mb-0">{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Council Metadata Trigger - Animated Entrance */}
                    {hasCouncilData && (
                        <motion.button
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            onClick={() => onViewCouncil(message.council_data)}
                            className="self-start flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-medium hover:bg-blue-100 transition-colors shadow-sm group"
                        >
                            <Activity size={10} className="text-blue-500" />
                            <span>View Council Process</span>
                            <ChevronRight size={10} className="opacity-50 group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
