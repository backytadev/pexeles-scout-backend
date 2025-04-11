import type { Request, Response } from 'express';

import User from '@/models/User';

import { generateJWT } from '@/utils/jwt';
import { checkPassword, hashPassword } from '@/utils/auth';

export class AuthController {
  //* CREATE USER
  static createUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validation if exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('El email ya esta registrado');
        res.status(409).json({ error: error.message });
        return;
      }

      // Create new user
      const user = new User(req.body);
      user.password = await hashPassword(password);

      await user.save();

      res.send('Cuenta creada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  //* LOGIN
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validation if exists
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error(
          'Credenciales incorrectas, verifique su correo y contraseña'
        );
        res.status(401).json({ error: error.message });
        return;
      }

      // Review password
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error(
          'Credenciales incorrectas, verifique su correo y contraseña'
        );
        res.status(401).json({ error: error.message });
        return;
      }

      const token = generateJWT({ id: user.id });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  //* GET USER
  static getUser = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({ roles: { $ne: 'super-user' } }).select(
        '_id firstNames lastNames email roles'
      );

      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  //* UPDATE PROFILE (firstNames, lastNames, email)
  static updateProfile = async (req: Request, res: Response) => {
    const { firstNames, lastNames, email } = req.body;

    // Validation if exists
    const userExists = await User.findOne({ email });

    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
      const error = new Error('El e-mail ya esta registrado.');
      res.status(409).json({ error: error.message });
      return;
    }

    // Set new values
    req.user.firstNames = firstNames;
    req.user.lastNames = lastNames;
    req.user.email = email;

    try {
      await req.user.save();
      res.send('Perfil actualizado correctamente');
    } catch (error) {
      res.status(500).send('Hubo un error.');
    }
  };

  //* UPDATE USER PASSWORD
  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    // Validation if exists
    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error('La contraseña actual es incorrecta');
      res.status(409).json({ error: error.message });
      return;
    }

    // Set new password
    try {
      user.password = await hashPassword(newPassword);
      await user.save();
      res.send('La contraseña se modifico correctamente');
    } catch (error) {
      res.status(500).send('Hubo un error.');
    }
  };

  //! DELETE USER
  static deleteUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: 'Usuario eliminado correctamente' });
      return;
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revise los logs.' });
    }
  };

  //? PEXELES IMAGES
  static getPexelesImages = async (req: Request, res: Response) => {
    try {
      const { query, page, per_page } = req.query;

      const resp = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=${per_page}`,
        {
          method: 'GET',
          headers: {
            Authorization: process.env.API_KEY_PEXELES,
          },
        }
      );

      const data = await resp.json();

      if (!data) {
        const error = new Error('Error al consultar la API de Pexels.');
        res.status(resp.status).json({ error: error.message });
        return;
      }

      res.status(200).json({ data });
      return;
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };
}
