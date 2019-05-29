module.exports = function(params) {
  let t = Object.assign({}, params);
  if (t.page) {
    delete t.page;
  }
  return t;
}