<#
.SYNOPSIS
  Creates, deletes or inspects the Windows Task Scheduler task for the MQTT subscriber.

.DESCRIPTION
  The task runs the subscriber web service as the CURRENT INTERACTIVE USER. No password,
  token or certificate is stored in the task or in this script. Configure the broker and
  topic filters in .env before creating the task.

.EXAMPLE
  .\manage-task.ps1 -Action Register                  # alias of Create
  .\manage-task.ps1 -Action Create -Port 8083         # custom service port
  .\manage-task.ps1 -Action Status
  .\manage-task.ps1 -Action Deregister                # alias of Delete
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('Create', 'Register', 'Delete', 'Deregister', 'Status')]
  [string]$Action,

  [string]$TaskName = 'MQTT-Subscriber-Production',

  [ValidateRange(0, 65535)]
  [int]$Port = 0,

  [ValidateSet('LogOn', 'Daily', 'Startup')]
  [string]$Trigger = 'LogOn',

  [string]$Time = '09:00',

  [string]$Arguments = '',

  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$entry = Join-Path $PSScriptRoot 'server.js'
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw 'Node.js was not found on PATH. Install Node.js 22+ LTS.' }
if (-not (Test-Path -LiteralPath $entry)) { throw "Entry point not found: $entry" }

$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
$operation = switch ($Action) {
  'Register'   { 'Create' }
  'Deregister' { 'Delete' }
  default      { $Action }
}

switch ($operation) {
  'Create' {
    if ($existing) {
      if (-not $Force) {
        throw "Task '$TaskName' already exists. Run with -Action Delete first, or use -Force to replace it."
      }
      Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
      Write-Host "Removed existing task '$TaskName'."
    }

    $argLine = '"' + $entry + '"'
    if ($Port -gt 0) { $argLine = $argLine + ' --http-port ' + $Port }
    if ($Arguments.Trim()) { $argLine = $argLine + ' ' + $Arguments.Trim() }
    $taskAction = New-ScheduledTaskAction -Execute $node -Argument $argLine -WorkingDirectory $PSScriptRoot
    $userId = "$env:USERDOMAIN\$env:USERNAME"
    switch ($Trigger) {
      'LogOn'   { $taskTrigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME }
      'Daily'   { $taskTrigger = New-ScheduledTaskTrigger -Daily -At $Time }
      'Startup' { $taskTrigger = New-ScheduledTaskTrigger -AtStartup }
    }
    $principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
    # Subscriber is long-running: no execution time limit. Multiple instances are ignored.
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero)

    Register-ScheduledTask -TaskName $TaskName -Action $taskAction -Trigger $taskTrigger -Principal $principal -Settings $settings -Description 'Runs the MQTT subscriber web service (local user, no credentials stored in the task).' | Out-Null
    Write-Host "Created task '$TaskName' ($Trigger trigger, runs as $userId)."
    Write-Host 'Note: Startup trigger requires an interactive logon with this LogonType; LogOn is recommended.'
  }

  'Delete' {
    if (-not $existing) {
      Write-Warning "Task '$TaskName' does not exist. Nothing to delete."
      exit 0
    }
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Deleted task '$TaskName'."
  }

  'Status' {
    if (-not $existing) {
      Write-Host "Task '$TaskName' does not exist."
      exit 0
    }
    $info = Get-ScheduledTaskInfo -TaskName $TaskName
    [pscustomobject]@{
      TaskName      = $TaskName
      State         = $existing.State
      NextRunTime   = $info.NextRunTime
      LastRunTime   = $info.LastRunTime
      LastResult    = $info.LastTaskResult
      Execute       = $existing.Actions[0].Execute
      Arguments     = $existing.Actions[0].Arguments
    } | Format-List
  }
}
