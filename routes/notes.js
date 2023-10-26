const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.query.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: 'Cannot find note' });
    }
    res.json(note);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    body: req.body.body,
    userId: req.body.userId,
    position: await Note.countDocuments({}),
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedNote == null) {
      return res.status(404).json({ message: 'Cannot find note' });
    }
    res.json(updatedNote);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndRemove(req.params.id);
    if (deletedNote == null) {
      return res.status(404).json({ message: 'Cannot find note' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put('/:id/position', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: 'Cannot find note' });
    }

    const oldPosition = note.position;
    const newPosition = req.body.position;

    if (oldPosition < newPosition) {
      await Note.updateMany(
        { position: { $gt: oldPosition, $lte: newPosition } },
        { $inc: { position: -1 } }
      );
    } else {
      await Note.updateMany(
        { position: { $lt: oldPosition, $gte: newPosition } },
        { $inc: { position: 1 } }
      );
    }

    note.position = newPosition;
    await note.save();

    res.json(note);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
