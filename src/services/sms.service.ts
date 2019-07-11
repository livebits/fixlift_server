var http = require("http");

export class SMSService {
	constructor() { }

	sendVerificationCode(phoneNumber: number, code: number) {

		this.getToken(phoneNumber, code, 'verification');
	};

	//send message
	sendMessage(phoneNumbers: number, message: string) {

		this.getToken(phoneNumbers, message, 'message');
	};

	getToken(param1: number, param2: (string | number), type: string): void {

		var post_data = JSON.stringify({
			"UserApiKey": "5e9427a53fa84f7a29c5522e",
			"SecretKey": "boxit@atria#2017"
		});
		var options = {
			"method": "POST",
			"hostname": "RestfulSms.com",
			"path": "/api/Token",
			"headers": {
				"content-type": "application/json; charset=utf-8",
				"Content-Length": Buffer.byteLength(post_data)
			}
		};

		try {
			var req = http.request(options, (response: any) => {

				let chunks = Array();
				response.on("data", function (chunk: any) {
					try {
						chunks.push(chunk);
					} catch (er) {
						console.log("sendSmsError2: " + JSON.stringify(er));
					}
				});

				response.on("end", () => {
					try {
						let body = Buffer.concat(chunks);

						if (type === 'verification') {
							this.sendCode(body, param1, param2);
						} else if (type === 'message') {
							// this.sendPortalMessage(body, param1, param2);
						}
					} catch (er) {
						console.log("sendSmsError3: " + JSON.stringify(er));
					}
				});
			});
			req.write(post_data);
			req.end();
		}
		catch (er) {
			console.log("sendSmsError4: " + JSON.stringify(er));
		}
	};

	sendCode(body: any, phoneNumber: number, code: (number | string)): void {
		body = JSON.parse(body);
		let token = body.TokenKey;

		let data = JSON.stringify({
			"Code": code,
			"MobileNumber": phoneNumber
		});

		let option = {
			"method": "POST",
			"hostname": "RestfulSms.com",
			"path": "/api/VerificationCode",
			"headers": {
				"content-type": "application/json; charset=utf-8",
				"Content-Length": Buffer.byteLength(data),
				"x-sms-ir-secure-token": token
			}
		};
		let req2 = http.request(option, function (res: any) {

			let chunks2 = Array();
			res.on("data", function (chunk: any) {
				try {
					chunks2.push(chunk);

				} catch (er) {
					console.log("sendSmsError5: " + JSON.stringify(er));
				}
			});

			res.on("end", function () {
				try {
					var body = Buffer.concat(chunks2);
					console.log(body.toString());

				}
				catch (er) {
					console.log("sendSmsError6: " + JSON.stringify(er));
				}
			});
		});
		req2.write(data);
		req2.end();
	};

}
