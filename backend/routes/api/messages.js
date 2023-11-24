// In a file like message.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); // Authentication middleware
const Message = require('../../models/Message');

// POST a message
router.post('/', auth, async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;
        const message = new Message({ sender, receiver, content });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// GET messages between two users
router.get('/:sender/:receiver', auth, async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ timestamp: 1 }).populate('sender').populate('receiver');
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
