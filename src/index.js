import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import realTimeProductsRouter from './routes/realTimeProducts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './dirname.js'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import ProductManager from './ProductManager.js'

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
app.set("io", io);

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main.hbs",
    })
);

app.use(express.json())
app.use(express.static("public"));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.urlencoded({ extended: true }))

app.use('/api/realtimeproducts', realTimeProductsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const server = httpServer.listen(8080, () => {
    console.log('Port running at 8080');
})

server.on("error", (error) => { console.log(error) })

const productos = new ProductManager('./src/products.json')

io.on('connection', async (socket) => {
    console.log(`New client connected, id: ${socket.id}`)

    const products = await productos.getProducts()

    io.sockets.emit("products", products);

    socket.on('addProduct', async (product) => {
        try {
            await productos.addProduct(product);

            io.sockets.emit("products", await productos.getProducts());
        }
        catch (error) {
            console.log(error)
        }
    });
});