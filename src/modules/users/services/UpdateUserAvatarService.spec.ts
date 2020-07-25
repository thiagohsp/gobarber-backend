import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateAvatarUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to upload a new avatar', async () => {
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarFilename.jpg',
    });

    expect(user.avatar).toBe('avatarFilename.jpg');
  });

  it('should not be able to upload an avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatarFilename.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete an old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarFilename.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarFilename2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatarFilename.jpg');
    expect(user.avatar).toBe('avatarFilename2.jpg');
  });
});
