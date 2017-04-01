module.exports = function* notFound(next) {
    if (this.status && 404 !== this.status) return;
    if (this.body) return;
    yield next;

    this.status = 404;
    this.body = this.error ? this.fail(this.error.message, 500) : this.fail("not this request", 404);
};
