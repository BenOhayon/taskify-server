module.exports = {
	async up(db) {
		await db.collection('tasks').updateMany({}, {$set: {title: ''}});
		await db.collection('tasks').updateMany({}, {$set: {description: ''}});
		await db.collection('tasks').updateMany({}, {$unset: {text: ''}});
	},

	async down(db) {
		await db.collection('tasks').updateMany({}, {$unset: {title: ''}});
		await db.collection('tasks').updateMany({}, {$unset: {description: ''}});
		await db.collection('tasks').updateMany({}, {$set: {text: ''}});
	}
};