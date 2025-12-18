import JWT from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};