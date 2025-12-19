import express from "express"
import { getSingleUserController, loginController, SignupController, deleteUserController, updateProfileController, resetPasswordController } from "../controllers/authController.js";
import multer from "multer";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/signup', SignupController);


router.post('/login', loginController)

router.get('/user/:id', getSingleUserController)

//delete user 
router.delete('/delete/:id', deleteUserController)

router.put("/profile/update", requireAuth, upload.single("profileImage"), updateProfileController);

router.put("/profile/reset-password", requireAuth, resetPasswordController);

export default router;