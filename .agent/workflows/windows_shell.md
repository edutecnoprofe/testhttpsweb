---
description: Windows Shell Command Separators
---

# Windows Shell Command Separators

When running multiple commands sequentially in the user's terminal (Windows PowerShell):

1. **Use `;` instead of `&&`**:
   - `&&` is only supported in PowerShell 7+ and CMD. In many PowerShell environments, it will throw a syntax error.
   - Use `;` to ensure commands run one after another regardless of the exit status of the previous one.
   - Example: `mkdir -p foo ; cd foo ; touch bar.txt`

2. **Error Handling**:
   - If conditional execution is strictly required (i.e., only run the second if the first succeeds), consider separate `run_command` calls or specific PowerShell error handling (`if ($?) { ... }`).

3. **Path Separators**:
   - Use `\` or `/` consistently. PowerShell handles both, but `\` is the native Windows separator.

4. **File Downloads**:
   - `curl -L` might sometimes fail or be interpreted incorrectly on specific Windows environments if it's an alias.
   - **Alternative**: Use PowerShell's `Invoke-WebRequest`.
   - Example: `powershell -Command "Invoke-WebRequest -Uri 'https://example.com/file.jpg' -OutFile 'C:\Path\To\file.jpg'"`
   - Note: Ensure the target directory exists before downloading.
