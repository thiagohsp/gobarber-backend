import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvider', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Thiago',
      email: 'thiago@gmail.com',
      password: '123456',
    });

    delete user1.password;

    const user2 = await fakeUsersRepository.create({
      name: 'Amanda Curty',
      email: 'amanda@gmail.com',
      password: '123456',
    });

    delete user2.password;

    const loggedUser = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual(
      expect.arrayContaining([
        { ...user1, avatar_url: null },
        { ...user2, avatar_url: null },
      ]),
    );
  });
});
