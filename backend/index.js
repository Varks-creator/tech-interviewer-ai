require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5001;

console.log(`Server is running on port ${PORT}`);
app.listen(PORT, () => {
});