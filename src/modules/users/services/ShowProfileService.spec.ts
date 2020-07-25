import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'mr.thiagoo@gmail.com',
      name: 'Thiago Pereira',
      password: '123456',
    });

    const userProfile = await showProfile.execute({
      user_id: user.id,
    });

    expect(userProfile.name).toBe('Thiago Pereira');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
