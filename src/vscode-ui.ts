import { OpenDialogOptions, Uri, window } from 'vscode';

export class VSCodeUI {
    static async promptForProjectName(): Promise<string | undefined> {
        const projectName = await window.showInputBox({
            prompt: 'Enter the name for your new project',
            placeHolder: 'e.g., my_c_project'
        });
        return projectName;
    }

        const options: OpenDialogOptions = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        };
        const result: Uri[] | undefined = await window.showOpenDialog(Object.assign(options));
        if (result && result.length) {
            return Promise.resolve(result[0]);
        } else {
            return Promise.reject();
        }
    }
}
