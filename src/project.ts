import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Uri } from 'vscode';
import { VSCodeUI } from './vscode-ui';

export class Project {
    directories: string[] = new Array('.vscode', 'output', 'include', 'lib', 'src');

    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async createFiles({ type, location }: { type: string; location: string; }) {
        try {
            const tasksPath = path.join(this.context.extensionPath, 'templates', 'tasks.json');
            const launchPath = path.join(this.context.extensionPath, 'templates', 'launch.json');

            const mainPath = path.join(this.context.extensionPath, 'templates', type, `main.${type}`);
            const makefilePath = path.join(this.context.extensionPath, 'templates', type, 'Makefile');

            fs.writeFileSync(path.join(location, '.vscode', 'tasks.json'), fs.readFileSync(tasksPath, 'utf-8'));
            fs.writeFileSync(path.join(location, '.vscode', 'launch.json'), fs.readFileSync(launchPath, 'utf-8'));
            fs.writeFileSync(path.join(location, 'src', `main.${type}`), fs.readFileSync(mainPath, 'utf-8'));
            fs.writeFileSync(path.join(location, 'Makefile'), fs.readFileSync(makefilePath, 'utf-8'));

            vscode.workspace.openTextDocument(path.join(location, 'src', 'main.cpp'))
                .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
        } catch (err) {
            console.error(err);
        }
    }


    async createFolders(location: string) {
        this.directories.forEach((dir: string) => {
            try {
                fs.ensureDirSync(path.join(location, dir));
            } catch (err) {
                console.error(err);
            }
        });
    }

    async createProject(type: string) {
        const result: Uri = await VSCodeUI.openDialogForFolder();
        if (result && result.fsPath) {
            await vscode.commands.executeCommand('vscode.openFolder', result);
            await this.createFolders(result.fsPath);
            await this.createFiles({ type, location: result.fsPath });
        }
    }
}
