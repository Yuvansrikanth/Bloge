const JWT = require("jsonwebtoken");
const private_key = "ahbdefkjN^@873";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = JWT.sign(payload, private_key);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, private_key);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};
