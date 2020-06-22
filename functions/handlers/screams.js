const { db } = require("../util/admin");

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
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    }
    db.collection('screams')
    .add(newScream)
    .then(doc =>{
        return res.json({message: `document ${doc.id} was creatsed successfully`}) //return is not necessary. res automatically sends...
    })
    .catch(err =>{
        res.status(500).json({error:"something went wrong..."})
        console.error(err);
    });

}


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