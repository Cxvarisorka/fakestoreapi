import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Routers
import productsRoutes from './routes/products.routes.js';
import adminsRoutes from './routes/admins.route.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Routers middleware
app.use('/products', productsRoutes);
app.use("/admin", adminsRoutes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})