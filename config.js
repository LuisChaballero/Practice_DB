//mongodb+srv://luis:luis@cluster0-g8ctf.mongodb.net/test?retryWrites=true&w=majority

//mongodb+srv://luis:luis@cluster0-g8ctf.mongodb.net/university?retryWrites=true&w=majority
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/university";
exports.PORT = process.env.PORT || 8080;