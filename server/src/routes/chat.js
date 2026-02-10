const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const { chat: openRouterChat } = require('../services/openrouter');

// List chats
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('title context updatedAt')
      .limit(50);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create chat
router.post('/', auth, async (req, res) => {
  try {
    const { title, context } = req.body;
    const chat = new Chat({
      userId: req.user.id,
      title: title || 'New Chat',
      context: context || 'general',
      messages: [],
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message & get AI response
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Add user message
    chat.messages.push({ role: 'user', content });

    // Build context for OpenRouter
    const systemPrompt = `You are SentinelOps AI — a cybersecurity assistant specialized in penetration testing, vulnerability assessment, and security remediation. You help security engineers understand vulnerabilities, write exploit proofs-of-concept, suggest fixes, and explain security concepts. Be concise, technical, and actionable. Always provide code examples when relevant.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chat.messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
    ];

    try {
      const aiResponse = await openRouterChat(messages);
      chat.messages.push({ role: 'assistant', content: aiResponse });
      
      // Auto-title from first message
      if (chat.messages.length <= 2 && chat.title === 'New Chat') {
        chat.title = content.length > 50 ? content.substring(0, 50) + '...' : content;
      }
    } catch (aiErr) {
      console.error('OpenRouter error:', aiErr.message);
      chat.messages.push({ 
        role: 'assistant', 
        content: `I apologize, but I encountered an error processing your request: ${aiErr.message}. Please check that your OPENROUTER_API_KEY is configured correctly.` 
      });
    }

    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete chat
router.delete('/:id', auth, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
