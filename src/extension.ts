'use strict';

import * as vscode from 'vscode';
import { project } from "./project";

export async function activate(context: vscode.ExtensionContext) {
    let createCProjectCommand = vscode.commands.registerCommand('extension.createCProject', () => {
        project.createProject("c");
    });

    let createCppProjectCommand = vscode.commands.registerCommand('extension.createCppProject', () => {
        project.createProject("cpp");
    });

    context.subscriptions.push(createCProjectCommand, createCppProjectCommand);
}

export function deactivate() {
}