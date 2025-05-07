import { Project } from './project';
import { commands, ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {
    const project = new Project(context);
    const createCProjectCommand = commands.registerCommand('extension.createCProject', () => {
        project.createProject('c')
            .catch(error => console.log(error));
    });

    const createCppProjectCommand = commands.registerCommand('extension.createCppProject', () => {
        project.createProject('cpp')
            .catch(error => console.log(error));
    });

    context.subscriptions.push(createCProjectCommand, createCppProjectCommand);
}

export function deactivate() {
}
