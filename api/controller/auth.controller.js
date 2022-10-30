const {Users} = require('../../models/models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const generateJwt = (name, email) => {
    return jwt.sign(
        {name, email},
        process.env.SECRET_KEY || 'OLMA',
        {expiresIn: '24h'}
    )
}

// Signup
const REGISTER = async(req,res) => {
   try {
     let { name, email, password } = req.body;
     console.log(req.body);
     name = name?.trim();
     email = email?.trim();
     password = password?.trim();
     if(!name || !email || !password){
      return res.json({
         status: 'Failed',
         message: 'Empty input fields!'
       })
    }

     const candidate = await Users?.findOne({where: {email}})
     if (candidate) {
         return next(ApiError.badRequest('user is already exist'))
     }
     const hashPassword = await bcrypt.hash(password, 5)
     const user = await Users.create({name, email, password: hashPassword})
     const token = generateJwt(user.name, user.email)
     return res.json({token})

   } catch (error) {
    throw error
   }
}

// Signin
const LOGIN = async(req,res) => {
  const {email, password} = req.body
        const user = await Users.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('user not exist'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('wrong password'))
        }
        const token = generateJwt(user.name, user.email, user.role)
        return res.json({token})
}

module.exports = {
	REGISTER,
	LOGIN
}