import nodemailer from 'nodemailer'

let mailTransporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'agritrade2025@gmail.com',
            pass: ''
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
        from: 'agritrade2025@gmail.com',
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
