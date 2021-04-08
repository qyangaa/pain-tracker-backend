// const { admin, db } = require("./admin");
const { getUid } = require("../postgres/queries");

module.exports = async (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    let authId = "";
    if (idToken == "dummyToken") authId = "dummyAuthId";
    else if (idToken == "dummyToken2") authId = "dummyAuthId2";
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // req.uid = decodedToken.auth_id;
    if (!authId) return res.status(403).json("Authentication Failed");
    const uid = await getUid(authId);
    if (!uid) return res.status(403).json("Authentication Failed");
    req.uid = uid;
    return next();
  } catch (error) {
    console.error("Error while verifying token", error);
    return res.status(403).json(error);
  }
};
