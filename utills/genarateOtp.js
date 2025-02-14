import nodemailer from 'nodemailer'

let mailTransporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'gopalnaidu1972@gmail.com',
            pass: 'jihkctavxaplbavy'
        }
    }
);

export const genarateOtp = (req, res) => {
    const { email } = req.body;

    let otp = ""
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    console.log(otp);

    let mailDetails = {
        from: 'gopalnaidu1972@gmail.com',
        to: email,
        subject: 'AgriTrade OTP For Email Verification',
        text: `Your OTP Is ${otp} `
    };

    mailTransporter.sendMail(mailDetails,
        (err, data) => {
            if (err) {
                console.log("Problem at OTP Route ", err)
                res.status(500).json({ error: "Internal Server Error" })
            } else {
                res.status(200).json({
                    otp: otp
                })
            }
        });
}
