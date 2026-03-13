import express, { Router } from 'express';
import initRegister from '../controllers/auth/initRegister';
import verifyRegister from '../controllers/auth/verifyRegister';
import initAuth from '../controllers/auth/initAuth';
import verifyAuth from '../controllers/auth/verifyAuth';

const router: Router = express.Router();

router.route('/init-register').put(initRegister);
router.route('/verify-register').post(verifyRegister);
router.route('/init-auth').get(initAuth);
router.route('/verify-auth').post(verifyAuth);

export default router;