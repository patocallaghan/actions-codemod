module.exports = function addComment(j, path, text) {
  let comment = j.commentLine(text, true, false);
  path.node.comments = path.node.comments || [];
  if (!path.node.comments.find((comment) => comment.value.includes(text))) {
    path.node.comments.push(comment);
  }
};
