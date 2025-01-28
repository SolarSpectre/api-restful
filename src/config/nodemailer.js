import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});


const sendMailToUser = (userMail, token) => {

    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: `<p>Hola, haz clic <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};


// send mail with defined transport object
const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
    <hr>
    <a href=${process.env.URL_FRONTEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Grandote te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}




// Send mail to student
const sendMailToEstudiante = async (userMail, password) => {
    let info = await transporter.sendMail({
        from: 'admin@universidades.com',
        to: userMail,
        subject: "Bienvenido a la Comunidad Universitaria 🎓",
        html: `
        <h1>Sistema de Gestión de Estudiantes (Uni-Connect 🎓)</h1>
        <hr>
        <p>Hola,</p>
        <p>¡Bienvenido a Uni-Connect! Estamos emocionados de que formes parte de nuestra comunidad de estudiantes entre universidades.</p>
        <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales para acceder:</p>
        <ul>
            <li><strong>Email:</strong> ${userMail}</li>
            <li><strong>Contraseña:</strong> ${password}</li>
        </ul>
        <p>Para iniciar sesión, haz clic en el siguiente enlace:</p>
        <a href="${process.env.URL_FRONTEND}login" style="color: #3498db; text-decoration: none;">Iniciar sesión</a>
        <hr>
        <footer style="text-align: center;">
            <p>© 2025 Uni-Connect. Todos los derechos reservados.</p>
            <p>Conectando estudiantes, creando oportunidades.</p>
        </footer>
        `
    });

    console.log("Correo enviado satisfactoriamente: ", info.messageId);
};




export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToEstudiante
}


