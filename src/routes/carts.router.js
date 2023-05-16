import { Router } from 'express'
const router = Router()

import CartManager from '../CartManager.js'

const carts = new CartManager('./src/carts.json')

router.get('/:id', (req, res) => {
    const getCartId = async function () {
        const cartId = await carts.getCartById(req.params.id)
        res.send(cartId)
    }
    getCartId()
})

router.post('/', (req, res) => {
    const cart = req.body
    const addCart = async function () {
        const newId = await carts.addCart(cart)
        res.send("Se agregó carrito con Id: " + newId)
    }

    addCart()
})

router.post('/:cid/product/:pid', (req, res) => {
    const addCartProduct = async function () {
        const cart = req.body
        const newId = await carts.addCartProduct(req.params.cid, req.params.pid)
        res.send("Se agregó el producto al carrito. Id producto: " + newId)
    }

    addCartProduct()
})

export default router