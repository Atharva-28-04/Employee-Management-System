export const validateEmployee = (
  req,
  res,
  next
) => {
  const {
    email,
    phone,
    salary
  } = req.body;

  if (
    email &&
    !/^\S+@\S+\.\S+$/.test(email)
  ) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  if (
    phone &&
    phone.length < 10
  ) {
    return res.status(400).json({
      error: 'Phone must be 10 digits'
    });
  }

  if (
    salary &&
    Number(salary) <= 0
  ) {
    return res.status(400).json({
      error: 'Salary must be greater than 0'
    });
  }

  next();
};