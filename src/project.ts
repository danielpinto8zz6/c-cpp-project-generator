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
        // 1. Prompt for project name
        const projectName = await VSCodeUI.promptForProjectName();
        if (!projectName) {
            vscode.window.showInformationMessage('Project creation cancelled: No project name provided.');
            return; // Exit if no name is given
        }

        // 2. Prompt for parent directory using the open dialog
        const parentDirectoryUri = await VSCodeUI.promptForParentDirectory(projectName);
        if (!parentDirectoryUri) {
            vscode.window.showInformationMessage('Project creation cancelled: No parent directory selected.');
            return; // Exit if no directory is selected
        }

        // 3. Construct the final project path
        const finalProjectPath = path.join(parentDirectoryUri.fsPath, projectName);

        try {
            // 4. Ensure the target project directory exists (creates if not present)
            await fs.ensureDir(finalProjectPath);

            // 5. Check if directory is empty (This check remains relevant)
            const files = await fs.readdir(finalProjectPath);
            if (files.length > 0) {
                const overwrite = await vscode.window.showWarningMessage(
                    `The directory ${finalProjectPath} is not empty. Do you want to proceed and potentially overwrite files?`,
                    { modal: true },
                    'Yes', 'No'
                );
                if (overwrite !== 'Yes') {
                    vscode.window.showInformationMessage('Project creation cancelled.');
                    return;
                }
            }

            // 6. Create standard subfolders (src, include, etc.) inside the final project path
            await this.createFolders(finalProjectPath);

            // 7. Create project files (Makefile, main.c/cpp, .vscode/*) inside the final project path
            await this.createFiles({ type, location: finalProjectPath });

            // 8. Open the created project folder in VS Code
            const projectUri = Uri.file(finalProjectPath);
            await vscode.commands.executeCommand('vscode.openFolder', projectUri, { forceNewWindow: false });

            vscode.window.showInformationMessage(`Successfully created ${type.toUpperCase()} project '${projectName}' at ${finalProjectPath}`);

        } catch (err) {
            console.error(err);
            vscode.window.showErrorMessage(`Failed to create project: ${err}`);
        }
    }
}
