import * as vscode from 'vscode';
import { Project } from './project';

export async function activate(context: vscode.ExtensionContext) {
    const project = new Project();
    const createCProjectCommand = vscode.commands.registerCommand('extension.createCProject', () => {
        project.createProject('c')
            .catch(error => console.log(error));
    });

    const createCppProjectCommand = vscode.commands.registerCommand('extension.createCppProject', () => {
        project.createProject('cpp')
            .catch(error => console.log(error));
    });

    context.subscriptions.push(createCProjectCommand, createCppProjectCommand);
}

export function deactivate() {
}
