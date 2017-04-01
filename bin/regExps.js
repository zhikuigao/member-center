module.exports = {
    mailRegExp:  new RegExp(/^[a-zA-Z0-9\+\.\_\%\-\+]{1,256}\@[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{0,25})$/),
    pwdRegExp:  new RegExp(/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,16}$/),
    phoneRegExp:  new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/)
};
