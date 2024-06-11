#Config Variables
$SiteURL = "https://providence4.sharepoint.com/sites/2025Budget"
$CSVFile = "User_extract\all_current_matrix_permissions.csv"
$FolderPathFile = "User_extract\Path.csv"

#Connect to PnP Online
Connect-PnPOnline -Url $SiteURL -UseWebLogin

#Import folder paths from the CSV file
$IncludeFolders = Import-Csv -Path $FolderPathFile | ForEach-Object { $_.Path }

#Create an array to hold the output
$Output = @()

#Loop through each folder
ForEach($FolderURL in $IncludeFolders) {
    #Get the folder
    try {
        $Folder = Get-PnPFolder -Url $FolderURL -Includes ListItemAllFields.RoleAssignments
    }
    catch {
        Write-Host -f Red "Error processing folder '$($FolderURL)"
    }
    #Get the permissions for the folder
    $RoleAssignments = $Folder.ListItemAllFields.RoleAssignments

    #Loop through each role assignment
    ForEach($RoleAssignment in $RoleAssignments) {
        $RoleDefinitionBindings = Get-PnPProperty -ClientObject $RoleAssignment -Property RoleDefinitionBindings
        $Member = Get-PnPProperty -ClientObject $RoleAssignment -Property Member

        #Add the permission to the output
        $Output += New-Object PSObject -Property @{
            "Path" = $FolderURL
            "User/Group" = $Member.Email
            "Permission" = $RoleDefinitionBindings.Name
        }
        Write-host -f Green "Extracted Permissions on Path '$($FolderURL)' to '$($Member.Email)'"
    }
}

#Export the output to a CSV file
$Output | Export-Csv -Path $CSVFile -NoTypeInformation



