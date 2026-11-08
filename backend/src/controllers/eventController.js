import Event from '../models/Event.js';

/**
 * @desc    Get all events with search, filtering, and sorting
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = async (req, res, next) => {
  try {
    const { search, category, type, sort, featured } = req.query;
    const query = {};

    // Search query on title or shortDescription
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Participation type filter
    if (type === 'solo') {
      query.isTeam = false;
    } else if (type === 'team') {
      query.isTeam = true;
    }

    // Featured only
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'fee-low') {
      sortOption = { fee: 1 };
    } else if (sort === 'fee-high') {
      sortOption = { fee: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'popular') {
      sortOption = { currentRegistrations: -1 };
    }

    const events = await Event.find(query).sort(sortOption);

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID or Slug
 * @route   GET /api/events/:identifier
 * @access  Public
 */
export const getEventById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let event;

    // Check if identifier is MongoDB ObjectId or slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(identifier);
    } else {
      event = await Event.findOne({ slug: identifier });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event (Admin only)
 * @route   POST /api/events
 * @access  Private/Admin
 */
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDescription,
      description,
      posterUrl,
      fee,
      isTeam,
      minTeamSize,
      maxTeamSize,
      date,
      time,
      venue,
      rules,
      eligibility,
      prizes,
      registrationOpen,
      isFeatured,
      maxParticipants,
      coordinators,
    } = req.body;

    const event = await Event.create({
      title,
      category,
      shortDescription,
      description,
      posterUrl,
      fee: Number(fee) || 0,
      isTeam: Boolean(isTeam),
      minTeamSize: isTeam ? Number(minTeamSize) || 2 : 1,
      maxTeamSize: isTeam ? Number(maxTeamSize) || 4 : 1,
      date,
      time,
      venue,
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').filter(Boolean) : []),
      eligibility,
      prizes,
      registrationOpen: registrationOpen !== undefined ? registrationOpen : true,
      isFeatured: Boolean(isFeatured),
      maxParticipants: Number(maxParticipants) || 100,
      coordinators: coordinators || [],
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing event (Admin only)
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Process rules if sent as string
    if (req.body.rules && typeof req.body.rules === 'string') {
      req.body.rules = req.body.rules.split('\n').filter(Boolean);
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Event updated successfully!',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event (Admin only)
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};
