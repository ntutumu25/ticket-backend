//const User = require("../models/user")
// const Post = require("../models/post")
// const path = require("path")
// const fs = require('fs');


// const addPost = async(req, res)=>{
//     //console.log(req.body) 
//     const autor = req.user.id
//     const image = '/img/uploades/' + req.file.filename;
//     const title = req.body.title
//     const description = req.body.description
//     const post = new Post({title, image, description, autor}) 

//     await post.save()
//     res.redirect('/users/space') 

// }

// const deletePost = async (req, res) => {
//     //Funcion para eliminar un post
//     const { id } = req.params;
//     const postDeleted = await Post.findByIdAndDelete(id);
//     //console.log(postDeleted)
   
//      fs.unlink(path.join(__dirname,'../../public') + postDeleted.image, (err) => {
//         // methodo para eliminar la imagen del post
//          if (err) {
//              throw err;
//          }
    
//          console.log("Delete File successfully.");
//      });
    
//     res.redirect('/users/space'); 
// }

 
// const likePost = async(req, res)=>{
//     const {id}= req.params
//     await Post.findByIdAndUpdate(id, {$push:{likes:req.user.name}});
//     res.redirect('/')
// }
// const unLikePost = async(req, res)=>{ 
//     const {id}= req.params
//     await Post.findByIdAndUpdate(id, {$pull:{likes:req.user.name}});
//     res.redirect('/')
// }

// const commentPost = async(req, res)=>{
//     const {id}= req.params

//     const {comment} = req.body
//     console.log(req.body, id)
//     await Post.findByIdAndUpdate(id, {$push:{comment:{autor:req.user.name, comment:comment}}});
//     res.redirect('/')
// }



// module.exports = {
//     addPost, deletePost, likePost,unLikePost,commentPost,
// }