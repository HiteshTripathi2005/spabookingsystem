import config from "../config/config.js";
import JWT from "jsonwebtoken";

const jwtToken = (userId, res) => {
  const token = JWT.sign({ userId }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default jwtToken;
