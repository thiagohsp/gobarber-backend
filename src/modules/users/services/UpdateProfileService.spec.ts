import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Thiago H S Pereira',
      email: 'mr.thiagoo@gmail.com.br',
    });

    expect(updatedUser.name).toBe('Thiago H S Pereira');
    expect(updatedUser.email).toBe('mr.thiagoo@gmail.com.br');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      email: 'amanda.ps.curty@gmail.com',
      name: 'Amanda Curty',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Amanda Curty',
        email: 'mr.thiagoo@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Thiago H S Pereira',
      email: 'mr.thiagoo@gmail.com.br',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should be not able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Thiago H S Pereira',
        email: 'mr.thiagoo@gmail.com.br',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to update the password with invalid old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Thiago H S Pereira',
        email: 'mr.thiagoo@gmail.com.br',
        old_password: '1234567',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
