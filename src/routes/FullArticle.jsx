import { useContext, useState } from "react";
import { Link, useParams, useLoaderData } from "react-router-dom";
import { getComments } from "../utils/api-requests";
import { VoteButtons } from "../components/VoteButtons";
import { Comments } from "../components/Comments";
import { UserContext } from "../contexts/UserContext";
import { AddComment } from "../components/AddComment";

export default function FullArticle() {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const { article_id } = useParams();
  const article = useLoaderData();

  const {
    title,
    article_img_url,
    topic,
    author,
    created_at,
    body,
    votes,
    comment_count,
  } = article;

  const date = new Date(created_at).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const commentHandler = async (id) => {
    if (!showComments) {
      const comments = await getComments(id);
      setShowComments((curr) => !curr);
      setComments(comments);

      if (comments.length === 0) {
        setComments([{ body: "No comments to display" }]);
      }
    } else {
      setShowComments((curr) => !curr);
      if (showAddCommentModal) toggleAddCommentModal();
    }
  };

  const toggleAddCommentModal = () => {
    setShowAddCommentModal(!showAddCommentModal);
  };

  return (
    <div className="fullArticle">
      <div className="img">
        <img src={article_img_url} alt={title} />
      </div>
      <h1>{title}</h1>
      <p id="author">
        Author: {author} - {date}
      </p>
      <p className="bodyText">{body}</p>
      <Link to="/articles">
        <button>Back to articles</button>
      </Link>
      <VoteButtons votes={votes} article_id={article_id} />
      <p>Comments: {comment_count}</p>
      <button id="commentsButton" onClick={() => commentHandler(article_id)}>
        {showComments ? "Hide comments" : "Show Comments"}
      </button>
      {showAddCommentModal && (
        <AddComment
          toggleAddCommentModal={toggleAddCommentModal}
          article_id={article_id}
          username={user.username}
          setComments={setComments}
        />
      )}
      {showComments && user && (
        <button id="commentsButton" onClick={toggleAddCommentModal}>
          {showAddCommentModal ? "cancel" : "Add comment"}
        </button>
      )}
      {showComments && <Comments comments={comments} />}
    </div>
  );
}