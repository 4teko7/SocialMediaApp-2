const { db } = require("../util/admin");
const { ref } = require("firebase-functions/lib/providers/database");

exports.getAllScreams = (req,res)=>{

    db.collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let screams = []
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                ...doc.data()
            })
        });
        return res.json(screams);
    })
    .catch(err=>console.error(err));

}


exports.postOneScream = (req,res) =>{
   
    if(req.method !== "POST") {
        res.status(400).json({error : "method are not allowed !"});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        userImage: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    }
    db.collection('screams')
    .add(newScream)
    .then(doc =>{
        const resScream = newScream;
        resScream.screamId = doc.id;
        return res.json({resScream}) //return is not necessary. res automatically sends...
    })
    .catch(err =>{
        res.status(500).json({error:"something went wrong..."})
        console.error(err);
    });

}



//Get Specific Scream Details
exports.getScream =(req,res) =>{
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc =>{
            if(!doc.exists){
                return res.status(404).json({error : "Scream not foun"});
            }
            console.log("DOC : " , doc);
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments')
            .orderBy("createdAt","desc")
            .where('screamId','==',req.params.screamId).get();
        })
        .then(data =>{
            screamData.comments = [];
            data.forEach(doc =>{
                console.log("DOCCC : " , doc)
                screamData.comments.push(doc.data());
            })
            return res.status(200).json(screamData);
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error : err.code});
        })


}



// Comment on scream
exports.commentOnScream = (req,res) =>{

    if(req.body.body.trim() === "") return res.status(400).json({error:"Comment must not be empty"});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc =>{
            if(!doc.exists){
                return res.status(404).json({error : "Scream does not exist"});
            }
            
            return doc.ref.update({commentCount: doc.data().commentCount + 1});
        })
        .then(() =>{
            return db.collection('comments').add(newComment);
        })
        .then(() =>{
            res.json(newComment);
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({message: err.code});
        })


}


// Like a scream
exports.likeScream = (req,res) => {
    const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
        .where('screamId','==',req.params.screamId).limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);
    
    let screamData = {};

    screamDocument.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({message: "Scream Not Found !"});
            }

            screamData = doc.data();
            screamData.screamId = doc.id;
            return likeDocument.get();
        })
        .then(data =>{
            console.log("datadatadata : " , data.empty)
            if(data.empty){
                return db.collection('likes').add({
                    screamId: req.params.screamId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    screamData.likeCount++;
                    return screamDocument.update({ likeCount: screamData.likeCount })
                })
                .then(() =>{
                    return res.status(201).json(screamData);
                })
            }else{
                return res.status(400).json({error: "Scream already liked !"});
            }
        })
        .catch(err =>{
            console.error(err);
            res.status(500).json({error:err.code});
        })
}


// Unlike a Scream
exports.unlikeScream = (req,res) => {
    const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
        .where('screamId','==',req.params.screamId).limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);
    
    let screamData = {};

    screamDocument.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({message: "Scream Not Found !"});
            }

            screamData = doc.data();
            screamData.screamId = doc.id;
            return likeDocument.get();
        })
        .then(data =>{
            if(!data.empty){
                return db.doc(`/likes/${data.docs[0].id}`)
                .delete()
                .then(() => {
                    screamData.likeCount--;
                    return screamDocument.update({ likeCount: screamData.likeCount })
                })
                .then(() =>{
                    return res.status(201).json(screamData);
                })
            }else{
                return res.status(400).json({error: "You did not like this !"});
            }
        })
        .catch(err =>{
            console.error(err);
            res.status(500).json({error:err.code});
        })
}

exports.deleteScream = (req,res) =>{
    const document = db.doc(`/screams/${req.params.screamId}`);
    document.get()
        .then(doc =>{
            if(!doc.exists){
                return res.status(404).json({error:"Scream not found !"});
            }

            if(doc.data().userHandle !== req.user.handle){
                return res.status(403).json({error: "You can not delete which you are not owner"});
            }else{
                return document.delete();
            }
        })
        .then(()=>{
            res.json({message: "Successfully Deleted"});
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({error:err.code});
        })
}