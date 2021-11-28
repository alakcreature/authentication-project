const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

exports.initialize = (passport, getuserbyemail, getuserbyid)=>{
    const authenticateuser = async(email, password, done)=>{
        const user = getuserbyemail(email);
        if(!user){
            return done(null, false, { message: 'No user with this email exists' })
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, { message: 'Password incorrect' })
            }
        }
        catch(err){
            return done(err);
        }
    }
    
    passport.use(new LocalStrategy({ 
        usernameField: 'email' 
    }, authenticateuser))

    // If authentication succeeds, a session will be established & maintained via a cookie set in the browser.
    // Each subsequent request will not contain credentials, but rather the unique cookie that identifies the 
    // session. In order to support login sessions, Passport will serialize and deserialize user instances to 
    // and from the session. Only the user id is serialized to the session.
    passport.serializeUser((user, done)=> done(null,user.id) )
    passport.deserializeUser((id, done)=>{  
        return done(null, getuserbyid(id))
    })
}