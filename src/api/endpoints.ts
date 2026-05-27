export const ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    USER_REGISTER: `/auth/registerUser`,
    ADMIN_REGISTER: `/auth/registerAsAdmin`,
    THEATRE_REGISTER: `/auth/registerAsTheatre`,
  },
  MOVIES: {
    GET_ALL: `/movies`,
    POST_MOVIE: `/movies`,
    GET_BY_ID: (id: string) => `/movies/${id}`,
    DELETE_BY_ID: (id: string) => `/movies/${id}`,
  },

  SHOWS: {
    POST_SHOWS: `/shows`,
    GET_SHOWS_BY_MOVIE: (movieId: string) => `/shows/movie/${movieId}`,
  },
  USER: {
    GET_ALL_USERS: `/users/getAllUsers`,
    UPDATE_BY_ID: (id: string) => `/users/updateUserbyId/${id}`,
  },
  BOOKINGS: {
    CREATE: (userId: string) => `/bookings/${userId}`,
    GET_BY_ID: (bookingId: string) => `/bookings/${bookingId}`,
  },
  PAYMENT: {
    CREATE_PAYMENT: (bookingId: string | number) =>
      `/payment/create/${bookingId}`,
    PAYMENT_SUCCESS: `/payment/success`,
    PAYMENT_CANCEL: `/payment/cancel`,
  },
  THEATRE: {
    CREATE_THEATRE: `/threatre/createTheatre`,
    GET_ALL_THEATRES: `/threatre/getalltheatres`,
    DELETE_THEATRE_BY_ID: (id: string) => `/theatre/${id}`,
  },
  LOCATION: {
    CREATE_LOCATION: `/locations/createlocation`,
    GET_ALL_LOCATIONS: `/locations/getAll`,
  },
  REVIEWS: {
    POST_REVIEW: `/reviews`,
    GET_REVIEWS_BY_MOVIE: (movieId: string) => `/reviews/movie/${movieId}`,
  },
};
