function hello(req, res, next) {
  res.send({ msg: 'hello world!' });
  next();
}

export default hello;
