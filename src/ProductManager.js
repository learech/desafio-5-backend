import fs from 'fs'

class ProductManager {

    constructor(path) {
        this.path = path;
    }
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                let jsonProd = await fs.promises.readFile(this.path, 'utf-8')
                let productos = JSON.parse(jsonProd)
                return productos;
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

    
    getNextID(products) {
        console.log(products)
        let nextID
        if (products.length === 0) {
            nextID = 1
        } else {
            nextID = products[products.length - 1].id + 1
        }
        return nextID
    }

    // Agregar item
    addProduct = async (product) => { //(title, description, price, thumbnail, code, stock) {
        try {
            const products = await this.getProducts();
            console.log(product)
            // valida que los campos sean obligatorios
            if (!product.title) { console.log("Debe ingresar un Título") }
            else if (!product.description) { console.log("Debe ingresar una Descripción ") }
            else if (!product.price) { console.log("Debe ingresar un Precio ") }
            else if (products.find(prod => prod.code == product.code)) { console.log(` El Producto con Código ${product.code} ya existe `) }
            else {
                const newId = this.getNextID(products)

                const newProduct = { ...product, id: newId }
                products.push(newProduct)

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), err => { if (err) console.log(err) })
                console.log(`Se agregó el elemento con Id: ${newId}`);
                return newId
            }
        }
        catch (e) {
            console.error('Error: ', e)
            return null
        }

    }

    // Leer item por id
    getProductById = async (p_id) => {
        const products = await this.getProducts();
        const product = products.find(prod => prod.id == p_id)

        const product_obj = { ...product }

        return (product_obj)
    }

    // Actualizar item
    updateProduct = async (p_id, p_product) => {

        const newId = Number(p_id)

        if (newId !== null) {
            const producto_upd = {
                id: newId,
                title: p_product.title,
                description: p_product.description,
                price: p_product.price,
                thumbnail: p_product.thumbnail,
                code: p_product.code,
                stock: p_product.stock
            }

            let products = await this.getProducts();

            let products_new = products.filter(function (p) {
                return p.id !== newId;
            });
            console.log(products_new)
            products_new.push(producto_upd);
            products_new.sort((firstItem, secondItem) => firstItem.id - secondItem.id);  // ordeno el array por id

            let jsonStrProd = JSON.stringify(products_new, null, 2)

            await fs.promises.writeFile(this.path, jsonStrProd, err => { if (err) console.log(err) })

            console.log("Se aplicó la actualización")
        }
    }

    // Borrar producto por id
    deleteProduct = async (p_id) => {
        const newId = Number(p_id)

        if (newId !== null) {

            let products = await this.getProducts();

            let products_new = products.filter(function (p) {
                return p.id !== newId;
            });

            let jsonStrProd = JSON.stringify(products_new, null, 2)

            await fs.promises.writeFile(this.path, jsonStrProd, err => { if (err) console.log(err) })

            console.log("Se eliminó el producto. ")
        }
    }
}

export default ProductManager
