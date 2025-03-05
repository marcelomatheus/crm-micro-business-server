import express from 'express';
import { login, register } from '../services/auth-service';
const router = express.Router();

router.use(express.json());

  /**
 * @swagger
 * /oi:
 *   get:
 *     summary: Get a resource
 *     description: Get a specific resource.
 *     parameters:
 *      - in: id
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/login', login);
router.post('/register', register);
export default router;