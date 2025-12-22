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
        formData.append('query', content); // Backend expects 'query', not 'content'
        if (file) {
            formData.append('file', file);
        }

        // Backend endpoint is /api/conversations (POST) which takes query + file + header
        const res = await axios.post(`${API_BASE}/conversations`, formData, {
            headers: {
                'conversation_id': conversationId,
                'Content-Type': 'multipart/form-data'
            }
        });

        // The backend returns { conversation_id, prompt, council_response, ... }
        // We need to map this to what the UI expects: { response: string, ...council_data }
        return {
            response: res.data.prompt ? `Processed: ${res.data.prompt}` : "Processing complete.", // or some message from backend
            ...res.data // everything else matches council data structure hopefully
        };
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
