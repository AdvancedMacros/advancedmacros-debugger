/*
 * This code is modeled after 
*  https://github.com/microsoft/vscode-mock-debug/blob/main/src/mockDebug.ts
 */

import * as vscode from 'vscode';

//ends in event? Implement handling that in handleMessage
import {
	Logger, logger,
	LoggingDebugSession,
	InitializedEvent, TerminatedEvent, StoppedEvent, BreakpointEvent, OutputEvent,
	ProgressStartEvent, ProgressUpdateEvent, ProgressEndEvent, InvalidatedEvent,
	Thread, StackFrame, Scope, Source, Handles, Breakpoint, MemoryEvent,Response
} from '@vscode/debugadapter';
import { Socket } from 'socket.io';
import internal = require('stream');
import {getClient} from './extension';
import { DebugProtocol } from '@vscode/debugprotocol';

export class AdvancedMacrosDebugSession extends LoggingDebugSession {

  private _sessionID!:          number;
  private _runtime:             Socket
  private _reportProgress:      boolean = false;
  private _useInvalidatedEvent: boolean = false;
  private _runtimePermissions:  {}      = {};

  //events are triggered by the debugger for vs code
  //requests come from vs code and ask about the debugger
  public constructor() {
    super( /**/ );
    this.setDebuggerLinesStartAt1( true );
    this.setDebuggerColumnsStartAt1( true );

    this._runtime = getClient();

    this._runtime.emit("start session", {/*session info*/}, ( sessionID:number, permissions:{}={} )=>{
      this._sessionID = sessionID;
      this._runtimePermissions = permissions;
    });



    //error
    //thread status
    //todo, change inspect table result
    //stacktrace
    //close
    //clear breakpoints @deprecated?
    //set breakpoints @deprecated?
    //add thread
    //remove thread

    this._runtime.on(`stop step-${this._sessionID}`, ()=>{

    })

    this._runtime.on("error", ( info )=>{
      this.sendEvent( new StoppedEvent( "error", threadID, info.message ) )
    });
  }

  //what can the editor do, & what can the adapter do
  protected override initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
    if( args.supportsProgressReporting )
      this._reportProgress = true;
    
    if( args.supportsInvalidatedEvent )
      this._useInvalidatedEvent = true;


    response.body = response.body || {};

    // response.body.supportsConfigurationDoneRequest = maybe
    


    this.sendResponse( response );

    this.sendEvent( new InitializedEvent() );
  }

  protected override configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments, request?: DebugProtocol.Request | undefined): void {
    
  }
  
  protected override stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments, request?: DebugProtocol.Request | undefined): void {
    
  }
}


// class DebugAdapter implements vscode.DebugAdapter {
//   onDidSendMessage!: vscode.Event<vscode.DebugProtocolMessage>;

//   handleMessage(message: vscode.DebugProtocolMessage): void {
//     // https://microsoft.github.io/debug-adapter-protocol/specification#Base_Protocol_ProtocolMessage
//     /*
//     request - from client or dap
//     event   - from dap
//     response - resp for req
//     ErrorResponse - extends response, includes error info
//     */

//     let x: DebugProtocol.Request;
//     if( message instanceof (DebugProtocol.Request) ) {

//     }

//     //events

//     else if( message instanceof InitializedEvent )
//       this.handleInitEvent( message );
//     else if( message instanceof TerminatedEvent ) 
//       this.handleTerminateEvent( message );
//     else if( message instanceof StoppedEvent ) 
//       this.handleStoppedEvent( message );
//     else if( message instanceof BreakpointEvent ) 
//       this.handleBreakpointEvent( message );
//     else if( message instanceof OutputEvent ) 
//       this.handleOutputEvent( message );
//     else if( message instanceof ProgressStartEvent ) 
//       this.handleProgressStartEvent( message );
//     else if( message instanceof ProgressUpdateEvent ) 
//       this.handleProgressUpdateEvent( message );
//     else if( message instanceof ProgressEndEvent ) 
//       this.handleProgressEndEvent( message );
//     else if( message instanceof InvalidatedEvent ) 
//       this.handleInvalidatedEvent( message );
//     else if( message instanceof MemoryEvent ) 
//       this.handleMemoryEvent( message );
//     else
//       throw new Error('Method not implemented.');
//   }

//   dispose() {
//     throw new Error('Method not implemented.');
//   }

//   //////////////////////////////////////////////////////
//   //////////// Debug Adapter Event Logic ///////////////
//   //////////////////////////////////////////////////////

//   handleInitEvent( event:InitializedEvent ) {
//     console.log("Initialized Event");
//   }

//   handleTerminateEvent( event:TerminatedEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleStoppedEvent( event:StoppedEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleBreakpointEvent( event:BreakpointEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleOutputEvent( event:OutputEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleProgressStartEvent( event:ProgressStartEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleProgressUpdateEvent( event:ProgressUpdateEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleProgressEndEvent( event:ProgressEndEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleInvalidatedEvent( event:InvalidatedEvent ) {
//     throw new Error('Method not implemented.');
//   }

//   handleMemoryEvent( event:MemoryEvent ) {
//     throw new Error('Method not implemented.');
//   }
// }

/**
 * Initalize request -> dap : get connection from local server
 * 
 * 
*/