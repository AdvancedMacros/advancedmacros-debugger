// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const express = require("express");
const { Server } = require("socket.io");


let app;
let io:any;
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
		app = express();
		app.disable('etag');
		app.use(express.json());
		server = app.listen(16142);
		io = new Server( server );

		app.get('/', (req:any, res:any) => {
			res.send(`<h1>Hello world</h1><script src="/socket.io/socket.io.js"></script>
			<script>
			  var socket = io();
			</script>`);
		});

		io.on('connection', (socket:any) => {
			console.log('a user connected');
			io.emit("wolf",{bark:1});
			io.emit("wolf","egg");
		});
		io.on('cow', (obj:any)=>{
			console.log("COW: " + obj)
		});

		console.log('listening on port *:16142');
	});
	context.subscriptions.push( connectToGame );

	let disconnect = vscode.commands.registerCommand('advancedmacros-debugger.disconnect', ()=>{
		io.emit("disconnect",{});
		server.close();
		console.log("Server closed");
	});
	context.subscriptions.push( disconnect );


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
