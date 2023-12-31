const router = require("express").Router();
const { BlogPost, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// create a new blog post
router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await BlogPost.create({
      post_title: req.body.title,
      post_content: req.body.content,
      user_id: req.session.user_id,
    });

    res
      .status(200)
      .json({ newPost, message: "Successfully created new post!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

// delete an existing blog post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deletedPost = await BlogPost.destroy({
      where: {
        // check for the post's id and ensure that the user deleting it is the user who made it
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res
      .status(200)
      .json({ deletedPost, message: "Successfully deleted post!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// update an existing blog post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updatePost = await BlogPost.update(
      {
        post_title: req.body.updatedTitle,
        post_content: req.body.updatedContent,
        user_id: req.session.user_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ updatePost, message: "Successfully updated post!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

// get all blog posts
router.get("/", async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: Comment,
          attributes: ["comment_content", "post_id", "comment_date"],
        },
      ],
    });
    res.status(200).json(blogPostData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
