import colors from 'colors';

import User from '@/models/User';

import { hashPassword } from '@/utils/auth';
import { UserRole } from '@/enums/user-role.enum';

export const createSuperUser = async () => {
  const {
    SUPER_USER_EMAIL: email,
    SUPER_USER_PASSWORD: password,
    SUPER_USER_FIRST_NAME: firstNames,
    SUPER_USER_LAST_NAME: lastNames,
  } = process.env;

  // Validate if super-user exists
  const existingSuperUser = await User.findOne({ roles: 'super-user' });

  if (!existingSuperUser) {
    const superUser = new User({
      email: email,
      password: await hashPassword(password),
      firstNames: firstNames,
      lastNames: lastNames,

      roles: [UserRole.SuperUser],
    });

    await superUser.save();
    console.log(colors.blue.bold('Super Usuario creado correctamente.'));
    return superUser;
  } else {
    console.log(colors.blue.bold('El Super Usuario ya existe.'));
    return null;
  }
};
