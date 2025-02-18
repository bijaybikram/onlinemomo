const router = require("express").Router();
const DataServices = require("../../controller/misc/dataService");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictedTo = require("../../middleware/restrictTo");

router
  .route("/misc/data")
  .get(isAuthenticated, restrictedTo("admin"), DataServices.getData);

module.exports = router;
