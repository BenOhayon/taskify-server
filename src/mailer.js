const nodemailer = require("nodemailer")
const responseCodes = require("./responseCodes")

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.NODEMAILER_GMAIL_ACCOUNT_USER,
		pass: process.env.NODEMAILER_GMAIL_ACCOUNT_PASS,
	},
})

async function sendMail(mailOptions) {
	try {
		const info = await transporter.sendMail(mailOptions);
	
		console.log("Message sent: ", info?.messageId)
		console.log('Successful sends: ', info.accepted)
		console.log('Failed sends: ', info.rejected)
	} catch (error) {
		throw new Error({error, code: responseCodes.SERVER_ERROR})
	}
}

module.exports = {
	sendMail
}