$workspace = "$home\workspace"
$sandbox = "$workspace\Sandbox"
$configs = "$workspace\configs"
$zeldaU = "$workspace\ZeldaU"

# Needed for Node manager https://github.com/Schniz/fnm/blob/master/README.md#powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression

function pruneGit() {
  git fetch --prune origin
}

function branchCreate($branch) {
  git checkout -b $branch
}

function branchDelete($branch, $force = $false) {
  if ($force -eq $true) {
    git branch -D $branch
    git push origin --delete $branch
  }
  else {
    git branch -d $branch
  }
}

function branchRename($branch) {
  git branch -m $branch
}

function branchResetHard() {
  git reset --hard
}

function killTask($processId) {
  if ($processId -eq $null) {
    "Please enter a pid."
    return
  }
  taskkill.exe /F /PID $processId
}

function findTaskByPort($portNumber) {
  if ($portNumber -eq $null) {
    "Please enter a port number."
    return
  }
  netstat -ano | findstr $portNumber
}

function killTaskByPort($portNumber) {
  $netStat = findTaskByPort($portNumber)
  if ($netStat -eq $null -Or $netStat.length -lt 0) {
    return;
  }
  $PortNumRegex = [regex]"(\d+)$";
  $portnum = $PortNumRegex.Match($netstat[$netStat.length -1]);
  killTask $portnum.captures[0].Value;
}

function upgradeApp() {
  npx npm-check-updates -u
}

function workspaceUpdate($dir) {
  if ($dir -eq $null) {
    return "dir is required."
  }
  cd $dir
  $children = Get-ChildItem .
  foreach ($package in $children) {
    cd $package
    upgradeApp
    cd ..
  }
  cd ..
  npm i
}

function createAPI() {
  param(
    [Parameter(Mandatory=$false)]
    [string]
    $name,

    [Parameter(Mandatory=$false)]
    [string]
    $directory,

    [Parameter(Mandatory=$false)]
    [switch]
    $w
  )
  if ([string]::IsNullOrWhiteSpace($name)) {
    $name = "api"
  }
  if ([string]::IsNullOrWhiteSpace($directory)) {
    $directory = "$workspace"
  }
  elseif ($directory -eq ".") {
    $directory = "$((Get-Item .).FullName)"
  }
  else {
    $directory = "$((Get-Item .).FullName)\$directory"
  }
  cd $configs
  npx tsx scaffold/api.ts -n "$name" -d "$directory" -w $w.IsPresent
  cd $directory
}

function createUI() {
  param(
    [Parameter(Mandatory=$false)]
    [string]
    $name,

    [Parameter(Mandatory=$false)]
    [ValidateSet('vue', 'react')]
    [string]
    $type,

    [Parameter(Mandatory=$false)]
    [switch]
    $w,

    [Parameter(Mandatory=$false)]
    [string]
    $directory
  )
  if ([string]::IsNullOrWhiteSpace($name)) {
    $name = "throwaway"
  }
  if ([string]::IsNullOrWhiteSpace($type)) {
    $type = "vue"
  }
  if ([string]::IsNullOrWhiteSpace($directory)) {
    $directory = "$workspace"
  }
  elseif ($directory -eq ".") {
    $directory = "$((Get-Item .).FullName)"
  }
  else {
    $directory = "$((Get-Item .).FullName)\$directory"
  }
  cd $configs
  npx tsx scaffold/ui.ts -n "$name" -t "$type" -d "$directory" -w $w.IsPresent
  cd $directory
}

function createWorkspace() {
  param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('vue', 'react')]
    [string]
    $ui,

    [Parameter(Mandatory=$false)]
    [string]
    $name,

    [Parameter(Mandatory=$false)]
    [string]
    $directory
  )
  if ([string]::IsNullOrWhiteSpace($ui)) {
    $ui = "vue"
  }
  if ([string]::IsNullOrWhiteSpace($name)) {
    $name = "throwaway"
  }
  if ([string]::IsNullOrWhiteSpace($directory)) {
    $directory = "$workspace"
  }
  elseif ($directory -eq ".") {
    $directory = "$((Get-Item .).FullName)"
  }
  else {
    $directory = "$((Get-Item .).FullName)\$directory"
  }
  cd $configs
  npx tsx scaffold/workspace.ts -ui "$ui" -n "$name" -d "$directory"
  cd "$workspace/$name"
}

function startAPI() {
  cd "$sandbox"
  npm run api
}


function startUI() {
  cd "$sandbox"
  npm run ui
}
