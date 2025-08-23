/**
 * @swagger
 * components:
 *   schemas:
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
 */
