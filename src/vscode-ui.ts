import { OpenDialogOptions, Uri, window, workspace } from 'vscode';
import { homedir } from 'os';

export class VSCodeUI {
    static async promptForProjectName(): Promise<string | undefined> {
        const projectName = await window.showInputBox({
            prompt: 'Enter the name for your new project',
            placeHolder: 'e.g., my_c_project'
        });
        return projectName;
    }

    // NEW: Prompt for parent directory using Open Dialog
    static async promptForParentDirectory(projectName: string): Promise<Uri | undefined> {
        const defaultUri = workspace.workspaceFolders && workspace.workspaceFolders.length > 0
            ? workspace.workspaceFolders[0].uri
            : Uri.file(homedir());

        const options: OpenDialogOptions = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            defaultUri: defaultUri,
            title: `Select Parent Directory for Project '${projectName}'`
        };

        const result: Uri[] | undefined = await window.showOpenDialog(options);
        if (result && result.length) {
            return result[0]; // Return the selected parent directory URI
        } else {
            return undefined; // User cancelled
        }
    }
}
