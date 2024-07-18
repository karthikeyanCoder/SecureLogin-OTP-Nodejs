const passwordValidator = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z])(?=.*[A-Z]).{8,}$/;

export const validatePassword = (password) => {
  return passwordValidator.test(password);
};
