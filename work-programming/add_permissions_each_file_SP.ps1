#Config Variables
$SiteURL = "https://providence4.sharepoint.com/sites/2025Budget"
Connect-PnPOnline -Url $SiteURL -UseWebLogin
$CSVFile = "User_extract\daily_matrix_add.csv"

Try {
    #Connect to PnP Online

    #Get the CSV file
    $CSVData = Import-CSV $CSVFile

    ForEach($Row in $CSVData) {
        Try {

            #Get the Folder
            #$Folder = Get-PnPFolder -Url $Row.Path -Includes ListItemAllFields.ParentList -ErrorAction Stop
            #$List =  $Folder.ListItemAllFields.ParentList

            #Sharepoint site 'visitor' group access
            Add-PnPUserToGroup -LoginName $Row.Email -Identity $Row.Divisons -ErrorAction Stop

            #Grant Permission to the Folder
            #Set-PnPFolderPermission -List $List -Identity $Folder.ServerRelativeUrl -User $Row.Email -AddRole "Edit" -ErrorAction Stop
            Write-host -f Green "Ensured Permissions on Group '$($Row.Divisons)' for '$($Row.Email)'"

        } Catch {
            Write-host "Error: in the for loop $($_.Exception.Message)" -foregroundcolor Red
        }
    }
} Catch {
    write-host "Error: in the csv $($_.Exception.Message)" -foregroundcolor Red
}
