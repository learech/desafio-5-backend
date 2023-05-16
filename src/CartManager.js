import fs from 'fs'

class CartManager {

    constructor(path) {
        this.path = path;
    }

    //consigue el siguiente id, se pasa como parámetro un array de carritos (objetos) 
    getNextID(carts) {
        console.log(carts)
        let nextID
        if (carts.length === 0) {
            nextID = 1
        } else {
            nextID = carts[carts.length - 1].id + 1
        }
        return nextID
    }

    // Leer carrito por id
    getCartById = async (p_id) => {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id == p_id)

        const cart_obj = { ...cart } // devuelve el producto en formato objeto

        return (cart_obj.products)
    }


    // Leer todos los carritos
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                let jsonCart = await fs.promises.readFile(this.path, 'utf-8')
                let carts = JSON.parse(jsonCart)
                return carts;
            }
            else {
                console.log("El archivo no existe")
                return []
            }
        }
        catch (e) {
            console.error('ERROR: ', e)
            return []
        }
    }

    // Agregar carrito 
    addCart = async (cart) => {
        try {
            const carts = await this.getCarts();

            const newId = this.getNextID(carts)

            const newCart = { ...cart, id: newId }
            console.log(newCart)
            carts.push(newCart)

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), err => { if (err) console.log(err) })
            console.log(`Se agregó el carrito con Id: ${newId}`);
            return newId
        }

        catch (e) {
            console.error('Error: ', e)
            return null
        }

    }

    // agregar un producto al carrito 
    addCartProduct = async (p_id_cart, p_id_product) => {
        try {
            const carts = await this.getCarts();
            // Validar si existe el carrito
            const products = await this.getCartById(p_id_cart);
            console.log(products)
            if (products === undefined) {
                console.log("No existe el carrito con el id informado")
                return null
            }

            else {
                // Validar si existe el producto en el carrito 
                const prod = products.find(prod => prod.id == p_id_product)
                if (prod === undefined) { // no encontró el producto
                    // agregar el producto
                    let prods = carts.find((el) => (el.id == p_id_cart))
                    const id_product = Number(p_id_product)
                    prods.products.push({ "id": id_product, "quantity": 1 })
                }
                else { // encontró el producto, le suma 1
                    let prods = carts.find((el) => (el.id == p_id_cart))
                    let prod = prods.products.find((el) => (el.id == p_id_product))
                    prod.quantity = prod.quantity + 1
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), err => { if (err) console.log(err) })
                console.log(`Se agregó el producto al carrito, con IdProducto: ${p_id_product}`);
                return p_id_product
            }
        }
        catch (e) {
            console.error('Error: ', e)
            return null
        }
    }
}

// PRUEBAS --------------------------------------
/* const carrito = new CartManager('./carts.json');

const getCartsId = async function () {
    const cartsId = await carrito.getCartById(100);
    console.log(cartsId)
}
getCartsId()*/
// ----------------------------------------------
/*

const carrito = new CartManager('./carts.json');

const addCartProduct1 = async function () {
    const cartsId = await carrito.addCartProduct(2, 2);
    console.log(cartsId)
}
addCartProduct1()

/*
const newCart = {
    "id": null,
    "products": [
        {
            "id": 1,
            "quantity": 4
        },
        {
            "id": 4,
            "quantity": 4
        }
    ]
}

const addCart = async function () {
    const cartsId = await carrito.addCart(newCart);
    console.log(cartsId)
}
addCart()
// ----------------------------------------------
*/

export default CartManager
