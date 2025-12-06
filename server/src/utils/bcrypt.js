import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

export const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}