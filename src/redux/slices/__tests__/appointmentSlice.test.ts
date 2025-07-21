import reducer, { setAppointmentLoading } from '../appointmentSlice';

describe('appointmentSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      appointment: null,
      loading: false,
      error: null,
    });
  });

  it('should handle setAppointmentLoading', () => {
    const initialState = { appointment: null, loading: false, error: null };
    const nextState = reducer(initialState, setAppointmentLoading(true));
    expect(nextState.loading).toBe(true);
  });
}); 