import express from 'express';
import { ImportantNote, DailyTask, GeneralNote } from '../models/Note';

const router = express.Router();

// Important Notes Routes
router.get('/important', async (req, res, next) => {
  try {
    const notes = await ImportantNote.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
});

router.post('/important', async (req, res, next) => {
  try {
    const note = new ImportantNote(req.body);
    await note.save();
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.put('/important/:id', async (req, res, next) => {
  try {
    const note = await ImportantNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Important note not found'
      });
    }
    
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.delete('/important/:id', async (req, res, next) => {
  try {
    const note = await ImportantNote.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Important note not found'
      });
    }
    
    res.json({ success: true, message: 'Important note deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Daily Tasks Routes
router.get('/daily-tasks', async (req, res, next) => {
  try {
    const { date } = req.query;
    let query: any = {};
    
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    const tasks = await DailyTask.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
});

router.post('/daily-tasks', async (req, res, next) => {
  try {
    const task = new DailyTask(req.body);
    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

router.put('/daily-tasks/:id', async (req, res, next) => {
  try {
    const task = await DailyTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Daily task not found'
      });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

router.delete('/daily-tasks/:id', async (req, res, next) => {
  try {
    const task = await DailyTask.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Daily task not found'
      });
    }
    
    res.json({ success: true, message: 'Daily task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// General Notes Routes
router.get('/general', async (req, res, next) => {
  try {
    const notes = await GeneralNote.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
});

router.post('/general', async (req, res, next) => {
  try {
    const note = new GeneralNote(req.body);
    await note.save();
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.put('/general/:id', async (req, res, next) => {
  try {
    const note = await GeneralNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'General note not found'
      });
    }
    
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.delete('/general/:id', async (req, res, next) => {
  try {
    const note = await GeneralNote.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'General note not found'
      });
    }
    
    res.json({ success: true, message: 'General note deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export = router;
