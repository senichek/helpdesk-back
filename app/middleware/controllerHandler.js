// Middleware to centralise all try/catch in controllers 
// to avoid writing the "try/catch" block multiple times
module.exports = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
