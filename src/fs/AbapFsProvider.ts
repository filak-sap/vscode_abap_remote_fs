import * as vscode from "vscode"
import { fromUri } from "../adt/AdtServer"
import { FileSystemError } from "vscode"

export class AbapFsProvider implements vscode.FileSystemProvider {
  private _eventEmitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>()
  readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this
    ._eventEmitter.event
  watch(
    uri: vscode.Uri,
    options: { recursive: boolean; excludes: string[] }
  ): vscode.Disposable {
    throw new Error("Method not implemented.")
  }
  stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
    console.log(`stat ${uri.path}`)
    const server = fromUri(uri)
    return server.findNodePromise(uri)
  }
  readDirectory(
    uri: vscode.Uri
  ): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
    console.log(`dir ${uri.path}`)
    const server = fromUri(uri)
    const dir = server.findNode(uri)
    const contents = [...dir].map(
      ([name, node]) => [name, node.type] as [string, vscode.FileType]
    )
    return contents
  }
  createDirectory(uri: vscode.Uri): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
  readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
    console.log(`download ${uri.path}`)
    const server = fromUri(uri)
    const file = server.findNode(uri)
    if (file && !file.isFolder())
      return server.connectionP.then(conn => file.fetchContents(conn))

    throw FileSystemError.FileNotFound(uri)
  }
  writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    options: { create: boolean; overwrite: boolean }
  ): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
  delete(
    uri: vscode.Uri,
    options: { recursive: boolean }
  ): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
  rename(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    options: { overwrite: boolean }
  ): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
}