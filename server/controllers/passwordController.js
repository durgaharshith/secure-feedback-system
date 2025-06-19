const User = require('../models/User.js');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: 'User not found'});

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now()+3600000;
        await user.save();

        res.status(200).json({
            message: 'Password reset link generated',
            resetLink: `/api/auth/reset-password/${token}`,
        })
    }catch(err){
        res.status(500).json({error: 'Server error'});
    }
}

exports.resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    try{
        const user =await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if(!user) res.status(404).json({message: 'Token expired ot invalid'});

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({message: 'Password reset Successfully'});
    }catch(err){
        res.status(500).json({error: 'Server error'});
    }
}