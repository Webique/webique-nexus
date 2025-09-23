import express, { Request, Response, NextFunction } from 'express';
import TikTokAd from '../models/TikTokAd';

const router = express.Router();

// GET /api/tiktok-ads - Get all TikTok ads
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
    
    const tiktokAds = await TikTokAd.find(query)
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await TikTokAd.countDocuments(query);
    
    return res.json({
      success: true,
      data: tiktokAds,
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

// GET /api/tiktok-ads/:id - Get single TikTok ad
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiktokAd = await TikTokAd.findById(req.params.id);
    
    if (!tiktokAd) {
      return res.status(404).json({
        success: false,
        error: 'TikTok ad not found'
      });
    }
    
    return res.json({
      success: true,
      data: tiktokAd
    });
  } catch (error) {
    return next(error);
  }
});

// POST /api/tiktok-ads - Create new TikTok ad
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiktokAd = new TikTokAd(req.body);
    await tiktokAd.save();
    
    return res.status(201).json({
      success: true,
      data: tiktokAd
    });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/tiktok-ads/:id - Update TikTok ad
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiktokAd = await TikTokAd.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!tiktokAd) {
      return res.status(404).json({
        success: false,
        error: 'TikTok ad not found'
      });
    }
    
    return res.json({
      success: true,
      data: tiktokAd
    });
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/tiktok-ads/:id - Delete TikTok ad
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiktokAd = await TikTokAd.findByIdAndDelete(req.params.id);
    
    if (!tiktokAd) {
      return res.status(404).json({
        success: false,
        error: 'TikTok ad not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'TikTok ad deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/tiktok-ads/stats/total - Get total TikTok ad costs
router.get('/stats/total', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query: any = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    
    const result = await TikTokAd.aggregate([
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
