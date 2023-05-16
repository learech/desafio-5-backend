import { Router } from 'express'
const router = Router()

import ProductManager from '../ProductManager.js'

const productos = new ProductManager('./src/products.json')

router.get('/', (req, res) => {
    res.render("realTimeProducts");

});

export default router