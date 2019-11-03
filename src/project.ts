import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Uri } from 'vscode';
import { VSCodeUI } from './vscode-ui';
import * as content from './content';

export class Project {
    async createFiles({ type, location }: { type: string; location: string; }) {
        if (process.platform === 'win32') {
            content.launch_json.configurations[0].miDebuggerPath += '.exe';
            content.launch_json.configurations[0].program += '.exe';
            content.tasks_json.tasks[0].args[1] = 'mingw32-make';
            content.tasks_json.tasks[1].args[1] = 'mingw32-make run';
            content.tasks_json.tasks[2].args[1] = 'mingw32-make clean';
        }

        try {
            fs.writeFileSync(path.join(location, '.vscode', 'tasks.json'), JSON.stringify(content.tasks_json, null, 4));
            fs.writeFileSync(path.join(location, '.vscode', 'launch.json'), JSON.stringify(content.launch_json, null, 4));
            switch (type) {
                case 'c':
                    fs.writeFileSync(path.join(location, 'src', 'main.c'), content.main_c);
                    fs.writeFileSync(path.join(location, 'Makefile'), content.makefile_c);
                    vscode.workspace.openTextDocument(path.join(location, 'src', 'main.c'))
                        .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
                    break;
                case 'cpp':
                    fs.writeFileSync(path.join(location, 'src', 'main.cpp'), content.main_cpp);
                    fs.writeFileSync(path.join(location, 'Makefile'), content.makefile_cpp);
                    vscode.workspace.openTextDocument(path.join(location, 'src', 'main.cpp'))
                        .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
                    break;
                default:
                    console.log('Invalid file type');
            }
        } catch (err) {
            console.error(err);
        }
    }


    async createFolders(location: string) {
        content.directories.forEach((dir: string) => {
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
