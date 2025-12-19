import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ListOrdered, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const StageHeader = ({ number, title, icon: Icon, active, completed, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left border mb-2",
            active
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "bg-white border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-700",
            completed && !active ? "opacity-70" : ""
        )}
    >
        <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
            active ? "bg-blue-600 text-white" : completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
        )}>
            {completed ? <CheckCircle2 size={16} /> : number}
        </div>
        <div className="flex-1">
            <h3 className={clsx("font-semibold text-sm", active ? "text-blue-900" : "text-slate-700")}>{title}</h3>
        </div>
        <Icon size={16} className={clsx(active ? "text-blue-500" : "text-slate-400")} />
    </button>
);

const Stage1Tabs = ({ data }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="animate-fade-in">
            <div className="mb-4 text-sm text-slate-500">
                Review independent responses from each council member.
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {data.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                            activeTab === idx
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                        )}
                    >
                        {item.model}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-blue-100 shadow-sm text-sm leading-relaxed text-slate-700 min-h-[300px] whitespace-pre-wrap">
                {data[activeTab]?.response}
            </div>
        </div>
    );
};

const Stage2Rankings = ({ data }) => {
    return (
        <div className="animate-fade-in space-y-4">
            <div className="mb-4 text-sm text-slate-500">
                Council members review and rank each other anonymously.
            </div>

            <div className="grid gap-4">
                {data.map((ranking, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Reviewer: {ranking.model}
                        </h4>
                        <div className="bg-blue-50/50 rounded-lg p-4 text-xs font-mono text-slate-600 whitespace-pre-wrap border border-blue-50">
                            {ranking.ranking}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Stage3Synthesis = ({ data }) => {
    return (
        <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-indigo-900">Chairman's Synthesis</h3>
                        <p className="text-sm text-indigo-500">{data.model}</p>
                    </div>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-normal">
                    {data.response}
                </div>
            </div>
        </div>
    );
};

const CouncilView = ({ data, onClose }) => {
    const [activeStage, setActiveStage] = useState(3);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    if (!data) return null;

    // Normalize data: support both multi-step and legacy single-step
    const steps = data.steps || [{ id: 'default', title: 'Analysis', data: data }];
    const currentStep = steps[activeStepIndex];
    const currentStepData = currentStep.data || currentStep; // fallback

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[800px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur top-0 z-10 sticky">
                <div>
                    <h2 className="font-bold text-lg text-slate-800">Council Metadata</h2>
                    <p className="text-xs text-slate-500">Trace the decision process</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Workflow Step Navigation (Only if multiple steps) */}
                {steps.length > 1 && (
                    <div className="w-full md:w-48 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-2 overflow-y-auto">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 py-1">Workflow Steps</div>
                        <div className="flex md:flex-col gap-2">
                            {steps.map((step, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStepIndex(idx)}
                                    className={clsx(
                                        "px-3 py-2 rounded-lg text-left text-xs font-medium transition-all w-full",
                                        activeStepIndex === idx
                                            ? "bg-white text-blue-700 shadow-sm border border-blue-100"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", activeStepIndex === idx ? "bg-blue-500" : "bg-slate-300")} />
                                        <span className="truncate">{step.title || `Step ${idx + 1}`}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">

                    {/* Step Title (Mobile/Context) */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-slate-800">{currentStep.title}</h3>
                        <p className="text-xs text-slate-500">Reviewing council output for this step.</p>
                    </div>

                    {/* Stage Navigation */}
                    <div className="mb-6">
                        <StageHeader
                            number={1}
                            title="Individual Responses"
                            icon={Users}
                            active={activeStage === 1}
                            completed={true}
                            onClick={() => setActiveStage(1)}
                        />
                        <StageHeader
                            number={2}
                            title="Peer Ranking (Blind)"
                            icon={ListOrdered}
                            active={activeStage === 2}
                            completed={true}
                            onClick={() => setActiveStage(2)}
                        />
                        <StageHeader
                            number={3}
                            title="Final Synthesis"
                            icon={ShieldCheck}
                            active={activeStage === 3}
                            completed={true}
                            onClick={() => setActiveStage(3)}
                        />
                    </div>

                    {/* Stage Content */}
                    <div className="relative min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeStage === 1 && (
                                <motion.div
                                    key={`s1-${activeStepIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Stage1Tabs data={currentStepData.stage1} />
                                </motion.div>
                            )}
                            {activeStage === 2 && (
                                <motion.div
                                    key={`s2-${activeStepIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Stage2Rankings data={currentStepData.stage2} />
                                </motion.div>
                            )}
                            {activeStage === 3 && (
                                <motion.div
                                    key={`s3-${activeStepIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Stage3Synthesis data={currentStepData.stage3} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CouncilView;
