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

            // Ensure .vscode and src directories exist before writing files into them
            await fs.ensureDir(path.join(location, '.vscode'));
            fs.writeFileSync(path.join(location, '.vscode', 'tasks.json'), fs.readFileSync(tasksPath, 'utf-8'));
            fs.writeFileSync(path.join(location, '.vscode', 'launch.json'), fs.readFileSync(launchPath, 'utf-8'));

            await fs.ensureDir(path.join(location, 'src'));
            fs.writeFileSync(path.join(location, 'src', `main.${type}`), fs.readFileSync(mainPath, 'utf-8'));

            fs.writeFileSync(path.join(location, 'Makefile'), fs.readFileSync(makefilePath, 'utf-8'));

            // Open the main file after creation
            vscode.workspace.openTextDocument(path.join(location, 'src', `main.${type}`))
                .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
        } catch (err) {
            console.error(err);
            vscode.window.showErrorMessage(`Error creating project files: ${err}`);
        }
    }


    async createFolders(location: string) {
        // Use Promise.all for potentially faster parallel directory creation
        await Promise.all(this.directories.map(async (dir: string) => {
            try {
                await fs.ensureDir(path.join(location, dir));
            } catch (err) {
                console.error(err);
                vscode.window.showErrorMessage(`Error creating directory ${dir}: ${err}`);
                throw err; // Re-throw to stop the process if a folder fails
            }
        }));
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
