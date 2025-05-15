import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
const login = async(req,res)=>{
try{
   const {email,password} = req.body;
   const user= await User.findOne({email});
   if(!user){
    res.status(404).json({success:false,error:"User Not Found"})
   }
   const isMatch = await bcrypt.compare(password,user.password)
   if(!isMatch){
    res.status(404).json({success:false,error:"Wrong Password"})
   }
   const token = jwt.sign(
    {_id: user._id, role: user.role},
    process.env.JWT_KEY,
    {expiresIn : "10d"}
   )

   res
   .status(200)
   .json({
    success:true,
    token,
    user:{_id: user._id,name :user.name,role:user.role}
});


}
catch(error){
    res.status(500).json({success:false,error:error.message})
}
};

const verify = (req,res) =>{
    return res.status(200).json({success:true,user:req.user})
}


const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Current password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
};


// Admin change password
 const adminchangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both current and new passwords are required." });
    }

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


export{login,verify,adminchangePassword,changePassword};