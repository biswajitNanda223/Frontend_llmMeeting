import axios from 'axios';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from './mockData';

// Toggle this to switch between Real and Mock
const USE_MOCK = true;
const API_BASE = 'http://localhost:8001/api';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const api = {
    getConversations: async () => {
        if (USE_MOCK) {
            await sleep(50);
            return [...MOCK_CONVERSATIONS];
        }
        const res = await axios.get(`${API_BASE}/conversations`);
        return res.data;
    },

    getConversationMessages: async (id) => {
        if (USE_MOCK) {
            await sleep(50);
            // specific logic for demo
            if (id === 'conv_1') return MOCK_MESSAGES;
            return [];
        }
        const res = await axios.get(`${API_BASE}/conversations/${id}`);
        return res.data.messages;
    },

    createConversation: async () => {
        if (USE_MOCK) {
            // Snappy create
            await sleep(50);
            const newConv = {
                id: `conv_${Date.now()}`,
                title: "New Conversation",
                created_at: new Date().toISOString(),
                message_count: 0
            };
            MOCK_CONVERSATIONS.unshift(newConv);
            return newConv;
        }
        const res = await axios.post(`${API_BASE}/conversations`);
        return res.data;
    },

    sendMessage: async (conversationId, content, file = null) => {
        if (USE_MOCK) {
            await sleep(600); // reduced from 1500+ for faster feel but still async

            const newResponse = {
                id: `msg_bot_${Date.now()}`,
                role: "assistant",
                content: `Processed your query: "${content.substring(0, 20)}..."`,
                council_data: MOCK_MESSAGES[2].council_data // reused for demo
            };
            return {
                ...newResponse.council_data, // The backend returns stage1, stage2, etc directly
                response: newResponse.content // backend doesn't quite structure it like this in the route, but close enough.
                // Actually backend returns { stage1, stage2, stage3, metadata } 
                // and saves the message to history.
            };
        }

        const formData = new FormData();
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        // The user's prompt said:
        // POST api/conversations/{conversation_id} for hitting the backend.
        // The backend code supplied shows: POST /api/conversations/{conversation_id}/message
        // I will use that.
        // However, for file upload, the python code supplied does NOT show file handling in `SendMessageRequest`.
        // It only shows `content: str`.
        // The user request SAID: "The input is query and the UploadFile"
        // But the PROVIDED CODE in the prompt (FastAPI) DOES NOT HAVE UploadFile support in `send_message`.
        // I must stick to the python code provided if I want it to work with *that* backend, 
        // BUT the user said "make the website... I have provided council code for reference".
        // I will implement standard JSON post for text. If I add file upload, I'll need to assume the backend *will* change or I just mock it.
        // I'll assume JSON for now as per the python code `SendMessageRequest`.

        const res = await axios.post(`${API_BASE}/conversations/${conversationId}/message`, { content });
        return res.data;
    },

    deleteConversation: async (id) => {
        if (USE_MOCK) {
            await sleep(50);
            const index = MOCK_CONVERSATIONS.findIndex(c => c.id === id);
            if (index !== -1) {
                MOCK_CONVERSATIONS.splice(index, 1);
            }
            return true;
        }
        await axios.delete(`${API_BASE}/conversations/${id}`);
        return true;
    }
};
