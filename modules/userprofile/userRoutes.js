const Router = require('express-promise-router');
const {getJwtToken, authCheck, updateUserProfileView, getProfiles} = require("./userController")

const routes = () => {
    const router = Router({ mergeParams: true });
    router.route("/getProfiles").post(authCheck, getProfiles)
    router.route("/updateProfile").post(authCheck, updateUserProfileView)
    router.route("/getToken").post(getJwtToken)
    return router;
};

module.exports = routes;