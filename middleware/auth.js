const { validateToken } = require("../services/authentication");

function checkForAuthCookie(cookieName){
    return (req, res, next) => {
        const cookieToken = req.cookies[cookieName];
        if(!cookieToken) return next();
        try {
            const userPayload = validateToken(cookieToken);  
            req.user = userPayload; // storing userpayload in the req body  
        } catch (error) {}
        return next();
    };
};

module.exports = { checkForAuthCookie };