import { exec as nodeExec } from "child_process";
export function exec(
	command: string,
	options?: { cwd?: string; env?: NodeJS.ProcessEnv },
): Promise<{ stdout: string; stderr: string }> {
	return new Promise((resolve, reject) => {
		nodeExec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (typeof stdout == "string" && typeof stderr == "string") {
				resolve({ stdout, stderr });
			}
		});
	});
}
