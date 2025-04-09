import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { AuthController } from '@/controllers/AuthController';

import { authenticate } from '@/middlewares/auth';
import { handleInputErrors } from '@/middlewares/validation';
import { UserRole } from '@/enums/user-role.enum';
import { setDefaultQueryParams } from '@/middlewares/ser-default-query-params';

const router: Router = Router();

//* CREATE USER
router.post(
  '/create-user',
  body('firstNames').notEmpty().withMessage('El nombre es requerido.'),
  body('lastNames').notEmpty().withMessage('El apellido es requerido.'),
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  body('password')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('El password es muy corto, mínimo 8 caracteres.'),
  body('passwordConfirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los passwords no son iguales.');
    }
    return true;
  }),
  body('roles')
    .isIn(Object.values(UserRole))
    .withMessage(
      `El rol debe ser uno de los siguientes: ${Object.values(UserRole).join(', ')}`
    ),
  handleInputErrors,
  AuthController.createUser
);

//* LOGIN
router.post(
  '/login',
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  body('password')
    .notEmpty()
    .notEmpty()
    .withMessage('El password no puede ir vació.'),
  handleInputErrors,
  AuthController.login
);

//* GET USER INFO
router.get('/get-user', authenticate, AuthController.getUser);
router.get('/get-all-users', authenticate, AuthController.getAllUsers);

//? PROFILE
//* UPDATE PROFILE (firstNames, lastNames, email)
router.put(
  '/update-profile',
  authenticate,
  body('firstNames').notEmpty().withMessage('El nombre es requerido.'),
  body('lastNames').notEmpty().withMessage('El apellido es requerido.'),
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  handleInputErrors,
  AuthController.updateProfile
);

//* UPDATE PASSWORD
router.put(
  '/update-password',
  authenticate,
  body('currentPassword')
    .notEmpty()
    .withMessage('El password actual no puede ir vació.'),
  body('newPassword')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('El password es muy corto, mínimo 8 caracteres.'),
  body('newPasswordConfirm').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Los passwords no son iguales.');
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);

//! DELETE USER
router.delete(
  '/:userId',
  authenticate,
  param('userId').isMongoId().withMessage('ID no valido.'),
  handleInputErrors,
  AuthController.deleteUserById
);

//? GET PEXELES IMAGES
router.get(
  '/get-images',
  authenticate,
  setDefaultQueryParams,
  query('query')
    .isString()
    .notEmpty()
    .withMessage('El parámetro de búsqueda no puede estar vacío.'),
  query('per_page')
    .isInt({ min: 1, max: 10 })
    .withMessage('per_page debe ser un número entre 1 y 10.'),
  query('page')
    .isInt({ min: 1 })
    .withMessage('page debe ser un número mayor o igual a 1.'),
  handleInputErrors,
  AuthController.getPexelesImages
);

export default router;
