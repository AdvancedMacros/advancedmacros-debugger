import * as vscode from 'vscode';
class DebugAdapter implements vscode.DebugAdapter {
  onDidSendMessage!: vscode.Event<vscode.DebugProtocolMessage>;
  handleMessage(message: vscode.DebugProtocolMessage): void {
    https://microsoft.github.io/debug-adapter-protocol/specification#Base_Protocol_ProtocolMessage
    throw new Error('Method not implemented.');
  }
  dispose() {
    throw new Error('Method not implemented.');
  }

}