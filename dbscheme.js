let db = {
    users : [

        {
            userId:"asdasdsadsadsad",
            email:"tekk@gmail.com",
            createdAt:'2020-06-21T20:15:39.453Z',
            imageUrl:'image/asdasdasd/asdasd',
            bio:"Dump User",
            website:"https://www.google.com",
            location:"Turkey"
        }
    ],
    
    screams: [
            {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt:'2020-06-21T20:15:39.453Z',
            likeCount:5,
            commentCount:2
        }
    ],
    comments:[
        {
            userHandle: "user",
            screamId: "asdasdasdsad",
            body: "Nice Scream",
            createdAt: '2020-06-21T20:15:39.453Z'
        }
    ]
};


const userDetails = {

    credentials : {
        userId: "asdasdasd",
        email: "user@gmail.com",
        handle: "user",
        createdAt: '2020-06-21T20:15:39.453Z',
        imageUrl: "image/asdasd/asdasd",
        bio: "Hello  this is my bio",
        website:"https://user.com",
        location:"Turkey"
    },
    likes:[
        {
            userHandle:"user",
            screamId:"asdasdasd"
        },
        {
            userHandle:"user",
            screamId: "asdasdas"
        }
    ]
}