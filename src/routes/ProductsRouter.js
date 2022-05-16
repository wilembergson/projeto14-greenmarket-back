import Router from "express"
import { finishOrder, listProducts, ordersList, saveProducts } from "../controllers/ProductController.js"

const productsRouter = Router()

productsRouter.post('/products', saveProducts)
productsRouter.get('/products', listProducts)
productsRouter.post('/orders', finishOrder)
productsRouter.get('/orders', ordersList)

export default productsRouter