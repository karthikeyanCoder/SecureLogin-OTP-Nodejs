const passwordValidator =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;

export const validatePassword = (password) => {
  return passwordValidator.test(password);
};
