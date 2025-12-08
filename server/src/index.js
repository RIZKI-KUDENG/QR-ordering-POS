import express from 'express'
import router from './routes/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const PORT = process.env.PORT || 3001;

app.use(router);

app.listen(PORT, () => {
    console.log('Server is running on port 3001');
})