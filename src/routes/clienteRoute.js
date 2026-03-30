import { Router } from 'express';
import * as controller from '../controllers/clienteController.js';

const router = Router();

router.post('/clientes', controller.criar);
router.get('/clientes', controller.buscarTodos);
router.get('/clientes/:id', controller.buscarPorId);
router.put('/clientes/:id', controller.atualizar);
router.delete('/clientes/:id', controller.deletar);

export default router;
