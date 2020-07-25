import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '1',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1');
  });

  it('should not be able to create two appointments on the same datetime', async () => {
    const appointmentDate = new Date(2020, 5, 16, 11);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '1',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
