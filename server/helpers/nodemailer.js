const nodemailer = require("nodemailer");

function sendEmail(email, name, privateKey) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nabilusnup@gmail.com",
      pass: "pqpmsjeqffktukxr",
    },
  });

  let mailOptions = {
    from: "nabilusnup@gmail.com",
    to: email,
    subject: "Your Verification Account was Successfully!",
    html: `
    <div class="es-wrapper-color">
        <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f0f0f0"></v:fill>
			</v:background>
		<![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table cellpadding="0" cellspacing="0" class="es-content esd-header-popover" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center" esd-custom-block-id="147869">
                                        <table bgcolor="#333333" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #333333;">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p10t es-p10b es-p15r es-p15l" align="left" bgcolor="#4A8BDF" style="background-color: #4a8bdf;">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="570" align="left" class="esd-container-frame">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="right" class="esd-block-text es-infoblock es-m-txt-c" esd-links-color="#ffffff">
                                                                                        <p><br></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-header" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center" esd-custom-block-id="147884">
                                        <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#333333" align="center" style="background-color: #333333;">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p10t es-p10b es-p15r es-p15l" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="570" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://demo.stripocdn.email/content/guids/9367f45a-2ef3-448e-b44d-c3adc5faff74/images/esign.png" alt style="display: block;" height="35"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="es-p30t es-p15r es-p15l esd-structure" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="570" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/inviterafiki_1.png" alt style="display: block;" width="250"></a></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p30t es-m-txt-c">
                                                                                        <h1 style="font-family: tahoma, verdana, segoe, sans-serif; font-size: 26px;"><span style="font-size:25px;">Dear ${name},<br>Your Verification Account was Successfully</span>.</h1>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10t es-p10b">
                                                                                        <p style="font-family: tahoma, verdana, segoe, sans-serif;">successfully registered to esignees Web that is working together with esignees to<br>sign digital documents securely and easily, Please enjoy our service with this account:</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-m-txt-l es-p15t es-p15b es-p25l" bgcolor="#efefef">
                                                                                        <p style="font-family: tahoma, verdana, segoe, sans-serif; line-height: 150%;"><strong><span style="color: #000000;">Your Private-Key :&nbsp;</span></strong><br><span style="color: #000000;">${privateKey}</span></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-footer esd-footer-popover" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p30t es-p30r es-p30l" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                        <!--[if mso]><table width="540" cellpadding="0" cellspacing="0"><tr><td width="255" valign="top"><![endif]-->
                                                        <table cellpadding="0" cellspacing="0" align="left" class="es-left">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="255" class="esd-container-frame es-m-p20b" align="left">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td valign="top" align="left" class="esd-block-image es-p10r" width="45" style="font-size: 0px;"><img src="https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/time.png" style="display: block;" width="45" alt></td>
                                                                                    <td valign="top" align="left" class="esd-block-text es-p5b">
                                                                                        <h4 style="line-height:100%;" class="es-p5b">Time Work:</h4>
                                                                                        <p>Mon-Fri&nbsp;9.00 - 18.00;</p>
                                                                                        <p>Sat10.00 - 16.00;</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td><td width="30"></td><td width="255" valign="top"><![endif]-->
                                                        <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="255" class="esd-container-frame" align="left">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td valign="top" align="left" class="esd-block-image es-p10r" width="45" style="font-size: 0px;"><img src="https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/location.png" style="display: block;" width="45" alt></td>
                                                                                    <td valign="top" align="left" class="esd-block-text es-p5b">
                                                                                        <h4 style="line-height:100%;" class="es-p5b">Address:</h4>
                                                                                        <p>Jl. Arteri Pd. Indah No.7, RT.5/RW.9, Kby. Lama Sel., Kec. Kby. Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12240</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p30b es-p30r es-p30l" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                        <!--[if mso]><table  width="540" cellpadding="0" cellspacing="0"><tr><td width="255" valign="top"><![endif]-->
                                                        <table cellpadding="0" cellspacing="0" align="left" class="es-left">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="255" class="esd-container-frame es-m-p20b" align="left">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td valign="top" align="left" class="esd-block-image es-p10r" width="45" style="font-size: 0px;"><img src="https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/technicalsupport.png" style="display: block;" width="45" alt></td>
                                                                                    <td valign="top" align="left" class="esd-block-html" esd-links-underline="none">
                                                                                        <table width="100%">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td class="esd-block-text" align="left">
                                                                                                        <h4 style="line-height:100%;" class="es-p5b">Email:</h4>
                                                                                                        <p>esignees<a target="_blank" href="mailto:your@mail.com" style="text-decoration: none;">@gmail.com</a></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="left" valign="top" class="esd-block-text es-p10t" esd-links-underline="none">
                                                                                                        <h4 style="line-height:100%;" class="es-p5b"><br></h4>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td><td width="30"></td><td width="255" valign="top"><![endif]-->
                                                        <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="255" class="esd-container-frame" align="left">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td valign="top" align="center" class="esd-block-image es-p10r" width="45" style="font-size: 0px;"><img src="https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/phoneset.png" style="display: block;" width="45" alt></td>
                                                                                    <td align="left" class="esd-block-text es-p5b" esd-links-underline="none" esd-links-color="#666666">
                                                                                        <h4 style="line-height:100%;" class="es-p5b">Phone:</h4>
                                                                                        <p>021-811118<a target="_blank" style="text-decoration: none; color: #666666;" href="tel:1234567890"></a></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p30t es-p30b es-p30r es-p30l" align="left" bgcolor="#4A8BDF" style="background-color: #4a8bdf;">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="540" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-m-txt-c" bgcolor="#4A8BDF">
                                                                                        <p style="color: #ffffff;">Note : Don't reply this email. This email is sent from an unmonitored e-mail address. If you have questions, please contact us at esignees@gmail.com&nbsp;</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log("Email sent: " + info.response);
  });
}

module.exports = { sendEmail };
