# -- venv\Scripts\Activate.ps1 --

param($NoPrompt)

# resolve the path to this script
$script_path = $MyInvocation.MyCommand.Path
$venv_path   = Split-Path $script_path -Parent

# if there's already a deactivate, call it first
if (Get-Command -Name global:deactivate -ErrorAction SilentlyContinue) {
    global:deactivate
}

# save old environment variables
Set-Variable -Name "VIRTUAL_ENV" -Value $venv_path -Scope Global
Set-Variable -Name "OLD_PATH"     -Value $env:PATH     -Scope Global

# prepend the venv Scripts folder onto PATH
$env:PATH = "$venv_path\Scripts;$env:PATH"

# override the prompt to show the env name
if (-not $NoPrompt) {
    # save the old prompt function (if any)
    if (Get-Command -Name global:Prompt -ErrorAction SilentlyContinue) {
        Set-Variable -Name "__OLD_PROMPT" -Value (Get-Command global:Prompt).ScriptBlock -Scope Global
    }
    function global:Prompt {
        "$([System.IO.Path]::GetFileName($env:VIRTUAL_ENV))> " +
        (& $(__OLD_PROMPT) )
    }
}

# define deactivate
function global:deactivate {
    # restore old PATH
    if (Get-Variable -Name OLD_PATH -Scope Global -ErrorAction SilentlyContinue) {
        $env:PATH = (Get-Variable -Name OLD_PATH -Scope Global).Value
        Remove-Variable -Name OLD_PATH -Scope Global
    }
    # remove VIRTUAL_ENV
    Remove-Variable -Name VIRTUAL_ENV -Scope Global
    # restore old prompt
    if (Get-Variable -Name __OLD_PROMPT -Scope Global -ErrorAction SilentlyContinue) {
        $function:Prompt = (Get-Variable -Name __OLD_PROMPT -Scope Global).Value
        Remove-Variable -Name __OLD_PROMPT -Scope Global
    }
    # unregister this function
    Remove-Item function:global:deactivate
}

# end of Activate.ps1
