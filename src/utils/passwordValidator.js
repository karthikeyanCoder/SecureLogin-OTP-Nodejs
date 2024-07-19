const passwordValidator = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const validatePassword = (password) => {
  return passwordValidator.test(password);
};
