const adam = { password: 'pass1', name: 'Adam', _id: '56f46358c558e7a529b0b42b', email: 'adam@gmail.com' }
const eve = { password: 'pass2', name: 'Eve', _id: '56f46365c558e7a529b0b42c', email: 'eve@gmail.com' }
const users = [ adam, eve ]

const bestScores = [
  { userId: adam._id, score: 7, mode: 'audioposition2' },
]

module.exports = { bestScores, users }
