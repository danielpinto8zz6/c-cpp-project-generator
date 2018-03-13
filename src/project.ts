import * as vscode from 'vscode';
import * as fs from "fs-extra";
import * as path from "path";
import { Uri } from 'vscode';
import { VSCodeUI } from "./VSCodeUI";
import { Utils } from './Utils';

export namespace project {
    export function copyFiles(type: string, location: string) {
        const data = JSON.parse(Utils.readFileIfExists(Utils.getPathToExtensionRoot("resources", type, 'files.json')));

        data.files.forEach((file: string) => {
            const source: string = Utils.getPathToExtensionRoot("resources", type, 'template', file);
            try {
                fs.copySync(source, path.join(location, file));
            } catch (err) {
                console.error(err);
            }
        });
    }


    export function createFolders(type: string, location: string): void {
        const data = JSON.parse(Utils.readFileIfExists(Utils.getPathToExtensionRoot("resources", type, 'files.json')));

        data.directories.forEach(function (dir: string) {
            try {
                fs.ensureDirSync(path.join(location, dir));
            } catch (err) {
                console.error(err);
            }
        });
    }

    export async function createProject(type: string) {
        const result: Uri = await VSCodeUI.openDialogForFolder();
        if (result && result.fsPath) {
            await vscode.commands.executeCommand('vscode.openFolder', result);
            createFolders(type, result.fsPath);
            copyFiles(type, result.fsPath);
        }
    }
}