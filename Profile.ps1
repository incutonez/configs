$workspace = "$home\workspace"
$sandbox = "$workspace\Sandbox"
$configs = "$workspace\configs"
$zeldaU = "$workspace\ZeldaU"

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

function createApp() {
  param(
    [Parameter(Mandatory=$false)]
    [string]
    $name,

    [Parameter(Mandatory=$false)]
    [ValidateSet('vue', 'react')]
    [string]
    $type,

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
  cd $configs
  npx tsx scaffold/main.ts -n "$name" -t "$type" -d "$directory"
}

function startAPI() {
  cd "$sandbox"
  npm run api
}


function startUI() {
  cd "$sandbox"
  npm run ui
}
