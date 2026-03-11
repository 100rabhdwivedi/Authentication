import {createTransport} from 'nodemailer'

const sendMail = async({email,subject,html})=>{
    const transport = createTransport({
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:"dsdasfd",
            pass:"casassdasd"
        }
    })

    await transport.sendMail({
        from:"xyz@gmail.com",
        to:email,
        subject,
        html
    })
}

export default sendMail