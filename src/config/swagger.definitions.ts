/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 *         error:
 *           type: object
 *           properties:
 *             path:
 *               type: string
 *             message:
 *               type: string
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           description: "Response data"
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         token:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         promo:
 *           $ref: '#/components/schemas/Promo'
 *         promoId:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         subtotal:
 *           type: number
 *         discountAmount:
 *           type: number
 *         total:
 *           type: number
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         quantity:
 *           type: number
 *         unitPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *         variant:
 *           $ref: '#/components/schemas/Variant'
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *     Promo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         type:
 *           type: string
 *         value:
 *           type: number
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 *     Image:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         isFeatured:
 *           type: boolean
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         orderNumber:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *         status:
 *           type: string
 *         promo:
 *           $ref: '#/components/schemas/Promo'
 *         subtotal:
 *           type: number
 *         discountAmount:
 *           type: number
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         variant:
 *           $ref: '#/components/schemas/Variant'
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *     CreateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     CreateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         isFeatured:
 *           type: boolean
 *         categoryId:
 *           type: string
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateVariantRequest'
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         isFeatured:
 *           type: boolean
 *         categoryId:
 *           type: string
 *     CreateVariantRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         isDefault:
 *           type: boolean
 *     UpdateVariantRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         isDefault:
 *           type: boolean
 *     CreatePromoRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         type:
 *           type: string
 *         value:
 *           type: number
 *         usageLimit:
 *           type: number
 *         minimumAmount:
 *           type: number
 *         uptoDiscount:
 *           type: number
 *         validFrom:
 *           type: string
 *           format: date-time
 *         validTo:
 *           type: string
 *           format: date-time
 *     UpdatePromoRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         type:
 *           type: string
 *         value:
 *           type: number
 *         usageLimit:
 *           type: number
 *         minimumAmount:
 *           type: number
 *         uptoDiscount:
 *           type: number
 *         status:
 *           type: string
 *         validFrom:
 *           type: string
 *           format: date-time
 *         validTo:
 *           type: string
 *           format: date-time
 *     UpdateOrderStatusRequest:
 *       type: object
 *       properties:
 *         newStatus:
 *           type: string
 */
