const hello = (req, res, next) => {
  res.json({ msg: 'hello world!' });
  next();
};

export default hello;
