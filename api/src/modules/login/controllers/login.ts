import express from "express";

class LoginController {
	  static async store(req: express.Request, res: express.Response) {
		res.send("Login endpoint hit! This is a placeholder response.");
	}
}

export default LoginController;