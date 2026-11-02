const { Router } = require('express');
const { 
    getPosts, 
    getPostById, 
    getPostsByAuthor, 
    createPost, 
    updatePost,
    deletePost
} = require('../controllers/postsController'); 

const router = Router();

router.get('/', getPosts);
router.get('/author/:authorId', getPostsByAuthor); 
router.get('/:id', getPostById);
router.post('/', createPost);

router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;