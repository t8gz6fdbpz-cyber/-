$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$node = "C:\Users\mmhm\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$vite = Join-Path $projectRoot "node_modules\vite\bin\vite.js"
$stdout = Join-Path $projectRoot "vite-5178.out.log"
$stderr = Join-Path $projectRoot "vite-5178.err.log"

Remove-Item Env:PATH -ErrorAction SilentlyContinue
$env:Path = Split-Path $node

Set-Location -LiteralPath $projectRoot

Start-Process `
  -FilePath $node `
  -ArgumentList @($vite, "--host", "127.0.0.1", "--port", "5178") `
  -RedirectStandardOutput $stdout `
  -RedirectStandardError $stderr `
  -WindowStyle Hidden
