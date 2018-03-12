'use strict';

import * as vscode from 'vscode';
import { project } from "./project";
import { Utils } from "./Utils";

export async function activate(context: vscode.ExtensionContext) {
    await Utils.loadPackageInfo(context);

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