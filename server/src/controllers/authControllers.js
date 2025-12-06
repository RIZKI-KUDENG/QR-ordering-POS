import {User} from '../db'
import { hashPasword, comparePassword } from '../utils/bcrypt'

export const register = async (req, res) => {
 try {
    const {username, password} = req.body;
    const user = await User.create({
        username,
        password: hashPasword(password)
    })
    res.json(user);
 } catch (error) {
    
 }
}