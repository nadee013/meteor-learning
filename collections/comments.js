Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function(commentAttributes) {

		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);

		if(!user) {
			throw new Meteor.Error(422, "Please write some content");
		}
		if(!commentAttributes.body) {
			throw new Meteor.Error(422, "Please write some content");
		}
		if(!commentAttributes.postId) {
			throw new Meteor.Error(422, "You must comment on a post");
		}
		comment = _.extend(_.pick(commentAttributes, "postId", "body"), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});

		comment._id = Comments.insert(comment);
		createCommentNotification(comment);
		Posts.update(comment.postId, {$inc: {commentsCount: 1}});
		return comment._id;
	}
});

