import nodemailer from 'nodemailer'

let mailTransporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'agritrade2025@gmail.com',
            pass: 'eualmbcgkqxqwazm'
        }
    }
);

export const sendMails = (req, res) => {
    const { email,subject,text } = req.body;

    let mailDetails = {
        from: 'agritrade2025@gmail.com',
        to: email,
        subject: subject,
        text: text
    };

    mailTransporter.sendMail(mailDetails,
        (err, data) => {
            if (err) {
                console.log("Problem at Email Sender Route ", err)
                res.status(500).json({ error: "Internal Server Error" })
            } else {
                res.status(200).json({
                    message:"success"
                })
            }
        });
}
