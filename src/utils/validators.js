export const required = (val) => {
    let test = val.trim();
    return test && test.length;
} 

export const maxLength = (len) => (val) => !(val) || (val.length <= len);

export const minLength = (len) => (val) => (val) && (val.length >= len);

export const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

export const validPassword = (val) => {
    let test = /[A-Z]/i.test(val);
    if (!test) return test;

    test = /[a-z]/i.test(val);
    if (!test) return test;

    test = /[0-9]/i.test(val);
    if (!test) return test;

    return /[^A-Za-z0-9\s]/i.test(val);
}