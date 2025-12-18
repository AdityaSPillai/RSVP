import EventModel from "../schema/eventSchema.js";

// Create a new event
export const createEventController = async (req, res) => {
    try {
        const { title, description, date, time, location, category, capacity } = req.body;

        let image = '';

        if (req.file) {
            image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        if (!title || !description || !date || !time || !location || !capacity) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const newEvent = new EventModel({
            title,
            description,
            date,
            time,
            location,
            category,
            capacity,
            image,
            host: req.user.id
        });

        await newEvent.save();

        res.status(201).send({
            success: true,
            message: "Event created successfully",
            event: newEvent
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error creating event",
            error: error.message
        });
    }
};

// Get all events
export const getEventsController = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };

        if (sort === 'date') {
            sortOption = { date: 1 };
        }

        if (sort === 'popular') {
            sortOption = null;
        }

        let events = await EventModel.find(query).populate('host', 'name email').populate('attendees', 'name');

        if (sortOption) {
            events = events.sort((a, b) => {
                return sortOption.date
                    ? a.date.localeCompare(b.date)
                    : b.createdAt - a.createdAt;
            });
        }

        if (sort === 'popular') {
            events.sort((a, b) => b.attendees.length - a.attendees.length);
        }

        if (sort === 'capacity') {
            events.sort(
                (a, b) =>
                    (b.capacity - b.attendees.length) -
                    (a.capacity - a.attendees.length)
            );
        }

        res.status(200).send({
            success: true,
            count: events.length,
            message: "Events fetched successfully",
            events
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching events",
            error: error.message
        });
    }
};

// Get single event
export const getEventByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await EventModel.findById(id)
            .populate('host', 'name email')
            .populate('attendees', 'name');

        if (!event) {
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Event fetched successfully",
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching event",
            error: error.message
        });
    }
};

// Join event
export const joinEventController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await EventModel.findById(id);
        if (!event) {
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        if (event.attendees.includes(userId)) {
            return res.status(400).send({
                success: false,
                message: "You have already joined this event"
            });
        }

        if (event.attendees.length >= event.capacity) {
            return res.status(400).send({
                success: false,
                message: "Event is full"
            });
        }

        event.attendees.push(userId);
        await event.save();

        res.status(200).send({
            success: true,
            message: "Successfully joined the event",
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error joining event",
            error: error.message
        });
    }
};

// Leave event
export const leaveEventController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await EventModel.findById(id);
        if (!event) {
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        if (!event.attendees.includes(userId)) {
            return res.status(400).send({
                success: false,
                message: "You have not joined this event"
            });
        }

        event.attendees = event.attendees.filter(attendeeId => attendeeId.toString() !== userId);
        await event.save();

        res.status(200).send({
            success: true,
            message: "Successfully left the event",
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error leaving event",
            error: error.message
        });
    }
};

// Get user events
export const getUserEventsController = async (req, res) => {
    try {
        const events = await EventModel.find({ host: req.user.id })
            .populate('host', 'name email')
            .populate('attendees', 'name')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            count: events.length,
            message: "User events fetched successfully",
            events
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching user events",
            error: error.message
        });
    }
};

// Update event
export const updateEventController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, time, location, category, capacity } = req.body;

        let event = await EventModel.findById(id);
        if (!event) {
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        // Check if user is host
        if (event.host.toString() !== req.user.id) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized to update this event"
            });
        }

        if (req.body.image === "") {
            event.image = "";
        }

        if (req.file) {
            const image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            event.image = image;
        }

        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (date !== undefined) event.date = date;
        if (time !== undefined) event.time = time;
        if (location !== undefined) event.location = location;
        if (category !== undefined) event.category = category;
        if (capacity !== undefined) event.capacity = capacity;

        await event.save();

        res.status(200).send({
            success: true,
            message: "Event updated successfully",
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating event",
            error: error.message
        });
    }
};

export const getAttendingEventsController = async (req, res) => {
    try {
        const events = await EventModel.find({
            attendees: req.user.id
        })
            .populate('host', 'name')
            .populate('attendees', 'name')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            events
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error fetching attending events',
            error: error.message
        });
    }
};