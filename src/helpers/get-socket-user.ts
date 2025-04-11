import User from '@/models/User';

export const getSocketUser = async (uid: string) => {
  try {
    const user = await User.findById(uid);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    throw new Error('SHubo un error, revisa los logs.');
  }
};
