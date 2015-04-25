

module.exports = function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    console.log("Authenticated!")
    return next()
  } else{
    res.status(500).send({err: "isLoggedIn failed!"});
  }
}
