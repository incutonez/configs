$workspace = "$home\workspace"
$sandbox = "$workspace\Sandbox"
$configs = "$workspace\configs"
$zeldaU = "$workspace\ZeldaU"

function pruneGit() {
  git fetch --prune origin
}

# In case the branch gets really out of date with dirs that were deleted but not reflected on pull https://stackoverflow.com/a/58470033/1253609
function cleanGit() {
  git clean -fd -x
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

function branchMain() {
	$currentBranch = git rev-parse --abbrev-ref HEAD
	git checkout main
	git pull
	branchDelete $currentBranch
	pruneGit
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

function upgradeNode() {
  nvm install lts
  nvm use lts
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
  cd "$directory/$name"
}

function startAPI() {
  cd "$sandbox"
  npm run api
}


function startUI() {
  cd "$sandbox"
  npm run ui
}

function sanitizeFileNames() {
  param(
    [Parameter(Mandatory=$true)]
    [string]
    $directory
  )
  $directory = (Get-Item $directory).FullName
  cd $configs
  node removeFileNameGuid.js $directory
}