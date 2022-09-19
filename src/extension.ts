// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const express = require("express");
const { Server } = require("socket.io");


let app;
let io;
let server:any;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "advancedmacros-debugger" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('advancedmacros-debugger.helloWorld', () => {
		vscode.window.showInformationMessage(`Hello World from AdvancedMacros-Debugger!`);
	});
	context.subscriptions.push(disposable);

	let connectToGame = vscode.commands.registerCommand('advancedmacros-debugger.connect', ()=>{
		vscode.window.showInformationMessage("Launching debug server...");
		console.log("Creating 'app'");
		app = express();
		app.disable('etag');
		app.use(express.json());
		console.log("Creating server");
		//server = http.createServer(app);
		server = app.listen(3000);
		io = new Server( server );

		// app.get('/', (req:IncomingMessage , res:ServerResponse)=>{
		// 	res.send('<h1>Hello world<h1/>');
		// });
		app.get('/', (req:any, res:any) => {
			res.send(`<h1>Hello world</h1><script src="/socket.io/socket.io.js"></script>
			<script>
			  var socket = io();
			</script>`);
		});

		io.on('connection', (socket:any) => {
			console.log('a user connected');
		  });

		// server.listen(3000, ()=>{
			console.log('listening on port *:3000');
		// });
		console.log("Not blocked");
	});
	context.subscriptions.push( connectToGame );

	let disconnect = vscode.commands.registerCommand('advancedmacros-debugger.disconnect', ()=>{
		server.close();
		console.log("Server closed");
	});


	let getProgramName = vscode.commands.registerCommand('extension.advancedmacros-debugger.getProgramName', config => {
		return vscode.window.showInputBox({
			placeHolder: 'Enter name of file',
			value: 'example.lua'
		});
	});

	//return api {}
}

// this method is called when your extension is deactivated
export function deactivate() {}
