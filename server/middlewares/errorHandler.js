const errorHandler = (error, req, res, next) => {
  console.log(error);
  let status = 500;
  let message = 'Internal server error';

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    status = 400;
    message = error.errors[0].message;
  } else if (error.name === 'BadRequest') {
    status = 400;
    message = 'Email or Password is required';
  } else if (error.name === 'InvalidPrivateKey') {
    status = 400;
    message = 'Private key is invalid. Please check your input';
  } else if (
    error.name === 'Unauthorized' ||
    error.name === 'JsonWebTokenError'
  ) {
    status = 401;
    message = 'Unauthenticated';
  } else if (error.name === 'InvalidCredentials') {
    status = 401;
    message = 'Invalid Email or Password';
  } else if (error.name === 'OnProcess') {
    status = 401;
    message =
      'Your Account still on process verification, please login back until verification process finish.';
  } else if (error.name === 'Forbidden') {
    status = 403;
    message = 'the server understands the request but refuses to authorize it';
  } else if (error.name === 'NotFoundUser') {
    status = 404;
    message = 'User not found';
  } else if (error.name === 'NotFoundCompany') {
    status = 404;
    message = 'Company not found';
  } else if (error.name === 'NotFoundMessage') {
    status = 404;
    message = 'Message not found';
  } else if (error.name === 'Free') {
    status = 401;
    message = 'You Must Subscribe first';
  } else if (error.name === 'UnauthorizedAdmin') {
    status = 401;
    message = 'Login First';
  } else if (error.name === 'NotFoundContact') {
    status = 404;
    message = 'Friend not found on your contact';
  }

  return res.status(status).json({ message });
};

module.exports = { errorHandler };
