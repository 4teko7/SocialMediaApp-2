const {admin,db} = require("./admin")

exports.checkAuth = (req,res,next) =>{
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split("Bearer ")[1];
    }else{
        console.error("No Token Found");
        return res.status(403).json({error : "Unauthorized"})
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken =>{
            req.user = decodedToken;
            console.log(decodedToken)
            return db.collection('users')
                .where('userId', '==',req.user.uid)
                .limit(1)
                .get();
        })
        .then(data =>{
            req.user.handle = data.docs[0].data().handle;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch(err =>{
            console.error(err);
            if(err.code === "auth/id-token-expired") {
                return res.status(403).json({error : "Please Login Before Posting Anything !"})
            }else if(err.code ==="Unauthorized"){
                return res.status(403).json({message: "You Should Login !"});
            }else{
                res.status(403).json({error:err.code});
            }
            
        });

}