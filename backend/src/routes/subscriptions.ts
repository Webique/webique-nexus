import express, { Request, Response, NextFunction } from 'express';
import Subscription from '../models/Subscription';

const router = express.Router();

// GET /api/subscriptions - Get all subscriptions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, page = 1, limit = 10, startDate, endDate } = req.query;
    
    let query: any = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    
    const subscriptions = await Subscription.find(query)
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Subscription.countDocuments(query);
    
    return res.json({
      success: true,
      data: subscriptions,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/subscriptions/:id - Get single subscription
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    return res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    return next(error);
  }
});

// POST /api/subscriptions - Create new subscription
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    
    return res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    return res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/subscriptions/:id - Delete subscription
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/subscriptions/stats/total - Get total subscription costs
router.get('/stats/total', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query: any = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    
    const result = await Subscription.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$price' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const stats = result[0] || { totalCost: 0, count: 0 };
    
    return res.json({
      success: true,
      data: {
        totalCost: stats.totalCost,
        count: stats.count
      }
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
