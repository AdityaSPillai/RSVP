import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createEventController,
    getEventsController,
    getEventByIdController,
    joinEventController,
    leaveEventController,
    getUserEventsController,
    updateEventController,
    getAttendingEventsController
} from "../controllers/eventController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes
router.get('/all', getEventsController);
// Move generic ID route to bottom or ensure specific routes are above it
// router.get('/:id', getEventByIdController); <--- Moved down

// Protected routes
router.get('/user-events', requireAuth, getUserEventsController); // Specific route first

router.post('/create', requireAuth,
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err?.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send({
                    success: false,
                    message: 'Image size exceeds 5 MB limit'
                });
            }
            if (err) return next(err);
            next();
        });
    }, createEventController);
router.get('/user-events', requireAuth, getUserEventsController);
router.put('/update/:id', requireAuth, upload.single('image'), updateEventController);
router.put('/join/:id', requireAuth, joinEventController);
router.put('/leave/:id', requireAuth, leaveEventController);
router.get('/attending', requireAuth, getAttendingEventsController);

// Generic ID route must be last
router.get('/:id', getEventByIdController);

export default router;
