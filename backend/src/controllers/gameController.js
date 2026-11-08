import Game from '../models/Game.js';

/**
 * @desc    Get all games with search and category filtering
 * @route   GET /api/games
 * @access  Public
 */
export const getGames = async (req, res, next) => {
  try {
    const { search, category, sort, featured } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'fee-low') {
      sortOption = { fee: 1 };
    } else if (sort === 'fee-high') {
      sortOption = { fee: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const games = await Game.find(query).sort(sortOption);

    res.json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single game by ID or Slug
 * @route   GET /api/games/:identifier
 * @access  Public
 */
export const getGameById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let game;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      game = await Game.findById(identifier);
    } else {
      game = await Game.findOne({ slug: identifier });
    }

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game tournament not found',
      });
    }

    res.json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new game (Admin only)
 * @route   POST /api/games
 * @access  Private/Admin
 */
export const createGame = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDescription,
      description,
      posterUrl,
      fee,
      isTeam,
      playersPerTeam,
      maxSlots,
      date,
      time,
      venue,
      rules,
      platform,
      format,
      prizes,
      registrationOpen,
      isFeatured,
      coordinators,
    } = req.body;

    const game = await Game.create({
      title,
      category,
      shortDescription,
      description,
      posterUrl,
      fee: Number(fee) || 0,
      isTeam: Boolean(isTeam),
      playersPerTeam: Number(playersPerTeam) || 1,
      maxSlots: Number(maxSlots) || 32,
      date,
      time,
      venue,
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').filter(Boolean) : []),
      platform,
      format,
      prizes,
      registrationOpen: registrationOpen !== undefined ? registrationOpen : true,
      isFeatured: Boolean(isFeatured),
      coordinators: coordinators || [],
    });

    res.status(201).json({
      success: true,
      message: 'Game arena created successfully!',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing game (Admin only)
 * @route   PUT /api/games/:id
 * @access  Private/Admin
 */
export const updateGame = async (req, res, next) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    if (req.body.rules && typeof req.body.rules === 'string') {
      req.body.rules = req.body.rules.split('\n').filter(Boolean);
    }

    game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Game tournament updated successfully!',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete game (Admin only)
 * @route   DELETE /api/games/:id
 * @access  Private/Admin
 */
export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    await game.deleteOne();

    res.json({
      success: true,
      message: 'Game tournament removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};
