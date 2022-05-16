import Router from "express"
import { listProducts, saveProducts } from "../controllers/ProductController.js"

const productsRouter = Router()

productsRouter.post('/products', saveProducts)
productsRouter.get('/products', listProducts)

export default productsRouter