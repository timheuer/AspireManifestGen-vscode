# Aspire Manifest Generator

Generate an Aspire AppHost manifest directly from Visual Studio Code.

This extension adds a command for Aspire AppHost project files and runs the built-in MSBuild target that produces a deployment manifest from your AppHost definition.

## What This Extension Does

- Adds a `Generate Aspire Manifest` command for `*.AppHost.csproj` files.
- Runs `dotnet msbuild /t:GenerateAspireManifest` for the selected AppHost project.
- Opens the generated manifest in the editor when the command completes.

## Requirements

To use this extension, you need:

- Visual Studio Code
- The .NET SDK installed and available on your `PATH`
- An Aspire solution with an AppHost project
- Aspire tooling/packages in your project that support manifest generation

If the command is not available, confirm you selected or right-clicked an AppHost project file whose name ends with `.AppHost.csproj`.

## Usage

1. Open a workspace that contains an Aspire AppHost project.
2. In the Explorer, right-click the AppHost project file, for example `MyApp.AppHost.csproj`.
3. Select `Aspire: Generate Aspire Manifest`.

You can also run the command from the Command Palette while an AppHost project file is active.

The extension switches the terminal to the AppHost project's workspace folder, invokes the manifest generation target, and then opens the generated output.

## Configuration

This extension contributes one setting:

- `aspire-gen.manifestPath`: Relative path used for manifest output.

Example:

```json
{
 "aspire-gen.manifestPath": "artifacts"
}
```

## How It Works

The extension invokes the following command in the integrated terminal:

```powershell
dotnet msbuild /t:GenerateAspireManifest /p:AspireManifestPublishOutputPath=<configured path> <your AppHost project>
```

This means the extension relies on the same Aspire and MSBuild capabilities your project already uses rather than introducing a custom manifest format.

## About Aspire

[Aspire](https://aspire.dev/) is a code-first platform for building distributed applications. Its AppHost acts as the orchestration entry point where you define services, resources, dependencies, configuration flow, and startup behavior in code.

For official Aspire documentation and background, start here:

- [Aspire home](https://aspire.dev/)
- [Aspire documentation](https://aspire.dev/docs/)
- [What is Aspire?](https://aspire.dev/get-started/what-is-aspire/)
- [What is the AppHost?](https://aspire.dev/get-started/app-host/)

## License

MIT
