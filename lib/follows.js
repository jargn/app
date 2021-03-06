// # Follows Library
// Library for accessing the database of follow activity.

// ## Follow Objects
/**
 * These will be replaced with database entries.  
 *
 * - `follower` The username who is following
 * - `followed` The username being followed
 */
function FollowActivity (follower, followed) {
	this.follower = follower;
	this.followed = followed;
}

// ## Follows Database
/**
 * A simple array `users` to record user data.  
 * Note: This will be replaced with calls to a database layer.
 */
var follows = new Array();

// ### *function*: getFollowers  
/**
 * Retrieves the list of all users following the passed user.
 *
 * @param {string} username The username whose followers to fetch
 * @param {function} cb Callback function to invoke after retrieving followers
 */
exports.getFollowers = function (username, cb) {
	var followers = new Array();
	//Walk through the array looking for people following this user
	for (var i=0; i<follows.length; i++) {
		if (follows[i].followed === username) {
			followers.push(follows[i].follower);
		}
	}
	if (followers.length === 0) {
		cb(username + ' has no followers');
	} else {
		console.log("Followers: " + followers);
		// Give back the array of followers
		cb(undefined, followers);
	}
};

// ### *function*: getFollowing  
/**
 * Retrieves the list of all users whom the passed user follows.
 *
 * @param {string} username The user whose subscriptions to fetch
 * @param {function} cb Callback function to invoke after retrieving following
 */
exports.getFollowing = function (username, cb) {
	var following = new Array();
	
	//Walk through the array looking for people this user is following
	for (var i=0; i<follows.length; i++) {
		if (follows[i].follower === username) {
			following.push(follows[i].followed);
		}
	}
	
	if (following.length === 0) {
		cb(username + ' is not following anyone');
	} else {
		console.log("Followed users: " + following);
		
		//Give back the array of users being followed
		cb(undefined, following);
	}
};

// ### *function*: follow  
/**
 * Makes user1 follow user2, if not already following user2.  
 * 
 * @param {string} user1 The username who is following user2  
 * @param {string} user2 The username being followed by user1
 */
exports.follow = function (user1, user2) {
	// Attempt to find this follow activity in the database
	for (var i=0; i<follows.length; i++) {
		if (follows[i].follower === user1 && follows[i].followed === user2) {
			//Do nothing if this follow activity exists already
			console.log(user1 + ' is already following ' + user2);
			return;
		}
	}
	
	follows.push(new FollowActivity(user1, user2));
	console.log(user1 + ' is now following ' + user2);
	console.log(follows);
};

// ### *function*: unfollow  
/**
 * Makes user1 no longer follow user2 if user1 was following user2.  
 *
 * @param {string} user1 The username who is following user2  
 * @param {string} user2 The username who was being followed by user1
 */
exports.unfollow = function (user1, user2) {
	// Attempt to find this follow activity in the database
	for (var i=0; i<follows.length; i++) {
		if (follows[i].follower === user1 && follows[i].followed === user2) {
			//Remove the follow activity from this index
			follows.splice(i, 1);
			console.log(user1 + ' has unfollowed ' + user2);
		}
	}
	console.log('Nonexistent follow activity');
};

// ### *function*: isFollowing
/**
 * Tells whether user1 is following user2.
 *
 * @param {string} user1 The username who may be following user2
 * @param {string} user2 The username who may be followed by user1
 * @return true	if user1 is following user2
 */
exports.isFollowing = function (user1, user2) {
	for (var i=0; i<follows.length; i++) {
		if (follows[i].follower === user1 && follows[i].followed === user2) {
			return true;
		}
	}
	return false;
};
