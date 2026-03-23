import express from 'express';
import * as controller from '../controllers/pdfController.js';

const router = express.Router();

router.get('/pdf', controller.relatorioTodos);
router.get('/pdf/:id', controller.relatorioPorId);

export default router;
