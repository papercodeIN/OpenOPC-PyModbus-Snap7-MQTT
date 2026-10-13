@echo off
setlocal enabledelayedexpansion

rem Define the directory to search
set "directory=."

rem Loop through all files in the directory
for /R "%directory%" %%F in (*) do (
    rem Get the size of the file (in bytes)
    set "size=%%~zF"
    
    rem Check if the size is greater than 100MB (104857600 bytes)
    if !size! GTR 104857600 (
        rem Get the file name
        set "filename=%%F"
        
        rem Add the file to Git
        git add "!filename!"
        
        rem Commit the file with the file name as the commit message
        git commit -m "Added file: !filename!"
        
        rem Push the file to the remote repository
        git push -u origin main
    )
)

echo All files larger than 100MB have been pushed to GitHub.
pause