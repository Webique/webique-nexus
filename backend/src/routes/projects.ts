import express, { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = 1, limit = 10, label } = req.query;
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (label) {
      query.label = label;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      data: projects,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    return next(error);
  }
});

// POST /api/projects - Create new project
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = new Project(req.body);
    await project.save();
    
    return res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/projects/stats/overview - Get finance overview
router.get('/stats/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({});
    
    const stats = projects.reduce((acc, project) => {
      acc.totalRevenue += project.totalAmount || 0;
      acc.totalAmountReceived += project.amountReceived || 0;
      acc.totalRemainingAmount += project.remainingAmount || 0;
      acc.totalCosts += (project.domainCost || 0) + (project.additionalCosts || 0) + 
                       (project.freelancerManagerFees || 0) + (project.freelancerFees || 0);
      return acc;
    }, {
      totalRevenue: 0,
      totalAmountReceived: 0,
      totalRemainingAmount: 0,
      totalCosts: 0,
      totalSubscriptionCosts: 0,
      totalTikTokAdCosts: 0,
      totalProfit: 0
    });
    
    stats.totalProfit = stats.totalAmountReceived - stats.totalCosts;
    
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
