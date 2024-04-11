//  catch async error

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.log(err.message);
      return res.status(500).json({
        message: "Something went wrong!",
        fullError: err,
      });
    });
  };
};
